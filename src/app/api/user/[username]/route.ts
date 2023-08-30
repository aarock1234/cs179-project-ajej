import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const schema = z.object({
  username: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = schema.safeParse(await req.json());
    if (!body.success) return NextResponse.json(body.error);

    const { username } = body.data;

    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        quizzes: {
          include: {
            likes: true,
          },
        },
        followers: true,
        following: true,
      },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to retrieve user' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}