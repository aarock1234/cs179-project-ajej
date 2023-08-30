'use client';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import User from '@/../public/user.svg';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Follow, User as UserType } from '@prisma/client';

type ProfilePageProps = {
	params: { username: string };
};

export default function ProfilePage({ params }: ProfilePageProps) {
	const { username } = params;

	const session = useSession();

	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch(`/api/user/${username}`, {
			method: 'POST',
			body: JSON.stringify({
				username,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				setUser(data);
				setLoading(false);
			})
			.catch((error) => {
				console.error('Error fetching user:', error);
				setLoading(false);
			});
	}, [username]);

	if (loading) {
		return <p>Loading...</p>;
	}

	if (!user) {
		return (
			<div className="h-screen w-screen bg-white">
				<Navbar />
				<div className="flex flex-col items-center justify-center h-full">
					<p className="text-2xl font-bold text-slate-500">User not found.</p>
				</div>
			</div>
		);
	}

	/** @ts-ignore */
	if (user?.username !== username) {
		return (
			<div className="h-screen w-screen bg-white">
				<Navbar />
				<div className="flex flex-col items-center justify-center h-full">
					<p className="text-2xl font-bold text-slate-500">User not found.</p>
				</div>
			</div>
		);
	}

	const handleFollow = () => {
		fetch(`/api/user/follow/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				/* @ts-ignore */
				userId: Number(session.data?.user?.id),
				/* @ts-ignore */
				followingId: Number(user?.id),
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				setUser(data.user);
			})
			.catch((error) => {
				console.error('Error following user:', error);
			});
	};

	const isFollowing = () => {
		/** @ts-ignore */
		return user?.following?.find(
			/** @ts-ignore */
			(follower) => follower.followerId == session.data?.user?.id
		);
	};

	return (
		<div className="min-h-screen bg-gray-100">
			<Navbar />
			<div className="flex flex-col items-left justify-left h-full">
				<div className="bg-white h-screen p-10 rounded-lg shadow-lg text-slate-500">
					<div className="flex flex-row items-center mb-6">
						<div className="w-12 h-12 mr-4">
							<Image src={User} width={48} height={48} alt="" />
						</div>
						<div>
							{/** @ts-ignore */}
							<p className="text-2xl font-bold">{user?.username}</p>
						</div>
						{/** @ts-ignore */}
						{session.data?.user?.id && session.data?.user?.id !== user?.id && (
							<button
								className={
									'ml-4 bg-slate-500 text-white font-bold py-2 px-4 rounded transition ease-in-out duration-300 delay-50' +
									(isFollowing() ? ' hover:bg-red-500' : ' hover:bg-blue-500')
								}
								onClick={handleFollow}
							>
								{/* @ts-ignore */}
								{isFollowing() ? 'Unfollow' : 'Follow'}
							</button>
						)}
					</div>
					<p className="text-lg font-medium mb-2">Quizzes:</p>
					<ul className="list-disc pl-6">
						{/** @ts-ignore */}
						{user?.quizzes.map((quiz) => (
							<div className="flex flex-col gap-2">
								<li>
									<a href={`/quiz/${quiz.id}`}>
										{/** @ts-ignore */}
										{quiz.title} {`${quiz.likes.length} likes`}
									</a>
									<p className="text-md text-slate-400">
										Description: {quiz.description}
									</p>
								</li>
							</div>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}
