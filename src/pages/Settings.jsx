import React, { useState, useEffect } from "react";
import { useLanguage } from "@/components/LanguageContext";
import { supabase } from "@/components/api/supabaseClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings as SettingsIcon, User, Bell, Moon, Type, Globe, Save, Heart, Sun, Shield, LogOut, ChevronRight, Check, Mail, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InterestsSelector from "@/components/InterestsSelector";
import Breadcrumb from "@/components/Breadcrumb";
import { toast } from "sonner";

export default function Settings() {
  const { t } = useLanguage();
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [fontSize, setFontSize] = useState(localStorage.getItem('fontSize') || 'medium');
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'ar');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    fatwa_updates: true,
    new_content: true,
    live_streams: true,
    scheduled_meetings: true
  });

  useEffect(() => {
    loadUser();
    loadNotificationSettings();
  }, []);

  const loadUser = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setUser({ ...authUser, role: 'user' });
      }
    } catch (error) {
      console.log("User not logged in");
    }
  };

  const loadNotificationSettings = () => {
    const saved = localStorage.getItem('notifications');
    if (saved) {
      setNotifications(JSON.parse(saved));
    }
  };

  const { data: userPreferences } = useQuery({
    queryKey: ['user_preferences', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const { data, error } = await supabase.from('UserPreference').select('*').eq('user_email', user.email);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
    initialData: [],
  });

  const updateUserMutation = useMutation({
    mutationFn: async (data) => {
      const { error } = await supabase.auth.updateUser({ data });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(t('تم حفظ التغييرات بنجاح') || 'تم حفظ التغييرات بنجاح');
      loadUser();
    },
    onError: (error) => {
        console.log("Error updating user:", error);
        toast.error(t('حدث خطأ أثناء حفظ التغييرات') || 'حدث خطأ أثناء حفظ التغييرات');
    }
  });

  const handleDarkModeToggle = (checked) => {
    setDarkMode(checked);
    localStorage.setItem('darkMode', checked);
    if (checked) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleFontSizeChange = (size) => {
    setFontSize(size);
    localStorage.setItem('fontSize', size);
    const sizes = { small: '14px', medium: '16px', large: '18px', xlarge: '20px' };
    document.documentElement.style.fontSize = sizes[size];
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    window.location.reload();
  };

  const handleNotificationChange = (key, value) => {
    const updated = { ...notifications, [key]: value };
    setNotifications(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));
    toast.success(t('تم تحديث الإعدادات') || 'تم تحديث الإعدادات');
  };

  const handleSaveProfile = () => {
    if (user) {
      updateUserMutation.mutate({
        full_name: user.full_name,
      });
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        handleNotificationChange('push', true);
        toast.success(t('تم تفعيل الإشعارات بنجاح') || 'تم تفعيل الإشعارات بنجاح');
      } else {
        toast.error(t('لم يتم منح إذن الإشعارات') || 'لم يتم منح إذن الإشعارات');
      }
    }
  };

  const languageOptions = [
    { value: 'ar', label: 'العربية', flag: '🇸🇦' },
    { value: 'en', label: 'English', flag: '🇬🇧' },
    { value: 'fr', label: 'Français', flag: '🇫🇷' },
    { value: 'zh', label: '中文', flag: '🇨🇳' },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-indigo-950 dark:to-purple-950 p-4 md:p-6 flex items-center justify-center transition-colors duration-300">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-0 shadow-2xl bg-white dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl max-w-md w-full mx-4 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
            <CardContent className="p-8 md:p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <SettingsIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {t('يرجى تسجيل الدخول')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-base">
                {t('سجل الدخول للوصول إلى إعداداتك')}
              </p>
              <button
                onClick={() => window.location.href = '/auth'}
                className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 py-4 text-lg rounded-2xl text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                {t('تسجيل الدخول')}
              </button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-indigo-950 dark:to-purple-950 p-4 md:p-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Breadcrumb items={[{ label: t("الإعدادات") }]} />
        </div>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="relative inline-block">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl transform rotate-3">
              <SettingsIcon className="w-10 h-10 text-white transform -rotate-3" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full animate-pulse"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-3">
            {t('الإعدادات')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t('تخصيص تجربتك في التطبيق')}
          </p>
        </motion.div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 mb-8 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl p-2 rounded-2xl shadow-lg">
            <TabsTrigger 
              value="profile" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              <User className="w-4 h-4 ml-2" />
              {t('الحساب')}
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              <Bell className="w-4 h-4 ml-2" />
              {t('الإشعارات')}
            </TabsTrigger>
            <TabsTrigger 
              value="appearance" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              {darkMode ? <Moon className="w-4 h-4 ml-2" /> : <Sun className="w-4 h-4 ml-2" />}
              {t('المظهر')}
            </TabsTrigger>
            <TabsTrigger 
              value="interests" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              <Heart className="w-4 h-4 ml-2" />
              {t('الاهتمامات')}
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Account Info Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                        {t('معلومات الحساب')}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {t('الاسم الكامل')}
                      </Label>
                      <Input
                        id="name"
                        value={user?.full_name || ''}
                        onChange={(e) => setUser({ ...user, full_name: e.target.value })}
                        className="border-2 border-gray-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl py-6 dark:bg-slate-900/50 dark:text-white transition-all duration-300"
                        placeholder="أدخل اسمك الكامل"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {t('البريد الإلكتروني')}
                      </Label>
                      <Input
                        id="email"
                        value={user?.email || ''}
                        disabled
                        className="border-2 bg-gray-50 dark:bg-slate-900/30 border-gray-200 dark:border-slate-700 rounded-xl py-6 dark:text-gray-400 cursor-not-allowed"
                      />
                    </div>
                    <Button
                      onClick={handleSaveProfile}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 py-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      disabled={updateUserMutation.isLoading}
                    >
                      {updateUserMutation.isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          {t('جاري الحفظ...')}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Save className="w-5 h-5" />
                          {t('حفظ التغييرات')}
                        </div>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Password Change Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                  <div className="h-2 bg-gradient-to-r from-red-500 to-pink-500"></div>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <span className="bg-gradient-to-r from-red-600 to-pink-600 dark:from-red-400 dark:to-pink-400 bg-clip-text text-transparent">
                        {t('تغيير كلمة المرور')}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="new-password" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {t('كلمة المرور الجديدة')}
                      </Label>
                      <Input
                        id="new-password"
                        type="password"
                        placeholder={t('أدخل كلمة المرور الجديدة')}
                        className="border-2 border-gray-200 dark:border-slate-700 focus:border-red-500 dark:focus:border-red-400 rounded-xl py-6 dark:bg-slate-900/50 dark:text-white transition-all duration-300"
                        onChange={(e) => window.newPassword = e.target.value}
                      />
                    </div>
                    <Button
                      onClick={async () => {
                        const newPass = window.newPassword;
                        if (!newPass || newPass.length < 6) {
                          toast.error(t("كلمة المرور يجب أن تكون 6 أحرف على الأقل"));
                          return;
                        }
                        try {
                          const { error } = await supabase.auth.updateUser({ password: newPass });
                          if (error) throw error;
                          toast.success(t("تم تحديث كلمة المرور بنجاح"));
                        } catch(e) {
                          toast.error(t("خطأ في تحديث كلمة المرور") + ": " + e.message);
                        }
                      }}
                      className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 py-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        {t('تحديث كلمة المرور')}
                      </div>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Bell className="w-6 h-6 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                      {t('إعدادات الإشعارات')}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      key: 'push',
                      icon: Smartphone,
                      title: t('إشعارات المتصفح'),
                      desc: t('تلقي إشعارات في المتصفح'),
                      color: 'from-blue-500 to-cyan-500',
                      special: true
                    },
                    {
                      key: 'email',
                      icon: Mail,
                      title: t('إشعارات البريد الإلكتروني'),
                      desc: t('تلقي الإشعارات عبر البريد'),
                      color: 'from-emerald-500 to-teal-500'
                    },
                    {
                      key: 'fatwa_updates',
                      icon: Bell,
                      title: t('تحديثات الفتاوى'),
                      desc: t('إشعار عند الرد على فتواك'),
                      color: 'from-amber-500 to-orange-500'
                    },
                    {
                      key: 'new_content',
                      icon: Bell,
                      title: t('محتوى جديد'),
                      desc: t('إشعار عند إضافة محتوى جديد'),
                      color: 'from-purple-500 to-pink-500'
                    },
                    {
                      key: 'live_streams',
                      icon: Bell,
                      title: t('البث المباشر'),
                      desc: t('إشعار عند بدء بث مباشر'),
                      color: 'from-red-500 to-rose-500'
                    },
                    {
                      key: 'scheduled_meetings',
                      icon: Bell,
                      title: t('مواعيد اللقاءات'),
                      desc: t('تذكير بمواعيد اللقاءات المجدولة'),
                      color: 'from-indigo-500 to-blue-500'
                    }
                  ].map((item, index) => (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-900/50 dark:to-slate-800/50 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center shadow-lg`}>
                          <item.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white">{item.title}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                        </div>
                      </div>
                      {item.special && !notifications[item.key] ? (
                        <Button
                          size="sm"
                          onClick={requestNotificationPermission}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg"
                        >
                          {t('تفعيل')}
                        </Button>
                      ) : (
                        <Switch
                          checked={notifications[item.key]}
                          onCheckedChange={(checked) => handleNotificationChange(item.key, checked)}
                          className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-emerald-500 data-[state=checked]:to-teal-500"
                        />
                      )}
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Theme Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                  <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-500"></div>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                        {darkMode ? <Moon className="w-6 h-6 text-white" /> : <Sun className="w-6 h-6 text-white" />}
                      </div>
                      <span className="bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
                        {t('إعدادات المظهر')}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-900/50 dark:to-slate-800/50">
                      <div className="flex items-center gap-3">
                        {darkMode ? <Moon className="w-6 h-6 text-indigo-500" /> : <Sun className="w-6 h-6 text-amber-500" />}
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{t('الوضع الليلي')}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{t('تفعيل المظهر الداكن')}</p>
                        </div>
                      </div>
                      <Switch
                        checked={darkMode}
                        onCheckedChange={handleDarkModeToggle}
                        className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-500 data-[state=checked]:to-purple-500"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="fontSize" className="flex items-center gap-2 text-base font-semibold text-gray-700 dark:text-gray-300">
                        <Type className="w-5 h-5" />
                        {t('حجم الخط')}
                      </Label>
                      <Select value={fontSize} onValueChange={handleFontSizeChange}>
                        <SelectTrigger className="border-2 border-gray-200 dark:border-slate-700 rounded-xl py-6 dark:bg-slate-900/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">{t('صغير')}</SelectItem>
                          <SelectItem value="medium">{t('متوسط')}</SelectItem>
                          <SelectItem value="large">{t('كبير')}</SelectItem>
                          <SelectItem value="xlarge">{t('كبير جداً')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Language Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                  <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Globe className="w-6 h-6 text-white" />
                      </div>
                      <span className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                        {t('اللغة')}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Select value={language} onValueChange={handleLanguageChange}>
                      <SelectTrigger className="border-2 border-gray-200 dark:border-slate-700 rounded-xl py-6 dark:bg-slate-900/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languageOptions.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{lang.flag}</span>
                              <span className="font-medium">{lang.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        {t('سيتم إعادة تحميل التطبيق عند تغيير اللغة')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Interests Tab */}
          <TabsContent value="interests">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-rose-500 to-pink-500"></div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-rose-600 to-pink-600 dark:from-rose-400 dark:to-pink-400 bg-clip-text text-transparent">
                      {t('إدارة الاهتمامات')}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-6 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-2xl mb-6">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {t('اختر المواضيع التي تهمك لتحصل على توصيات أفضل')}
                    </p>
                  </div>
                  <InterestsSelector userEmail={user?.email} />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card className="border-0 shadow-xl bg-gradient-to-br from-red-500 via-rose-500 to-pink-500 text-white overflow-hidden rounded-3xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <Button
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.href = '/';
                }}
                variant="ghost"
                className="w-full text-white hover:bg-white/20 backdrop-blur-sm text-lg py-7 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center justify-center gap-3">
                  <LogOut className="w-6 h-6" />
                  {t('تسجيل الخروج')}
                  <ChevronRight className="w-5 h-5" />
                </div>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}