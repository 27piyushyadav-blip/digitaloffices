import Header from "@/components/dashboard/header";

// Backend removed - auth guard removed
export default function PlatformLayout({ children }) {
  return (
    <div className="flex min-h-dvh flex-col bg-zinc-50/50">
      {/* 1. Header is rendered ONCE here for all platform pages */}
      <Header />
      
      {/* 2. Children will be either the Dashboard Layout or Chat Pages */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}