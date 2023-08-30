import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const schema = z.object({
	userId: z.number(),
	followingId: z.number(),
});

export async function POST(req: NextRequest) {
	try {
		const body = schema.safeParse(await req.json());
		if (!body.success) return NextResponse.json(body.error);

		const { userId, followingId } = body.data;

		let follow = await prisma.follow.findFirst({
			where: {
				followerId: userId,
				followingId,
			},
			include: {
				following: true,
				follower: true,
			},
		});

		// follow if not already following
		// if following already, unfollow

		if (follow) {
			await prisma.follow.delete({
				where: {
					id: follow.id,
				},
			});

			// return the user object of the person being followed

			const user = await prisma.user.findUnique({
				where: {
					id: followingId,
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

			return NextResponse.json({
				following: false,
				user,
			});
		}

		follow = await prisma.follow.create({
			data: {
				followerId: userId,
				followingId,
			},
			include: {
				following: true,
				follower: true,
			},
		});

		const user = await prisma.user.findUnique({
			where: {
				id: followingId,
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

		return NextResponse.json({
			following: true,
			user,
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
	} finally {
		await prisma.$disconnect();
	}
}
