/*
 * File: src/components/ui/sonner.jsx
 * SR-DEV: Toast Notification Component
 * ACTION: REMOVED external 'react-responsive' dependency and implemented an internal useMediaQuery hook to fix the build error (117).
 */

"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import { useState, useEffect } from "react";

// Custom hook to detect screen size (replaces 'react-responsive' dependency)
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    // Check if window is defined (runs only on client)
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
        return;
    }

    const media = window.matchMedia(query);
    
    // Set initial state
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    // Listener for changes
    const listener = () => setMatches(media.matches);
    media.addListener(listener); // Use addListener for cross-browser compatibility
    
    return () => media.removeListener(listener);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]); 
  
  return matches;
};

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();
  
  // Custom media query for standard tablet/mobile breakpoint (max-width: 768px)
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Set position based on device type: 
  // Desktop/Tablet (min-width 769px): Bottom Right 
  // Mobile (max-width 768px): Bottom Center
  const position = isMobile ? "bottom-center" : "bottom-right";

  return (
    <Sonner
      theme={theme}
      position={position} // Set dynamically based on media query
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-zinc-950 group-[.toaster]:border-zinc-200 group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-zinc-950 dark:group-[.toaster]:text-zinc-50 dark:group-[.toaster]:border-zinc-800",
          description: "group-[.toast]:text-zinc-500 dark:group-[.toast]:text-zinc-400",
          actionButton:
            "group-[.toast]:bg-zinc-900 group-[.toaster]:text-zinc-50 dark:group-[.toaster]:bg-zinc-50 dark:group-[.toaster]:text-zinc-900",
          cancelButton:
            "group-[.toast]:bg-zinc-100 group-[.toast]:text-zinc-500 dark:group-[.toaster]:bg-zinc-800 dark:group-[.toaster]:text-zinc-400",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };