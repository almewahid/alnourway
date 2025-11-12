import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Video, FileText, Play } from "lucide-react";
import { motion } from "framer-motion";

export default function Content() {
  const [activeTab, setActiveTab] = useState("articles");

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            المحتوى
          </h1>
          <p className="text-xl text-gray-600">
            استكشف مكتبتنا من المقالات والفيديوهات
          </p>
        </motion.div>

        <div className="flex justify-center mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-white shadow-lg">
              <TabsTrigger value="articles" className="gap-2">
                <FileText className="w-4 h-4" />
                المقالات
              </TabsTrigger>
              <TabsTrigger value="videos" className="gap-2">
                <Video className="w-4 h-4" />
                الفيديوهات
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {activeTab === "articles" ? (
          <div className="grid md:grid-cols-2 gap-6">
            <Link to={createPageUrl("Stories")}>
              <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm h-full hover:-translate-y-1 cursor-pointer">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">قصص ملهمة</h3>
                  <p className="text-gray-600 text-lg">
                    اقرأ قصص المهتدين والتائبين
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to={createPageUrl("Fatwa")}>
              <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm h-full hover:-translate-y-1 cursor-pointer">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">الفتاوى</h3>
                  <p className="text-gray-600 text-lg">
                    تصفح الفتاوى الشرعية
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <Link to={createPageUrl("Lectures")}>
              <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm h-full hover:-translate-y-1 cursor-pointer">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">المحاضرات</h3>
                  <p className="text-gray-600 text-lg">
                    شاهد واستمع للمحاضرات الإسلامية
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