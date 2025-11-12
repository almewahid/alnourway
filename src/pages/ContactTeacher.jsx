import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Phone, MessageCircle, Globe, Mail, Video, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import ContactModal from "../components/ContactModal";

export default function ContactTeacher() {
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");

  const { data: teachers, isLoading } = useQuery({
    queryKey: ['teachers'],
    queryFn: () => base44.entities.Scholar.filter({ type: "teacher", is_available: true }),
    initialData: [],
  });

  const languages = ["الكل", ...new Set(teachers.flatMap(t => t.languages || []))];
  
  const filteredTeachers = teachers.filter(t => {
    const matchesLanguage = selectedLanguage === "all" || t.languages?.includes(selectedLanguage);
    const matchesGender = selectedGender === "all" || t.gender === selectedGender;
    return matchesLanguage && matchesGender;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-100 to-cyan-100 px-6 py-3 rounded-full mb-6">
            <BookOpen className="w-5 h-5 text-teal-600" />
            <span className="text-teal-800 font-semibold">تواصل مع محفظ</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            المحفظون المتاحون
          </h1>
          <p className="text-xl text-gray-600">
            تواصل مع محفظين متخصصين في تحفيظ القرآن
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-3 justify-center mb-8">
          <button
            onClick={() => setSelectedGender("all")}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
              selectedGender === "all"
                ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-teal-50"
            }`}
          >
            الكل
          </button>
          <button
            onClick={() => setSelectedGender("male")}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
              selectedGender === "male"
                ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-teal-50"
            }`}
          >
            محفظون
          </button>
          <button
            onClick={() => setSelectedGender("female")}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
              selectedGender === "female"
                ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-teal-50"
            }`}
          >
            محفظات
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          </div>
        ) : filteredTeachers.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredTeachers.map((teacher, index) => (
              <motion.div key={teacher.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm h-full">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                        <BookOpen className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl mb-2">{teacher.name}</CardTitle>
                        {teacher.country && <p className="text-sm text-gray-600">{teacher.country}</p>}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {teacher.bio && <p className="text-gray-600 text-sm leading-relaxed">{teacher.bio}</p>}

                    {teacher.languages && teacher.languages.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-teal-600" />
                        <div className="flex flex-wrap gap-2">
                          {teacher.languages.map((lang, idx) => (
                            <span key={idx} className="px-2 py-1 bg-teal-50 text-teal-700 rounded-full text-xs">
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2 pt-3 border-t">
                      {teacher.phone && (
                        <a href={`tel:${teacher.phone}`} className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700">
                          <Phone className="w-4 h-4" />
                          اتصال تليفوني
                        </a>
                      )}
                      {teacher.whatsapp && (
                        <a href={`https://wa.me/${teacher.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700">
                          <MessageCircle className="w-4 h-4" />
                          واتساب
                        </a>
                      )}
                      {teacher.email && (
                        <a href={`mailto:${teacher.email}`} className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700">
                          <Mail className="w-4 h-4" />
                          بريد إلكتروني
                        </a>
                      )}
                      {teacher.google_meet_link && (
                        <a href={teacher.google_meet_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700">
                          <Video className="w-4 h-4" />
                          Google Meet
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm mb-12">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                لا يوجد محفظون متاحون حالياً
              </h3>
              <p className="text-gray-600">
                يمكنك إرسال طلب وسنتواصل معك قريباً
              </p>
            </CardContent>
          </Card>
        )}

        <Card className="border-0 shadow-2xl bg-gradient-to-br from-teal-500 to-teal-600 text-white">
          <CardContent className="p-8 text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-amber-300" />
            <h2 className="text-2xl font-bold mb-3">لم تجد ما تبحث عنه؟</h2>
            <p className="text-teal-50 mb-6">
              أرسل لنا طلبك وسنساعدك في إيجاد المحفظ المناسب
            </p>
            <button
              onClick={() => setShowContactModal(true)}
              className="bg-white text-teal-600 px-8 py-3 rounded-xl font-bold hover:bg-teal-50 transition-all duration-300 shadow-lg"
            >
              إرسال طلب تواصل
            </button>
          </CardContent>
        </Card>
      </div>

      <ContactModal
        open={showContactModal}
        onClose={() => setShowContactModal(false)}
        requestType="تحفيظ القرآن"
      />
    </div>
  );
}