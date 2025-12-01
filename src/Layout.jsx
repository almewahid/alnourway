import React, { useState, useEffect } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Home,
  Video,
  BookOpen,
  MessageSquare,
  Heart,
  HelpCircle,
  Users,
  GraduationCap,
  Library,
  Sparkles,
  LogOut,
  User,
  Shield
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Layout({ children }) {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    loadUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({
          email: session.user.email,
          full_name: session.user.user_metadata?.full_name || session.user.email,
          role: session.user.user_metadata?.role || 'user'
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const loadUser = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setUser({
          email: authUser.email,
          full_name: authUser.user_metadata?.full_name || authUser.email,
          role: authUser.user_metadata?.role || 'user'
        });
      }
    } catch (error) {
      console.log("User not logged in");
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const navItems = [
    { icon: Home, label: "الرئيسية", path: "/" },
    { icon: Video, label: "المحاضرات", path: "/lectures" },
    { icon: Library, label: "المكتبة", path: "/library" },
    { icon: MessageSquare, label: "الفتاوى", path: "/fatwa" },
    { icon: Heart, label: "قصص التائبين", path: "/repentance" },
    { icon: GraduationCap, label: "دورات القرآن", path: "/quran-courses" },
    { icon: Users, label: "لجنة المصالحة", path: "/reconciliation" },
    { icon: HelpCircle, label: "تعلم الإسلام", path: "/learn-islam" },
  ];

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-white/20 p-2 rounded-xl group-hover:bg-white/30 transition-all duration-300">
                <Sparkles className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <span className="font-bold text-xl md:text-2xl">النور الطريق</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                    isActivePath(item.path)
                      ? "bg-white/20 text-white"
                      : "hover:bg-white/10 text-white/90"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 md:gap-3">
              {user ? (
                <>
                  {user.role === "admin" && (
                    <Link to="/admin">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hidden md:flex text-white hover:bg-white/20"
                      >
                        <Shield className="w-4 h-4 ml-2" />
                        لوحة التحكم
                      </Button>
                    </Link>
                  )}
                  <Link to="/favorites" className="hidden md:block">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link to="/profile">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hidden md:flex text-white hover:bg-white/20"
                    >
                      <User className="w-4 h-4 ml-2" />
                      {user.full_name}
                    </Button>
                  </Link>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <Link to="/auth">
                  <Button className="bg-white text-blue-600 hover:bg-white/90">
                    <User className="w-4 h-4 ml-2" />
                    تسجيل الدخول
                  </Button>
                </Link>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-white/10"
            >
              <div className="container mx-auto px-4 py-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActivePath(item.path)
                        ? "bg-white/20 text-white"
                        : "hover:bg-white/10 text-white/90"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}

                {user && (
                  <>
                    <Link
                      to="/favorites"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 text-white/90"
                    >
                      <Heart className="w-5 h-5" />
                      <span className="font-medium">المفضلة</span>
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 text-white/90"
                    >
                      <User className="w-5 h-5" />
                      <span className="font-medium">الملف الشخصي</span>
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 text-white/90"
                      >
                        <Shield className="w-5 h-5" />
                        <span className="font-medium">لوحة التحكم</span>
                      </Link>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="min-h-[calc(100vh-80px)]">{children}</main>

      <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-blue-600 p-3 rounded-xl">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold">النور الطريق</span>
            </div>
            <p className="text-gray-400 mb-6">منصة إسلامية شاملة للتعليم والإرشاد</p>
            <p className="text-gray-500 text-sm">
              © 2024 النور الطريق. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
