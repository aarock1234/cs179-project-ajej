'use client';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import User from '@/../public/user.svg';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type ProfilePageProps = {
	params: { username: string };
};

export default function ProfilePage({ params }: ProfilePageProps) {
	const { username } = params;

	const session = useSession();
	const router = useRouter();

	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	const [newUsername, setNewUsername] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmNewPassword, setConfirmNewPassword] = useState('');

	useEffect(() => {
		if (session.status == 'loading') return;

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
	}, [username, session.status]);

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
	if (!user?.id) {
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

	const handleDeleteQuiz = (quizId: Number) => {
		fetch(`/api/quiz/delete`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				/* @ts-ignore */
				userId: Number(session.data?.user?.id),
				quizId: Number(quizId),
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				setUser(data.user);
			})
			.catch((error) => {
				console.error('Error deleting quiz:', error);
			});
	};

	const handleChangeInfo = () => {
		if (newPassword !== confirmNewPassword) {
			alert('Passwords do not match.');
			return;
		} else if (newPassword && newPassword.length < 8) {
			alert('Password must be at least 8 characters long.');
			return;
		}

		fetch(`/api/user/change`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				/* @ts-ignore */
				userId: Number(session.data?.user?.id),
				username: newUsername,
				password: newPassword,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				router.push(`/user/${data.user.username}`);
				setNewPassword('');
				setConfirmNewPassword('');
				setNewUsername('');
				alert('Successfully changed user info.');
			})
			.catch((error) => {
				console.error('Error changing user info:', error);
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
					<div>
						{/** @ts-ignore */}
						{session.data?.user?.id == user?.id && (
							<div className="flex flex-row">
								<input
									type="text"
									className="p-1 mr-2 border text-slate-500 border-slate-200 rounded transition ease-in-out duration-300 delay-50 h-8"
									placeholder="New Username"
									value={newUsername}
									onChange={(e) => setNewUsername(e.target.value)}
								/>
								<div className="flex flex-col gap-2">
									<input
										type="password"
										className="p-1 mr-2 border text-slate-500 border-slate-200 rounded transition ease-in-out duration-300 delay-50"
										placeholder="New Password"
										value={newPassword}
										onChange={(e) => setNewPassword(e.target.value)}
									/>
									<input
										type="password"
										className="p-1 mr-2 border text-slate-500 border-slate-200 rounded transition ease-in-out duration-300 delay-50"
										placeholder="Confirm New Password"
										value={confirmNewPassword}
										onChange={(e) => setConfirmNewPassword(e.target.value)}
									/>
								</div>
								<button
									onClick={handleChangeInfo}
									className="bg-blue-500 hover:bg-blue-700 text-white font-bold  px-2 rounded h-8"
								>
									Confirm Change
								</button>
							</div>
						)}
					</div>
					<p className="text-lg font-medium mb-2">Quizzes:</p>
					<ul>
						{/** @ts-ignore */}
						{user?.quizzes.map((quiz, i) => (
							<div key={i} className="flex flex-row gap-2">
								<div className="flex-grow">
									<li>
										<div className="flex flex-col gap-2 border-2 p-2 rounded-md mb-4 w-1/4">
											<li>
												<p className="text-lg text-slate-400">#{i + 1}</p>
												<a
													className="text-xl text-slate-500 hover:text-slate-600"
													href={`/quiz/${quiz.id}`}
												>
													{quiz.title} ({quiz.likes?.length} likes)
												</a>
												<p className="text-lg text-slate-400">
													Description: {quiz.description}
												</p>
												<p className="text-lg text-slate-400">
													Tags: {quiz.tags?.join(', ')}
												</p>
											</li>
											{/** @ts-ignore */}
											{session.data?.user?.id == user?.id && (
												<button
													onClick={() => handleDeleteQuiz(quiz.id)}
													className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded m-2 w-1/4"
												>
													Delete
												</button>
											)}
										</div>
									</li>
								</div>
							</div>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}
