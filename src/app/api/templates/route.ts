import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const templates = await prisma.template.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(templates);
  } catch (e) {
    console.error('templates GET error', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, sessionClaims } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const role = (sessionClaims as any)?.metadata?.role || (sessionClaims as any)?.publicMetadata?.role;
    if (role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const tpl = await prisma.template.create({ data: body });
    return NextResponse.json(tpl, { status: 201 });
  } catch (e) {
    console.error('templates POST error', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId, sessionClaims } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const role = (sessionClaims as any)?.metadata?.role || (sessionClaims as any)?.publicMetadata?.role;
    if (role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const { id, ...data } = body;
    const tpl = await prisma.template.update({ where: { id }, data });
    return NextResponse.json(tpl);
  } catch (e) {
    console.error('templates PUT error', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId, sessionClaims } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const role = (sessionClaims as any)?.metadata?.role || (sessionClaims as any)?.publicMetadata?.role;
    if (role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    await prisma.template.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('templates DELETE error', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}


