"use client";
import SigninButton from "@/components/SignInButton";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";
import { useEffect } from "react";
import User from "@/../public/user.svg";

export default function Home() {
  const session = useSession();

  useEffect(() => {
    console.log(session);
    console.log(session.status);
  }, [session]);

  return (
    <main className="flex min-h-screen flex-col items-center py-12 bg-white">
      <div className="flex flex-row font-medium w-2/3 justify-between text-xl text-slate-500 items-center">
        QuizAjej
        <div className="w-24">
          {session.status === "authenticated" ? (
            <div className="bg-slate-300 px-1 py-2.5 gap-1 text-xs text-black/50 rounded-xl justify-center items-center flex">
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
            <SigninButton loading={session.status == "loading"} />
          )}
        </div>
      </div>
    </main>
  );
}
