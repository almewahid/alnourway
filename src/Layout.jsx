import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, BookOpen, Heart, MessageSquare, Menu, Bell, User as UserIcon, Sparkles, Users, GraduationCap, Shield, Star, Settings, Radio } from "lucide-react";
import { LanguageProvider } from "@/components/LanguageContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { supabase } from "@/components/api/supabaseClient";
import NotificationManager from "@/components/NotificationManager";
import { Toaster } from "@/components/ui/sonner";
import ChatWidget from "@/components/ChatWidget";

const navigationItems = [
  { title: "الرئيسية", url: createPageUrl("Home"), icon: Home, color: "text-teal-600" },
  { title: "التعرف على الإسلام", url: createPageUrl("LearnIslam"), icon: BookOpen, color: "text-teal-600" },
  { title: "أريد أن أتوب", url: createPageUrl("Repentance"), icon: Heart, color: "text-rose-600" },
  { title: "طلب فتوى", url: createPageUrl("Fatwa"), icon: MessageSquare, color: "text-emerald-600" },
  { title: "البث المباشر", url: createPageUrl("LiveStreams"), icon: Radio, color: "text-red-600" },
  { title: "إصلاح ذات البين", url: createPageUrl("ReconciliationCommittee"), icon: Users, color: "text-cyan-600" },
  { title: "المرشد الذكي", url: createPageUrl("AIGuide"), icon: Sparkles, color: "text-emerald-600" },
  { title: "المدونة", url: createPageUrl("Blog"), icon: BookOpen, color: "text-blue-600" },
  { title: "الدورات التعليمية", url: createPageUrl("Courses"), icon: GraduationCap, color: "text-teal-600" },
];

const quickLinks = [
  { title: "تواصل مع مفتي", url: createPageUrl("ContactScholar"), icon: UserIcon, color: "text-emerald-600" },
  { title: "تواصل مع داعية", url: createPageUrl("ContactPreacher"), icon: Users, color: "text-teal-600" },
  { title: "تواصل مع محفظ", url: createPageUrl("ContactTeacher"), icon: BookOpen, color: "text-purple-600" },
  { title: "دورات القرآن", url: createPageUrl("QuranCourses"), icon: GraduationCap, color: "text-teal-600" },
  { title: "التوصيات المخصصة", url: createPageUrl("Recommendations"), icon: Star, color: "text-purple-600" },
  { title: "الإعدادات", url: createPageUrl("Settings"), icon: Settings, color: "text-gray-600" },
];

const bottomNavItems = [
  { title: "الرئيسية", url: createPageUrl("Home"), icon: Home, color: "from-teal-500 to-teal-600" },
  { title: "المحتوى", url: createPageUrl("Content"), icon: BookOpen, color: "from-blue-500 to-blue-600" },
  { title: "الإشعارات", url: createPageUrl("Notifications"), icon: Bell, color: "from-amber-500 to-amber-600" },
  { title: "الحساب", url: createPageUrl("Profile"), icon: UserIcon, color: "from-purple-500 to-purple-600" },
];

export default function Layout({ children, currentPageName }) {
  return (
    <LanguageProvider>
      <LayoutContent children={children} currentPageName={currentPageName} />
    </LanguageProvider>
  );
}

