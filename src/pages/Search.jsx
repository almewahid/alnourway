import React, { useState, useEffect } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, BookOpen, Video, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Search() {
  const urlParams = new URLSearchParams(window.location.search);
  const queryParam = urlParams.get('q') || "";
  
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [activeTab, setActiveTab] = useState("all");

  const { data: lectures } = useQuery({
    queryKey: ['lectures'],
    queryFn: async () => {
      const { data, error } = await supabase.from('Lecture').select('*');
      if (error) throw error;
      return data || [];
    },
    initialData: [],
  });

  const { data: stories } = useQuery({
    queryKey: ['stories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('Story').select('*');
      if (error) throw error;
      return data || [];
    },
    initialData: [],
  });

  const { data: fatwas } = useQuery({
    queryKey: ['fatwas'],
    queryFn: async () => {
      const { data, error } = await supabase.from('Fatwa').select('*');
      if (error) throw error;
      return data || [];
    },
    initialData: [],
  });

  // تحسين البحث
  const normalizeText = (text) => {
    if (!text) return '';
    return text.toLowerCase().trim();
  };

  const searchInText = (text, query) => {
    if (!text || !query) return false;
    const normalizedText = normalizeText(text);
    const normalizedQuery = normalizeText(query);
    return normalizedText.includes(normalizedQuery);
  };

  const filteredLectures = lectures.filter(item =>
    searchInText(item.title, searchQuery) || 
    searchInText(item.speaker, searchQuery) ||
    searchInText(item.topic, searchQuery) ||
    searchInText(item.description, searchQuery)
  );

  const filteredStories = stories.filter(item =>
    searchInText(item.title, searchQuery) || 
    searchInText(item.content, searchQuery) ||
    searchInText(item.author, searchQuery) ||
    searchInText(item.excerpt, searchQuery)
  );

  const filteredFatwas = fatwas.filter(item =>
    searchInText(item.question, searchQuery) || 
    searchInText(item.answer, searchQuery) ||
    searchInText(item.category, searchQuery) ||
    searchInText(item.mufti, searchQuery)
  );

  const allResults = [
    ...filteredLectures.map(item => ({ ...item, type: 'lecture' })),
    ...filteredStories.map(item => ({ ...item, type: 'story' })),
    ...filteredFatwas.map(item => ({ ...item, type: 'fatwa' }))
  ];

  const displayResults = activeTab === "all" ? allResults :
    activeTab === "lectures" ? filteredLectures.map(item => ({ ...item, type: 'lecture' })) :
    activeTab === "stories" ? filteredStories.map(item => ({ ...item, type: 'story' })) :
    filteredFatwas.map(item => ({ ...item, type: 'fatwa' }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <SearchIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            البحث
          </h1>
          <p className="text-xl text-gray-600">
            ابحث في جميع المحتوى
          </p>
        </motion.div>

        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <Input
                placeholder="ابحث عن محاضرات، قصص، فتاوى..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-lg py-6 pr-12"
              />
              <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-white shadow-lg">
              <TabsTrigger value="all" className="gap-2">
                الكل ({allResults.length})
              </TabsTrigger>
              <TabsTrigger value="lectures" className="gap-2">
                <Video className="w-4 h-4" />
                محاضرات ({filteredLectures.length})
              </TabsTrigger>
              <TabsTrigger value="stories" className="gap-2">
                <BookOpen className="w-4 h-4" />
                قصص ({filteredStories.length})
              </TabsTrigger>
              <TabsTrigger value="fatwas" className="gap-2">
                <FileText className="w-4 h-4" />
                فتاوى ({filteredFatwas.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {searchQuery ? (
          <div className="space-y-4">
            {displayResults.length > 0 ? (
              displayResults.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          result.type === 'lecture' ? 'bg-purple-100' :
                          result.type === 'story' ? 'bg-amber-100' :
                          'bg-emerald-100'
                        }`}>
                          {result.type === 'lecture' && <Video className="w-6 h-6 text-purple-600" />}
                          {result.type === 'story' && <BookOpen className="w-6 h-6 text-amber-600" />}
                          {result.type === 'fatwa' && <FileText className="w-6 h-6 text-emerald-600" />}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {result.title || result.question}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {result.type === 'lecture' && (result.speaker || result.description)}
                            {result.type === 'story' && (result.excerpt || result.content?.substring(0, 150))}
                            {result.type === 'fatwa' && result.answer?.substring(0, 150)}
                          </p>
                          <div className="mt-2">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              result.type === 'lecture' ? 'bg-purple-50 text-purple-700' :
                              result.type === 'story' ? 'bg-amber-50 text-amber-700' :
                              'bg-emerald-50 text-emerald-700'
                            }`}>
                              {result.type === 'lecture' ? 'محاضرة' : 
                               result.type === 'story' ? 'قصة' : 'فتوى'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    لا توجد نتائج
                  </h3>
                  <p className="text-gray-600">
                    جرب البحث بكلمات مفتاحية أخرى
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                ابدأ البحث
              </h3>
              <p className="text-gray-600">
                اكتب في مربع البحث للعثور على ما تريد
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}