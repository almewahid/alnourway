"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/components/api/supabaseClient";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      // Supabase سيحاول استخراج الجلسة
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        // تسجيل دخول ناجح → إلى الصفحة الرئيسية
        router.replace("/");
      } else {
        // فشل → رجوع لصفحة auth
        router.replace("/auth?error=oauth_failed");
      }
    };

    handleOAuthCallback();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "20px",
      }}
    >
      جاري تسجيل الدخول...
    </div>
  );
}
