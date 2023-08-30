import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const schema = z.object({
	quizId: z.number(),
});

export async function POST(req: NextRequest) {
	try {
		const { quizId } = schema.parse(await req.json());

		const leaderboard = await prisma.result.findMany({
			where: { quizId },
			include: {
				user: true,
			},
			orderBy: [
				{
					score: 'desc',
				},
				{
					createdAt: 'asc',
				},
			],
		});

		return NextResponse.json(leaderboard);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: 'Failed to retrieve leaderboard' }, { status: 500 });
	} finally {
		await prisma.$disconnect();
	}
}
