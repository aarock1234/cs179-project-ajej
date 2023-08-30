'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import User from '@/../public/user.svg';
import SignInButton from './SignInButton';
import SignOutButton from './SignOutButton';
import SignupModal from '@/components/SignUpModal';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
	const session = useSession();
	const router = useRouter();
	const [signupModalOpen, setSignupModalOpen] = useState(false);

	return (
		<div>
			{signupModalOpen && (
				<SignupModal isOpen={signupModalOpen} setOpen={setSignupModalOpen} />
			)}
			<nav className="flex flex-row font-medium w-full justify-between text-xl text-slate-500 items-center py-4 px-8 bg-white shadow-md">
				<div className="flex flex-row items-center">
					<p className="text-xl font-bold font-mono">quiz</p>
					<p className="mr-4 text-3xl font-bold font-mono">AJEJ</p>
					<ul className="flex flex-row justify-center items-center">
						<li className="mr-2 hover:text-slate-600 transition ease-in-out duration-300 delay-50">
							<a href="/">Home Feed</a>
						</li>
						<div className="border border-slate-400 h-6 mr-2"></div>
						<li className="mr-2 hover:text-slate-600 transition ease-in-out duration-300 delay-50">
							<a href="/following/feed">Following Feed</a>
						</li>
						<div className="border border-slate-400 h-6 mr-2"></div>
						<li className="mr-2 hover:text-slate-600 transition ease-in-out duration-300 delay-50">
							<a href="/search">Search Quizzes</a>
						</li>
						<div className="border border-slate-400 h-6 mr-2"></div>
						<li className="border border-2 rounded-lg px-1.5 py-0.5 hover:bg-slate-500 hover:text-white transition ease-in-out duration-300 delay-50">
							<a href="/quiz/create">Create a Quiz</a>
						</li>
					</ul>
				</div>
				<div className="flex flex-row gap-3">
					{session.status !== 'authenticated' && (
						<div>
							<button
								onClick={() => setSignupModalOpen(true)}
								className="bg-slate-300 px-6 py-2.5 hover:bg-slate-200 transition ease-in-out duration-300 delay-50 w-full focus:outline-none rounded-md text-sm font-bold flex justify-center gap-1 text-black/50 justify-center items-center flex"
							>
								Sign Up
							</button>
						</div>
					)}
					<div>
						{session.status === 'authenticated' ? (
							<div className="flex flex-row gap-1">
								<button
									onClick={() => {
										/* @ts-ignore */
										router.push(`/user/${session?.data?.user?.username}`);
									}}
								>
									<div className="bg-slate-300 px-6 py-2.5 hover:bg-slate-200 transition ease-in-out duration-300 delay-50 w-full focus:outline-none rounded-md text-sm font-bold flex justify-center gap-1 text-black/50 justify-center items-center flex">
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
								</button>
								<SignOutButton />
							</div>
						) : (
							<SignInButton loading={session.status == 'loading'} />
						)}
					</div>
				</div>
			</nav>
		</div>
	);
}
