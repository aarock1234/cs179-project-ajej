import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
	try {
		const quizzes = await prisma.quiz.findMany({
			include: {
                likes: true,
            },
			orderBy: {
				likes: {
					_count: 'desc',
				},
			},
		});

		return NextResponse.json(quizzes);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
	} finally {
		await prisma.$disconnect();
	}
}
