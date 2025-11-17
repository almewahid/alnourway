import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BookOpen, Heart, MessageSquare, Users, Globe, Calendar, Library, Video, Search, User, Handshake } from "lucide-react";
import { base44 } from "@/api/base44Client";

const verses = [
  { text: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", ref: "سورة الشرح - آية 6" },
  { text: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا", ref: "سورة الطلاق - آية 2" },
  { text: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", ref: "سورة الشرح - آية 5" },
  { text: "وَقُل رَّبِّ زِدْنِي عِلْمًا", ref: "سورة طه - آية 114" },
  { text: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", ref: "سورة البقرة - آية 153" },
  { text: "ادْعُونِي أَسْتَجِبْ لَكُمْ", ref: "سورة غافر - آية 60" },
  { text: "وَاللَّهُ خَيْرٌ حَافِظًا وَهُوَ أَرْحَمُ الرَّاحِمِينَ", ref: "سورة يوسف - آية 64" }
];

const hadiths = [
  { text: "إنما الأعمال بالنيات", ref: "رواه البخاري ومسلم" },
  { text: "خيركم من تعلم القرآن وعلمه", ref: "رواه البخاري" },
  { text: "الدين النصيحة", ref: "رواه مسلم" },
  { text: "من دعا إلى هدى كان له من الأجر مثل أجور من تبعه", ref: "رواه مسلم" }
];

const allQuotes = [...verses, ...hadiths];

export default function Home() {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'ar');
  const [randomQuote] = useState(() => allQuotes[Math.floor(Math.random() * allQuotes.length)]);
  const [searchQuery, setSearchQuery] = useState("");
  const [onlineCount, setOnlineCount] = useState({ scholars: 0, preachers: 0, teachers: 0 });
  const [appSettings, setAppSettings] = useState({
    features: { azkar: true, library: true, lectures: true, stories: true, fatwas: true },
    languages: { ar: true, en: true, fr: true, ur: true }
  });

  useEffect(() => {
    const saved = localStorage.getItem('appSettings');
    if (saved) {
      setAppSettings(JSON.parse(saved));
    }
    trackEvent('view', 'page', 'home');
    loadOnlineCounts();
  }, []);

  const loadOnlineCounts = async () => {
    try {
      const [scholars, preachers, teachers] = await Promise.all([
        base44.entities.Scholar.filter({ type: 'mufti', is_available: true }),
        base44.entities.Scholar.filter({ type: 'preacher', is_available: true }),
        base44.entities.Scholar.filter({ type: 'teacher', is_available: true })
      ]);
      
      setOnlineCount({
        scholars: scholars.length,
        preachers: preachers.length,
        teachers: teachers.length
      });
    } catch (error) {
      console.log('Error loading online counts:', error);
    }
  };

  const trackEvent = async (eventType, contentType, contentId) => {
    try {
      const user = await base44.auth.me().catch(() => null);
      await base44.entities.AnalyticsEvent.create({
        event_type: eventType,
        user_email: user?.email || 'guest',
        content_type: contentType,
        content_id: contentId,
        device_type: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
      });
    } catch (error) {
      console.log('Analytics error:', error);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      trackEvent('search', 'query', searchQuery);
      window.location.href = createPageUrl("Search") + `?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const features = [
    {
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ecdfbb3578091a5f1e1c54/6cae5772d_.png",
      title: "التعرف على الإسلام",
      description: "اكتشف مبادئ الإسلام وتعاليمه السمحة",
      color: "from-teal-100 to-teal-200",
      link: createPageUrl("LearnIslam")
    },
    {
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ecdfbb3578091a5f1e1c54/8c7f0d887_.png",
      title: "أريد أن أتوب",
      description: "ابدأ رحلة التوبة والعودة إلى الله",
      color: "from-rose-100 to-rose-200",
      link: createPageUrl("Repentance")
    },
    {
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ecdfbb3578091a5f1e1c54/66aa568de_.png",
      title: "طلب فتوى",
      description: "احصل على إجابات شرعية موثوقة",
      color: "from-emerald-100 to-emerald-200",
      link: createPageUrl("Fatwa"),
      onlineCount: onlineCount.scholars,
      countLabel: "مفتي متاح"
    },
    {
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ecdfbb3578091a5f1e1c54/2d618ad07_.png",
      title: "إصلاح ذات البين",
      description: "حل النزاعات بطريقة شرعية",
      color: "from-cyan-100 to-cyan-200",
      link: createPageUrl("ReconciliationCommittee")
    }
  ];

  const additionalFeatures = [
    {
      icon: BookOpen,
      title: "دورات القرآن الكريم",
      description: "سجل في دورات تحفيظ القرآن",
      color: "from-teal-100 to-teal-200",
      iconColor: "text-teal-700",
      link: createPageUrl("QuranCourses"),
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ecdfbb3578091a5f1e1c54/631c6f8fc_.png",
      show: true,
      onlineCount: onlineCount.teachers,
      countLabel: "محفظ متاح"
    },
    {
      icon: Calendar,
      title: "الأذكار اليومية",
      description: "أذكار الصباح والمساء",
      color: "from-amber-100 to-amber-200",
      iconColor: "text-amber-700",
      link: createPageUrl("Azkar"),
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ecdfbb3578091a5f1e1c54/580d0a37b_.png",
      show: appSettings.features.azkar
    },
    {
      icon: Library,
      title: "المكتبة الإسلامية",
      description: "مجموعة من الكتب والمراجع",
      color: "from-indigo-100 to-indigo-200",
      iconColor: "text-indigo-700",
      link: createPageUrl("Library"),
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ecdfbb3578091a5f1e1c54/a0a1f4137_.png",
      show: appSettings.features.library
    }
  ];

  const stats = [
    { icon: Users, value: "10,000+", label: "مستخدم سعيد" },
    { icon: BookOpen, value: "500+", label: "محاضرة" },
    { icon: Globe, value: "50+", label: "دولة" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-700 via-teal-600 to-teal-800 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Search and Join Team */}
        <div className="flex flex-col md:flex-row items-center gap-3 max-w-3xl mx-auto mb-8 pt-4">
          <div className="relative flex-1 w-full">
            <Input
              placeholder="ابحث..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pr-12 py-6 text-lg bg-white/95 backdrop-blur-sm rounded-full border-0 shadow-lg"
            />
            <button
              onClick={handleSearch}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-teal-600 hover:bg-teal-700 rounded-full flex items-center justify-center transition-colors"
            >
              <Search className="w-5 h-5 text-white" />
            </button>
          </div>

          <Link to={createPageUrl("JoinTeam")} className="w-full md:w-auto">
            <Button 
              className="w-full md:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg rounded-full px-8 py-6 text-lg whitespace-nowrap"
            >
              <Users className="w-5 h-5 ml-2" />
              انضم إلى فريقنا
            </Button>
          </Link>
        </div>

        {/* الأقسام الرئيسية - 2 في الموبايل، 4 في الديسكتوب */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {features.map((feature, index) => (
            <Link key={index} to={feature.link} onClick={() => trackEvent('view', 'section', feature.title)}>
              <Card className={`group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br ${feature.color} overflow-hidden h-full hover:-translate-y-2 rounded-3xl relative`}>
                {feature.onlineCount > 0 && (
                  <div className="absolute top-2 left-2 z-10 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    {feature.onlineCount} {feature.countLabel}
                  </div>
                )}
                <CardContent className="p-6 md:p-8 text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg overflow-hidden">
                    <img src={feature.image} alt={feature.title} className="w-12 h-12 md:w-14 md:h-14 object-contain" />
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-xs text-gray-700 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* الأقسام الإضافية - 2 في الموبايل، 3 في الديسكتوب */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          {additionalFeatures.filter(f => f.show).map((feature, index) => (
            <Link key={index} to={feature.link} onClick={() => trackEvent('view', 'section', feature.title)}>
              <Card className={`group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br ${feature.color} overflow-hidden h-full hover:-translate-y-2 rounded-3xl relative`}>
                {feature.onlineCount > 0 && (
                  <div className="absolute top-2 left-2 z-10 bg-teal-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    {feature.onlineCount} {feature.countLabel}
                  </div>
                )}
                <CardContent className="p-6 md:p-8 text-center">
                  <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg overflow-hidden`}>
                    {feature.image ? (
                      <img src={feature.image} alt={feature.title} className="w-10 h-10 md:w-12 md:h-12 object-contain" />
                    ) : (
                      <feature.icon className={`w-7 h-7 md:w-8 md:h-8 ${feature.iconColor}`} />
                    )}
                  </div>
                  <h3 className="text-xs md:text-sm font-bold text-gray-800 mb-1">{feature.title}</h3>
                  <p className="text-xs text-gray-700 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* الإحصائيات - صف واحد */}
        <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-2xl mb-8">
          <div className="flex flex-row justify-around items-center gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-8 h-8 md:w-10 md:h-10 text-amber-300 mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-amber-100 text-xs md:text-sm whitespace-nowrap">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* الآية/الحديث */}
        <div className="text-center">
          <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl border border-white/20">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-3 leading-relaxed">
              {randomQuote.text}
            </h2>
            <p className="text-amber-200 text-sm md:text-base">{randomQuote.ref}</p>
          </div>
        </div>
      </div>
    </div>
  );
}