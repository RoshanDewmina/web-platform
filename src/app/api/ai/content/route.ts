import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: 'Missing OPENAI_API_KEY' }, { status: 500 });

    const body = await req.json();
    const { action, topic, sourceText } = body as { action: 'outline' | 'quiz' | 'refine'; topic?: string; sourceText?: string };
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    if (action === 'outline') {
      const prompt = `Create a concise lesson outline about "${topic}" with 5-7 bullet points.`;
      const res = await client.chat.completions.create({ model: process.env.OPENAI_MODEL || 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], temperature: 0.5 });
      return NextResponse.json({ outline: res.choices?.[0]?.message?.content || '' });
    }
    if (action === 'quiz') {
      const prompt = `Create 5 multiple-choice questions with 4 options and indicate the correct answer index for this content:\n${sourceText}`;
      const res = await client.chat.completions.create({ model: process.env.OPENAI_MODEL || 'gpt-4o-mini', messages: [{ role: 'system', content: 'Return JSON array of {question, options, correctIndex}.' }, { role: 'user', content: prompt }], temperature: 0.4 });
      let items: any = [];
      try { items = JSON.parse(res.choices?.[0]?.message?.content || '[]'); } catch {}
      return NextResponse.json({ items });
    }
    if (action === 'refine') {
      const prompt = `Improve clarity and formatting of the following text. Keep original meaning and use a friendly educational tone.\n${sourceText}`;
      const res = await client.chat.completions.create({ model: process.env.OPENAI_MODEL || 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], temperature: 0.3 });
      return NextResponse.json({ refined: res.choices?.[0]?.message?.content || '' });
    }
    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
  } catch (e) {
    console.error('content ai error', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}


