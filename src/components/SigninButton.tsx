import { signIn } from "next-auth/react";

type ButtonProps = {
  loading: boolean;
};
function SigninButton({ loading }: ButtonProps) {
  return (
    <button
      onClick={() => signIn("credentials")}
      className="bg-slate-300 px-4 py-2.5 hover:bg-slate-200 transition ease-in-out duration-300 delay-50 w-full focus:outline-none rounded-lg text-xs font-bold flex justify-center gap-4 text-black/50"
    >
      {loading ? (
        <div className="text-slate-400 font-semibold">Loading...</div>
      ) : (
        "Sign in"
      )}
    </button>
  );
}

export default SigninButton;
