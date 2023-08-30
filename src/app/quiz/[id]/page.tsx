'use client';

import { useState } from 'react';
import { Like, Question, Quiz } from '@prisma/client';
import Navbar from '@/components/Navbar';
import { useSession } from 'next-auth/react';
import { AiFillDislike, AiFillLike } from 'react-icons/ai';

type Props = {};

type QuizQuestions = Quiz & {
	questions: Question[];
	likes: Like[];
};

type Answer = {
	questionId: number;
	answer: string;
	correct?: boolean;
};

export default function QuizPage(props: Props) {
	const [quiz, setQuiz] = useState<QuizQuestions | null>(null);
	const [answers, setAnswers] = useState<Answer[]>([]);
	const [quizDone, setQuizDone] = useState(false);
	const [quizGraded, setQuizGraded] = useState(false);
	const session = useSession();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (typeof window === 'undefined') {
			return;
		}

		if (answers.length !== quiz?.questions?.length) {
			window?.alert('Please answer all questions.');
			return;
		}

		if (quizDone) {
			return;
		}

		setQuizDone(true);

		const response = await fetch(`/api/quiz/grade`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				/* @ts-ignore */
				userId: Number(session.data?.user?.id),
				quizId: quiz?.id,
				answers,
			}),
		});

		if (!response.ok) {
			if (typeof window === 'undefined') {
				return;
			}

			const data = await response.json();
			window?.alert(data.error);
			setQuizDone(false);
			return;
		}

		const result = await response.json();

		console.log(result);

		// set correct on each answer, result returns an array of answers that are correct and leaves out the incorrect ones
		const newAnswers = [...answers];
		for (let i = 0; i < newAnswers.length; i++) {
			newAnswers[i].correct = result.answers.find((question: Question) => {
				console.log(question, newAnswers[i]);
				return question.id == newAnswers[i].questionId;
			})
				? true
				: false;
		}

		setAnswers(newAnswers);
		setQuizGraded(true);

		console.log(newAnswers);
	};

	const handleLike = async () => {
		const id = window?.location?.pathname?.split('/')?.[2];
		const response = await fetch(`/api/quiz/${id}/like`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				/* @ts-ignore */
				userId: Number(session.data?.user?.id),
				quizId: Number(id),
			}),
		});

		const data = await response.json();

		if (!response.ok) {
			if (typeof window === 'undefined') {
				return;
			}

			window?.alert(data.error);
			return;
		}

		setQuiz({
			...quiz,
			likes: data.quiz?.likes as Like[],
			questions: data.quiz?.questions as Question[],
		} as QuizQuestions);
	};

	const fetchQuiz = async () => {
		try {
			if (typeof window === 'undefined') {
				return;
			}

			// get id from the url
			const id = window?.location?.pathname?.split('/')?.[2];
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

	if (!quiz) {
		fetchQuiz();
		return (
			<main>
				<Navbar />
				<div className="flex flex-col items-center min-h-screen bg-gray-100">
					<div className="w-2/3 mt-8">
						<h2 className="text-2xl font-medium text-slate-500 mb-4">Loading...</h2>
					</div>
				</div>
			</main>
		);
	}

	return (
		<main>
			<Navbar />
			<div className="flex flex-col items-center min-h-screen bg-gray-100">
				<div className="w-2/3 mt-8">
					<a
						href={`/quiz/${quiz.id}/leaderboard`}
						className="text-xl border-2 px-1.5 py-0.5 rounded rounded-lg border text-slate-500 hover:text-slate-600 hover:bg-slate-200 transition ease-in-out duration-300 delay-50"
					>
						Leaderboard
					</a>
					<h2 className="text-2xl mt-3 font-medium text-slate-500">{quiz.title}</h2>
					{session.status == 'authenticated' ? (
						<button
							onClick={handleLike}
							className={
								'flex flex-row items-center text-xl text-slate-400 mb-4 space-x-1 transition ease-in-out duration-300 delay-50 focus:outline-none' +
								/* @ts-ignore */
								(quiz.likes.find((like) => like.userId == session.data?.user?.id)
									? ' hover:text-red-400'
									: ' hover:text-blue-500')
							}
							disabled={quizDone}
						>
							{/* @ts-ignore */}
							<p>
								{quiz.likes.length} {quiz.likes.length === 1 ? 'like' : 'likes'}
							</p>
							{
								/* @ts-ignore */
								quiz.likes.find((like) => like.userId == session.data?.user?.id) ? (
									<AiFillDislike />
								) : (
									<AiFillLike />
								)
							}
						</button>
					) : (
						<p className="text-xl text-slate-400">
							{quiz.likes.length} {quiz.likes.length === 1 ? 'like' : 'likes'}
						</p>
					)}
					<p className="text-lg text-slate-400">Description: {quiz.description}</p>
					<p className="text-lg text-slate-400 mb-4">Tags: {quiz.tags?.join(', ')}</p>
					<form onSubmit={handleSubmit}>
						<ul className="space-y-4">
							{quiz?.questions?.map((question: Question, i: number) => (
								<div
									key={i}
									className={
										'flex flex-col gap-2 border-2 p-2 rounded-md' +
										(quizDone && quizGraded
											? [...answers][i]?.correct
												? ' border-green-300 bg-green-100'
												: ' border-red-300 bg-red-100'
											: '')
									}
								>
									<li>
										<p className="text-md text-slate-400">
											#{i + 1} {question.question}
										</p>
										{question.type === 'MULTIPLE_CHOICE' && (
											<ul className="space-y-2">
												{question.choices.map(
													(choice: string, j: number) => (
														<li key={j}>
															<label>
																<input
																	type="radio"
																	name={`question-${i}`}
																	value={choice}
																	disabled={quizDone}
																	onChange={(event) => {
																		const newAnswers = [
																			...answers,
																		];
																		newAnswers[i] = {
																			questionId: question.id,
																			answer: event.target
																				.value,
																		};
																		setAnswers(newAnswers);
																	}}
																/>
																<span className="ml-2 text-md text-slate-400">
																	{choice}
																</span>
															</label>
														</li>
													)
												)}
											</ul>
										)}
										{question.type === 'TRUE_FALSE' && (
											<ul className="space-y-2">
												<li>
													<label>
														<input
															type="radio"
															name={`question-${i}`}
															disabled={quizDone}
															value="true"
															onChange={(event) => {
																const newAnswers = [...answers];
																newAnswers[i] = {
																	questionId: question.id,
																	answer: event.target.value,
																};
																setAnswers(newAnswers);
															}}
														/>
														<span className="ml-2 text-md text-slate-400">
															True
														</span>
													</label>
												</li>
												<li>
													<label>
														<input
															type="radio"
															name={`question-${i}`}
															disabled={quizDone}
															value="false"
															onChange={(event) => {
																const newAnswers = [...answers];
																newAnswers[i] = {
																	questionId: question.id,
																	answer: event.target.value,
																};
																setAnswers(newAnswers);
															}}
														/>
														<span className="ml-2 text-md text-slate-400">
															False
														</span>
													</label>
												</li>
											</ul>
										)}
										{question.type === 'SHORT_ANSWER' && (
											<input
												type="text"
												name={`question-${i}`}
												disabled={quizDone}
												onChange={(event) => {
													const newAnswers = [...answers];
													newAnswers[i] = {
														questionId: question.id,
														answer: event.target.value,
													};
													setAnswers(newAnswers);
												}}
											/>
										)}
									</li>
								</div>
							))}
						</ul>
						<button
							type="submit"
							disabled={quizDone}
							className="bg-slate-300 py-2.5 hover:bg-slate-200 transition ease-in-out duration-300 delay-50 w-full focus:outline-none rounded-lg text-xs font-bold flex justify-center gap-4 text-black/50 mt-4"
						>
							Submit
						</button>
					</form>
				</div>
			</div>
		</main>
	);
}
