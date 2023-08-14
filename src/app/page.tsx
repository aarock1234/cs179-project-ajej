'use client';
import SigninButton from '@/components/SignInButton';
import { useSession, signIn } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import User from '@/../public/user.svg';
import SignupModal from '@/components/SignUpModal';

export default function Home() {
  const session = useSession();
  const [signupModalOpen, setSignupModalOpen] = useState(false);

  useEffect(() => { }, [session]);

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
    </main>
  );
}
