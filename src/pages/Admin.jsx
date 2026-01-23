import React, { useState, useEffect } from "react";
import { useLanguage } from "@/components/LanguageContext";
import { supabase } from "@/components/api/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Shield, BookOpen, Video, MessageSquare, Users, Heart, Building2, GraduationCap, Calendar, Eye, ThumbsUp, MessageCircleMore, Star, TrendingUp, Activity, Upload, Sparkles } from "lucide-react";
import AdminTable from "@/components/AdminTable";
import AppSettingsAdmin from "@/components/AppSettingsAdmin";
import BulkUploadModal from "@/components/BulkUploadModal";
import UsersManagement from "@/components/UsersManagement";
import CourseManager from "@/components/admin/CourseManager";
import FatwaModeration from "@/components/admin/FatwaModeration";
import CommentsModeration from "@/components/admin/CommentsModeration";
import AIContentGenerator from "@/components/admin/AIContentGenerator";

export default function Admin() {
  const { t } = useLanguage();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("analytics");
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [bulkUploadEntity, setBulkUploadEntity] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      // 1. التحقق من تسجيل الدخول
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authUser) {
        console.error('User not authenticated:', authError);
        window.location.href = '/auth';
        return;
      }

      // 2. جلب الصلاحية من جدول Profile
      const { data: profileData, error: profileError } = await supabase
        .from('Profile')
        .select('role')
        .eq('user_id', authUser.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        window.location.href = '/';
        return;
      }

      // 3. التحقق من صلاحية Admin أو Moderator
      if (profileData?.role !== 'admin' && profileData?.role !== 'moderator') {
        console.warn('Access denied: User is not admin or moderator');
        window.location.href = '/unauthorized';
        return;
      }

      // 4. حفظ بيانات المستخدم
      setUser({ ...authUser, role: profileData.role });
      
    } catch (error) {
      console.error("Error loading user:", error);
      window.location.href = '/';
    }
  };

  const { data: lectures } = useQuery({
    queryKey: ['admin_lectures'],
    queryFn: async () => {
      const { data, error } = await supabase.from('Lecture').select('*');
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  const { data: stories } = useQuery({
    queryKey: ['admin_stories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('Story').select('*');
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  const { data: fatwas } = useQuery({
    queryKey: ['admin_fatwas'],
    queryFn: async () => {
      const { data, error } = await supabase.from('Fatwa').select('*');
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  const { data: comments } = useQuery({
    queryKey: ['admin_comments'],
    queryFn: async () => {
      const { data, error } = await supabase.from('Comment').select('*');
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  const { data: ratings } = useQuery({
    queryKey: ['admin_ratings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('Rating').select('*');
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  const { data: liveStreams } = useQuery({
    queryKey: ['admin_live_streams'],
    queryFn: async () => {
      const { data, error } = await supabase.from('LiveStream').select('*');
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  const { data: users } = useQuery({
    queryKey: ['admin_users'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from('Profile').select('*');
        if (error) return [];
        return data;
      } catch (e) {
        return [];
      }
    },
    initialData: [],
  });

  const { data: searchTerms } = useQuery({
    queryKey: ['search_analytics'],
    queryFn: async () => {
      // هنا يمكن إضافة entity لتتبع عمليات البحث
      return [];
    },
    initialData: [],
  });

  const totalViews = lectures.reduce((sum, l) => sum + (l.views_count || 0), 0);
  const totalLikes = lectures.reduce((sum, l) => sum + (l.likes_count || 0), 0);
  const totalShares = lectures.reduce((sum, l) => sum + (l.shares_count || 0), 0);
  const averageRating = ratings.length > 0 
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
    : 0;
  const pendingComments = comments.filter(c => !c.is_approved).length;
  const upcomingStreams = liveStreams.filter(s => !s.is_live && new Date(s.scheduled_time) > new Date()).length;
  const liveNow = liveStreams.filter(s => s.is_live).length;

  // محتوى الأسبوع الماضي
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  const lecturesThisWeek = lectures.filter(l => new Date(l.created_date) > lastWeek).length;
  const storiesThisWeek = stories.filter(s => new Date(s.created_date) > lastWeek).length;
  const fatwasThisWeek = fatwas.filter(f => new Date(f.created_date) > lastWeek).length;

  // أكثر المحاضرات مشاهدة
  const topLectures = [...lectures]
    .sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
    .slice(0, 5);

  const exportToText = () => {
    const report = `
تقرير إحصائيات طريق النور
تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}

=================================
الإحصائيات الرئيسية
=================================
إجمالي المستخدمين: ${users.length}
المشاهدات: ${totalViews.toLocaleString()}
الإعجابات: ${totalLikes.toLocaleString()}
التعليقات: ${comments.length}
متوسط التقييم: ${averageRating.toFixed(1)}/5
المشاركات: ${totalShares.toLocaleString()}

=================================
إحصائيات المحتوى
=================================
المحاضرات: ${lectures.length}
القصص: ${stories.length}
الفتاوى: ${fatwas.length}
البثوث المباشرة: ${liveStreams.length}

=================================
معلومات سريعة
=================================
التعليقات المعلقة: ${pendingComments}
بث مباشر الآن: ${liveNow}
بثوث قادمة: ${upcomingStreams}
`;

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tariq-alnoor-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleBulkUpload = (entityType) => {
    setBulkUploadEntity(entityType);
    setShowBulkUpload(true);
  };

  const statsCards = [
    { title: "إجمالي المستخدمين", value: users.length, icon: Users, color: "from-blue-500 to-blue-600" },
    { title: "المشاهدات", value: totalViews.toLocaleString(), icon: Eye, color: "from-purple-500 to-purple-600" },
    { title: "الإعجابات", value: totalLikes.toLocaleString(), icon: ThumbsUp, color: "from-rose-500 to-rose-600" },
    { title: "التعليقات", value: comments.length, icon: MessageCircleMore, color: "from-emerald-500 to-emerald-600" },
    { title: "متوسط التقييم", value: averageRating.toFixed(1) + "/5", icon: Star, color: "from-amber-500 to-amber-600" },
    { title: "المشاركات", value: totalShares.toLocaleString(), icon: TrendingUp, color: "from-cyan-500 to-cyan-600" },
  ];

  const contentStats = [
    { title: "المحاضرات", count: lectures.length, icon: Video, color: "bg-purple-100 text-purple-700" },
    { title: "القصص", count: stories.length, icon: Heart, color: "bg-rose-100 text-rose-700" },
    { title: "الفتاوى", count: fatwas.length, icon: MessageSquare, color: "bg-emerald-100 text-emerald-700" },
    { title: "البثوث المباشرة", count: liveStreams.length, icon: Activity, color: "bg-red-100 text-red-700" },
  ];

  const sections = [
    {
      id: "ai_generation",
      title: "توليد المحتوى (AI)",
      icon: Sparkles,
      component: AIContentGenerator
    },
    {
      id: "books",
      title: "الكتب",
      icon: BookOpen,
      entity: "Book",
      supportsBulkUpload: true,
      fields: [
        { key: "title", label: "العنوان", type: "text", required: true },
        { key: "author", label: "المؤلف", type: "text", required: true },
        { key: "description", label: "الوصف", type: "textarea" },
        { 
          key: "category", 
          label: "التصنيف", 
          type: "select",
          options: [
            { value: "hadith", label: "الحديث" },
            { value: "tafsir", label: "التفسير" },
            { value: "fiqh", label: "الفقه" },
            { value: "azkar", label: "الأذكار" },
            { value: "seerah", label: "السيرة" },
            { value: "general", label: "عام" }
          ],
          required: true
        },
        { key: "language", label: "اللغة", type: "text" },
        { key: "pages", label: "عدد الصفحات", type: "number" },
        { key: "cover_url", label: "رابط صورة الغلاف", type: "text" },
        { key: "pdf_url", label: "رابط PDF", type: "text" },
        { key: "content", label: "المحتوى للقراءة (اختياري)", type: "textarea" },
      ]
    },
    {
      id: "courses_management",
      title: "إدارة الدورات (مطور)",
      icon: GraduationCap,
      component: CourseManager
    },
    {
      id: "lectures",
      title: "المحاضرات",
      icon: Video,
      entity: "Lecture",
      supportsBulkUpload: true,
      hasYouTubeAutoFill: true,
      fields: [
        { key: "title", label: "العنوان", type: "text", required: true },
        { key: "speaker", label: "المتحدث", type: "text", required: true },
        { key: "description", label: "الوصف", type: "textarea" },
        { 
          key: "type", 
          label: "النوع", 
          type: "select",
          options: [
            { value: "audio", label: "صوتية" },
            { value: "video", label: "مرئية" }
          ],
          required: true
        },
        { 
          key: "category", 
          label: "التصنيف", 
          type: "select",
          options: [
            { value: "learn_islam", label: "التعرف على الإسلام" },
            { value: "repentance", label: "التوبة" },
            { value: "general", label: "عام" }
          ],
          required: true
        },
        { key: "topic", label: "الموضوع", type: "text" },
        { key: "url", label: "الرابط", type: "text" },
        { key: "duration", label: "المدة", type: "text" },
        { key: "thumbnail_url", label: "صورة مصغرة", type: "text" },
      ]
    },
    {
      id: "live_streams",
      title: "البث المباشر",
      icon: Activity,
      entity: "LiveStream",
      fields: [
        { key: "title", label: "عنوان البث", type: "text", required: true },
        { key: "speaker", label: "المحاضر", type: "text", required: true },
        { key: "description", label: "الوصف", type: "textarea" },
        { 
          key: "category", 
          label: "النوع", 
          type: "select",
          options: [
            { value: "lecture", label: "محاضرة" },
            { value: "quran_class", label: "درس قرآن" },
            { value: "qa_session", label: "أسئلة وأجوبة" },
            { value: "special_event", label: "حدث خاص" }
          ],
          required: true
        },
        { key: "scheduled_time", label: "موعد البث", type: "datetime-local", required: true },
        { key: "stream_url", label: "رابط البث", type: "text" },
        { key: "thumbnail_url", label: "صورة البث", type: "text" },
        { 
          key: "is_live", 
          label: "على الهواء", 
          type: "select",
          options: [
            { value: true, label: "نعم" },
            { value: false, label: "لا" }
          ]
        },
        { key: "recording_url", label: "رابط التسجيل", type: "text" },
      ]
    },
    {
      id: "fatwa_moderation",
      title: "طلبات الفتاوى",
      icon: MessageSquare,
      component: FatwaModeration
    },
    {
      id: "fatwas",
      title: "أرشيف الفتاوى",
      icon: BookOpen,
      entity: "Fatwa",
      fields: [
        { key: "question", label: "السؤال", type: "textarea", required: true },
        { key: "answer", label: "الجواب", type: "textarea", required: true },
        { key: "mufti", label: "المفتي", type: "text" },
        { key: "category", label: "التصنيف", type: "text", required: true },
        { key: "reference", label: "المرجع", type: "text" },
      ]
    },
    {
      id: "stories",
      title: "القصص",
      icon: Heart,
      entity: "Story",
      fields: [
        { key: "title", label: "العنوان", type: "text", required: true },
        { key: "author", label: "صاحب القصة", type: "text" },
        { key: "content", label: "المحتوى", type: "textarea", required: true },
        { 
          key: "category", 
          label: "النوع", 
          type: "select",
          options: [
            { value: "convert", label: "المهتدين" },
            { value: "repentance", label: "التائبين" }
          ],
          required: true
        },
        { key: "excerpt", label: "مقتطف", type: "textarea" },
        { key: "image_url", label: "صورة", type: "text" },
        { key: "country", label: "البلد", type: "text" },
      ]
    },
    {
      id: "reconciliation_committee",
      title: "أعضاء لجنة الإصلاح",
      icon: Users,
      entity: "ReconciliationCommittee",
      fields: [
        { key: "name", label: "الاسم الكامل", type: "text", required: true },
        { key: "title", label: "اللقب العلمي", type: "text", required: true },
        { key: "position", label: "المنصب", type: "text", required: true },
        { key: "photo_url", label: "رابط الصورة", type: "text" },
        { key: "bio", label: "النبذة التعريفية", type: "textarea" },
        { key: "experience_years", label: "سنوات الخبرة", type: "number" },
        { key: "contact_email", label: "البريد الإلكتروني", type: "email" },
        { key: "contact_phone", label: "رقم الهاتف", type: "text" },
        { 
          key: "is_active", 
          label: "نشط", 
          type: "select",
          options: [
            { value: true, label: "نعم" },
            { value: false, label: "لا" }
          ]
        },
        { key: "order", label: "ترتيب العرض", type: "number" },
      ]
    },
    {
      id: "reconciliation_requests",
      title: "طلبات الإصلاح",
      icon: Heart,
      entity: "ReconciliationRequest",
      fields: [
        { key: "applicant_name", label: "الاسم", type: "text", required: true },
        { key: "applicant_email", label: "البريد الإلكتروني", type: "email" },
        { key: "applicant_phone", label: "رقم الهاتف", type: "text" },
        { key: "case_title", label: "عنوان القضية", type: "text", required: true },
        { key: "case_description", label: "وصف القضية", type: "textarea", required: true },
        { 
          key: "status", 
          label: "الحالة", 
          type: "select",
          options: [
            { value: "pending", label: "معلق" },
            { value: "under_review", label: "قيد المراجعة" },
            { value: "scheduled", label: "تم الجدولة" },
            { value: "in_progress", label: "جاري الحل" },
            { value: "resolved", label: "تم الحل" },
            { value: "rejected", label: "مرفوض" }
          ],
          required: true
        },
        { key: "assigned_mediator", label: "الوسيط المعين", type: "text" },
        { key: "notes", label: "ملاحظات اللجنة", type: "textarea" },
      ]
    },
    {
      id: "scholars",
      title: "العلماء والدعاة",
      icon: GraduationCap,
      entity: "Scholar",
      fields: [
        { key: "name", label: "الاسم", type: "text", required: true },
        { 
          key: "type", 
          label: "النوع", 
          type: "select",
          options: [
            { value: "mufti", label: "مفتي" },
            { value: "preacher", label: "داعية" },
            { value: "scholar", label: "شيخ" },
            { value: "teacher", label: "محفظ" }
          ],
          required: true
        },
        { 
          key: "specialization", 
          label: "التخصص", 
          type: "select",
          options: [
            { value: "fiqh", label: "فقه" },
            { value: "hadith", label: "حديث" },
            { value: "tafsir", label: "تفسير" },
            { value: "aqeedah", label: "عقيدة" },
            { value: "quran", label: "قرآن" },
            { value: "general", label: "عام" }
          ]
        },
        { 
          key: "gender", 
          label: "الجنس", 
          type: "select",
          options: [
            { value: "male", label: "ذكر" },
            { value: "female", label: "أنثى" }
          ]
        },
        { key: "country", label: "البلد", type: "text" },
        { key: "bio", label: "النبذة", type: "textarea" },
        { key: "phone", label: "الهاتف", type: "text" },
        { key: "whatsapp", label: "واتساب", type: "text" },
        { key: "email", label: "البريد الإلكتروني", type: "email" },
        { key: "google_meet_link", label: "رابط Google Meet", type: "text" },
        { 
          key: "is_available", 
          label: "متاح", 
          type: "select",
          options: [
            { value: true, label: "نعم" },
            { value: false, label: "لا" }
          ]
        },
      ]
    },
    {
      id: "centers",
      title: "مراكز الدعوة",
      icon: Building2,
      entity: "IslamicCenter",
      fields: [
        { key: "name", label: "الاسم", type: "text", required: true },
        { key: "city", label: "المدينة", type: "text", required: true },
        { key: "country", label: "الدولة", type: "text", required: true },
        { key: "address", label: "العنوان", type: "text" },
        { key: "description", label: "الوصف", type: "textarea" },
        { key: "phone", label: "الهاتف", type: "text" },
        { key: "email", label: "البريد الإلكتروني", type: "email" },
      ]
    },
    {
      id: "courses",
      title: "دورات القرآن",
      icon: BookOpen,
      entity: "QuranCourse",
      fields: [
        { key: "title", label: "عنوان الدورة", type: "text", required: true },
        { key: "teacher_name", label: "اسم المحفظ", type: "text", required: true },
        { key: "description", label: "الوصف", type: "textarea" },
        { 
          key: "type", 
          label: "نوع الدورة", 
          type: "select",
          options: [
            { value: "memorization", label: "تحفيظ" },
            { value: "recitation", label: "تلاوة" },
            { value: "tajweed", label: "تجويد" }
          ],
          required: true
        },
        { 
          key: "gender", 
          label: "الجنس", 
          type: "select",
          options: [
            { value: "male", label: "رجال" },
            { value: "female", label: "نساء" }
          ],
          required: true
        },
        { 
          key: "level", 
          label: "المستوى", 
          type: "select",
          options: [
            { value: "beginner", label: "مبتدئ" },
            { value: "intermediate", label: "متوسط" },
            { value: "advanced", label: "متقدم" }
          ]
        },
        { key: "schedule", label: "الموعد", type: "text" },
        { key: "duration", label: "المدة", type: "text" },
        { key: "max_students", label: "أقصى عدد طلاب", type: "number" },
        { key: "google_meet_link", label: "رابط Google Meet", type: "text" },
        { key: "start_date", label: "تاريخ البدء", type: "date" },
        { 
          key: "is_active", 
          label: "نشطة", 
          type: "select",
          options: [
            { value: true, label: "نعم" },
            { value: false, label: "لا" }
          ]
        },
      ]
    },
    {
      id: "moderation",
      title: "الإشراف والتعليقات",
      icon: MessageCircleMore,
      component: CommentsModeration
    },
    {
      id: "ratings",
      title: "التقييمات",
      icon: Star,
      entity: "Rating",
      fields: [
        { key: "user_email", label: "البريد الإلكتروني", type: "email" },
        { key: "content_type", label: "نوع المحتوى", type: "text" },
        { key: "rating", label: "التقييم", type: "number" },
        { key: "review", label: "المراجعة", type: "textarea" },
      ]
    },
    {
      id: "settings",
      title: "إعدادات التطبيق",
      icon: Shield,
      component: AppSettingsAdmin
    },
    {
      id: "users_management",
      title: "إدارة المستخدمين",
      icon: Users,
      component: UsersManagement
    }
  ];

  if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // Filter sections for moderator
  const visibleSections = user.role === 'moderator' 
    ? sections.filter(s => !['settings', 'users_management'].includes(s.id))
    : sections;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
            لوحة التحكم
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 transition-colors duration-300">
            إدارة محتوى التطبيق والإحصائيات
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white dark:bg-slate-800 shadow-lg p-2 flex-wrap h-auto gap-2 transition-colors duration-300">
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              الإحصائيات
            </TabsTrigger>
            {visibleSections.map((section) => (
              <TabsTrigger
                key={section.id}
                value={section.id}
                className="flex items-center gap-2"
              >
                <section.icon className="w-4 h-4" />
                <span>{section.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <div className="flex justify-end">
                <Button 
                  onClick={exportToText}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg"
                >
                  📄 تصدير التقرير
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {statsCards.map((stat, index) => (
                  <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-md`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{stat.value}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">{stat.title}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* إحصائيات هذا الأسبوع */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-cyan-50">
                <CardHeader>
                  <CardTitle>محتوى هذا الأسبوع</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <Video className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                      <p className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{lecturesThisWeek}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">محاضرة جديدة</p>
                    </div>
                    <div className="text-center">
                      <Heart className="w-8 h-8 mx-auto mb-2 text-rose-600" />
                      <p className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{storiesThisWeek}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">قصة جديدة</p>
                    </div>
                    <div className="text-center">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                      <p className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{fatwasThisWeek}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">فتوى جديدة</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* أكثر المحاضرات مشاهدة */}
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>أكثر المحاضرات مشاهدة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topLectures.map((lecture, idx) => (
                      <div key={lecture.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-900 rounded-lg transition-colors duration-300">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">{lecture.title}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">{lecture.speaker}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 transition-colors duration-300">
                          <Eye className="w-4 h-4" />
                          <span className="font-semibold">{lecture.views_count || 0}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>إحصائيات المحتوى</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {contentStats.map((item, index) => (
                      <div key={index} className={`${item.color} rounded-xl p-6 text-center`}>
                        <item.icon className="w-8 h-8 mx-auto mb-3" />
                        <p className="text-3xl font-bold mb-1">{item.count}</p>
                        <p className="text-sm font-medium">{item.title}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-3 gap-6">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-amber-50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 transition-colors duration-300">التعليقات المعلقة</p>
                        <p className="text-3xl font-bold text-amber-700">{pendingComments}</p>
                      </div>
                      <MessageCircleMore className="w-12 h-12 text-amber-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-rose-50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 transition-colors duration-300">بث مباشر الآن</p>
                        <p className="text-3xl font-bold text-red-700">{liveNow}</p>
                      </div>
                      <Activity className="w-12 h-12 text-red-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 transition-colors duration-300">بثوث قادمة</p>
                        <p className="text-3xl font-bold text-blue-700">{upcomingStreams}</p>
                      </div>
                      <Calendar className="w-12 h-12 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {visibleSections.map((section) => (
            <TabsContent key={section.id} value={section.id}>
              <Card className="border-0 shadow-xl bg-white dark:bg-slate-800/90 backdrop-blur-sm transition-colors duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <section.icon className="w-5 h-5 text-emerald-600" />
                      {section.title}
                    </CardTitle>
                    {section.supportsBulkUpload && (
                      <Button
                        onClick={() => handleBulkUpload(section.entity)}
                        variant="outline"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Upload className="w-4 h-4 ml-2" />
                        رفع جماعي
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {section.component ? (
                    <section.component />
                  ) : (
                    <AdminTable
                      entity={section.entity}
                      fields={section.fields}
                      showPendingOnly={section.showPendingOnly}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <BulkUploadModal
        open={showBulkUpload}
        onClose={() => {
          setShowBulkUpload(false);
          setBulkUploadEntity(null);
        }}
        entityType={bulkUploadEntity}
      />
    </div>
  );
}