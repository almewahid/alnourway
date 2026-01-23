import React, { useState, useEffect } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, Search, Play, BookOpen, Clock, Star, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Badge } from "@/components/ui/badge";
import AIRecommendations from "@/components/AIRecommendations";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

export default function Courses() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [user, setUser] = useState(null);

  useEffect(() => {
    import("@/components/api/supabaseClient").then(({ supabase }) => {
        supabase.auth.getUser().then(({ data }) => setUser(data.user));
    });
  }, []);

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase.from('Course').select('*').eq('is_published', true).order('created_date', { ascending: false });
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  const categories = [
    { value: "all", label: t("الكل") },
    { value: "aqeedah", label: t("العقيدة") },
    { value: "fiqh", label: t("الفقه") },
    { value: "hadith", label: t("الحديث") },
    { value: "tafsir", label: t("التفسير") },
    { value: "general", label: t("عام") },
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.instructor?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6 md:p-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 dark:from-teal-600 dark:to-teal-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transition-colors duration-300">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">{t('الدورات التعليمية')}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 transition-colors duration-300">{t('دورات شاملة في العلوم الإسلامية')}</p>
        </motion.div>

        <Card className="border-0 shadow-xl bg-white dark:bg-slate-800/90 backdrop-blur-sm mb-8 transition-colors duration-300">
          <CardContent className="p-6">
            <div className="relative">
              <Input 
                placeholder={t('ابحث عن دورة...')} 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="text-lg py-6 pr-12 dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:placeholder:text-gray-500 transition-colors duration-300" 
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 transition-colors duration-300" />
            </div>
          </CardContent>
        </Card>

        {user && <AIRecommendations userEmail={user.email} />}

        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                selectedCategory === cat.value
                  ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg"
                  : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-slate-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 dark:border-teal-400 mx-auto transition-colors duration-300"></div>
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800/90 backdrop-blur-sm h-full overflow-hidden flex flex-col transition-colors duration-300">
                  <div className="h-48 bg-gradient-to-br from-teal-400 to-blue-500 relative">
                    {course.thumbnail_url ? (
                      <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <GraduationCap className="w-16 h-16 text-white/50" />
                      </div>
                    )}
                    <Badge className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 text-teal-800 dark:text-teal-300 hover:bg-white dark:hover:bg-slate-800 transition-colors duration-300">
                      {categories.find(c => c.value === course.category)?.label || course.category}
                    </Badge>
                  </div>
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">{course.title}</h3>
                    <p className="text-teal-600 dark:text-teal-400 font-medium text-sm mb-3 transition-colors duration-300">{course.instructor}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 leading-relaxed line-clamp-2 transition-colors duration-300">{course.description}</p>
                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100 dark:border-slate-700 transition-colors duration-300">
                      <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs transition-colors duration-300">
                        <Clock className="w-3 h-3 ml-1" />
                        <span>{t('متاح الآن')}</span>
                      </div>
                      <Link to={createPageUrl(`CourseView?id=${course.id}`)}>
                        <Button className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-800 text-white gap-2 transition-colors duration-300">
                           {t('عرض الدورة')}
                           <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <GraduationCap className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4 transition-colors duration-300" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">{t('لا توجد دورات متاحة')}</h3>
            <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">{t('لم نجد نتائج لبحثك')}</p>
          </div>
        )}
      </div>
    </div>
  );
}