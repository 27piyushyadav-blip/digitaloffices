"use client";

import Link from "next/link";
import { UserNav } from "@/components/dashboard/user-nav";
import { NotificationsNav } from "@/components/dashboard/notifications-nav";
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar";
import { Brain, MessageSquare } from "lucide-react";
import UnreadChatIndicator from "@/components/chat/UnreadChatIndicator";
import { useEffect, useState } from "react";

// Backend removed - component now uses mock data
export default function Header() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [totalUnread, setTotalUnread] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; description: string; type?: string; link?: string }>>([]);

  useEffect(() => {
    // Mock user data from localStorage
    const authUser = localStorage.getItem("auth_user");
    if (authUser) {
      try {
        setUser(JSON.parse(authUser) as { name: string; email: string });
      } catch (e) {
        setUser({ name: "Demo User", email: "demo@example.com" });
      }
    } else {
      setUser({ name: "Demo User", email: "demo@example.com" });
    }
    // Mock data
    setTotalUnread(0);
    setIsLive(false);
    setNotifications([]);
  }, []);

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-40 h-16 w-full">

      {/* Left: Brand & Status */}
      <div className="flex items-center gap-4 md:gap-6">
        <MobileSidebar />

        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-sm">
            <Brain className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900 hidden sm:block">
            Mindnamo
          </span>
        </Link>

        <div className="hidden md:block h-6 w-px bg-zinc-200" />

        {/* Live Status */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-50 border border-zinc-100">
          {isLive ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-medium text-zinc-600">
                Online
              </span>
            </>
          ) : (
            <>
              <div className="h-2 w-2 rounded-full bg-yellow-400" />
              <span className="text-xs font-medium text-zinc-600">
                Unverified
              </span>
            </>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">

        {/* ✅ Chat Button */}
        <Link href="/chat" className="relative p-2 rounded-full hover:bg-zinc-100 transition-colors text-zinc-600">
          <MessageSquare className="h-5 w-5" />
          {/* ✅ FIXED: Pass initial server count to the client indicator */}
          <UnreadChatIndicator initialCount={totalUnread} />
        </Link>

        <NotificationsNav data={notifications} />
        <UserNav user={user} />
      </div>
    </header>
  );
}
