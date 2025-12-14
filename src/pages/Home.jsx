import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BookOpen, Heart, MessageSquare, Users, Globe, Calendar, Library, Video, Search, User, Handshake } from "lucide-react";
import { supabase } from "@/components/api/supabaseClient";
import AIRecommendations from "@/components/AIRecommendations";
import { useLanguage } from "../components/LanguageContext";

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
  const { t, language } = useLanguage();
  const [randomQuote] = useState(() => allQuotes[Math.floor(Math.random() * allQuotes.length)]);
  const [searchQuery, setSearchQuery] = useState("");
  const [onlineCount, setOnlineCount] = useState({ scholars: 0, preachers: 0, teachers: 0 });
  const [appSettings, setAppSettings] = useState({
    features: { azkar: true, library: true, lectures: true, stories: true, fatwas: true },
    languages: { ar: true, en: true, fr: true, ur: true }
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
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
        supabase.from('Scholar').select('*', { count: 'exact' }).eq('type', 'mufti').eq('is_available', true),
        supabase.from('Scholar').select('*', { count: 'exact' }).eq('type', 'preacher').eq('is_available', true),
        supabase.from('Scholar').select('*', { count: 'exact' }).eq('type', 'teacher').eq('is_available', true)
      ]);

      setOnlineCount({
        scholars: scholars.count || 0,
        preachers: preachers.count || 0,
        teachers: teachers.count || 0
      });
    } catch (error) {
      console.log('Error loading online counts:', error);
    }
  };

  const trackEvent = async (eventType, contentType, contentId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('AnalyticsEvent').insert({
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
      image: "https://res.cloudinary.com/dufjbywcm/image/upload/v1765562069/%D9%82%D8%B3%D9%85_%D8%A7%D9%84%D8%AA%D8%B9%D8%B1%D9%81_%D8%B9%D9%84%D9%89_%D8%A7%D9%84%D8%A7%D8%B3%D9%84%D8%A7%D9%85_z4rxqo.png",
      title: t('learn_islam'),
      description: t('learn_islam_desc'),
      color: "from-teal-100 to-teal-200",
      link: createPageUrl("LearnIslam")
    },
    {
      image: "https://res.cloudinary.com/dufjbywcm/image/upload/v1765562068/%D9%82%D8%B3%D9%85_%D8%A7%D9%84%D8%AA%D9%88%D8%A8%D8%A9_o8ukrq.png",
      title: t('repentance'),
      description: t('repentance_desc'),
      color: "from-rose-100 to-rose-200",
      link: createPageUrl("Repentance")
    },
    {
      image: "https://res.cloudinary.com/dufjbywcm/image/upload/v1765562069/%D9%82%D8%B3%D9%85_%D8%A7%D9%84%D9%81%D8%AA%D9%88%D9%89_d9nvcw.png",
      title: t('fatwa'),
      description: t('fatwa_desc'),
      color: "from-emerald-100 to-emerald-200",
      link: createPageUrl("Fatwa"),
      onlineCount: onlineCount.scholars,
      countLabel: t('contact_scholar')
    },
    {
      image: "https://res.cloudinary.com/dufjbywcm/image/upload/v1765562069/%D9%82%D8%B3%D9%85_%D8%A5%D8%B5%D9%84%D8%A7%D8%AD_%D8%B0%D8%A7%D8%AA_%D8%A7%D9%84%D8%A8%D9%8A%D9%86_tjvu5j.png",
      title: t('reconciliation'),
      description: t('reconciliation_desc'),
      color: "from-cyan-100 to-cyan-200",
      link: createPageUrl("ReconciliationCommittee")
    }
  ];

  const additionalFeatures = [
    {
      icon: BookOpen,
      title: t('quran_courses'),
      description: t('quran_courses_desc'),
      color: "from-teal-100 to-teal-200",
      iconColor: "text-teal-700",
      link: createPageUrl("QuranCourses"),
      image: "https://res.cloudinary.com/dufjbywcm/image/upload/v1765562069/%D9%81%D8%B1%D8%B9%D9%8A_%D8%AF%D9%88%D8%B1%D8%A7%D8%AA_%D8%A7%D9%84%D9%82%D8%B1%D8%A2%D9%86_it1oto.png",
      show: true,
      onlineCount: onlineCount.teachers,
      countLabel: t('contact_teacher')
    },
    {
      icon: Calendar,
      title: t('daily_azkar'),
      description: t('daily_azkar_desc'),
      color: "from-amber-100 to-amber-200",
      iconColor: "text-amber-700",
      link: createPageUrl("Azkar"),
      image: "https://res.cloudinary.com/dufjbywcm/image/upload/v1765562069/%D9%81%D8%B1%D8%B9%D9%8A_%D8%A3%D8%B0%D9%83%D8%A7%D8%B1_a1bjup.png",
      show: appSettings.features.azkar
    },
    {
      icon: Library,
      title: t('islamic_library'),
      description: t('islamic_library_desc'),
      color: "from-indigo-100 to-indigo-200",
      iconColor: "text-indigo-700",
      link: createPageUrl("Library"),
      image: "https://res.cloudinary.com/dufjbywcm/image/upload/v1765562068/%D9%81%D8%B1%D8%B9%D9%8A_%D8%A7%D9%84%D9%85%D9%83%D8%AA%D8%A8%D8%A9_kmf8ph.png",
      show: appSettings.features.library
    }
  ];

  const stats = [
    { icon: Users, value: "10,000+", label: t('happy_user') },
    { icon: BookOpen, value: "500+", label: t('lecture') },
    { icon: Globe, value: "50+", label: t('country') }
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
              {t('join_team')}
            </Button>
          </Link>
        </div>

        {/* AI Recommendations */}
        {user && <AIRecommendations userEmail={user.email} />}

        {/* الأقسام الرئيسية - 2 في الموبايل، 4 في الديسكتوب */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {features.map((feature, index) => (
            <Link key={index} to={feature.link} onClick={() => trackEvent('view', 'section', feature.title)}>
              <Card className={`group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br ${feature.color} overflow-hidden h-full hover:-translate-y-2 rounded-3xl relative flex flex-col`}>
                {feature.onlineCount > 0 && (
                  <div className="absolute top-2 left-2 z-10 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    {feature.onlineCount} {feature.countLabel}
                  </div>
                )}
                {/* To change image size, modify aspect ratio below (e.g. aspect-[16/9] for smaller height) */}
                <div className="w-full aspect-[7/8] overflow-hidden">
                  <img 
                    src={feature.image} 
                    alt={feature.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <CardContent className="p-4 md:p-6 text-center flex-1 flex flex-col justify-center">
                  <h3 className="text-base md:text-lg font-bold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-[10px] md:text-xs text-gray-700 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* الأقسام الإضافية - 2 في الموبايل، 3 في الديسكتوب */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          {additionalFeatures.filter(f => f.show).map((feature, index) => (
            <Link key={index} to={feature.link} onClick={() => trackEvent('view', 'section', feature.title)}>
              <Card className={`group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br ${feature.color} overflow-hidden h-full hover:-translate-y-2 rounded-3xl relative flex flex-col`}>
                {feature.onlineCount > 0 && (
                  <div className="absolute top-2 left-2 z-10 bg-teal-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    {feature.onlineCount} {feature.countLabel}
                  </div>
                )}
                {/* To change image size, modify aspect ratio below */}
                <div className="w-full aspect-[8/8] overflow-hidden">
                    {feature.image ? (
                      <img src={feature.image} alt={feature.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-white/30">
                        <feature.icon className={`w-16 h-16 ${feature.iconColor}`} />
                      </div>
                    )}
                </div>
                <CardContent className="p-4 md:p-6 text-center flex-1 flex flex-col justify-center">
                  <h3 className="text-sm md:text-base font-bold text-gray-800 mb-1">{feature.title}</h3>
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