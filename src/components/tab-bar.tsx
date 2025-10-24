"use client";
import Link from "next/link";
import {
  ChatBubbleLeftRightIcon,
  HeartIcon,
  HomeIcon,
  PlayCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import {
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  HeartIcon as HeartIconSolid,
  HomeIcon as HomeIconSolid,
  PlayCircleIcon as PlayCircleIconSolid,
  UserIcon as UserIconSolid,
} from "@heroicons/react/24/solid";
import { usePathname } from "next/navigation";

export default function TabBar() {
  // Get the current route path to determine which tab is active
  const pathname = usePathname(); // <- interactive ! so need
  return (
    <div className="fixed bottom-0 left-0 right-0 backdrop-blur-sm bg-black/50 flex items-center justify-around py-3">
      <Link href="/home" className="flex flex-col items-center">
        {pathname === "/home" ? (
          <HomeIconSolid className="w-7 h-7" />
        ) : (
          <HomeIcon className="w-7 h-7" />
        )}
        <span className="text-sm">Home</span>
      </Link>
      <Link href="/life" className="flex flex-col items-center">
        {pathname === "/life" ? (
          <HeartIconSolid className="w-7 h-7" />
        ) : (
          <HeartIcon className="w-7 h-7" />
        )}
        <span className="text-sm">Life</span>
      </Link>
      <Link href="/live" className="flex flex-col items-center">
        {pathname === "/live" ? (
          <PlayCircleIconSolid className="w-7 h-7" />
        ) : (
          <PlayCircleIcon className="w-7 h-7" />
        )}
        <span className="text-sm">Live</span>
      </Link>
      <Link href="/chat" className="flex flex-col items-center">
        {pathname === "/chat" ? (
          <ChatBubbleLeftRightIconSolid className="w-7 h-7" />
        ) : (
          <ChatBubbleLeftRightIcon className="w-7 h-7" />
        )}
        <span className="text-sm">Chat</span>
      </Link>
      <Link href="/profile" className="flex flex-col items-center">
        {pathname === "/profile" ? (
          <UserIconSolid className="w-7 h-7" />
        ) : (
          <UserIcon className="w-7 h-7" />
        )}
        <span className="text-sm">Profile</span>
      </Link>
    </div>
  );
}
