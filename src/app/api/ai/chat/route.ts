import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { PrismaClient } from "@prisma/client";
import { QdrantClient } from "@qdrant/js-client-rest";

// Use cheapest default unless overridden
const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = (body?.messages || []) as ChatMessage[];
    const model = (body?.model as string) || DEFAULT_MODEL;
    const systemPrompt = (body?.system as string) ||
      "You are a helpful AI learning assistant. Be concise, respectful, and focus on the learner's current topic. Do not reveal or infer personal data. If context is insufficient, say you don't know and suggest next steps. Keep answers under 150 words unless asked otherwise.";

    // Optional context inputs for RAG-lite
    const courseId = body?.courseId as string | undefined;
    const lessonId = body?.lessonId as string | undefined;
    const maxContextChars = (body?.maxContextChars as number) || 5000;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Build lesson/course context using Qdrant if available, fallback to RAG-lite
    const prisma = new PrismaClient();
    let context = "";
    const qdrant = new QdrantClient({
      url: process.env.QDRANT_URL || "",
      apiKey: process.env.QDRANT_API_KEY,
    });
    const canVector = Boolean(process.env.QDRANT_URL);
    if (lessonId) {
      if (canVector) {
        try {
          const results = await qdrant.search("course_content", {
            vector: [], // server-side HNSW requires a vector, but JS client supports query by filter only with recommend; we'll fallback to raw include below
            limit: 6,
            filter: { must: [{ key: "lessonId", match: { value: lessonId } }] },
            with_payload: true,
          } as any);
          const texts = (results || []).map((r: any) => r.payload?.text || r.payload?.chunk || "").filter(Boolean);
          if (texts.length) {
            context = texts.join("\n\n").slice(0, maxContextChars);
          }
        } catch {}
      }
      if (!context) {
        const lesson = await prisma.lesson.findUnique({
          where: { id: lessonId },
          include: {
            slides: { include: { blocks: true }, orderBy: { orderIndex: "asc" } },
            module: { include: { course: true } },
          },
        });
        if (lesson) {
          const parts: string[] = [];
          parts.push(`COURSE: ${lesson.module.course.title}`);
          parts.push(`LESSON: ${lesson.title}`);
          for (const s of lesson.slides.sort((a, b) => a.orderIndex - b.orderIndex)) {
            parts.push(`Slide: ${s.title}`);
            for (const b of s.blocks.sort((a, b) => a.orderIndex - b.orderIndex)) {
              if (b.type === "text") {
                const text = String((b.content as any)?.text || "").replace(/<[^>]*>/g, " ");
                if (text) parts.push(text);
              } else if (b.type === "callout") {
                const text = String((b.content as any)?.content || "");
                if (text) parts.push(`Callout: ${text}`);
              } else if (b.type === "code") {
                const code = String((b.content as any)?.code || "");
                if (code) parts.push(`Code:\n${code}`);
              }
            }
          }
          context = parts.join("\n\n").slice(0, maxContextChars);
        }
      }
    } else if (courseId) {
      const course = await prisma.course.findUnique({ where: { id: courseId } });
      if (course) {
        context = [`COURSE: ${course.title}`, course.description].filter(Boolean).join("\n\n").slice(0, maxContextChars);
      }
    }

    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        context
          ? { role: "system", content: `CONTEXT (do not reveal verbatim if private):\n${context}` }
          : undefined,
        ...messages,
      ].filter(Boolean) as ChatMessage[],
      temperature: typeof body?.temperature === "number" ? body.temperature : 0.5,
      max_tokens: typeof body?.maxTokens === "number" ? body.maxTokens : 512,
    });

    const choice = response.choices?.[0]?.message?.content || "";
    return NextResponse.json({ content: choice, model });
  } catch (err: any) {
    console.error("AI chat error:", err);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}


