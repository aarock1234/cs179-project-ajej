import { signOut } from 'next-auth/react';

function SignOutButton() {
	return (
		<button
			onClick={() => signOut()}
			className="w-24 bg-slate-300 px-4 py-2.5 hover:bg-slate-200 transition ease-in-out duration-300 delay-50 w-full focus:outline-none rounded-lg text-xs font-bold flex justify-center gap-4 text-black/50"
		>
			Sign Out
		</button>
	);
}

export default SignOutButton;
