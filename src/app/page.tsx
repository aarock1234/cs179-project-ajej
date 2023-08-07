"use client";
import SigninButton from "@/components/SigninButton";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Home() {
  const session = useSession();

  useEffect(() => {
    console.log(session);
    console.log(session.status);
  }, [session]);

  return (
    <main className="flex min-h-screen flex-col items-center py-12 bg-white">
      <SigninButton />
    </main>
  );
}
