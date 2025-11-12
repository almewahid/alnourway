import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, BookOpen, Heart, MessageSquare, Menu, Bell, User as UserIcon, Sparkles, Users, GraduationCap, Video, Shield } from "lucide-react";
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
import { base44 } from "@/api/base44Client";
import NotificationManager from "@/components/NotificationManager";
import { Toaster } from "@/components/ui/sonner";

const navigationItems = [
  { title: "الرئيسية", url: createPageUrl("Home"), icon: Home, color: "text-teal-600" },
  { title: "التعرف على الإسلام", url: createPageUrl("LearnIslam"), icon: BookOpen, color: "text-teal-600" },
  { title: "أريد أن أتوب", url: createPageUrl("Repentance"), icon: Heart, color: "text-rose-600" },
  { title: "طلب فتوى", url: createPageUrl("Fatwa"), icon: MessageSquare, color: "text-emerald-600" },
  { title: "إصلاح ذات البين", url: createPageUrl("ReconciliationCommittee"), icon: Users, color: "text-cyan-600" },
];

const quickLinks = [
  { title: "تواصل مع مفتي", url: createPageUrl("ContactScholar"), icon: UserIcon, color: "text-emerald-600" },
  { title: "تواصل مع داعية", url: createPageUrl("ContactPreacher"), icon: Users, color: "text-teal-600" },
  { title: "تواصل مع محفظ", url: createPageUrl("ContactTeacher"), icon: BookOpen, color: "text-purple-600" },
  { title: "دورات القرآن", url: createPageUrl("QuranCourses"), icon: GraduationCap, color: "text-teal-600" },
];

const bottomNavItems = [
  { title: "الرئيسية", url: createPageUrl("Home"), icon: Home },
  { title: "المحتوى", url: createPageUrl("Content"), icon: BookOpen },
  { title: "الإشعارات", url: createPageUrl("Notifications"), icon: Bell },
  { title: "الحساب", url: createPageUrl("Profile"), icon: UserIcon },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (error) {
      console.log("User not logged in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <style>{`
        * { direction: rtl; text-align: right; }
        :root {
          --emerald: #059669;
          --emerald-dark: #047857;
          --gold: #D4AF37;
          --gold-light: #F3E5AB;
        }
      `}</style>

      {/* Notification Manager */}
      <NotificationManager />
      <Toaster position="top-center" richColors />

      {/* إضافة Favicon */}
      <link rel="icon" type="image/png" sizes="192x192" href="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ecdfbb3578091a5f1e1c54/3f7f97347_android-chrome-192x192.png" />
      <link rel="icon" type="image/png" sizes="512x512" href="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ecdfbb3578091a5f1e1c54/760ac07b0_android-chrome-512x512.png" />
      
      <div className="min-h-screen flex w-full bg-gradient-to-br from-emerald-50 via-white to-amber-50">
        {/* Desktop Sidebar */}
        <Sidebar side="right" className="border-r border-emerald-100 hidden md:flex">
          <SidebarHeader className="border-b border-emerald-100 p-6 bg-gradient-to-br from-emerald-600 to-emerald-700">
            <div className="flex items-center justify-center gap-3">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ecdfbb3578091a5f1e1c54/3f7f97347_android-chrome-192x192.png" 
                alt="طريق النور" 
                className="w-10 h-10"
              />
              <h2 className="text-2xl font-bold text-white">طريق النور</h2>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild className={`hover:bg-emerald-50 transition-all duration-300 rounded-xl mb-2 ${location.pathname === item.url ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md' : ''}`}>
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className={`w-5 h-5 ${location.pathname === item.url ? 'text-white' : item.color}`} />
                          <span className="font-semibold text-base">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* روابط سريعة */}
            <SidebarGroup className="mt-6">
              <SidebarGroupLabel className="px-4 py-2 text-sm font-semibold text-gray-500">
                روابط سريعة
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {quickLinks.map((link) => (
                    <SidebarMenuItem key={link.title}>
                      <SidebarMenuButton asChild className="hover:bg-emerald-50 transition-all duration-300 rounded-xl mb-1">
                        <Link to={link.url} className="flex items-center gap-3 px-4 py-2">
                          <link.icon className={`w-4 h-4 ${link.color}`} />
                          <span className="text-sm">{link.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* قسم المدير */}
            {!loading && user?.role === 'admin' && (
              <SidebarGroup className="mt-6">
                <SidebarGroupLabel className="px-4 py-2 text-sm font-semibold text-red-500">
                  لوحة التحكم
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild className={`hover:bg-red-50 hover:text-red-700 transition-all duration-300 rounded-xl ${location.pathname === createPageUrl("Admin") ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md' : ''}`}>
                        <Link to={createPageUrl("Admin")} className="flex items-center gap-3 px-4 py-2">
                          <Shield className={`w-4 h-4 ${location.pathname === createPageUrl("Admin") ? 'text-white' : 'text-red-600'}`} />
                          <span className="text-sm">إدارة المحتوى</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild className={`hover:bg-red-50 hover:text-red-700 transition-all duration-300 rounded-xl ${location.pathname === createPageUrl("AdvancedAnalytics") ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md' : ''}`}>
                        <Link to={createPageUrl("AdvancedAnalytics")} className="flex items-center gap-3 px-4 py-2">
                          <Sparkles className={`w-4 h-4 ${location.pathname === createPageUrl("AdvancedAnalytics") ? 'text-white' : 'text-red-600'}`} />
                          <span className="text-sm">التحليلات المتقدمة</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col min-h-screen">
          {/* Mobile Header */}
          <header className="bg-white border-b border-emerald-100 px-6 py-4 block md:hidden shadow-sm">
            <div className="flex items-center gap-4 justify-between">
              <SidebarTrigger className="hover:bg-emerald-50 p-2 rounded-lg transition-colors duration-200">
                <Menu className="w-6 h-6 text-emerald-700" />
              </SidebarTrigger>
              <div className="flex items-center gap-2">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ecdfbb3578091a5f1e1c54/3f7f97347_android-chrome-192x192.png" 
                  alt="طريق النور" 
                  className="w-8 h-8"
                />
                <h2 className="text-xl font-bold text-emerald-700">طريق النور</h2>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto pb-20">
            {children}
          </div>

          {/* Bottom Navigation - Always Visible */}
          <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-emerald-100 shadow-2xl">
            <div className="flex items-center justify-around px-2 py-2 max-w-screen-lg mx-auto">
              {bottomNavItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <Link key={item.title} to={item.url} className="flex flex-col items-center justify-center gap-1 py-2 px-3 flex-1 min-w-0 transition-all duration-200">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg scale-105' : 'bg-transparent hover:bg-gray-50'}`}>
                      <item.icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    </div>
                    <span className={`text-xs font-medium truncate w-full text-center ${isActive ? 'text-emerald-600' : 'text-gray-600'}`}>
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