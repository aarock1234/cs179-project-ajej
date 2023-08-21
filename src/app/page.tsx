'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import User from '@/../public/user.svg';
import SignupModal from '@/components/SignUpModal';
import SigninButton from '@/components/SignInButton';
import { Like, Quiz } from '@prisma/client';

type QuizLikes = Quiz & { likes: Like[] };

export default function Home() {
	const session = useSession();
	const [signupModalOpen, setSignupModalOpen] = useState(false);
	const [quizzes, setQuizzes] = useState([]);

	useEffect(() => {
		fetch('/api/quiz/top')
			.then((response) => response.json())
			.then((data) => setQuizzes(data))
			.catch((error) => console.error(error));
	}, []);

	return (
		<main className="flex min-h-screen flex-col items-center py-12 bg-white">
			{signupModalOpen && (
				<SignupModal isOpen={signupModalOpen} setOpen={setSignupModalOpen} />
			)}
			<div className="flex flex-row font-medium w-2/3 justify-between text-xl text-slate-500 items-center">
				QuizAjej
				<div className="flex flex-row gap-3">
					<div className="w-24">
						{session.status !== 'authenticated' && (
							<button
								onClick={() => setSignupModalOpen(true)}
								className="bg-slate-300 py-2.5 hover:bg-slate-200 transition ease-in-out duration-300 delay-50 w-full focus:outline-none rounded-lg text-xs font-bold flex justify-center gap-4 text-black/50"
							>
								Sign Up
							</button>
						)}
					</div>
					{session.status === 'authenticated' ? (
						<div className="bg-slate-300 w-20 px-1 py-2.5 gap-1 text-xs text-black/50 rounded-xl justify-center items-center flex">
							<Image
								src={User}
								width={20}
								height={20}
								alt=""
								className="stroke-slate-500"
							/>
							{/*@ts-ignore*/}
							{session.data.user.username}
						</div>
					) : (
						<div className="w-20">
							<SigninButton loading={session.status == 'loading'} />
						</div>
					)}
				</div>
			</div>
			<div className="w-2/3 mt-8">
				<h2 className="text-2xl font-medium text-slate-500 mb-4">Quizzes</h2>
				<ul className="space-y-4">
					{/** Show loading */}
					{quizzes.length === 0 && (
						<div className="flex flex-col items-center justify-center h-full">
							<p className="text-2xl font-bold text-slate-500">Loading...</p>
						</div>
					)}
					{quizzes.map((quiz: QuizLikes, i) => (
						<div className="flex flex-col gap-2 border-2 p-2 rounded-md">
							<li>
								<p className="text-md text-slate-400">#{i + 1}</p>
								<a
									className="text-lg text-slate-500 hover:text-slate-600"
									href={`/quiz/${quiz.id}`}
								>
									{quiz.title} ({quiz.likes?.length} likes)
								</a>
								<p className="text-md text-slate-400">
									Description: {quiz.description}
								</p>
							</li>
						</div>
					))}
				</ul>
			</div>
		</main>
	);
}
