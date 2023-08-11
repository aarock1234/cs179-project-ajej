import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Question } from '@prisma/client';

const prisma = new PrismaClient();

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
	const { title, description, questions } = req.body;

	try {
		const newQuiz = await prisma.quiz.create({
			data: {
				title,
				description,
				questions: {
					create: questions.map((question: Question) => ({
						type: question.type,
						question: question.question,
						choices: { set: question.choices },
						answer: question.answer,
					})),
				},
			},
		});

		return res.status(201).json(newQuiz);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Internal server error' });
	} finally {
		await prisma.$disconnect();
	}
}
