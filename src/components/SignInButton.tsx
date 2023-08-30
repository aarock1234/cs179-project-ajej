import { signIn } from 'next-auth/react';

type ButtonProps = {
	loading: boolean;
};
function SignInButton({ loading }: ButtonProps) {
	return (
		<button
			onClick={() => signIn()}
			className="bg-slate-300 px-6 py-2.5 hover:bg-slate-200 transition ease-in-out duration-300 delay-50 w-full focus:outline-none rounded-md text-sm font-bold flex justify-center gap-1 text-black/50 justify-center items-center flex"
		>
			{loading ? <div className="text-slate-400 font-semibold">Loading...</div> : 'Sign In'}
		</button>
	);
}

export default SignInButton;
