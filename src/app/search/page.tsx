'use client';

import Navbar from '@/components/Navbar';
import { Like, Quiz } from '@prisma/client';
import { useSearchParams } from 'next/navigation';
import { use, useEffect, useState } from 'react';

type QuizLikes = Quiz & { likes: Like[] };

export default function Search() {
	const searchParams = useSearchParams();
	const query = searchParams.get('query') ?? '';

	const [searchBar, setSearchBar] = useState<string>(query);
	const [quizzes, setQuizzes] = useState([]);
	const [loading, setLoading] = useState(false);

	const handleSearch = async () => {
		setLoading(true);
		try {
			const res = await fetch('/api/quiz/search', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ query: searchBar }),
			});
			const data = await res.json();
			setQuizzes(data.quizzes);
		} catch (error) {
			console.error('Error fetching quizzes:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (query) {
			handleSearch();
		}
	}, [query]);

	return (
		<div className="min-h-screen bg-gray-100">
			<Navbar /> {/* Include the Navbar here */}
			<div className="flex flex-row items-center justify-center h-full mt-10 mb-4">
				<input
					className="mr-2 w-1/2 p-2 border text-slate-500 border-slate-200 rounded transition ease-in-out duration-300 delay-50"
					type="text"
					placeholder="Search quizzes..."
					value={searchBar}
					onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
						if (e.key === 'Enter') {
							handleSearch();
						}
					}}
					onChange={(e) => setSearchBar(e.target.value)}
				/>
				<button
					className="transition ease-in-out duration-300 delay-50 bg-slate-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					onClick={handleSearch}
				>
					Search
				</button>
			</div>
			<div className="flex flex-col items-center justify-center h-full">
				{loading ? (
					<p className="text-lg text-slate-400">Loading...</p>
				) : (
					<ul>
						{quizzes?.map((quiz: QuizLikes, i) => (
							<div
								key={i}
								className="flex flex-col gap-2 border-2 p-2 rounded-md mb-4"
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
						))}
					</ul>
				)}
			</div>
		</div>
	);
}
