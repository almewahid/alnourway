import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, BookOpen, Video, FileText, Globe, Filter, Calendar, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/components/LanguageContext";
import { Button } from "@/components/ui/button";

export default function Search() {
  const { t } = useLanguage();
  const urlParams = new URLSearchParams(window.location.search);
  const queryParam = urlParams.get('q') || "";
  
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  
  // Advanced Search States
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [speakerAuthor, setSpeakerAuthor] = useState("");

  const { data: lectures } = useQuery({
    queryKey: ['lectures'],
    queryFn: () => base44.entities.Lecture.list(),
    initialData: [],
  });

  const { data: stories } = useQuery({
    queryKey: ['stories'],
    queryFn: () => base44.entities.Story.list(),
    initialData: [],
  });

  const { data: fatwas } = useQuery({
    queryKey: ['fatwas'],
    queryFn: () => base44.entities.Fatwa.list(),
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

  const filterByDate = (item) => {
    if (!dateFrom && !dateTo) return true;
    const itemDate = new Date(item.created_date || item.created_at); // Fallback to created_at if created_date missing
    if (isNaN(itemDate.getTime())) return true;
    
    const start = dateFrom ? new Date(dateFrom) : new Date('2000-01-01');
    const end = dateTo ? new Date(dateTo) : new Date();
    
    return itemDate >= start && itemDate <= end;
  };

  const filteredLectures = lectures.filter(item => {
    const textMatch = searchInText(item.title, searchQuery) || 
      searchInText(item.speaker, searchQuery) ||
      searchInText(item.topic, searchQuery) ||
      searchInText(item.description, searchQuery);
    
    const speakerMatch = !speakerAuthor || searchInText(item.speaker, speakerAuthor);
    
    return textMatch && speakerMatch && filterByDate(item);
  });

  const filteredStories = stories.filter(item => {
    const textMatch = searchInText(item.title, searchQuery) || 
      searchInText(item.content, searchQuery) ||
      searchInText(item.author, searchQuery) ||
      searchInText(item.excerpt, searchQuery);

    const countryMatch = selectedCountry === "all" || !item.country || item.country === selectedCountry;
    const authorMatch = !speakerAuthor || searchInText(item.author, speakerAuthor);
    
    return textMatch && countryMatch && authorMatch && filterByDate(item);
  });

  const filteredFatwas = fatwas.filter(item => {
    const textMatch = searchInText(item.question, searchQuery) || 
      searchInText(item.answer, searchQuery) ||
      searchInText(item.category, searchQuery) ||
      searchInText(item.mufti, searchQuery);
      
    const muftiMatch = !speakerAuthor || searchInText(item.mufti, speakerAuthor);
    
    return textMatch && muftiMatch && filterByDate(item);
  });

  const allResults = [
    ...filteredLectures.map(item => ({ ...item, type: 'lecture' })),
    ...filteredStories.map(item => ({ ...item, type: 'story' })),
    ...filteredFatwas.map(item => ({ ...item, type: 'fatwa' }))
  ];

  let displayResults = activeTab === "all" ? allResults :
    activeTab === "lectures" ? filteredLectures.map(item => ({ ...item, type: 'lecture' })) :
    activeTab === "stories" ? filteredStories.map(item => ({ ...item, type: 'story' })) :
    filteredFatwas.map(item => ({ ...item, type: 'fatwa' }));

  // Apply extra filters if necessary for types that don't support them natively in the specific filter above
  if (selectedLanguage !== "all") {
     displayResults = displayResults.filter(item => !item.language || item.language === selectedLanguage);
  }

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
            {t('advanced_search')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('search_placeholder')}
          </p>
        </motion.div>

        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm mb-8">
          <CardContent className="p-6">
            <div className="relative mb-4">
              <Input
                placeholder={t('search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-lg py-6 pr-12"
              />
              <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">{t('filter_by')}:</span>
                </div>
                <Button 
                    variant="ghost" 
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-indigo-600 hover:bg-indigo-50"
                >
                    {showAdvanced ? 'إخفاء خيارات متقدمة' : t('advanced_search')}
                </Button>
            </div>

            <div className="flex flex-wrap gap-4">
               <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                 <SelectTrigger className="w-[180px]">
                   <SelectValue placeholder="اللغة" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">{t('all')}</SelectItem>
                   <SelectItem value="ar">العربية</SelectItem>
                   <SelectItem value="en">English</SelectItem>
                   <SelectItem value="fr">French</SelectItem>
                   <SelectItem value="ur">Urdu</SelectItem>
                 </SelectContent>
               </Select>

               <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                 <SelectTrigger className="w-[180px]">
                   <SelectValue placeholder={t('country')} />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">{t('all')}</SelectItem>
                   <SelectItem value="Egypt">مصر</SelectItem>
                   <SelectItem value="Saudi Arabia">السعودية</SelectItem>
                   <SelectItem value="Jordan">الأردن</SelectItem>
                   <SelectItem value="UAE">الإمارات</SelectItem>
                 </SelectContent>
               </Select>
            </div>

            {showAdvanced && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-4 pt-4 border-t grid md:grid-cols-3 gap-4"
                >
                    <div className="space-y-2">
                        <label className="text-sm text-gray-600 flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {t('date_from')}
                        </label>
                        <Input 
                            type="date" 
                            value={dateFrom} 
                            onChange={(e) => setDateFrom(e.target.value)} 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-600 flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {t('date_to')}
                        </label>
                        <Input 
                            type="date" 
                            value={dateTo} 
                            onChange={(e) => setDateTo(e.target.value)} 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-600 flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {t('speaker_author')}
                        </label>
                        <Input 
                            placeholder={t('speaker_author')}
                            value={speakerAuthor}
                            onChange={(e) => setSpeakerAuthor(e.target.value)} 
                        />
                    </div>
                </motion.div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-center mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-white shadow-lg flex-wrap h-auto">
              <TabsTrigger value="all" className="gap-2">
                {t('all')} ({allResults.length})
              </TabsTrigger>
              <TabsTrigger value="lectures" className="gap-2">
                <Video className="w-4 h-4" />
                {t('lectures')} ({filteredLectures.length})
              </TabsTrigger>
              <TabsTrigger value="stories" className="gap-2">
                <BookOpen className="w-4 h-4" />
                {t('stories')} ({filteredStories.length})
              </TabsTrigger>
              <TabsTrigger value="fatwas" className="gap-2">
                <FileText className="w-4 h-4" />
                {t('fatwas')} ({filteredFatwas.length})
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
                    {t('no_results')}
                  </h3>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {t('start_search')}
              </h3>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}