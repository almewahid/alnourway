
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings as SettingsIcon, User, Bell, Moon, Type, Globe, Save } from "lucide-react";
import { motion } from "framer-motion";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [fontSize, setFontSize] = useState(localStorage.getItem('fontSize') || 'medium');
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'ar');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    fatwa_updates: true,
    new_content: true,
  });
  const [appSettings, setAppSettings] = useState(() => {
    const savedSettings = localStorage.getItem('appSettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      features: { azkar: true, library: true },
      languages: { ar: true, en: true, fr: true, ur: true }
    };
  });

  useEffect(() => {
    loadUser();
    loadNotificationSettings();
    loadAppSettings();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const loadNotificationSettings = () => {
    const saved = localStorage.getItem('notifications');
    if (saved) {
      setNotifications(JSON.parse(saved));
    }
  };

  const loadAppSettings = () => {
    const saved = localStorage.getItem('appSettings');
    if (saved) {
      setAppSettings(JSON.parse(saved));
    }
  };

  const updateUserMutation = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: () => {
      alert('تم حفظ التغييرات بنجاح');
      loadUser();
    },
    onError: (error) => {
        console.error("Error updating user:", error);
        alert('حدث خطأ أثناء حفظ التغييرات');
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
  };

  const handleSaveProfile = () => {
    if (user) {
      updateUserMutation.mutate({
        full_name: user.full_name,
      });
    }
  };

  const languageOptions = [
    { value: 'ar', label: 'العربية', flag: '🇸🇦' },
    { value: 'en', label: 'English', flag: '🇪🇬' },
    { value: 'fr', label: 'Français', flag: '🇫🇷' },
    { value: 'ur', label: 'اردو', flag: '🇵🇰' },
  ];

  const availableLanguages = languageOptions.filter(lang => appSettings.languages[lang.value]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <SettingsIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            الإعدادات
          </h1>
          <p className="text-xl text-gray-600">
            تخصيص تجربتك في التطبيق
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* معلومات الحساب */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                معلومات الحساب
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">الاسم الكامل</Label>
                <Input
                  id="name"
                  value={user?.full_name || ''}
                  onChange={(e) => setUser({ ...user, full_name: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="mt-2 bg-gray-50"
                />
              </div>
              <Button
                onClick={handleSaveProfile}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 w-full"
                disabled={updateUserMutation.isLoading}
              >
                <Save className="w-4 h-4 ml-2" />
                {updateUserMutation.isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </Button>
            </CardContent>
          </Card>

          {/* إعدادات الإشعارات */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-purple-600" />
                إعدادات الإشعارات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">إشعارات البريد الإلكتروني</p>
                  <p className="text-sm text-gray-500">تلقي الإشعارات عبر البريد</p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">تحديثات الفتاوى</p>
                  <p className="text-sm text-gray-500">إشعار عند الرد على فتواك</p>
                </div>
                <Switch
                  checked={notifications.fatwa_updates}
                  onCheckedChange={(checked) => handleNotificationChange('fatwa_updates', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">محتوى جديد</p>
                  <p className="text-sm text-gray-500">إشعار عند إضافة محتوى جديد</p>
                </div>
                <Switch
                  checked={notifications.new_content}
                  onCheckedChange={(checked) => handleNotificationChange('new_content', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* إعدادات المظهر */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-indigo-600" />
                إعدادات المظهر
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">الوضع الليلي</p>
                  <p className="text-sm text-gray-500">تفعيل المظهر الداكن</p>
                </div>
                <Switch
                  checked={darkMode}
                  onCheckedChange={handleDarkModeToggle}
                />
              </div>
              
              <div>
                <Label htmlFor="fontSize" className="flex items-center gap-2 mb-2">
                  <Type className="w-4 h-4" />
                  حجم الخط
                </Label>
                <Select value={fontSize} onValueChange={handleFontSizeChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">صغير</SelectItem>
                    <SelectItem value="medium">متوسط</SelectItem>
                    <SelectItem value="large">كبير</SelectItem>
                    <SelectItem value="xlarge">كبير جداً</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* إعدادات اللغة */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-600" />
                اللغة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableLanguages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{lang.flag}</span>
                        <span>{lang.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500 mt-2">
                سيتم إعادة تحميل التطبيق عند تغيير اللغة
              </p>
            </CardContent>
          </Card>

          {/* زر تسجيل الخروج */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <Button
                onClick={() => base44.auth.logout()}
                variant="ghost"
                className="w-full text-white hover:bg-white/20 hover:text-white"
              >
                تسجيل الخروج
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
