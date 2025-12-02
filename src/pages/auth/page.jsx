"use client";

import { useEffect } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { useRouter } from "next/navigation";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSessionFromUrl({ storeSession: true });
        if (error || !session) {
          router.replace("/auth?error=oauth_failed");
        } else {
          router.replace("/");
        }
      } catch (err) {
        router.replace("/auth?error=oauth_failed");
      }
    };

    handleOAuthCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-gray-700">
      جاري تسجيل الدخول...
    </div>
  );
}