function LayoutContent({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [sidebarOpen, setSidebarOpen] = React.useState(window.innerWidth >= 768);

  React.useEffect(() => {
    loadUser();
    registerServiceWorker();
  }, []);

  const loadUser = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data: profile } = await supabase
          .from('Profile')
          .select('role')
          .eq('user_id', authUser.id)
          .single();
        setUser({ ...authUser, role: profile?.role || 'user' });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log("User not logged in");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({ ...session.user, role: 'user' });
      } else {
        setUser(null);
      }
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('/service-worker.js');
        console.log('Service Worker registered');
      } catch (error) {
        console.log('Service Worker registration failed:', error);
      }
    }
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const [isDarkMode, setIsDarkMode] = React.useState(localStorage.getItem("theme") === "dark");

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <SidebarProvider defaultOpen={true} open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <style>{`
        * { direction: rtl; text-align: right; }
        :root {
          --emerald: #059669;
          --emerald-dark: #047857;
          --gold: #D4AF37;
          --gold-light: #F3E5AB;
        }
        .dark {
           color-scheme: dark;
        }
      `}</style>

      <NotificationManager />
      <Toaster position="top-center" richColors />
      <ChatWidget />

      <link rel="icon" type="image/png" sizes="192x192" href="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ecdfbb3578091a5f1e1c54/3f7f97347_android-chrome-192x192.png" />
      <link rel="icon" type="image/png" sizes="512x512" href="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ecdfbb3578091a5f1e1c54/760ac07b0_android-chrome-512x512.png" />
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#059669" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      <div className="min-h-screen flex w-full bg-gradient-to-br from-emerald-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-950 transition-colors duration-300">
        <Sidebar side="right" className="border-r border-emerald-100 dark:border-emerald-900 dark:bg-gray-900">
          <SidebarHeader className="border-b border-emerald-100 dark:border-emerald-900 p-6 bg-gradient-to-br from-emerald-600 to-emerald-700 dark:from-emerald-900 dark:to-emerald-950">
            <div className="flex items-center gap-3">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ecdfbb3578091a5f1e1c54/3f7f97347_android-chrome-192x192.png" 
                alt="طريق النور" 
                className="w-12 h-12 rounded-full shadow-lg border-2 border-white/20"
              />
              <div>
                <h1 className="text-xl font-bold text-white drop-shadow-lg">طريق النور</h1>
                <p className="text-xs text-emerald-100">منصة إسلامية شاملة</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild className={`hover:bg-emerald-50 dark:hover:bg-emerald-900/50 dark:text-gray-200 transition-all duration-300 rounded-xl mb-2 ${location.pathname === item.url ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md' : ''}`}>
                        <Link to={item.url} onClick={handleLinkClick} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className={`w-5 h-5 ${location.pathname === item.url ? 'text-white' : item.color}`} />
                          <span className="font-semibold text-base">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-6">
              <SidebarGroupLabel className="px-4 py-2 text-sm font-semibold text-gray-500">
                روابط سريعة
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {quickLinks.map((link) => (
                    <SidebarMenuItem key={link.title}>
                      <SidebarMenuButton asChild className="hover:bg-emerald-50 transition-all duration-300 rounded-xl mb-1">
                        <Link to={link.url} onClick={handleLinkClick} className="flex items-center gap-3 px-4 py-2">
                          <link.icon className={`w-4 h-4 ${link.color}`} />
                          <span className="text-sm">{link.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {!loading && (user?.role === 'admin' || user?.role === 'moderator') && (
              <SidebarGroup className="mt-6">
                <SidebarGroupLabel className="px-4 py-2 text-sm font-semibold text-red-500">
                  لوحة التحكم
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild className={`hover:bg-red-50 hover:text-red-700 transition-all duration-300 rounded-xl ${location.pathname === createPageUrl("Admin") ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md' : ''}`}>
                        <Link to={createPageUrl("Admin")} onClick={handleLinkClick} className="flex items-center gap-3 px-4 py-2">
                          <Shield className={`w-4 h-4 ${location.pathname === createPageUrl("Admin") ? 'text-white' : 'text-red-600'}`} />
                          <span className="text-sm">إدارة المحتوى</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild className={`hover:bg-red-50 hover:text-red-700 transition-all duration-300 rounded-xl ${location.pathname === createPageUrl("Docs") ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md' : ''}`}>
                        <Link to={createPageUrl("Docs")} onClick={handleLinkClick} className="flex items-center gap-3 px-4 py-2">
                          <BookOpen className={`w-4 h-4 ${location.pathname === createPageUrl("Docs") ? 'text-white' : 'text-red-600'}`} />
                          <span className="text-sm">التوثيق التقني</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild className={`hover:bg-red-50 hover:text-red-700 transition-all duration-300 rounded-xl ${location.pathname === createPageUrl("AdvancedAnalytics") ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md' : ''}`}>
                        <Link to={createPageUrl("AdvancedAnalytics")} onClick={handleLinkClick} className="flex items-center gap-3 px-4 py-2">
                          <Sparkles className={`w-4 h-4 ${location.pathname === createPageUrl("AdvancedAnalytics") ? 'text-white' : 'text-red-600'}`} />
                          <span className="text-sm">التحليلات المتقدمة</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}

            {user && (
              <div className="p-4 mt-auto border-t border-emerald-100 dark:border-emerald-900">
                <button
                   onClick={toggleDarkMode}
                   className="flex items-center gap-3 px-4 py-2 mb-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl w-full transition-all duration-300"
                >
                   {isDarkMode ? <span className="flex items-center gap-3"><span className="text-xl">☀️</span> وضع النهار</span> : <span className="flex items-center gap-3"><span className="text-xl">🌙</span> وضع الليل</span>}
                </button>
                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    window.location.href = '/';
                  }}
                  className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl w-full transition-all duration-300"
                >
                  <span className="font-semibold text-sm">تسجيل الخروج</span>
                </button>
              </div>
            )}
            </SidebarContent>
            </Sidebar>

        <main className="flex-1 flex flex-col min-h-screen w-full overflow-x-hidden">
          <header className="bg-white border-b border-emerald-100 px-4 md:px-6 py-4 block md:hidden shadow-sm">
            <div className="flex items-center gap-4 justify-between max-w-full">
              <SidebarTrigger onClick={() => setSidebarOpen(!sidebarOpen)} className="hover:bg-emerald-50 p-2 rounded-lg transition-colors duration-200">
                <Menu className="w-6 h-6 text-emerald-700" />
              </SidebarTrigger>
              <div className="flex items-center gap-2 min-w-0">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ecdfbb3578091a5f1e1c54/3f7f97347_android-chrome-192x192.png" 
                  alt="طريق النور" 
                  className="w-8 h-8 flex-shrink-0"
                />
                <h2 className="text-lg md:text-xl font-bold text-emerald-700 truncate">طريق النور</h2>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto pb-20 md:pb-16 w-full">
            {children}
          </div>

          <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-lg border-t border-gray-200 shadow-2xl md:hidden">
            <div className="flex items-center justify-around px-2 py-1.5 w-full max-w-full">
              {bottomNavItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <Link 
                    key={item.title} 
                    to={item.url} 
                    className="flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 flex-1 min-w-0 transition-all duration-200"
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isActive 
                        ? `bg-gradient-to-br ${item.color} shadow-lg scale-105` 
                        : 'bg-transparent hover:bg-gray-50'
                    }`}>
                      <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    </div>
                    <span className={`text-[9px] font-medium truncate w-full text-center ${
                      isActive ? 'text-gray-900' : 'text-gray-600'
                    }`}>
                      {item.title}
                    </span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </main>
      </div>
    </SidebarProvider>
  );
}