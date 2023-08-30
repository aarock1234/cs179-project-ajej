import { Follow, Quiz, User } from '@prisma/client';
import { prisma } from '../prisma';

export const useUser = async (username: string): Promise<[(User & {
	quizzes: Quiz[],
	followers: Follow[],
	following: Follow[],
}) | null]> => {
	const record = await prisma.user.findUnique({
		where: {
			username,
		},
		include: {
			quizzes: true,
			followers: true,
			following: true,
		},
	});

	if (!record) return [null];

	return [record];
};
