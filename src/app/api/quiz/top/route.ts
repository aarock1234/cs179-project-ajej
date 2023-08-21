import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
	try {
		const quizzes = await prisma.quiz.findMany({
			orderBy: { likes: 'desc' },
		});

		return NextResponse.json(quizzes);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
	} finally {
		await prisma.$disconnect();
	}
}
