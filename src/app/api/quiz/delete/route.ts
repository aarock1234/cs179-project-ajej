import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const schema = z.object({
	userId: z.number().nullable(),
	quizId: z.number().nullable(),
});

export async function DELETE(req: NextRequest) {
	try {
		const body = schema.safeParse(await req.json());
		if (!body.success) return NextResponse.json(body.error);

		const { userId, quizId } = body.data;

		if (!userId) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 });
		}

		if (!quizId) {
			return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
		}

		const quiz = await prisma.quiz.delete({
			where: { id: quizId },
		});

		if (!quiz) {
			return NextResponse.json({ error: 'Quiz not found (2)' }, { status: 404 });
		}

		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
			include: {
				quizzes: {
					include: {
						likes: true,
					},
				},
				followers: true,
				following: true,
				likes: true,
			},
		});

		if (!user) {
			return NextResponse.json({ error: 'User not found (2)' }, { status: 404 });
		}

		return NextResponse.json({ user });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: 'Failed to delete quiz' }, { status: 500 });
	} finally {
		await prisma.$disconnect();
	}
}
