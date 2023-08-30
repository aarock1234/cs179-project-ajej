import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const schema = z.object({
	query: z.string(),
});

export async function POST(req: NextRequest) {
	try {
		const body = schema.safeParse(await req.json());
		if (!body.success) return NextResponse.json(body.error);

		const { query } = body.data;

		const quizzes = await prisma.quiz.findMany({
			where: {
				OR: [
					{
						title: {
							contains: query,
							mode: 'insensitive',
						},
					},
					{
						description: {
							contains: query,
							mode: 'insensitive',
						},
					},
					{
						tags: {
							has: query,
						},
					},
				],
			},
			include: {
				likes: true,
			},
		});

		return NextResponse.json({ quizzes });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
	} finally {
		await prisma.$disconnect();
	}
}
