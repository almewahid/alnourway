import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations } from "./translations";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('ar');
  const [isRTL, setIsRTL] = useState(true);

  useEffect(() => {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
  }, []);

  // ✅ تعطيل الترجمة - إرجاع المفتاح كما هو
  const t = (key) => {
    return key; // ببساطة نرجع المفتاح نفسه بدون ترجمة
  };

  const changeLanguage = (lang) => {
    console.log('تم تعطيل تغيير اللغة مؤقتاً');
    // لا نفعل شيء
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
