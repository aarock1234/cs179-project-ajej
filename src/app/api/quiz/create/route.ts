import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Question } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const schema = z.object({
	title: z.string(),
	description: z.string(),
	questions: z.array(
		z.object({
			type: z.enum(['MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER']),
			question: z.string(),
			choices: z.array(z.string()),
			answer: z.string(),
		})
	),
	creatorId: z.number(),
});

export async function POST(req: NextRequest) {
	const body = schema.safeParse(await req.json());
	if (!body.success) return NextResponse.json(body.error);

	const { title, description, questions } = body.data;

	try {
		const newQuiz = await prisma.quiz.create({
			data: {
				title,
				description,
				questions: {
					create: questions.map((question) => ({
						type: question.type,
						question: question.question,
						choices: { set: question.choices },
						answer: question.answer,
					})),
				},
				creatorId: body.data.creatorId,
			},
		});

		return NextResponse.json(newQuiz, { status: 201 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
	} finally {
		await prisma.$disconnect();
	}
}
