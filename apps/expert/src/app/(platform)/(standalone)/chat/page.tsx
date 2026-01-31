"use client";

/*
 * File: src/app/(platform)/(standalone)/chat/page.js
 * ROLE: Expert Chat Page (Client Component - Backend removed)
 */

import ChatClient from "@/components/chat/ChatClient";
import { useEffect, useState } from "react";

type UserData = {
  id: string;
  name: string;
  email: string;
  role: string;
  isOnline: boolean;
};

export default function ChatPage() {
  const [conversations, setConversations] = useState([]);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);

  useEffect(() => {
    // Backend removed - using mock data
    const authUser = localStorage.getItem("auth_user");
    if (authUser) {
      try {
        const user = JSON.parse(authUser);
        setCurrentUser({
          ...user,
          id: user.id || "demo-user-id",
          role: "expert",
          isOnline: true,
        });
      } catch (e) {
        setCurrentUser({
          id: "demo-user-id",
          name: "Demo User",
          email: "demo@example.com",
          role: "expert",
          isOnline: true,
        });
      }
    } else {
      setCurrentUser({
        id: "demo-user-id",
        name: "Demo User",
        email: "demo@example.com",
        role: "expert",
        isOnline: true,
      });
    }
    setConversations([]);
  }, []);

  if (!currentUser) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <ChatClient
      initialConversations={conversations}
      currentUser={currentUser}
    />
  );
}
