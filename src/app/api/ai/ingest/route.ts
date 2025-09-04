import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import OpenAI from 'openai';
import { QdrantClient } from '@qdrant/js-client-rest';


function chunkText(text: string, maxChars = 1500, overlap = 200): string[] {
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    const end = Math.min(text.length, i + maxChars);
    chunks.push(text.slice(i, end));
    i = end - overlap;
    if (i < 0) i = 0;
    if (i >= text.length) break;
  }
  return chunks;
}

async function ensureCollection(client: QdrantClient, name: string, dim: number) {
  try {
    await client.getCollection(name);
  } catch {
    await client.createCollection(name, {
      vectors: { size: dim, distance: 'Cosine' },
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, sessionClaims } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const role = (sessionClaims as any)?.metadata?.role || (sessionClaims as any)?.publicMetadata?.role;
    if (role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: 'Missing OPENAI_API_KEY' }, { status: 500 });

    const { courseId } = await req.json();
    if (!courseId) return NextResponse.json({ error: 'Missing courseId' }, { status: 400 });

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            lessons: {
              include: { slides: { include: { blocks: true } } },
            },
          },
        },
      },
    });
    if (!course) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const embedModel = 'text-embedding-3-small';
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const qdrant = new QdrantClient({
      url: process.env.QDRANT_URL || 'http://localhost:6333',
      apiKey: process.env.QDRANT_API_KEY,
    });

    const dim = 1536; // text-embedding-3-small output dims
    const collection = 'course_content';
    await ensureCollection(qdrant, collection, dim);

    const docs: Array<{ id: string; text: string; meta: any }> = [];
    for (const m of course.modules) {
      for (const l of m.lessons) {
        const parts: string[] = [l.title, (l.description || '')];
        for (const s of l.slides) {
          parts.push(s.title);
          for (const b of s.blocks) {
            if (b.type === 'text') parts.push(String((b.content as any)?.text || '').replace(/<[^>]*>/g, ' '));
            if (b.type === 'callout') parts.push(String((b.content as any)?.content || ''));
            if (b.type === 'code') parts.push(String((b.content as any)?.code || ''));
          }
        }
        const full = parts.filter(Boolean).join('\n');
        for (const chunk of chunkText(full)) {
          docs.push({ id: `${l.id}-${Math.random().toString(36).slice(2)}`, text: chunk, meta: { courseId: course.id, lessonId: l.id, title: l.title } });
        }
      }
    }

    // Embed in batches and upsert
    const batchSize = 64;
    for (let i = 0; i < docs.length; i += batchSize) {
      const batch = docs.slice(i, i + batchSize);
      const emb = await client.embeddings.create({ model: embedModel, input: batch.map(d => d.text) });
      const points = emb.data.map((e, idx) => ({
        id: `${batch[idx].id}`,
        vector: e.embedding as number[],
        payload: batch[idx].meta,
      }));
      await qdrant.upsert(collection, { wait: true, points });
    }

    return NextResponse.json({ ok: true, chunks: docs.length });
  } catch (e) {
    console.error('ingest error', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}


