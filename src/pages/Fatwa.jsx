import React, { useState, useEffect } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MessageSquare, Users, BookOpen, Sparkles, ArrowRight, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import FatwaCard from "@/components/FatwaCard";
import FatwaRequestModal from "@/components/FatwaRequestModal";
import ContactModal from "@/components/ContactModal";
import AIFatwaAssistant from "@/components/AIFatwaAssistant";
import RatingWidget from "@/components/RatingWidget";
import CommentsSection from "@/components/CommentsSection";
import ShareButtons from "@/components/ShareButtons";
import { useLanguage } from "@/contexts/LanguageContext.jsx";

export default function Fatwa() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [muftiQuery, setMuftiQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedFatwa, setSelectedFatwa] = useState(null);
  const [onlineMuftis, setOnlineMuftis] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [user, setUser] = useState(null);
  const [userFavorites, setUserFavorites] = useState([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
       if (data.user) {
          setUser(data.user);
          fetchFavorites(data.user.email);
       }
    });
  }, []);

  const fetchFavorites = async (email) => {
     const { data } = await supabase.from('Favorite').select('item_id').eq('user_email', email).eq('item_type', 'fatwa');
     if (data) setUserFavorites(data.map(f => f.item_id));
  };

  const toggleFavorite = async (fatwa) => {
     if (!user) {
        alert("يرجى تسجيل الدخول");
        return;
     }
     if (userFavorites.includes(fatwa.id)) {
        await supabase.from('Favorite').delete().eq('user_email', user.email).eq('item_id', fatwa.id);
        setUserFavorites(prev => prev.filter(id => id !== fatwa.id));
     } else {
        await supabase.from('Favorite').insert({
           user_email: user.email,
           item_type: 'fatwa',
           item_id: fatwa.id,
           item_title: fatwa.question,
           item_data: fatwa
        });
        setUserFavorites(prev => [...prev, fatwa.id]);
     }
  };

  const categories = [
    { value: "all", label: "الكل" },
    { value: "عبادات", label: "عبادات" },
    { value: "معاملات", label: "معاملات" },
    { value: "عقيدة", label: "عقيدة" },
    { value: "أخلاق", label: "أخلاق" },
    { value: "أسرة", label: "أسرة" },
  ];

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const fatwaId = urlParams.get('id');
    if (fatwaId && fatwas) {
      const fatwa = fatwas.find(f => f.id === fatwaId);
      if (fatwa) setSelectedFatwa(fatwa);
    }
    loadOnlineMuftis();
  }, []);

  const loadOnlineMuftis = async () => {
    try {
      const { count } = await supabase.from('Scholar').select('*', { count: 'exact' }).eq('type', 'mufti').eq('is_available', true);
      setOnlineMuftis(count || 0);
    } catch (error) {
      console.log('Error loading muftis:', error);
    }
  };

  const { data: fatwas, isLoading } = useQuery({
    queryKey: ['fatwas'],
    queryFn: async () => {
      const { data, error } = await supabase.from('Fatwa').select('*').order('created_date', { ascending: false });
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  const filteredFatwas = fatwas.filter(fatwa => {
    const lowerQuery = searchQuery.toLowerCase();
    const matchesSearch = fatwa.question?.toLowerCase().includes(lowerQuery) || fatwa.answer?.toLowerCase().includes(lowerQuery);
    const matchesMufti = !muftiQuery || fatwa.mufti?.toLowerCase().includes(muftiQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || fatwa.category === selectedCategory;
    
    let matchesDate = true;
    if (dateFrom && fatwa.created_date) {
       matchesDate = matchesDate && new Date(fatwa.created_date) >= new Date(dateFrom);
    }
    if (dateTo && fatwa.created_date) {
       matchesDate = matchesDate && new Date(fatwa.created_date) <= new Date(dateTo);
    }
    
    return matchesSearch && matchesMufti && matchesCategory && matchesDate;
  });

  const quickActions = [
    {
      icon: Search,
      title: "ابحث عن فتوى",
      description: "ابحث في آلاف الفتاوى",
      color: "from-blue-100 to-blue-200 dark:from-slate-800 dark:to-slate-700",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ecdfbb3578091a5f1e1c54/66aa568de_.png",
      action: () => document.getElementById('search-input')?.focus()
    },
    {
      icon: MessageSquare,
      title: "اطرح سؤالاً",
      description: "اسأل واحصل على فتوى",
      color: "from-emerald-100 to-emerald-200 dark:from-slate-800 dark:to-slate-700",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ecdfbb3578091a5f1e1c54/66aa568de_.png",
      action: () => setShowRequestModal(true)
    },
    {
      icon: Users,
      title: "تواصل مع مفتي",
      description: "تحدث مباشرة مع مفتي",
      color: "from-purple-100 to-purple-200 dark:from-slate-800 dark:to-slate-700",
      image: "https://res.cloudinary.com/dufjbywcm/image/upload/v1765636071/%D8%AA%D9%88%D8%A7%D8%B5%D9%84_%D9%85%D8%B9_%D9%85%D9%81%D8%AA%D9%8A_o9rwrq.png",
      action: () => setShowContactModal(true),
      onlineCount: onlineMuftis,
      countLabel: "تواصل مع مفتي"
    }
  ];

  if (selectedFatwa) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 md:p-6 transition-colors duration-300 transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={() => setSelectedFatwa(null)}
            variant="ghost"
            className="text-white hover:bg-white dark:bg-slate-800/20 dark:hover:bg-slate-800/50 mb-6 transition-colors duration-300"
          >
            <ArrowRight className="w-5 h-5 ml-2" />
            رجوع للفتاوى
          </Button>

          <Card className="border-0 shadow-2xl bg-white dark:bg-slate-800/95 dark:bg-slate-800/50 backdrop-blur-sm rounded-3xl mb-6 transition-colors duration-300 transition-colors duration-300">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 text-white rounded-t-3xl p-6 md:p-8 transition-colors duration-300">
              <CardTitle className="text-xl md:text-2xl">{selectedFatwa.question}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">الجواب:</h3>
                    <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-slate-700 gap-1 transition-colors duration-300"
                        onClick={async () => {
                            try {
                                const { data, error } = await supabase.functions.invoke('aiAssistant', {
                                    body: { action: 'summarize', text: selectedFatwa.answer }
                                });
                                if (error) throw error;
                                alert("ملخص الجواب:\n" + (data.summary || "تعذر التلخيص"));
                            } catch (e) {
                                alert("حدث خطأ أثناء التلخيص");
                            }
                        }}
                    >
                        <Sparkles className="w-4 h-4" />
                        تلخيص بالذكاء الاصطناعي
                    </Button>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap transition-colors duration-300">{selectedFatwa.answer}</p>
              </div>

              {selectedFatwa.mufti && (
                <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 transition-colors duration-300">
                  <div className="flex items-center gap-2">
                     <Users className="w-5 h-5" />
                     <span className="font-semibold">{selectedFatwa.mufti}</span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                    {new Date(selectedFatwa.created_date).toLocaleDateString('ar-SA')}
                  </div>
                </div>
              )}

              {selectedFatwa.reference && (
                <div className="p-4 bg-amber-50 dark:bg-slate-700/50 rounded-lg border border-amber-200 dark:border-slate-600 transition-colors duration-300 transition-colors duration-300">
                  <p className="text-sm text-amber-800 dark:text-amber-300 transition-colors duration-300">
                    <BookOpen className="w-4 h-4 inline ml-1" />
                    <strong>المرجع:</strong> {selectedFatwa.reference}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <ShareButtons
                  title={selectedFatwa.question}
                  url={window.location.href}
                  description={selectedFatwa.answer?.substring(0, 100)}
                />
                <Button 
                   variant="outline" 
                   className="gap-2 text-rose-600 dark:text-rose-400 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-slate-700 transition-colors duration-300"
                   onClick={async () => {
                      const { data: { user } } = await supabase.auth.getUser();
                      if(!user) { alert('يرجى تسجيل الدخول للحفظ'); return; }
                      const { error } = await supabase.from('Favorite').insert({
                         user_email: user.email,
                         item_type: 'fatwa',
                         item_id: selectedFatwa.id,
                         item_title: selectedFatwa.question,
                         item_data: selectedFatwa
                      });
                      if(error) alert('خطأ في الحفظ');
                      else alert('تم الحفظ في المفضلة');
                   }}
                >
                   <Heart className="w-5 h-5" />
                   حفظ في المفضلة
                </Button>
              </div>
            </CardContent>
          </Card>

          <RatingWidget contentType="fatwa" contentId={selectedFatwa.id} />
          <CommentsSection contentType="fatwa" contentId={selectedFatwa.id} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 md:p-6 transition-colors duration-300 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 pt-4"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-slate-800/80 dark:to-slate-700/80 px-6 py-3 rounded-full mb-6 transition-colors duration-300 transition-colors duration-300">
            <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400 transition-colors duration-300" />
            <span className="text-emerald-800 dark:text-emerald-300 font-semibold transition-colors duration-300">الفتاوى الشرعية</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            الفتاوى
          </h1>
          <p className="text-lg md:text-xl text-white/90 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300">
            ابحث في مكتبة الفتاوى أو اطرح سؤالك الشرعي
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-8">
          {quickActions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                onClick={action.action}
                className={`group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br ${action.color} overflow-hidden h-full hover:-translate-y-2 rounded-3xl relative cursor-pointer`}
              >
                {action.onlineCount > 0 && (
                  <div className="absolute top-2 left-2 z-10 bg-emerald-500 dark:bg-teal-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1 transition-colors duration-300">
                    <div className="w-1.5 h-1.5 bg-white dark:bg-slate-800 rounded-full animate-pulse transition-colors duration-300"></div>
                    {action.onlineCount} {action.countLabel}
                  </div>
                )}
                <CardContent className="p-6 md:p-8 text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white dark:bg-slate-800/90 dark:bg-slate-700/90 backdrop-blur-sm flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg overflow-hidden transition-colors duration-300">
                    <img src={action.image} alt={action.title} className="w-12 h-12 md:w-14 md:h-14 object-contain" />
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-gray-800 dark:text-white mb-2 transition-colors duration-300">{action.title}</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-300">{action.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="border-0 shadow-2xl bg-white dark:bg-slate-800/95 dark:bg-slate-800/50 backdrop-blur-sm rounded-3xl mb-8 transition-colors duration-300 transition-colors duration-300">
          <CardContent className="p-6 md:p-8">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="search-input"
                  placeholder="ابحث في الفتاوى..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-12 py-6 text-lg bg-white dark:bg-slate-700 dark:text-white dark:placeholder-gray-400 rounded-full border-2 border-gray-200 dark:border-slate-600 focus:border-emerald-500 dark:focus:border-emerald-400 transition-colors duration-300 transition-colors duration-300"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat.value}
                    variant={selectedCategory === cat.value ? "default" : "outline"}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`rounded-full ${selectedCategory === cat.value 
                      ? 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600' 
                      : 'hover:bg-emerald-50 dark:hover:bg-slate-700 dark:text-gray-300'}`}
                  >
                    {cat.label}
                  </Button>
                ))}
              </div>

              <Button
                variant="ghost"
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                className="text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors duration-300"
              >
                {showAdvancedSearch ? 'إخفاء' : 'بحث متقدم'}
              </Button>

              {showAdvancedSearch && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="grid md:grid-cols-3 gap-4 pt-4 border-t dark:border-slate-600 transition-colors duration-300"
                >
                  <Input
                    placeholder="اسم المفتي"
                    value={muftiQuery}
                    onChange={(e) => setMuftiQuery(e.target.value)}
                    className="dark:bg-slate-700 dark:text-white dark:placeholder-gray-400 transition-colors duration-300"
                  />
                  <Input
                    type="date"
                    placeholder="من تاريخ"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="dark:bg-slate-700 dark:text-white transition-colors duration-300"
                  />
                  <Input
                    type="date"
                    placeholder="إلى تاريخ"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="dark:bg-slate-700 dark:text-white transition-colors duration-300"
                  />
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>

        <AIFatwaAssistant />

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <p className="text-white mt-4">جاري التحميل...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredFatwas.map((fatwa, index) => (
              <motion.div
                key={fatwa.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <FatwaCard
                  fatwa={fatwa}
                  onClick={() => setSelectedFatwa(fatwa)}
                  isFavorite={userFavorites.includes(fatwa.id)}
                  onToggleFavorite={() => toggleFavorite(fatwa)}
                />
              </motion.div>
            ))}
          </div>
        )}

        {filteredFatwas.length === 0 && !isLoading && (
          <Card className="border-0 shadow-2xl bg-white dark:bg-slate-800/95 dark:bg-slate-800/50 backdrop-blur-sm rounded-3xl p-12 text-center transition-colors duration-300 transition-colors duration-300">
            <BookOpen className="w-16 h-16 text-gray-400 dark:text-gray-500 dark:text-gray-400 mx-auto mb-4 transition-colors duration-300" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">لا توجد نتائج</h3>
            <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">جرب البحث بكلمات مختلفة</p>
          </Card>
        )}
      </div>

      <FatwaRequestModal
        open={showRequestModal}
        onClose={() => setShowRequestModal(false)}
      />

      <ContactModal
        open={showContactModal}
        onClose={() => setShowContactModal(false)}
        requestType="fatwa"
      />
    </div>
  );
}
