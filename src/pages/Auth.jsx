import { useState, useEffect } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error) throw error;

      navigate("/"); // تسجيل الدخول ناجح
    } catch (err) {
      setError(err.message || "فشل تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/auth", // العودة إلى هذه الصفحة
        },
      });
      if (error) throw error;
    } catch (err) {
      setError("فشل تسجيل الدخول بحساب Google");
    } finally {
      setLoading(false);
    }
  };

  // قراءة OAuth hash عند العودة من Google
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token");

    if (accessToken && refreshToken) {
      localStorage.setItem(
        "supabase.auth.token",
        JSON.stringify({
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_at: Date.now() + 3600 * 1000,
        })
      );
      window.history.replaceState(null, "", "/"); // إزالة hash
      navigate("/"); // إعادة التوجيه للصفحة الرئيسية
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">تسجيل الدخول</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleLogin} className="space-y-4 w-full max-w-sm">
        <input
          type="email"
          name="email"
          placeholder="البريد الإلكتروني"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="كلمة المرور"
          value={formData.password}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {loading ? "جاري التحميل..." : "تسجيل الدخول"}
        </button>
      </form>

      <button
        onClick={handleGoogleLogin}
        className="mt-4 w-full max-w-sm bg-red-600 text-white py-2 rounded"
      >
        الدخول بحساب Google
      </button>
    </div>
  );
}
