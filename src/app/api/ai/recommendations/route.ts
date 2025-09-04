import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import OpenAI from 'openai';


export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: 'Missing OPENAI_API_KEY' }, { status: 500 });

    const user = await currentUser();
    const aiProfile = (user?.publicMetadata as any)?.aiProfile || {};
    const enrollments = await prisma.enrollment.findMany({ where: { userId }, include: { course: true } });
    const progresses = await prisma.progress.findMany({ where: { userId } });

    // Simple heuristics to build candidate list
    const allCourses = await prisma.course.findMany({ where: { isPublished: true }, include: { modules: true } });
    const alreadyIds = new Set(enrollments.map(e => e.courseId));
    const candidates = allCourses.filter(c => !alreadyIds.has(c.id)).slice(0, 20);

    // Build a short profile and ask LLM to rerank
    const profileJson = JSON.stringify({ aiProfile, progresses: progresses.slice(0, 20) });
    const itemsJson = JSON.stringify(candidates.map(c => ({ id: c.id, title: c.title, description: c.description, category: c.category, difficulty: c.difficulty })));
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const prompt = `You are a learning assistant. Given a learner profile and a list of courses, pick the top 6 and return JSON array of {id, reason}. Focus on matching goals, topics, difficulty and novelty.\nPROFILE=${profileJson}\nCOURSES=${itemsJson}`;
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [ { role: 'system', content: 'Return only valid JSON.' }, { role: 'user', content: prompt } ],
      temperature: 0.2,
      max_tokens: 400,
    });
    let picks: Array<{ id: string; reason: string }>=[];
    try { picks = JSON.parse(completion.choices?.[0]?.message?.content || '[]'); } catch {}
    const map = new Map(candidates.map(c => [c.id, c] as const));
    const top = picks.map(p => ({ course: map.get(p.id), reason: p.reason })).filter(x => x.course);
    return NextResponse.json({ recommendations: top });
  } catch (e) {
    console.error('recs error', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}


