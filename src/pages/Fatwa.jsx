import React, { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MessageSquare, Users, BookOpen, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import FatwaCard from "../components/FatwaCard";
import FatwaRequestModal from "../components/FatwaRequestModal";
import ContactModal from "../components/ContactModal";
import RatingWidget from "../components/RatingWidget";
import CommentsSection from "../components/CommentsSection";
import ShareButtons from "../components/ShareButtons";

export default function Fatwa() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedFatwa, setSelectedFatwa] = useState(null);
  const [onlineMuftis, setOnlineMuftis] = useState(0);

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
      const { data, error } = await supabase
        .from('Scholar')
        .select('*')
        .eq('type', 'mufti')
        .eq('is_available', true);
      
      setOnlineMuftis(data?.length || 0);
    } catch (error) {
      console.log('Error loading muftis:', error);
    }
  };

  const { data: fatwas, isLoading } = useQuery({
    queryKey: ['fatwas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Fatwa')
        .select('*')
        .order('created_date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    initialData: [],
  });

  const filteredFatwas = fatwas.filter(fatwa =>
    fatwa.question?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fatwa.answer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fatwa.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const quickActions = [
    {
      icon: Search,
      title: "ابحث عن فتوى",
      description: "ابحث في مكتبة الفتاوى",
      color: "from-blue-100 to-blue-200",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ecdfbb3578091a5f1e1c54/66aa568de_.png",
      action: () => document.getElementById('search-input')?.focus()
    },
    {
      icon: MessageSquare,
      title: "اطرح سؤالك",
      description: "أرسل سؤالك الشرعي",
      color: "from-emerald-100 to-emerald-200",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ecdfbb3578091a5f1e1c54/66aa568de_.png",
      action: () => setShowRequestModal(true)
    },
    {
      icon: Users,
      title: "تواصل مع مفتي",
      description: "تحدث مباشرة مع عالم",
      color: "from-purple-100 to-purple-200",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ecdfbb3578091a5f1e1c54/8f4f91aed_.png",
      action: () => setShowContactModal(true),
      onlineCount: onlineMuftis,
      countLabel: "مفتي متاح"
    }
  ];

  if (selectedFatwa) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-800 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={() => setSelectedFatwa(null)}
            variant="ghost"
            className="text-white hover:bg-white/20 mb-6"
          >
            <ArrowRight className="w-5 h-5 ml-2" />
            العودة للفتاوى
          </Button>

          <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm rounded-3xl mb-6">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-t-3xl p-6 md:p-8">
              <CardTitle className="text-xl md:text-2xl">{selectedFatwa.question}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">الجواب:</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedFatwa.answer}</p>
              </div>

              {selectedFatwa.mufti && (
                <div className="flex items-center gap-2 text-emerald-700">
                  <Users className="w-5 h-5" />
                  <span className="font-semibold">{selectedFatwa.mufti}</span>
                </div>
              )}

              {selectedFatwa.reference && (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-800">
                    <BookOpen className="w-4 h-4 inline ml-1" />
                    <strong>المرجع:</strong> {selectedFatwa.reference}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3">
                <ShareButtons
                  title={selectedFatwa.question}
                  url={window.location.href}
                  description={selectedFatwa.answer?.substring(0, 100)}
                />
              </div>
            </CardContent>
          </Card>

          <RatingWidget contentType="fatwa" contentId={selectedFatwa.id} />
          <CommentsSection
            contentType="fatwa"
            contentId={selectedFatwa.id}
            contentTitle={selectedFatwa.question}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-800 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 pt-4"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 px-6 py-3 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <span className="text-emerald-800 font-semibold">طلب فتوى</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            الفتاوى الشرعية
          </h1>

          <div className="max-w-4xl mx-auto bg-gradient-to-br from-amber-50 to-amber-100 rounded-3xl p-6 md:p-10 shadow-2xl border-2 border-amber-200 mb-8">
            <p className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed mb-3">
              "فَاسْأَلُوا أَهْلَ الذِّكْرِ إِن كُنتُمْ لَا تَعْلَمُونَ"
            </p>
            <p className="text-lg text-emerald-700 font-semibold">سورة النحل - آية 43</p>
          </div>

          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8">
            احصل على إجابات شرعية موثوقة من علماء متخصصين
          </p>

          <div className="relative max-w-2xl mx-auto mb-8">
            <Input
              id="search-input"
              placeholder="ابحث في الفتاوى..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-12 py-6 text-lg bg-white/95 backdrop-blur-sm rounded-full border-0 shadow-lg"
            />
            <button className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-emerald-600 hover:bg-emerald-700 rounded-full flex items-center justify-center transition-colors">
              <Search className="w-5 h-5 text-white" />
            </button>
          </div>
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
                className={`group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br ${action.color} overflow-hidden h-full hover:-translate-y-2 rounded-3xl cursor-pointer relative`}
              >
                {action.onlineCount > 0 && (
                  <div className="absolute top-2 left-2 z-10 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    {action.onlineCount} {action.countLabel}
                  </div>
                )}
                <CardContent className="p-6 md:p-8 text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg overflow-hidden">
                    <img src={action.image} alt={action.title} className="w-12 h-12 md:w-14 md:h-14 object-contain" />
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-gray-800 mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{action.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            </div>
          ) : filteredFatwas.length > 0 ? (
            filteredFatwas.map((fatwa, index) => (
              <motion.div
                key={fatwa.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <FatwaCard fatwa={fatwa} onClick={() => setSelectedFatwa(fatwa)} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <MessageSquare className="w-16 h-16 text-white/50 mx-auto mb-4" />
              <p className="text-white text-lg">لا توجد نتائج</p>
            </div>
          )}
        </div>
      </div>

      <FatwaRequestModal open={showRequestModal} onClose={() => setShowRequestModal(false)} />
      <ContactModal
        open={showContactModal}
        onClose={() => setShowContactModal(false)}
        requestType="fatwa"
      />
    </div>
  );
}
