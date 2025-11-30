import React, { useState, useEffect } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Settings, LogOut, Heart, BookOpen, Bell, Mail, Shield, Search, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        // You can fetch additional profile data here if you have a profiles table
        setUser({ ...authUser, role: 'user' }); // Default role for now
      }
    } catch (error) {
      console.error("Error loading user:", error);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const menuItems = [
    { icon: Heart, label: "المفضلة", color: "from-red-400 to-red-600", link: createPageUrl("Favorites") },
    { icon: Search, label: "البحث", color: "from-indigo-400 to-indigo-600", link: createPageUrl("Search") },
    { icon: Settings, label: "الإعدادات", color: "from-gray-400 to-gray-600", link: createPageUrl("Settings") },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-800 p-6 md:p-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-800">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white py-12 md:py-16 px-4"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-white" />
            <span className="text-white font-semibold">الحساب الشخصي</span>
          </div>
          
          <div className="w-20 h-20 md:w-28 md:h-28 mx-auto mb-4 md:mb-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl">
            <User className="w-10 h-10 md:w-14 md:h-14" />
          </div>
          {user ? (
            <>
              <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-3">
                {user.email ? user.email.split('@')[0] : "المستخدم"}
              </h1>
              <p className="text-purple-100 text-base md:text-lg mb-2">{user.email}</p>
              <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                {user.role === 'admin' ? 'مدير' : 'مستخدم'}
              </span>
            </>
          ) : (
            <>
              <h1 className="text-2xl md:text-4xl font-bold mb-3">غير مسجل دخول</h1>
              <p className="text-purple-100 text-base md:text-lg">يرجى تسجيل الدخول للوصول إلى حسابك</p>
            </>
          )}
        </div>
      </motion.div>

      {user ? (
        <div className="max-w-3xl mx-auto px-4 py-6 md:py-8">
          {/* User Info Cards */}
          <div className="grid md:grid-cols-2 gap-4 mb-6 md:mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm rounded-3xl">
                <CardContent className="p-5 md:p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                      <p className="font-semibold text-gray-900 text-sm md:text-base">{user.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm rounded-3xl">
                <CardContent className="p-5 md:p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">نوع الحساب</p>
                      <p className="font-semibold text-gray-900 text-sm md:text-base">
                        {user.role === 'admin' ? 'مدير' : 'مستخدم'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Menu Items */}
          <div className="space-y-3 mb-6 md:mb-8">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={item.link}>
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer group bg-white/95 backdrop-blur-sm rounded-3xl">
                    <CardContent className="p-4 md:p-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md`}>
                          <item.icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-base md:text-lg font-semibold text-gray-800 flex-1">
                          {item.label}
                        </span>
                        <span className="text-gray-400">←</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Logout Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              variant="outline"
              className="w-full py-5 md:py-6 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 text-base md:text-lg bg-white/95 backdrop-blur-sm rounded-2xl"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 ml-2" />
              تسجيل الخروج
            </Button>
          </motion.div>
        </div>
      ) : (
        <div className="max-w-md mx-auto px-4 py-8 md:py-12 text-center">
          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm rounded-3xl">
            <CardContent className="p-8 md:p-12">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-6" />
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                غير مسجل دخول
              </h3>
              <p className="text-gray-600 mb-8">
                يرجى تسجيل الدخول للوصول إلى حسابك وميزاته
              </p>
              <Link to="/auth">
                <Button
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 py-5 md:py-6 text-base md:text-lg rounded-2xl"
                >
                  تسجيل الدخول
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}