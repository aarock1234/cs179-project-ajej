import { Follow, User } from '@prisma/client';
import { prisma } from '../prisma';

export const useFollow = async (userId: number, userToFollowId: number): Promise<[User & {
    following: Follow[],
    followers: Follow[],
} | null]> => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            following: true,
        },
    });

    // follow if not already following
    // if following already, unfollow

    const userToFollow = await prisma.user.findUnique({
        where: { id: userToFollowId },
        include: {
            following: true,
            followers: true,
        },
    });

    if (userToFollow) {
        if (user) {
            if (user.following.find((user) => user.id === userToFollowId)) {
                await prisma.user.update({
                    where: { id: userId },
                    data: {
                        following: {
                            disconnect: {
                                id: userToFollowId,
                            },
                        },
                    },
                });
            } else {
                await prisma.user.update({
                    where: { id: userId },
                    data: {
                        following: {
                            connect: {
                                id: userToFollowId,
                            },
                        },
                    },
                });

                return [userToFollow];
            }
        }
    }

    return [null];
}