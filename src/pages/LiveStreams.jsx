import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext.jsx";
import { supabase } from "@/components/api/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, Calendar, Users, Clock, Play, Radio } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import CreateStreamModal from "@/components/CreateStreamModal";

export default function LiveStreams() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const { data: streams, isLoading } = useQuery({
    queryKey: ['live_streams'],
    queryFn: async () => {
      const { data, error } = await supabase.from('LiveStream').select('*').order('scheduled_time', { ascending: false });
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  const now = new Date();
  const liveStreams = streams.filter(s => s.is_live);
  const upcomingStreams = streams.filter(s => !s.is_live && new Date(s.scheduled_time) > now);
  const pastStreams = streams.filter(s => !s.is_live && new Date(s.scheduled_time) <= now && s.recording_url);

  const filteredStreams = filter === "live" ? liveStreams 
    : filter === "upcoming" ? upcomingStreams 
    : filter === "past" ? pastStreams 
    : streams;

  const getCategoryLabel = (category) => {
    const labels = {
      lecture: t("محاضرة"),
      quran_class: t("درس قرآن"),
      qa_session: t("جلسة أسئلة وأجوبة"),
      special_event: t("حدث خاص")
    };
    return labels[category] || category;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-6 py-3 rounded-full mb-6">
            <Radio className="w-5 h-5 text-purple-600" />
            <span className="text-purple-800 font-semibold">{t('البث المباشر')}</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">{t('المحاضرات والدروس المباشرة')}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6 transition-colors duration-300">{t('شاهد البث المباشر للمحاضرات والدروس الإسلامية')}</p>
          
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
          >
            <Video className="w-4 h-4" />{t('جدولة بث جديد')}</Button>
        </motion.div>

        {/* إحصائيات سريعة */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardContent className="p-6 text-center">
              <Radio className="w-12 h-12 mx-auto mb-3 animate-pulse" />
              <div className="text-3xl font-bold mb-1">{liveStreams.length}</div>
              <div className="text-red-100">{t('على الهواء الآن')}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-3" />
              <div className="text-3xl font-bold mb-1">{upcomingStreams.length}</div>
              <div className="text-blue-100">{t('قادمة')}</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6 text-center">
              <Video className="w-12 h-12 mx-auto mb-3" />
              <div className="text-3xl font-bold mb-1">{pastStreams.length}</div>
              <div className="text-purple-100">{t('التسجيلات')}</div>
            </CardContent>
          </Card>
        </div>

        {/* الفلاتر */}
        <div className="flex justify-center mb-8">
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList className="bg-white dark:bg-slate-800 shadow-lg transition-colors duration-300">
              <TabsTrigger value="all">{t('الكل')}</TabsTrigger>
              <TabsTrigger value="live" className="text-red-600">
                <Radio className="w-4 h-4 ml-1 animate-pulse" />{t('مباشر')}</TabsTrigger>
              <TabsTrigger value="upcoming">{t('قادم')}</TabsTrigger>
              <TabsTrigger value="past">{t('التسجيلات')}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* قائمة البث */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          </div>
        ) : filteredStreams.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStreams.map((stream, index) => (
              <motion.div
                key={stream.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800/90 backdrop-blur-sm h-full transition-colors duration-300">
                  {stream.is_live && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="bg-red-600 text-white animate-pulse">
                        <Radio className="w-3 h-3 ml-1" />{t('مباشر الآن')}</Badge>
                    </div>
                  )}

                  {stream.thumbnail_url ? (
                    <div className="relative h-48 overflow-hidden rounded-t-xl">
                      <img
                        src={stream.thumbnail_url}
                        alt={stream.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-purple-400 to-purple-600 rounded-t-xl flex items-center justify-center">
                      <Video className="w-16 h-16 text-white/80" />
                    </div>
                  )}

                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{getCategoryLabel(stream.category)}</Badge>
                      {stream.viewers_count > 0 && (
                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm transition-colors duration-300">
                          <Users className="w-4 h-4" />
                          {stream.viewers_count}
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-xl leading-snug">{stream.title}</CardTitle>
                    <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">{stream.speaker}</p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {stream.description && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 transition-colors duration-300">{stream.description}</p>
                    )}

                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm transition-colors duration-300">
                      <Clock className="w-4 h-4" />
                      {new Date(stream.scheduled_time).toLocaleString('ar-SA', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </div>

                    {stream.stream_url && (
                      <Link 
                        to={createPageUrl("LiveStreamWatch") + `?id=${stream.id}`}
                        className="block"
                      >
                        <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                          <Play className="w-5 h-5 ml-2" />
                          {stream.is_live ? "انضم للبث المباشر" : stream.recording_url ? "شاهد التسجيل" : "تفاصيل البث"}
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-lg bg-white dark:bg-slate-800/90 backdrop-blur-sm transition-colors duration-300">
            <CardContent className="p-12 text-center">
              <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">{t('لا توجد بثوث حالياً')}</h3>
              <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                {filter === "live" && "لا يوجد بث مباشر الآن"}
                {filter === "upcoming" && "لا توجد بثوث قادمة"}
                {filter === "past" && "لا توجد تسجيلات متاحة"}
                {filter === "all" && "لا توجد بثوث متاحة"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
      <CreateStreamModal 
        open={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
        user={user}
      />
    </div>
  );
}