import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations } from "./translations";
import { supabase } from "@/components/api/supabaseClient";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'ar');
  const [isRTL, setIsRTL] = useState(language === 'ar' || language === 'ur');

  useEffect(() => {
    const fetchUserPreference = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // ✅ تصحيح: استخدام default_language بدلاً من language
          const { data, error } = await supabase
            .from('UserPreference')
            .select('default_language')
            .eq('user_email', user.email)
            .maybeSingle(); // ✅ استخدام maybeSingle بدلاً من single لتجنب الأخطاء
          
          if (error) {
            console.log("Error fetching language preference", error);
            return;
          }
          
          if (data?.default_language && data.default_language !== language) {
            setLanguage(data.default_language);
          }
        }
      } catch (e) {
        console.log("Error fetching language preference", e);
      }
    };
    fetchUserPreference();
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
    const rtl = language === 'ar' || language === 'ur';
    setIsRTL(rtl);
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations['ar'][key] || key;
  };

  const changeLanguage = async (lang) => {
    setLanguage(lang);
    
    // ✅ حفظ اللغة في قاعدة البيانات
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('UserPreference')
          .upsert({
            user_email: user.email,
            default_language: lang,
            updated_date: new Date().toISOString()
          }, {
            onConflict: 'user_email'
          });
      }
    } catch (e) {
      console.log("Error saving language preference", e);
    }
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