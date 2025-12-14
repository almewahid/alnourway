import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Map, BookOpen, Clock, ArrowRight } from "lucide-react";
import { supabase } from "@/components/api/supabaseClient";
import { motion } from "framer-motion";

export default function AILearningPath({ user }) {
  const [loading, setLoading] = useState(false);
  const [learningPath, setLearningPath] = useState(null);

  const generatePath = async () => {
    setLoading(true);
    try {
      // Mock profile context if not full user data
      const context = {
        level: "beginner",
        interests: ["aqeedah", "seerah"],
        goal: "Learn basics of Islam"
      };

      const { data, error } = await supabase.functions.invoke('aiAssistant', {
        body: {
          action: 'generate_learning_path',
          context: context
        }
      });

      if (error) throw error;
      if (!data.steps) throw new Error("لم يتم استلام خطوات المسار");
      setLearningPath(data.steps);
    } catch (error) {
      console.error("Error generating path:", error);
      alert("حدث خطأ أثناء إنشاء المسار: " + (error.message || "خطأ غير معروف"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-50 to-purple-50 overflow-hidden">
      <CardHeader className="bg-white/50 backdrop-blur-sm border-b border-purple-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <CardTitle className="text-purple-900">مسار التعلم الذكي</CardTitle>
          </div>
          {!learningPath && (
            <Button 
              onClick={generatePath} 
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {loading ? "جاري الإنشاء..." : "إنشاء مسار شخصي"}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {!learningPath ? (
          <div className="text-center py-8 text-gray-500">
            <Map className="w-16 h-16 mx-auto mb-4 text-purple-200" />
            <p>اضغط على "إنشاء مسار شخصي" للحصول على خطة تعليمية مخصصة لك بالذكاء الاصطناعي</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">خطتك التعليمية المقترحة:</h3>
              <Button variant="ghost" size="sm" onClick={() => setLearningPath(null)} className="text-gray-500">
                إعادة تعيين
              </Button>
            </div>
            
            <div className="relative border-r-2 border-purple-200 mr-4 space-y-8">
              {learningPath.map((step, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pr-8"
                >
                  <div className="absolute -right-[9px] top-0 w-4 h-4 rounded-full bg-purple-500 border-4 border-purple-100"></div>
                  <Card className="border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-purple-900 text-lg">{step.title}</h4>
                        <div className="flex items-center text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                          <Clock className="w-3 h-3 ml-1" />
                          {step.duration}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{step.description}</p>
                      
                      {step.resources && step.resources.length > 0 && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center">
                            <BookOpen className="w-3 h-3 ml-1" /> المصادر المقترحة:
                          </p>
                          <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
                            {step.resources.map((res, i) => (
                              <li key={i}>{res}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            <div className="flex justify-center pt-4">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                البدء في المسار <ArrowRight className="w-4 h-4 mr-2" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}