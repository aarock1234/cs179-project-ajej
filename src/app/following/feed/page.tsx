'use client';

import Navbar from '@/components/Navbar';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Like, Quiz } from '@prisma/client';

type QuizLikes = Quiz & { likes: Like[] };

export default function Home() {
	const session = useSession();
	const [quizzes, setQuizzes] = useState([]);
	const [loading, setLoading] = useState(true);

	// only do when session.status != 'loading'
	useEffect(() => {
		if (session.status == 'loading') return;

		fetch('/api/quiz/top/following', {
			method: 'POST',
			body: JSON.stringify({
				/* @ts-ignore */
				userId: Number(session.data?.user?.id),
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				setQuizzes(data.quizzes);
				setLoading(false);
			})
			.catch((error) => console.error(error));
	}, [session.status]);

	return (
		<main>
			<Navbar />
			<div className="flex min-h-screen flex-col items-left px-7 bg-white">
				<div className="w-2/3">
					<h2 className="text-2xl font-medium text-slate-500 mb-4">
						Following Feed (by Most Recent)
					</h2>
					<ul className="space-y-4">
						{/** Show loading */}
						{loading ? (
							<div className="flex flex-col items-center justify-center h-full">
								<p className="text-2xl font-bold text-slate-500">Loading...</p>
							</div>
						) : session.status == 'authenticated' ? (
							quizzes?.length == 0 ? (
								<div className="flex flex-col items-center justify-center h-full">
									<p className="text-2xl font-bold text-slate-500">
										No quizzes found.
									</p>
								</div>
							) : (
								quizzes?.map((quiz: QuizLikes, i) => (
									<div
										key={i}
										className="flex flex-col gap-2 border-2 p-2 rounded-md"
									>
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
									</div>
								))
							)
						) : (
							<div className="flex flex-col items-center justify-center h-full">
								<p className="text-2xl font-bold text-slate-500">
									Please sign in to view your following feed.
								</p>
							</div>
						)}
					</ul>
				</div>
			</div>
		</main>
	);
}
