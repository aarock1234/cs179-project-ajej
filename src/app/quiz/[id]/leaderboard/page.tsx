'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Question, Quiz, Result, User } from '@prisma/client';

type LeaderboardPageProps = {
	params: { id: string };
};

type QuizLeaderboard = (Result & {
	user: User;
})[];

type QuizQuestions = Quiz & {
	questions: Question[];
};

export default function LeaderboardPage({ params }: LeaderboardPageProps) {
	const { id } = params;
	const router = useRouter();
	const [leaderboard, setLeaderboard] = useState<QuizLeaderboard>([]);
	const [quiz, setQuiz] = useState<QuizQuestions>();

	useEffect(() => {
		const fetchLeaderboard = async () => {
			const res = await fetch(`/api/quiz/leaderboard`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ quizId: Number(id) }),
			});

			if (!res.ok) {
				alert('Error fetching leaderboard.');
				return;
			}

			const data = await res.json();

			setLeaderboard(data);
		};

		const fetchQuiz = async () => {
			try {
				if (typeof window === 'undefined') {
					return;
				}

				// get id from the url
				const response = await fetch(`/api/quiz/${id}`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ quizId: Number(id) }),
				});
				const data = await response.json();
				setQuiz(data[0]);
			} catch (error) {
				console.error(error);
			}
		};

		fetchQuiz();
		fetchLeaderboard();
	}, [id, quiz, router]);

	return (
		<div className="min-h-screen bg-gray-100">
			<Navbar />
			<div className="flex flex-col items-center justify-center h-full">
				<div className="bg-white p-10 m-10 w-1/2 rounded-sm shadow-lg text-slate-500">
					<a
						href={`/quiz/${params.id}`}
						className="text-xl border-2 px-1.5 py-0.5 rounded rounded-lg border text-slate-500 hover:text-slate-600 hover:bg-slate-200 transition ease-in-out duration-300 delay-50"
					>
						Back to Quiz
					</a>
					<h1 className="text-2xl mt-3 font-bold mb-6">Leaderboard</h1>
					<h2 className="text-xl mb-6">{quiz?.title}</h2>
					<table className="table-auto w-full">
						<thead>
							<tr>
								<th className="px-4 py-2">Rank</th>
								<th className="px-4 py-2">Username</th>
								<th className="px-4 py-2">Score</th>
								<th className="px-4 py-2">Date</th>
							</tr>
						</thead>
						<tbody>
							{leaderboard.map((entry, index) => (
								<tr key={entry.user.id}>
									<td className="border px-4 py-2">{index + 1}</td>
									<td className="border px-4 py-2">{entry.user.username}</td>
									<td className="border px-4 py-2">
										{entry.score} / {quiz?.questions.length} (
										{Math.round(
											(entry.score / (quiz?.questions?.length ?? 1)) * 100
										)}
										%)
									</td>
									<td className="border px-4 py-2">
										{new Date(entry.createdAt).toLocaleString()}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
