import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

// ترجمات مباشرة - كل key يرجع النص العربي مباشرة
const directTranslations = {
  "home": "الرئيسية",
  "learn_islam": "تعلم الإسلام",
  "learn_islam_desc": "ابدأ رحلتك في تعلم الإسلام من الأساسيات",
  "learn_islam_title": "تعلم الإسلام",
  "learn_islam_subtitle": "ابدأ رحلتك في تعلم الإسلام",
  "discover_islam": "اكتشف الإسلام",
  "repentance": "التوبة",
  "repentance_desc": "دليلك الشامل للتوبة والرجوع إلى الله",
  "fatwa": "الفتاوى",
  "fatwa_desc": "اسأل واحصل على فتاوى شرعية موثوقة",
  "reconciliation": "الإصلاح",
  "reconciliation_desc": "إصلاح ذات البين والمصالحة",
  "live_streams": "البث المباشر",
  "ai_guide": "المرشد الذكي",
  "courses": "الدورات",
  "convert_stories": "قصص المهتدين",
  "convert_stories_desc": "قصص ملهمة لمن اعتنق الإسلام",
  "lectures_library": "مكتبة المحاضرات",
  "lectures_desc": "محاضرات إسلامية شاملة",
  "find_center": "ابحث عن مركز",
  "find_center_desc": "ابحث عن مراكز إسلامية قريبة منك",
  "principles_title": "أركان الإسلام",
  "principles_desc": "تعرف على الأركان الخمسة للإسلام",
  "islam_pillars": "أركان الإسلام الخمسة",
  "contact_preacher": "تواصل مع داعية",
  "contact_scholar": "تواصل مع مفتي",
  "contact_teacher": "تواصل مع محفظ",
  "quran_courses": "دورات القرآن",
  "quran_courses_desc": "تعلم القرآن الكريم مع معلمين متخصصين",
  "recommendations": "التوصيات",
  "settings": "الإعدادات",
  "daily_azkar": "الأذكار اليومية",
  "daily_azkar_desc": "أذكار الصباح والمساء وأذكار متنوعة",
  "islamic_library": "المكتبة الإسلامية",
  "islamic_library_desc": "مكتبة شاملة من الكتب والمراجع الإسلامية",
  "join_team": "انضم للفريق",
  "happy_user": "مستخدم سعيد",
  "lecture": "محاضرة",
  "country": "دولة",
  "login": "تسجيل الدخول",
  "logout": "تسجيل الخروج",
  "register": "إنشاء حساب",
  "save": "حفظ",
  "cancel": "إلغاء",
  "edit": "تعديل",
  "delete": "حذف",
  "add": "إضافة",
  "search": "بحث",
  "loading": "جارٍ التحميل...",
  "email": "البريد الإلكتروني",
  "password": "كلمة المرور",
  "name": "الاسم",
  "phone": "رقم الهاتف",
  "message": "الرسالة",
  "subject": "الموضوع",
  "description": "الوصف",
  "success": "تمت العملية بنجاح",
  "error": "حدث خطأ",
  "required": "هذا الحقل مطلوب",
  "invalid_email": "البريد الإلكتروني غير صحيح",
  "password_min": "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
};

export const LanguageProvider = ({ children }) => {
  const [language] = useState('ar'); // دائماً عربي
  const [isRTL] = useState(true); // دائماً RTL

  useEffect(() => {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
  }, []);

  // دالة الترجمة - ترجع العربي مباشرة
  const t = (key) => {
    return directTranslations[key] || key;
  };

  // تعطيل تغيير اللغة
  const changeLanguage = () => {
    console.log('تغيير اللغة معطل - الموقع عربي فقط');
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};