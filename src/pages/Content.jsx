import React, { useState } from "react";
import { useLanguage } from "@/components/LanguageContext";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Video, FileText, Play, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Content() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("articles");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950 p-4 md:p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 pt-4"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 px-6 py-3 rounded-full mb-6 transition-colors duration-300">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 transition-colors duration-300" />
            <span className="text-blue-800 dark:text-blue-200 font-semibold transition-colors duration-300">{t('مكتبة المحتوى')}</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {t('المحتوى')}
          </h1>
          <p className="text-lg md:text-xl text-white/90 dark:text-white/80 transition-colors duration-300">
            {t('استكشف مكتبتنا من المقالات والفيديوهات')}
          </p>
        </motion.div>

        <div className="flex justify-center mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-white dark:bg-slate-800/95 backdrop-blur-sm shadow-lg transition-colors duration-300">
              <TabsTrigger value="articles" className="gap-2">
                <FileText className="w-4 h-4" />
                {t('المقالات')}
              </TabsTrigger>
              <TabsTrigger value="videos" className="gap-2">
                <Video className="w-4 h-4" />
                {t('الفيديوهات')}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {activeTab === "articles" ? (
          <div className="grid md:grid-cols-2 gap-6">
            <Link to={createPageUrl("Stories")}>
              <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white dark:bg-slate-800/95 backdrop-blur-sm h-full hover:-translate-y-2 cursor-pointer rounded-3xl transition-colors duration-300">
                <CardContent className="p-6 md:p-8 text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mb-4 md:mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3 transition-colors duration-300">{t('قصص ملهمة')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg transition-colors duration-300">
                    {t('اقرأ قصص المهتدين والتائبين')}
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to={createPageUrl("Fatwa")}>
              <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white dark:bg-slate-800/95 backdrop-blur-sm h-full hover:-translate-y-2 cursor-pointer rounded-3xl transition-colors duration-300">
                <CardContent className="p-6 md:p-8 text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-4 md:mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <FileText className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3 transition-colors duration-300">{t('الفتاوى')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg transition-colors duration-300">
                    {t('تصفح الفتاوى الشرعية')}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <Link to={createPageUrl("Lectures")}>
              <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white dark:bg-slate-800/95 backdrop-blur-sm h-full hover:-translate-y-2 cursor-pointer rounded-3xl transition-colors duration-300">
                <CardContent className="p-6 md:p-8 text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4 md:mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Play className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3 transition-colors duration-300">{t('المحاضرات')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg transition-colors duration-300">
                    {t('شاهد واستمع للمحاضرات الإسلامية')}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}