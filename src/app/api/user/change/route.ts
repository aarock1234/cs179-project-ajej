import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const schema = z.object({
	userId: z.number(),
	username: z.string().optional(),
	password: z.string().optional(),
});

export async function POST(req: NextRequest) {
	try {
		const body = schema.safeParse(await req.json());

		if (!body.success) {
			return NextResponse.json(body.error, { status: 400 });
		}

		const { userId, username, password } = body.data;

		let updateData: any = {};

		if (username) {
			updateData.username = username;
		}

		if (password) {
			// Add your password hashing logic here if needed
			updateData.password = password;
		}

		const updatedUser = await prisma.user.update({
			where: { id: userId },
			data: updateData,
			include: {
				quizzes: {
					include: {
						likes: true,
					},
				},
				followers: true,
				following: true,
			},
		});

		if (!updatedUser) {
			return NextResponse.json({ error: 'User update failed' }, { status: 404 });
		}

		return NextResponse.json({
			user: updatedUser,
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
	} finally {
		await prisma.$disconnect();
	}
}
