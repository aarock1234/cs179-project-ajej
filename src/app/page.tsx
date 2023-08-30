'use client';

import Navbar from '@/components/Navbar';
import { useEffect, useState } from 'react';
import { Like, Quiz } from '@prisma/client';
import { useRouter } from 'next/navigation';

type QuizLikes = Quiz & { likes: Like[] };

export default function Home() {
	const router = useRouter();
	const [quizzes, setQuizzes] = useState([]);

	useEffect(() => {
		fetch('/api/quiz/top')
			.then((response) => response.json())
			.then((data) => setQuizzes(data))
			.catch((error) => console.error(error));
	}, []);

	return (
		<main>
			<Navbar />
			<div className="flex min-h-screen flex-col items-left px-7 bg-white">
				<div className="w-2/3">
					<h2 className="text-2xl font-medium text-slate-500 mb-4">
						Most Popular Quizzes (by Likes)
					</h2>
					<ul className="space-y-4">
						{/** Show loading */}
						{quizzes.length === 0 && (
							<div className="flex flex-col items-center justify-center h-full">
								<p className="text-2xl font-bold text-slate-500">Loading...</p>
							</div>
						)}
						{quizzes.map((quiz: QuizLikes, i) => (
							<div key={i} className="flex flex-col gap-2 border-2 p-2 rounded-md">
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
									{quiz.tags.length && (
										<p className="text-lg text-slate-400">
											Tags:{' '}
											{quiz.tags.map((tag, j) => {
												return (
													<button
														key={j}
														className="border border-1 p-1 rounded rounded-xl m-0.5 hover:bg-slate-500 hover:text-white transition ease-in-out duration-300 delay-50"
														onClick={() => {
															router.push(`/search?query=${tag}`);
														}}
													>
														{tag}
													</button>
												);
											})}
										</p>
									)}
								</li>
							</div>
						))}
					</ul>
				</div>
			</div>
		</main>
	);
}
