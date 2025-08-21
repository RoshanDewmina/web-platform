import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ friends: [], requests: [] });

    const friends = await prisma.friendship.findMany({
      where: { OR: [{ userId: user.id }, { friendId: user.id }] },
      include: {
        user: { select: { id: true, username: true, avatarUrl: true } },
        friend: { select: { id: true, username: true, avatarUrl: true } },
      },
    });
    const requests = await prisma.friendRequest.findMany({
      where: { receiverId: user.id, status: 'PENDING' },
      include: { sender: { select: { id: true, username: true, avatarUrl: true, clerkId: true } } },
    });
    return NextResponse.json({ friends, requests });
  } catch (e) {
    console.error("friends error", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { targetClerkId } = await req.json();
    if (!targetClerkId) return NextResponse.json({ error: "Missing targetClerkId" }, { status: 400 });

    const sender = await prisma.user.findUnique({ where: { clerkId: userId } });
    const receiver = await prisma.user.findUnique({ where: { clerkId: targetClerkId } });
    if (!sender || !receiver) return NextResponse.json({ error: "Users not found" }, { status: 404 });

    const fr = await prisma.friendRequest.upsert({
      where: { senderId_receiverId: { senderId: sender.id, receiverId: receiver.id } },
      update: { status: "PENDING" },
      create: { senderId: sender.id, receiverId: receiver.id },
    });
    return NextResponse.json({ request: fr });
  } catch (e) {
    console.error("friend request error", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { senderClerkId, action } = await req.json(); // action: 'accept' | 'reject'
    if (!senderClerkId || !['accept','reject'].includes(action)) return NextResponse.json({ error: 'Invalid' }, { status: 400 });

    const receiver = await prisma.user.findUnique({ where: { clerkId: userId } });
    const sender = await prisma.user.findUnique({ where: { clerkId: senderClerkId } });
    if (!receiver || !sender) return NextResponse.json({ error: 'Users not found' }, { status: 404 });

    const fr = await prisma.friendRequest.findUnique({ where: { senderId_receiverId: { senderId: sender.id, receiverId: receiver.id } } });
    if (!fr || fr.status !== 'PENDING') return NextResponse.json({ error: 'No pending request' }, { status: 404 });

    if (action === 'accept') {
      await prisma.$transaction([
        prisma.friendRequest.update({ where: { senderId_receiverId: { senderId: sender.id, receiverId: receiver.id } }, data: { status: 'ACCEPTED' } }),
        prisma.friendship.create({ data: { userId: receiver.id, friendId: sender.id } }),
      ]);
      return NextResponse.json({ ok: true });
    } else {
      await prisma.friendRequest.update({ where: { senderId_receiverId: { senderId: sender.id, receiverId: receiver.id } }, data: { status: 'REJECTED' } });
      return NextResponse.json({ ok: true });
    }
  } catch (e) {
    console.error('friend accept/reject error', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}


