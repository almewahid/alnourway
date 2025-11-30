import React, { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Users, Clock, Calendar, Video, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import CourseEnrollmentModal from "../components/CourseEnrollmentModal";

export default function QuranCourses() {
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const { data: { user: userData } } = await supabase.auth.getUser();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const { data: courses, isLoading } = useQuery({
    queryKey: ['quran_courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('QuranCourse')
        .select('*')
        .eq('is_active', true)
        .order('created_date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    initialData: [],
  });

  const filteredCourses = courses.filter(course => {
    const matchesGender = selectedGender === "all" || course.gender === selectedGender;
    const matchesType = selectedType === "all" || course.type === selectedType;
    return matchesGender && matchesType;
  });

  const courseTypes = {
    all: "جميع الدورات",
    memorization: "تحفيظ القرآن",
    recitation: "تلاوة القرآن",
    tajweed: "أحكام التجويد"
  };

  const levelLabels = {
    beginner: "مبتدئ",
    intermediate: "متوسط",
    advanced: "متقدم"
  };

  const handleEnroll = (course) => {
    if (!user) {
      alert("يرجى تسجيل الدخول أولاً");
      return;
    }
    setSelectedCourse(course);
    setShowEnrollModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-100 to-cyan-100 px-6 py-3 rounded-full mb-6">
            <BookOpen className="w-5 h-5 text-teal-600" />
            <span className="text-teal-800 font-semibold">دورات القرآن الكريم</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            تعلم وحفظ القرآن الكريم
          </h1>
          <p className="text-xl text-gray-600">
            دورات متخصصة في التحفيظ والتلاوة والتجويد
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
          <Tabs value={selectedGender} onValueChange={setSelectedGender}>
            <TabsList className="bg-white shadow-lg">
              <TabsTrigger value="all">الكل</TabsTrigger>
              <TabsTrigger value="male">رجال</TabsTrigger>
              <TabsTrigger value="female">نساء</TabsTrigger>
            </TabsList>
          </Tabs>

          <Tabs value={selectedType} onValueChange={setSelectedType}>
            <TabsList className="bg-white shadow-lg">
              {Object.entries(courseTypes).map(([key, label]) => (
                <TabsTrigger key={key} value={key}>{label}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm h-full">
                  <CardHeader className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white rounded-t-xl">
                    <CardTitle className="text-xl">{course.title}</CardTitle>
                    <div className="flex items-center gap-2 text-teal-50 text-sm">
                      <Users className="w-4 h-4" />
                      <span>{course.teacher_name}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <p className="text-gray-600">{course.description}</p>

                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium">
                        {courseTypes[course.type]}
                      </span>
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                        {course.gender === "male" ? "رجال" : course.gender === "female" ? "نساء" : "الكل"}
                      </span>
                      {course.level && (
                        <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
                          {levelLabels[course.level]}
                        </span>
                      )}
                    </div>

                    {course.schedule && (
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>{course.schedule}</span>
                      </div>
                    )}

                    {course.duration && (
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                    )}

                    {course.max_students && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">المقاعد المتاحة:</span>
                        <span className={`font-semibold ${
                          course.current_students >= course.max_students ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {course.max_students - course.current_students} / {course.max_students}
                        </span>
                      </div>
                    )}

                    {course.google_meet_link && (
                      <div className="flex items-center gap-2 text-teal-600 text-sm">
                        <Video className="w-4 h-4" />
                        <span>يتضمن لقاءات أونلاين</span>
                      </div>
                    )}

                    <Button
                      onClick={() => handleEnroll(course)}
                      className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
                      disabled={course.current_students >= course.max_students}
                    >
                      {course.current_students >= course.max_students ? "مكتمل" : "سجل الآن"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                لا توجد دورات متاحة
              </h3>
              <p className="text-gray-600">
                سنضيف المزيد من الدورات قريباً
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {showEnrollModal && (
        <CourseEnrollmentModal
          course={selectedCourse}
          user={user}
          open={showEnrollModal}
          onClose={() => setShowEnrollModal(false)}
        />
      )}
    </div>
  );
}
