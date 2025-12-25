import React, { useState } from "react";
import AILearningPath from "@/components/AILearningPath";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, MapPin, Video, Heart, Sparkles, MessageCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import ContactModal from "@/components/ContactModal";
import { useLanguage } from "@/contexts/LanguageContext.jsx";

export default function LearnIslam() {
  const { t } = useLanguage();
  const [showContactModal, setShowContactModal] = useState(false);

  const sections = [
    {
      icon: BookOpen,
      title: "أساسيات الإسلام",
      description: "تعرف على مبادئ الدين الإسلامي الأساسية",
      color: "from-blue-100 to-blue-200 dark:from-slate-800 dark:to-slate-700",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ecdfbb3578091a5f1e1c54/6cae5772d_.png",
      action: () => window.scrollTo({ top: document.getElementById('principles').offsetTop - 100, behavior: 'smooth' })
    },
    {
      icon: Users,
      title: "تواصل مع داعية",
      description: "احصل على إرشاد شخصي من دعاة متخصصين",
      color: "from-emerald-100 to-emerald-200 dark:from-slate-800 dark:to-slate-700",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ecdfbb3578091a5f1e1c54/8f4f91aed_.png",
      link: createPageUrl("ContactPreacher")
    },
    {
      icon: MapPin,
      title: "ابحث عن مركز إسلامي",
      description: "اعثر على مراكز إسلامية قريبة منك",
      color: "from-purple-100 to-purple-200 dark:from-slate-800 dark:to-slate-700",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ecdfbb3578091a5f1e1c54/2d618ad07_.png",
      link: createPageUrl("IslamicCenters")
    },
    {
      icon: Video,
      title: "مكتبة المحاضرات",
      description: "شاهد محاضرات إسلامية متنوعة",
      color: "from-rose-100 to-rose-200 dark:from-slate-800 dark:to-slate-700",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ecdfbb3578091a5f1e1c54/bb9bb2ec8_.png",
      link: createPageUrl("Lectures?category=learn_islam")
    },
    {
      icon: Heart,
      title: "قصص المهتدين",
      description: "تعرف على قصص من اهتدوا للإسلام",
      color: "from-amber-100 to-amber-200 dark:from-slate-800 dark:to-slate-700",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ecdfbb3578091a5f1e1c54/8c7f0d887_.png",
      link: createPageUrl("Stories?type=convert")
    }
  ];

  const principles = [
    {
      title: "أركان الإسلام الخمسة",
      items: [
        "الشهادتان: أشهد أن لا إله إلا الله وأن محمداً رسول الله",
        "إقامة الصلاة: خمس صلوات في اليوم والليلة",
        "إيتاء الزكاة: إخراج جزء من المال للفقراء",
        "صوم رمضان: الامتناع عن الطعام والشراب من الفجر حتى المغرب",
        "حج البيت: لمن استطاع إليه سبيلاً"
      ]
    },
    {
      title: "أركان الإيمان الستة",
      items: [
        "الإيمان بالله: الإيمان بوحدانية الله وأسمائه وصفاته",
        "الإيمان بالملائكة: الإيمان بوجود الملائكة المكرمين",
        "الإيمان بالكتب: القرآن والتوراة والإنجيل والزبور",
        "الإيمان بالرسل: من آدم إلى محمد عليهم الصلاة والسلام",
        "الإيمان باليوم الآخر: يوم البعث والحساب",
        "الإيمان بالقدر: خيره وشره من الله تعالى"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-700 via-teal-600 to-teal-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 md:p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 pt-4"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-emerald-100 dark:from-slate-800/80 dark:to-slate-700/80 px-6 py-3 rounded-full mb-6 transition-colors duration-300">
            <span className="text-blue-800 dark:text-teal-300 font-semibold">اكتشف الإسلام</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            تعلم الإسلام
          </h1>
          <p className="text-lg md:text-xl text-white/90 dark:text-gray-300 max-w-2xl mx-auto">
            ابدأ رحلتك في تعلم الإسلام من الأساسيات حتى الإتقان
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {section.link ? (
                <Link to={section.link}>
                  <Card className={`group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br ${section.color} overflow-hidden h-full hover:-translate-y-1 cursor-pointer rounded-3xl`}>
                    <CardContent className="p-4 md:p-6 text-center">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/90 dark:bg-slate-700/90 backdrop-blur-sm flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg overflow-hidden">
                        <img src={section.image} alt={section.title} className="w-8 h-8 md:w-12 md:h-12 object-contain" />
                      </div>
                      <h3 className="text-sm md:text-base font-bold text-gray-800 dark:text-white mb-1">{section.title}</h3>
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{section.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ) : (
                <Card 
                  onClick={section.action}
                  className={`group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br ${section.color} overflow-hidden h-full hover:-translate-y-1 cursor-pointer rounded-3xl`}
                >
                  <CardContent className="p-4 md:p-6 text-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/90 dark:bg-slate-700/90 backdrop-blur-sm flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg overflow-hidden">
                      <img src={section.image} alt={section.title} className="w-8 h-8 md:w-12 md:h-12 object-contain" />
                    </div>
                    <h3 className="text-sm md:text-base font-bold text-gray-800 dark:text-white mb-1">{section.title}</h3>
                    <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{section.description}</p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          ))}
        </div>

        <div id="principles" className="space-y-6 mb-8">
          {principles.map((principle, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Card className="border-0 shadow-2xl bg-white/95 dark:bg-slate-800/50 backdrop-blur-sm rounded-3xl overflow-hidden transition-colors duration-300">
                <CardHeader className="bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-teal-600 dark:to-teal-700 text-white p-6 md:p-8">
                  <CardTitle className="text-xl md:text-2xl">{principle.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 md:p-8">
                  <div className="space-y-4">
                    {principle.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex gap-4 items-start bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-700/50 dark:to-slate-600/50 p-4 md:p-5 rounded-2xl shadow-md transition-colors duration-300">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 dark:from-teal-500 dark:to-teal-700 flex items-center justify-center flex-shrink-0 shadow-md">
                          <span className="text-white font-bold">{itemIndex + 1}</span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-200 text-sm md:text-base leading-relaxed pt-2">{item}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-slate-800/80 dark:to-slate-700/80 text-white overflow-hidden relative rounded-3xl transition-colors duration-300">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-32 translate-y-32"></div>
            
            <CardContent className="p-8 md:p-12 text-center relative z-10">
              <MessageCircle className="w-16 h-16 mx-auto mb-6 text-amber-300 dark:text-teal-300" />
              <h2 className="text-2xl md:text-4xl font-bold mb-4">
                هل لديك أسئلة؟
              </h2>
              <p className="text-lg md:text-xl text-emerald-50 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                نحن هنا لمساعدتك في رحلتك لتعلم الإسلام
              </p>
              <Button
                onClick={() => setShowContactModal(true)}
                size="lg"
                className="bg-white text-emerald-600 hover:bg-emerald-50 dark:bg-slate-700 dark:text-teal-300 dark:hover:bg-slate-600 text-lg md:text-xl px-8 md:px-10 py-6 md:py-7 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <MessageCircle className="w-5 h-5 md:w-6 md:h-6 ml-2" />
                تواصل معنا الآن
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <ContactModal
        open={showContactModal}
        onClose={() => setShowContactModal(false)}
        requestType="learn_islam"
      />
    </div>
  );
}
