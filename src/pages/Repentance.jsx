import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, Video, CheckCircle, Sparkles, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import ContactModal from "@/components/ContactModal";
import { supabase } from "@/components/api/supabaseClient";
import { useLanguage } from "@/contexts/LanguageContext.jsx";

export default function Repentance() {
  const { t } = useLanguage();
  const [showContactModal, setShowContactModal] = useState(false);
  const [onlineScholars, setOnlineScholars] = useState(0);

  useEffect(() => {
    loadOnlineScholars();
  }, []);

  const loadOnlineScholars = async () => {
    try {
      const { count } = await supabase.from('Scholar').select('*', { count: 'exact' }).eq('type', 'mufti').eq('is_available', true);
      setOnlineScholars(count || 0);
    } catch (error) {
      console.log('Error loading scholars:', error);
    }
  };

  const sections = [
    {
      icon: Users,
      title: "تواصل مع مفتي",
      description: "احصل على إرشاد ديني من مفتين متخصصين",
      color: "from-emerald-100 to-emerald-200 dark:from-slate-800 dark:to-slate-700",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ecdfbb3578091a5f1e1c54/8f4f91aed_.png",
      link: createPageUrl("ContactScholar"),
      onlineCount: onlineScholars,
      countLabel: "تواصل مع مفتي"
    },
    {
      icon: Video,
      title: "مكتبة المحاضرات",
      description: "استمع لمحاضرات عن التوبة والرجوع إلى الله",
      color: "from-rose-100 to-rose-200 dark:from-slate-800 dark:to-slate-700",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ecdfbb3578091a5f1e1c54/bb9bb2ec8_.png",
      link: createPageUrl("Lectures?category=repentance")
    },
    {
      icon: Heart,
      title: "قصص التائبين",
      description: "تعرف على قصص ملهمة لمن تابوا ورجعوا لله",
      color: "from-amber-100 to-amber-200 dark:from-slate-800 dark:to-slate-700",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ecdfbb3578091a5f1e1c54/8c7f0d887_.png",
      link: createPageUrl("Stories?type=repentance")
    }
  ];

  const steps = [
    {
      title: "الندم على الذنب",
      description: "أن تندم على ما فعلت وتشعر بالحزن على ارتكاب المعصية"
    },
    {
      title: "الإقلاع عن الذنب فوراً",
      description: "ترك المعصية على الفور وعدم الاستمرار فيها"
    },
    {
      title: "العزم على عدم العودة",
      description: "العزيمة الصادقة على عدم الرجوع للذنب مستقبلاً"
    },
    {
      title: "رد الحقوق لأصحابها",
      description: "إن كان الذنب يتعلق بحق العباد، يجب رد الحقوق والاستسماح"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-700 via-rose-600 to-rose-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 md:p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 pt-4"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-100 to-pink-100 dark:from-slate-800/80 dark:to-slate-700/80 px-6 py-3 rounded-full mb-6 transition-colors duration-300">
            <Heart className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            <span className="text-rose-800 dark:text-rose-300 font-semibold">التوبة</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            باب التوبة مفتوح
          </h1>

          <div className="max-w-4xl mx-auto bg-gradient-to-br from-amber-50 to-amber-100 dark:from-slate-800/50 dark:to-slate-700/50 rounded-3xl p-6 md:p-10 shadow-2xl border-2 border-amber-200 dark:border-slate-600 mb-8 transition-colors duration-300">
            <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white leading-relaxed mb-3">
              "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ"
            </p>
            <p className="text-lg text-rose-700 dark:text-rose-400 font-semibold">سورة الزمر - آية 53</p>
          </div>

          <p className="text-lg md:text-xl text-white/90 dark:text-gray-300 max-w-2xl mx-auto">
            مهما كانت ذنوبك، باب التوبة مفتوح دائماً
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={section.link}>
                <Card className={`group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br ${section.color} overflow-hidden h-full hover:-translate-y-2 rounded-3xl relative`}>
                  {section.onlineCount > 0 && (
                    <div className="absolute top-2 left-2 z-10 bg-emerald-500 dark:bg-teal-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                      {section.onlineCount} {section.countLabel}
                    </div>
                  )}
                  <CardContent className="p-6 md:p-8 text-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/90 dark:bg-slate-700/90 backdrop-blur-sm flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg overflow-hidden">
                      <img src={section.image} alt={section.title} className="w-12 h-12 md:w-14 md:h-14 object-contain" />
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-gray-800 dark:text-white mb-2">{section.title}</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{section.description}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-0 shadow-2xl bg-white/95 dark:bg-slate-800/50 backdrop-blur-sm rounded-3xl overflow-hidden mb-8 transition-colors duration-300">
            <CardHeader className="bg-gradient-to-r from-rose-500 to-rose-600 dark:from-rose-600 dark:to-rose-700 text-white p-6 md:p-8">
              <CardTitle className="text-2xl md:text-3xl text-center">شروط التوبة الصحيحة</CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-10">
              <div className="grid md:grid-cols-2 gap-6">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex gap-4 items-start bg-gradient-to-br from-rose-50 to-pink-50 dark:from-slate-700/50 dark:to-slate-600/50 p-6 rounded-2xl shadow-md transition-colors duration-300"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 dark:from-rose-500 dark:to-rose-700 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <span className="text-white font-bold text-lg">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{step.title}</h4>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-700/30 dark:to-slate-600/30 rounded-2xl border-2 border-emerald-200 dark:border-slate-600 transition-colors duration-300">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-6 h-6 text-emerald-600 dark:text-teal-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-lg font-bold text-emerald-900 dark:text-teal-300 mb-2">تذكر دائماً</h4>
                    <p className="text-emerald-800 dark:text-gray-300 leading-relaxed">
                      "إِنَّ اللَّهَ يُحِبُّ التَّوَّابِينَ وَيُحِبُّ الْمُتَطَهِّرِينَ" - سورة البقرة: 222
                    </p>
                    <p className="text-emerald-700 dark:text-gray-400 mt-2">
                      الله يحب التائبين ويفرح بتوبتهم أكثر من فرحة الرجل بدابته التي وجدها بعد أن فقدها في الصحراء
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-rose-500 to-pink-600 dark:from-slate-800/80 dark:to-slate-700/80 text-white overflow-hidden relative rounded-3xl transition-colors duration-300">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-32 translate-y-32"></div>
            
            <CardContent className="p-8 md:p-12 text-center relative z-10">
              <MessageCircle className="w-16 h-16 mx-auto mb-6 text-amber-300 dark:text-teal-300" />
              <h2 className="text-2xl md:text-4xl font-bold mb-4">
                تحتاج مساعدة؟
              </h2>
              <p className="text-lg md:text-xl text-rose-50 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                فريقنا من المفتين والدعاة جاهز لمساعدتك في رحلة التوبة
              </p>
              <Button
                onClick={() => setShowContactModal(true)}
                size="lg"
                className="bg-white text-rose-600 hover:bg-rose-50 dark:bg-slate-700 dark:text-rose-300 dark:hover:bg-slate-600 text-lg md:text-xl px-8 md:px-10 py-6 md:py-7 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <Heart className="w-5 h-5 md:w-6 md:h-6 ml-2" />
                تواصل معنا الآن
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <ContactModal
        open={showContactModal}
        onClose={() => setShowContactModal(false)}
        requestType="repentance"
      />
    </div>
  );
}
