import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const schema = z.object({
	quizId: z.number(),
});

export async function POST(req: NextRequest) {
	try {
		const body = schema.safeParse(await req.json());
		if (!body.success) return NextResponse.json(body.error);

		const { quizId } = body.data;

		const quiz = await prisma.quiz.findMany({
			where: { id: quizId },
			include: {
				questions: true,
				likes: true,
			},
		});

		return NextResponse.json(quiz);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
	} finally {
		await prisma.$disconnect();
	}
}
