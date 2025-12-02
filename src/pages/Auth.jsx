import React, { useState } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, UserPlus, AlertCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
    setSuccess("");
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

      setSuccess("تم تسجيل الدخول بنجاح!");
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (err) {
      setError(err.message || "فشل تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      setSuccess("تم إنشاء الحساب بنجاح! يرجى تفعيل حسابك من البريد الإلكتروني");
      setFormData({
        email: "",
        password: "",
        confirmPassword: ""
      });

      setTimeout(() => {
        setIsLogin(true);
      }, 3000);
    } catch (err) {
      setError(err.message || "فشل إنشاء الحساب");
    } finally {
      setLoading(false);
    }
  };

 const { error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`
  }
});

      if (error) throw error;
    } catch (err) {
      setError(err.message || "فشل تسجيل الدخول عبر Google");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 p-4 md:p-6 flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 px-6 py-3 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span className="text-blue-800 font-semibold">منصة النور الطريق</span>
          </div>
        </div>

        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm rounded-3xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-center text-gray-900">
              {isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 md:p-8">

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </motion.div>
            )}

            {success && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-800">{success}</p>
              </motion.div>
            )}

            <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
              
              <div>
                <Label className="text-gray-700 font-medium mb-2 block">البريد الإلكتروني</Label>
                <Input name="email" type="email" value={formData.email} onChange={handleInputChange} required className="rounded-2xl" />
              </div>

              <div>
                <Label className="text-gray-700 font-medium mb-2 block">كلمة المرور</Label>
                <Input name="password" type="password" value={formData.password} onChange={handleInputChange} required className="rounded-2xl" />
              </div>

              {!isLogin && (
                <div>
                  <Label className="text-gray-700 font-medium mb-2 block">تأكيد كلمة المرور</Label>
                  <Input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} required className="rounded-2xl" />
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 py-6 text-lg rounded-2xl">
                {isLogin ? "تسجيل الدخول" : "إنشاء حساب"}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
                <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-500">أو</span></div>
              </div>

              <Button type="button" variant="outline" onClick={handleGoogleLogin} className="w-full py-6 text-lg rounded-2xl border-2">
                الدخول بحساب Google
              </Button>

            </form>

            <div className="mt-6 text-center">
              <button onClick={() => { setIsLogin(!isLogin); setFormData({ email: "", password: "", confirmPassword: "" }); setError(""); setSuccess(""); }} className="text-blue-600 hover:text-blue-700 font-medium">
                {isLogin ? "ليس لديك حساب؟ إنشاء حساب جديد" : "لديك حساب بالفعل؟ تسجيل الدخول"}
              </button>
            </div>

          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
