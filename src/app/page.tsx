"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Home() {
  const session = useSession();

  useEffect(() => {
    console.log(session);
    console.log(session.status);
  }, [session]);

  return (
    <main></main>
  );
}
