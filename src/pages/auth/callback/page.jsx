import { useEffect } from "react";
import { supabase } from "@/components/api/supabaseClient";

export default function OAuthCallback() {
  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const { data: { session }, error } =
          await supabase.auth.getSessionFromUrl({ storeSession: true });

        if (error || !session) {
          window.location.href = "/auth?error=oauth_failed";
        } else {
          window.location.href = "/";
        }
      } catch (err) {
        window.location.href = "/auth?error=oauth_failed";
      }
    };

    handleOAuthCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      جاري تسجيل الدخول...
    </div>
  );
}
