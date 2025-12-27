import React, { useState, useEffect } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Award, Briefcase, GraduationCap, Heart, Sparkles, Shield, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import ReconciliationRequestModal from "@/components/ReconciliationRequestModal";
import { useLanguage } from "@/contexts/LanguageContext.jsx";

export default function ReconciliationCommittee() {
  const { t } = useLanguage();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
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

  const { data: committee, isLoading } = useQuery({
    queryKey: ['reconciliation_committee'],
    queryFn: async () => {
      const { data, error } = await supabase.from('ReconciliationCommittee').select('*').eq('is_active', true);
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  const sortedCommittee = [...committee].sort((a, b) => (a.order || 0) - (b.order || 0));

  const features = [
    {
      icon: Heart,
      title: t('السرية التامة'),
      description: t('نحافظ على خصوصية جميع الأطراف'),
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ecdfbb3578091a5f1e1c54/2d618ad07_.png"
    },
    {
      icon: Shield,
      title: t('الحياد والعدل'),
      description: t('نلتزم بالحياد التام في جميع القضايا'),
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ecdfbb3578091a5f1e1c54/2d618ad07_.png"
    },
    {
      icon: Users,
      title: t('خبرة عالية'),
      description: t('فريق من المتخصصين في الإصلاح'),
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ecdfbb3578091a5f1e1c54/8f4f91aed_.png"
    },
    {
      icon: CheckCircle,
      title: t('نسبة نجاح عالية'),
      description: t('سجل حافل بالإصلاحات الناجحة'),
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ecdfbb3578091a5f1e1c54/66aa568de_.png"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-700 via-cyan-600 to-blue-800 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4 md:p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 pt-4"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 px-6 py-3 rounded-full mb-6 transition-colors duration-300">
            <Heart className="w-5 h-5 text-blue-600 dark:text-blue-400 transition-colors duration-300" />
            <span className="text-blue-800 dark:text-blue-200 font-semibold transition-colors duration-300">{t('الإصلاح')}</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {t('لجنة الإصلاح')}
          </h1>

          <div className="max-w-4xl mx-auto bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-3xl p-6 md:p-10 shadow-2xl border-2 border-amber-200 dark:border-amber-700/50 mb-8 transition-colors duration-300">
            <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white leading-relaxed mb-3 transition-colors duration-300">
              {t('"وَإِن طَائِفَتَانِ مِنَ الْمُؤْمِنِينَ اقْتَتَلُوا فَأَصْلِحُوا بَيْنَهُمَا"')}
            </p>
            <p className="text-lg text-cyan-700 dark:text-cyan-300 font-semibold transition-colors duration-300">{t('سورة الحجرات - آية 9')}</p>
          </div>

          <p className="text-lg md:text-xl text-white/90 dark:text-white/80 max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
            {t('نساعدك في إصلاح ذات البين وحل النزاعات')}
          </p>
        </motion.div>

        {/* مميزات اللجنة */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800/90 backdrop-blur-sm h-full text-center rounded-3xl">
                <CardContent className="p-4 md:p-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-cyan-100 to-cyan-200 dark:from-cyan-900/50 dark:to-cyan-800/50 flex items-center justify-center mb-3 mx-auto shadow-lg overflow-hidden transition-colors duration-300">
                    <img src={feature.image} alt={feature.title} className="w-8 h-8 md:w-10 md:h-10 object-contain" />
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* أعضاء اللجنة */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {t('أعضاء لجنة الإصلاح')}
            </h2>
            <p className="text-lg text-white/80 dark:text-white/70 transition-colors duration-300">
              {t('نخبة من المختصين في الإصلاح والمصالحة')}
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white dark:border-cyan-400 mx-auto transition-colors duration-300"></div>
            </div>
          ) : sortedCommittee.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedCommittee.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white dark:bg-slate-800/95 backdrop-blur-sm h-full rounded-3xl">
                    <CardHeader className="text-center pb-4">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 dark:from-cyan-600 dark:to-cyan-800 flex items-center justify-center mx-auto mb-4 shadow-xl transition-colors duration-300">
                        {member.photo_url ? (
                          <img src={member.photo_url} alt={member.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <Users className="w-12 h-12 text-white" />
                        )}
                      </div>
                      <CardTitle className="text-xl text-gray-900 dark:text-white transition-colors duration-300">
                        {member.name}
                      </CardTitle>
                      <p className="text-base text-cyan-600 dark:text-cyan-400 font-semibold transition-colors duration-300">
                        {member.title}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {member.position && (
                        <div className="flex items-start gap-2">
                          <Briefcase className="w-4 h-4 text-cyan-600 dark:text-cyan-400 mt-1 flex-shrink-0 transition-colors duration-300" />
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white text-sm transition-colors duration-300">
                              {t('المنصب:')}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">
                              {member.position}
                            </p>
                          </div>
                        </div>
                      )}

                      {member.qualifications && member.qualifications.length > 0 && (
                        <div className="flex items-start gap-2">
                          <GraduationCap className="w-4 h-4 text-cyan-600 dark:text-cyan-400 mt-1 flex-shrink-0 transition-colors duration-300" />
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white text-sm transition-colors duration-300">
                              {t('المؤهلات:')}
                            </p>
                            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1 transition-colors duration-300">
                              {member.qualifications.map((qual, idx) => (
                                <li key={idx} className="text-xs">{qual}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {member.specialization && member.specialization.length > 0 && (
                        <div className="flex items-start gap-2">
                          <Award className="w-4 h-4 text-cyan-600 dark:text-cyan-400 mt-1 flex-shrink-0 transition-colors duration-300" />
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white text-sm transition-colors duration-300">
                              {t('التخصص:')}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {member.specialization.map((spec, idx) => (
                                <span 
                                  key={idx} 
                                  className="px-2 py-1 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded-full text-xs transition-colors duration-300"
                                >
                                  {spec}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {member.experience_years && (
                        <div className="text-center py-2 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg transition-colors duration-300">
                          <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">
                            {t('سنوات الخبرة')}
                          </p>
                          <p className="text-xl font-bold text-cyan-600 dark:text-cyan-400 transition-colors duration-300">
                            {member.experience_years}+
                          </p>
                        </div>
                      )}

                      {member.bio && (
                        <div className="pt-3 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-xs transition-colors duration-300">
                            {member.bio}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="border-0 shadow-lg bg-white dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl transition-colors duration-300">
              <CardContent className="p-12 text-center">
                <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4 transition-colors duration-300" />
                <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  {t('جاري تشكيل اللجنة...')}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* أنواع القضايا */}
        <div className="mb-8">
          <Card className="border-0 shadow-xl bg-white dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl transition-colors duration-300">
            <CardHeader>
              <CardTitle className="text-xl text-center text-gray-900 dark:text-white transition-colors duration-300">
                {t('أنواع القضايا التي نتعامل معها')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: t("النزاعات الأسرية"), desc: t("خلافات بين الأزواج، الأبناء، الأقارب") },
                  { title: t("النزاعات الزوجية"), desc: t("مشاكل زوجية، حالات طلاق، نفقة") },
                  { title: t("قضايا الميراث"), desc: t("خلافات حول توزيع الميراث والتركات") },
                  { title: t("النزاعات المالية"), desc: t("ديون، شراكات تجارية، عقود") },
                  { title: t("نزاعات الجيرة"), desc: t("خلافات بين الجيران حول الحقوق") },
                  { title: t("قضايا أخرى"), desc: t("أي نزاعات أخرى تحتاج للإصلاح") }
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl p-4 shadow-md transition-colors duration-300"
                  >
                    <h4 className="font-bold text-base text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                      {item.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* زر تقديم الطلب */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-cyan-500 to-blue-600 dark:from-cyan-700 dark:to-blue-800 text-white overflow-hidden relative rounded-3xl transition-colors duration-300">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 dark:bg-slate-800/10 rounded-full -translate-x-32 -translate-y-32 transition-colors duration-300"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 dark:bg-slate-800/10 rounded-full translate-x-32 translate-y-32 transition-colors duration-300"></div>
            
            <CardContent className="p-8 md:p-12 text-center relative z-10">
              <Sparkles className="w-16 h-16 mx-auto mb-6 text-amber-300 dark:text-amber-400 transition-colors duration-300" />
              <h2 className="text-2xl md:text-4xl font-bold mb-4">
                {t('هل تحتاج مساعدة في الإصلاح؟')}
              </h2>
              <p className="text-lg md:text-xl text-cyan-50 dark:text-cyan-100 mb-8 max-w-2xl mx-auto transition-colors duration-300">
                {t('قدم طلبك الآن وسنتواصل معك قريباً')}
              </p>
              <Button
                onClick={() => setShowRequestModal(true)}
                size="lg"
                className="bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-slate-700 text-lg md:text-xl px-8 md:px-10 py-6 md:py-7 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <Heart className="w-5 h-5 md:w-6 md:h-6 ml-2" />
                {t('تقديم طلب إصلاح')}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <ReconciliationRequestModal
        open={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        user={user}
      />
    </div>
  );
}