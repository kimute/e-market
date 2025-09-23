import { HomeIcon } from "@heroicons/react/16/solid";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <div className="my-auto *:font-medium flex flex-col items-center gap-2">
        <HomeIcon className="size-10 text-amber-500" />
        <h1 className="text-4xl">E-market</h1>
        <h2 className="text-2xl">Welcome to E-market</h2>
      </div>
      <div className="flex flex-col items-center gap-3 w-full">
        <Link
          href="/create-account"
          className="w-full bg-orange-500 !text-white text-lg font-medium py-2.5 rounded-md text-center hover:bg-orange-600 transition-colors block"
        >
          Start
        </Link>
      </div>
      <div className="flex gap-2 mt-2">
        <span> you have account?</span>
        <Link
          href="/login"
          className="hover:underline
  underline-offset-4"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
