import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const schema = z.object({
    userId: z.onumber().nullable(),
});

// get the quizzes only by people that the userId follows
export async function POST(req: NextRequest) {
    try {
        const body = schema.safeParse(await req.json());
        if (!body.success) return NextResponse.json(body.error);

        const { userId } = body.data;

        if (!userId) {
            return NextResponse.json({ quizzes: [] });
        }

        const follow = await prisma.follow.findMany({
            where: {
                followerId: userId,
            },
            include: {
                following: {
                    include: {
                        quizzes: {
                            include: {
                                likes: true,
                            },
                        },
                        followers: true,
                        following: true,
                        likes: true,
                        results: {
                            include: {
                                quiz: {
                                    include: {
                                        questions: true,
                                        likes: true,
                                    }
                                },
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        const quizzes = follow.map((f) => f.following.quizzes).flat();

        return NextResponse.json({
            quizzes,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
