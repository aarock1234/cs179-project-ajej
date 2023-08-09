'use client';

import SignInButton from '@/components/SignInButton';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import User from '@/../public/user.svg';
import SignOutButton from './SignOutButton';

export default function Navbar() {
	const session = useSession();

	return (
		<nav className="flex flex-row font-medium w-full justify-between text-xl text-slate-500 items-center py-4 px-8 bg-white shadow-md">
			<div className="flex flex-row items-center">
				<p className="mr-4 font-bold">AJEJ</p>
				<ul className="flex flex-row">
					<li className="mr-4">
						<a href="/">Home</a>
					</li>
					<li>
						<a href="/quizzes">Quizzes</a>
					</li>
				</ul>
			</div>
			<div className="w-48">
				<div className="flex space-x-1">
					{session.status === 'authenticated' ? (
						<div className="w-24 bg-slate-300 px-1 py-2.5 gap-1 text-xs text-black/50 rounded-xl justify-center items-center flex">
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
						<SignInButton loading={session.status == 'loading'} />
					)}
					{session.status === 'authenticated' ? <SignOutButton /> : <></>}
				</div>
			</div>
		</nav>
	);
}