import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const schema = z.object({
	quizId: z.number(),
	userId: z.number(),
});

export async function POST(req: NextRequest) {
	try {
		const body = schema.safeParse(await req.json());
		if (!body.success) return NextResponse.json(body.error);

		const { userId, quizId } = body.data;

		// check if user has already liked quiz
		let like = await prisma.like.findFirst({
			where: {
				userId,
				quizId,
			},
			include: {
				quiz: {
					include: {
						questions: true,
						likes: true,
					},
				},
			},
		});

		if (like) {
			// remove the like if it exists
			const deletedLike = await prisma.like.delete({
				where: {
					id: like.id,
				},
			});

			const quiz = await prisma.quiz.findUnique({
				where: {
					id: quizId,
				},
				include: {
					questions: true,
					likes: true,
				},
			});

			return NextResponse.json({
				liked: false,
				quiz,
			});
		}

		like = await prisma.like.create({
			data: {
				userId,
				quizId,
			},
			include: {
				quiz: {
					include: {
						questions: true,
						likes: true,
					},
				},
			},
		});

		return NextResponse.json({
			liked: true,
			...like,
			quiz: like.quiz,
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: 'Failed to like quiz' }, { status: 500 });
	} finally {
		await prisma.$disconnect();
	}
}
