import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: 'Missing OPENAI_API_KEY' }, { status: 500 });

    const { quizId, attemptId } = await req.json();
    if (!quizId || !attemptId) return NextResponse.json({ error: 'Missing params' }, { status: 400 });

    const attempt = await prisma.quizAttempt.findUnique({ where: { id: attemptId } });
    if (!attempt || attempt.userId !== userId) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const quiz = await prisma.quiz.findUnique({ where: { id: quizId }, include: { questions: true, lesson: { include: { slides: { include: { blocks: true } } } } } });
    if (!quiz) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Build feedback prompt with incorrect answers and brief context
    const learnerAnswers = attempt.answers as any;
    const mistakes = quiz.questions.map((q, idx) => ({
      question: q.question,
      correct: q.correctAnswer,
      learner: learnerAnswers?.[idx],
      explanation: q.explanation || '',
    }));
    const context = quiz.lesson?.slides?.slice(0,3).flatMap(s => s.blocks.filter(b => b.type==='text').map(b => (b.content as any)?.text || '')).join('\n').replace(/<[^>]*>/g,' ');
    const prompt = `Provide supportive, actionable feedback for the following quiz results. Only address items where the learner is wrong. Keep each tip brief (1-2 sentences) and suggest one relevant review reference.\nCONTEXT:${context}\nRESULTS:${JSON.stringify(mistakes)}`;

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [ { role: 'system', content: 'You are a helpful tutor. Return JSON array of {question, feedback, reviewHint}.' }, { role: 'user', content: prompt } ],
      temperature: 0.4,
      max_tokens: 600,
    });
    let feedback: any = [];
    try { feedback = JSON.parse(completion.choices?.[0]?.message?.content || '[]'); } catch {}
    return NextResponse.json({ feedback });
  } catch (e) {
    console.error('quiz feedback error', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}


