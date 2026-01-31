"use client";

import ProfileForm from "@/components/dashboard/profile-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { XCircle, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

// Backend removed - metadata removed for client component

type ProfileData = {
  user: {
    name: string;
    email: string;
    username: string;
    image: string;
  };
  isVetted: boolean;
  hasPendingUpdates: boolean;
  rejectionReason: string | null;
  draft: Record<string, any>;
};

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    // Backend removed - using mock profile data
    setProfile({
      user: {
        name: "Demo User",
        email: "demo@example.com",
        username: "demo-user",
        image: "",
      },
      isVetted: false,
      hasPendingUpdates: false,
      rejectionReason: null,
      draft: {},
    });
  }, []);

  // 2. Determine Active Tab
  const validTabs = [
    "identity",
    "professional",
    "services",
    "availability",
    "documents",
    "settings"
  ];

  const tabParam = searchParams?.get("tab") || null;
  const activeTab =
    (tabParam && validTabs.includes(tabParam))
      ? tabParam
      : "identity";

  if (!profile) {
    return <div className="p-8 text-center">Loading profile...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 pt-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 border-b border-zinc-100 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            Expert Profile
          </h1>
          <p className="text-zinc-500 mt-1">
            Manage your public presence and settings.
          </p>
        </div>

        {/* Public View Button */}
        {profile.isVetted && (
          <Button variant="outline" asChild className="gap-2 border-zinc-200">
            <Link href={`/experts/${profile.user.username}`} target="_blank">
              <Eye className="h-4 w-4" /> Public View
            </Link>
          </Button>
        )}
      </div>

      {/* REJECTION ALERT */}
      {profile.rejectionReason && (
        <Alert
          variant="destructive"
          className="bg-red-50 border-red-200 text-red-900"
        >
          <XCircle className="h-5 w-5 text-red-600" />
          <div className="ml-2">
            <AlertTitle className="font-bold">Action Required</AlertTitle>
            <AlertDescription className="text-sm mt-1">
              {profile.rejectionReason}
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* MAIN FORM */}
      <ProfileForm
        initialData={profile}
        isPending={profile.hasPendingUpdates}
        initialTab={activeTab} // SSR-safe tab
      />
    </div>
  );
}
