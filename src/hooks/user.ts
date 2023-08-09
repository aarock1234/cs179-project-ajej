import { Quiz, User } from '@prisma/client';
import { prisma } from '../prisma';

export const useUser = async (username: string): Promise<[({ quizzes: Quiz[] } & User) | null]> => {
	const record = await prisma.user.findUnique({
		where: {
			username,
		},
		include: {
			quizzes: true,
		},
	});

	if (!record) return [null];

	return [record];
};