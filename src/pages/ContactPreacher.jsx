import React, { useState } from "react";
import { useLanguage } from "@/components/LanguageContext";
import { supabase } from "@/components/api/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Phone, MessageCircle, Globe, Mail } from "lucide-react";
import { motion } from "framer-motion";
import ContactModal from "@/components/ContactModal";
import OnlineIndicator from "@/components/OnlineIndicator";

export default function ContactPreacher() {
  const { t } = useLanguage();
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("all");

  const { data: preachers, isLoading } = useQuery({
    queryKey: ['preachers'],
    queryFn: async () => {
      const { data, error } = await supabase.from('Scholar').select('*').eq('type', 'preacher').eq('is_available', true);
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  const languages = ["الكل", ...new Set(preachers.flatMap(p => p.languages || []))];
  
  const filteredPreachers = selectedLanguage === "all" 
    ? preachers 
    : preachers.filter(p => p.languages?.includes(selectedLanguage));

  const isPreacherOnline = (preacher) => {
    return Math.random() > 0.5;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-950 p-6 md:p-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-blue-100 dark:from-emerald-900/50 dark:to-blue-900/50 px-6 py-3 rounded-full mb-6 transition-colors duration-300">
            <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400 transition-colors duration-300" />
            <span className="text-emerald-800 dark:text-emerald-200 font-semibold transition-colors duration-300">{t('تواصل مع داعية')}</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">{t('الدعاة المتاحون')}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 transition-colors duration-300">{t('تواصل مع دعاة متخصصين حول العالم')}</p>
        </motion.div>

        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang === "الكل" ? "all" : lang)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                (selectedLanguage === "all" && lang === "الكل") || selectedLanguage === lang
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg"
                  : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-slate-700"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 dark:border-emerald-400 mx-auto transition-colors duration-300"></div>
            <p className="text-gray-500 dark:text-gray-400 mt-4 transition-colors duration-300">{t('جاري التحميل...')}</p>
          </div>
        ) : filteredPreachers.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredPreachers.map((preacher, index) => {
              const isOnline = isPreacherOnline(preacher);
              return (
                <motion.div
                  key={preacher.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800/90 backdrop-blur-sm h-full transition-colors duration-300">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg relative">
                          <Users className="w-8 h-8 text-white" />
                          <div className="absolute -bottom-1 -right-1">
                            <OnlineIndicator isOnline={isOnline} size="md" />
                          </div>
                        </div>
                        <div>
                          <CardTitle className="text-xl mb-2">{preacher.name}</CardTitle>
                          {preacher.country && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">{preacher.country}</p>
                          )}
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full mt-1 transition-colors duration-300 ${
                            isOnline 
                              ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30' 
                              : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30'
                          }`}>
                            <OnlineIndicator isOnline={isOnline} size="sm" />
                            {isOnline ? t('متاح') : t('غير متصل')}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {preacher.bio && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed transition-colors duration-300">{preacher.bio}</p>
                      )}

                      {preacher.languages && preacher.languages.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-emerald-600" />
                          <div className="flex flex-wrap gap-2">
                            {preacher.languages.map((lang, idx) => (
                              <span key={idx} className="px-2 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-xs transition-colors duration-300">
                                {lang}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-slate-700 transition-colors duration-300">
                        {preacher.phone && (
                          <a
                            href={`tel:${preacher.phone}`}
                            className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors duration-300"
                          >
                            <Phone className="w-4 h-4" />{t('اتصال تليفوني')}</a>
                        )}
                        {preacher.whatsapp && (
                          <a
                            href={`https://wa.me/${preacher.whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors duration-300"
                          >
                            <MessageCircle className="w-4 h-4" />{t('واتساب')}</a>
                        )}
                        {preacher.email && (
                          <a
                            href={`mailto:${preacher.email}`}
                            className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors duration-300"
                          >
                            <Mail className="w-4 h-4" />{t('بريد إلكتروني')}</a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <Card className="border-0 shadow-lg bg-white dark:bg-slate-800/90 backdrop-blur-sm mb-12 transition-colors duration-300">
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4 transition-colors duration-300" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">{t('لا يوجد دعاة متاحون حالياً')}</h3>
              <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">{t('يمكنك إرسال طلب وسنتواصل معك قريباً')}</p>
            </CardContent>
          </Card>
        )}
      </div>

      <ContactModal
        open={showContactModal}
        onClose={() => setShowContactModal(false)}
        requestType={t("التعرف على الإسلام")}
      />
    </div>
  );
}