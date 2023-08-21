import { useUser } from '@/hooks/user';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import User from '@/../public/user.svg';

type ProfilePageProps = {
	params: { username: string };
};

export default async function ProfilePage({ params }: ProfilePageProps) {
	const { username } = params;
	const users = await useUser(username);

	if (!users?.length) {
		<div className="h-screen w-screen bg-white">
			<Navbar />
			<div className="flex flex-col items-center justify-center h-full">
				<p className="text-2xl font-bold text-slate-500">User not found.</p>
			</div>
		</div>;
	}

	const user = users[0];

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
							<p className="text-2xl font-bold">{user?.username}</p>
						</div>
					</div>
					<p className="text-lg font-medium mb-2">Quizzes:</p>
					<ul className="list-disc pl-6">
						{user?.quizzes.map((quiz) => (
							<div className="flex flex-col gap-2">
								<li>
									<a href={`/quiz/${quiz.id}`}>{quiz.title} ({quiz.likes} likes)</a>
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
