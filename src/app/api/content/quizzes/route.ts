import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const quiz = await prisma.quiz.create({ data: body });
    return NextResponse.json(quiz, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const { id, ...data } = body;
    const quiz = await prisma.quiz.update({ where: { id }, data });
    return NextResponse.json(quiz);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}


