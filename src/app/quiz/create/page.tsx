'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Question } from '@prisma/client';

type NewQuizPageProps = {};

export default function NewQuizPage({ }: NewQuizPageProps) {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [questions, setQuestions] = useState<Question[]>([]);

	const handleQuestionTypeChange = (
		event: React.ChangeEvent<HTMLSelectElement>,
		index: number
	) => {
		const newQuestions = [...questions];
		newQuestions[index].type = event.target.value;
		setQuestions(newQuestions);
	};

	const handleQuestionTextChange = (
		event: React.ChangeEvent<HTMLInputElement>,
		index: number
	) => {
		const newQuestions = [...questions];
		newQuestions[index].question = event.target.value;
		setQuestions(newQuestions);
	};

	const handleChoiceTextChange = (
		event: React.ChangeEvent<HTMLInputElement>,
		questionIndex: number,
		choiceIndex: number
	) => {
		const newQuestions = [...questions];
		newQuestions[questionIndex].choices[choiceIndex] = event.target.value;
		setQuestions(newQuestions);
	};

	const handleAddChoice = (questionIndex: number) => {
		const newQuestions = [...questions];
		newQuestions[questionIndex].choices.push('');
		setQuestions(newQuestions);
	};

	const handleRemoveChoice = (questionIndex: number, choiceIndex: number) => {
		if (questions[questionIndex].choices.length === 1) return;

		const newQuestions = [...questions];
		newQuestions[questionIndex].choices = newQuestions[questionIndex].choices.filter(
			(_, i) => i !== choiceIndex
		);
		setQuestions(newQuestions);
	};

	const handleSetCorrectChoice = (questionIndex: number, choiceIndex: number) => {
		const newQuestions = [...questions];
		newQuestions[questionIndex].answer = newQuestions[questionIndex].choices[
			choiceIndex
		];
		setQuestions(newQuestions);
	};

	const handleAnswerTextChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
		const newQuestions = [...questions];
		newQuestions[index].answer = event.target.value;
		setQuestions(newQuestions);
	};

	const handleAddQuestion = () => {
		const newQuestions = [...questions];
		newQuestions.push({
			id: 0,
			type: 'MULTIPLE_CHOICE',
			question: '',
			choices: [''],
			answer: '',
			quizId: 0,
		});

		setQuestions(newQuestions);
	};

	const handleRemoveQuestion = (index: number) => {
		const newQuestions = [...questions];
		newQuestions.splice(index, 1);
		setQuestions(newQuestions);
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const response = await fetch('/api/quiz/create', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ title, description, questions }),
		});
		if (response.ok) {
			const newQuiz = await response.json();
		} else {
			console.error(response.statusText);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100">
			<Navbar />
			<div className="ease-in duration-100 text-slate-500 border-slate-200 max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
				<form
					onSubmit={handleSubmit}
					className="bg-white p-10 rounded-lg shadow-lg text-black"
				>
					<div className="mb-6">
						<label htmlFor="title" className="block font-medium mb-2">
							Title
						</label>

						<input
							type="text"
							id="title"
							value={title}
							onChange={(event) => setTitle(event.target.value)}
							className="border border-slate-200 rounded px-3 py-2 w-full"
						/>
					</div>
					<div className="mb-6">
						<label htmlFor="description" className="block font-medium mb-2">
							Description
						</label>
						<textarea
							id="description"
							value={description}
							onChange={(event) => setDescription(event.target.value)}
							className="border border-slate-200 rounded px-3 py-2 w-full"
						/>
					</div>
					{questions.map((question, i) => (
						<div key={i} className="border-slate-200 border rounded-md p-2 mb-6">
							<div className="mb-2">
								<div className="flex flex-row justify-between">
									<label
										htmlFor={`question-${i}-type`}
										className="block font-medium mb-2"
									>
										Question Type
									</label>
									<button
										type="button"
										onClick={() => handleRemoveQuestion(i)}
										className="ease-in duration-100 bg-red-500 rounded-md m-2 text-sm font-bold text-white px-3 py-2 hover:bg-red-600"
									>
										Delete
									</button>
								</div>
								<select
									id={`question-${i}-type`}
									value={question.type}
									onChange={(event) => handleQuestionTypeChange(event, i)}
									className="border border-slate-200 rounded px-3 py-2 w-full"
								>
									<option value="MULTIPLE_CHOICE">Multiple Choice</option>
									<option value="TRUE_FALSE">True/False</option>
									<option value="SHORT_ANSWER">Short Answer</option>
								</select>
							</div>
							<div className="mb-2">
								<label
									htmlFor={`question-${i}-text`}
									className="block font-medium mb-2"
								>
									Question Text
								</label>
								<input
									type="text"
									id={`question-${i}-text`}
									value={question.question}
									onChange={(event) => handleQuestionTextChange(event, i)}
									className="border border-slate-200 rounded px-3 py-2 w-full"
								/>
							</div>
							{question.type === 'MULTIPLE_CHOICE' && (
								<div className="mb-2">
									<label
										htmlFor={`question-${i}-choices`}
										className="block font-medium mb-2"
									>
										Choices
									</label>
									{question.choices.map((choice, j) => (
										<div key={j} className="flex flex-row mb-2">
											{/** Radio button to select which is correct */}
											<input
												type="radio"
												id={`question-${i}-answer`}
												name={`question-${i}-answer`}
												value={choice}
												onChange={() => handleSetCorrectChoice(i, j)}
												className='border border-slate-200 rounded-l mr-2'
											>
											</input>
											<input
												type="text"
												id={`question-${i}-choice-${j}`}
												value={choice}
												onChange={(event) =>
													handleChoiceTextChange(event, i, j)
												}
												className="border border-slate-200 rounded-l px-3 py-2 w-full"
											/>
											<button
												type="button"
												onClick={() => handleRemoveChoice(i, j)}
												className="ease-in duration-100 bg-red-500 text-lg font-bold text-white px-3 py-2 hover:bg-red-600"
											>
												-
											</button>
											<button
												type="button"
												onClick={() => handleAddChoice(i)}
												className="ease-in duration-100 bg-blue-500 text-lg font-bold text-white rounded-r px-3 py-2 hover:bg-blue-600"
											>
												+
											</button>
										</div>
									))}
								</div>
							)}
							<div className="mb-2">
								<label
									htmlFor={`question-${i}-answer`}
									className="block font-medium mb-2"
								>
									Answer
								</label>
								<input
									disabled
									type="text"
									id={`question-${i}-answer`}
									value={question.answer}
									onChange={(event) => handleAnswerTextChange(event, i)}
									className="border border-slate-200 rounded px-3 py-2 w-full"
								/>
							</div>
						</div>
					))}
					<div className="flex flex-col w-32">
						<button
							type="button"
							onClick={handleAddQuestion}
							className="ease-in duration-100 bg-blue-500 text-white rounded px-3 py-2 hover:bg-blue-600 mb-6"
						>
							Add Question
						</button>
						<button
							type="submit"
							className="ease-in duration-100 bg-green-500 text-white rounded px-3 py-2 hover:bg-green-600"
						>
							Create Quiz
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
