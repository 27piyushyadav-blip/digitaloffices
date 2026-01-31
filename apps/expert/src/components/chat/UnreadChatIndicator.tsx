// src/components/chat/UnreadChatIndicator.js
"use client";

import { useState, useEffect } from "react";

// Backend removed - socket and actions removed
export default function UnreadChatIndicator({ initialCount = 0 }) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  // Backend removed - socket listeners removed

  if (count <= 0) return null;

  return (
    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white border-2 border-white shadow-sm animate-in fade-in zoom-in-75">
      {/* ✅ FIXED: 9+ Logic applied here */}
      {count > 9 ? "9+" : count}
    </span>
  );
}