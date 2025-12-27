import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext.jsx";
import { supabase } from "@/components/api/supabaseClient";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Send, Filter, Search, Calendar, User, CheckCircle, Clock, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ProtectedFeature from "@/components/ProtectedFeature";

export default function Fatwa() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // States
  const [fatwas, setFatwas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form states
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("");
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Categories configuration
  const categories = [
    { value: "all", label: "الكل", icon: BookOpen },
    { value: "عبادات", label: "عبادات", icon: Sparkles },
    { value: "معاملات", label: "معاملات", icon: CheckCircle },
    { value: "أحوال شخصية", label: "أحوال شخصية", icon: User },
    { value: "عقيدة", label: "عقيدة", icon: BookOpen },
    { value: "أخلاق", label: "أخلاق و سلوك", icon: CheckCircle },
  ];

  // Fetch fatwas on mount
  useEffect(() => {
    fetchFatwas();
  }, []);

  // Fetch fatwas from database
  const fetchFatwas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('Fatwa')
        .select('*')
        .eq('status', 'published')
        .order('created_date', { ascending: false });
      
      if (error) throw error;
      setFatwas(data || []);
    } catch (error) {
      console.error("Error fetching fatwas:", error);
      console.error("Error details:", error.message, error.details, error.hint);
      toast({
        title: "خطأ",
        description: `حدث خطأ في تحميل الفتاوى: ${error.message || 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !question.trim()) {
      toast({
        title: "تنبيه",
        description: "الرجاء ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('FatwaRequest')
        .insert([{
          name: user?.full_name || user?.email || 'مستخدم',
          email: user?.email,
          question: `${title.trim()}\n\n${question.trim()}`,
          category: category || null,
          status: 'pending',
          created_by: user?.id,
          created_date: new Date().toISOString(),
        }]);

      if (error) throw error;

      toast({
        title: "تم الإرسال بنجاح ✓",
        description: "تم إرسال سؤالك بنجاح، سيتم الرد عليه من قبل علمائنا قريباً إن شاء الله",
      });

      // Reset form
      setTitle("");
      setQuestion("");
      setCategory("");
    } catch (error) {
      console.error("Error submitting question:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في إرسال السؤال، الرجاء المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Filter fatwas based on search and category
  const filteredFatwas = fatwas.filter(fatwa => {
    const matchesSearch = 
      fatwa.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fatwa.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fatwa.answer?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === "all" || fatwa.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12 px-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ==================== HEADER SECTION ==================== */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-900 dark:to-blue-900 p-6 rounded-full shadow-lg">
              <BookOpen className="w-16 h-16 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-400 dark:to-blue-400 bg-clip-text text-transparent">
            الفتاوى الشرعية
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            اطرح سؤالك الشرعي واحصل على إجابة موثوقة من علمائنا المتخصصين
          </p>
        </div>

        {/* ==================== ASK QUESTION FORM (PROTECTED) ==================== */}
        <ProtectedFeature featureName="إرسال الأسئلة الشرعية">
          <Card className="shadow-2xl border-2 border-emerald-200 dark:border-emerald-800 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/30 dark:to-blue-900/30">
              <CardTitle className="flex items-center gap-3 text-2xl text-emerald-700 dark:text-emerald-400">
                <div className="bg-emerald-100 dark:bg-emerald-900 p-2 rounded-lg">
                  <Send className="w-6 h-6" />
                </div>
                اطرح سؤالك الشرعي
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                سيقوم علماؤنا بالإجابة على سؤالك في أقرب وقت ممكن
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              <form onSubmit={handleSubmitQuestion} className="space-y-6">
                
                {/* Title Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    عنوان السؤال <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثال: ما حكم صلاة الجماعة في المسجد؟"
                    className="text-lg py-6 border-2 focus:border-emerald-500 dark:focus:border-emerald-400"
                    required
                  />
                </div>

                {/* Category Select */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    الفئة (اختياري)
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 bg-white dark:bg-slate-900 text-gray-900 dark:text-white transition-colors"
                  >
                    <option value="">اختر الفئة</option>
                    <option value="عبادات">عبادات</option>
                    <option value="معاملات">معاملات</option>
                    <option value="أحوال شخصية">أحوال شخصية</option>
                    <option value="عقيدة">عقيدة</option>
                    <option value="أخلاق">أخلاق و سلوك</option>
                  </select>
                </div>

                {/* Question Textarea */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    السؤال التفصيلي <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="اكتب سؤالك بالتفصيل مع ذكر الملابسات إن وجدت..."
                    rows={8}
                    className="text-lg border-2 focus:border-emerald-500 dark:focus:border-emerald-400 leading-relaxed"
                    required
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    كلما كان سؤالك أكثر تفصيلاً، كانت الإجابة أدق وأوضح
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white text-lg py-7 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      جاري الإرسال...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Send className="w-5 h-5" />
                      إرسال السؤال
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </ProtectedFeature>

        {/* ==================== SEARCH AND FILTER SECTION ==================== */}
        <Card className="shadow-lg">
          <CardContent className="pt-6 space-y-4">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute right-4 top-4 text-gray-400 w-5 h-5" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث في الفتاوى المنشورة..."
                className="pr-12 text-lg py-7 border-2"
              />
            </div>
            
            {/* Category Filter */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <Filter className="w-4 h-4" />
                تصفية حسب الفئة:
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <Badge
                      key={cat.value}
                      variant={selectedCategory === cat.value ? "default" : "outline"}
                      className={`cursor-pointer px-4 py-2 text-sm transition-all duration-200 ${
                        selectedCategory === cat.value
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                          : "hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                      }`}
                      onClick={() => setSelectedCategory(cat.value)}
                    >
                      <Icon className="w-4 h-4 ml-1" />
                      {cat.label}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ==================== FATWAS LIST SECTION ==================== */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              الفتاوى المنشورة ({filteredFatwas.length})
            </h2>
          </div>

          {loading ? (
            // Loading State
            <div className="flex justify-center py-20">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto"></div>
                <p className="text-gray-600 dark:text-gray-400">جاري تحميل الفتاوى...</p>
              </div>
            </div>
          ) : filteredFatwas.length === 0 ? (
            // Empty State
            <Card className="p-12 text-center shadow-lg">
              <BookOpen className="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600 mb-6" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                لا توجد فتاوى
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm || selectedCategory !== "all"
                  ? "لا توجد نتائج مطابقة للبحث"
                  : "لا توجد فتاوى منشورة حالياً"}
              </p>
            </Card>
          ) : (
            // Fatwas Grid
            <div className="grid gap-6">
              {filteredFatwas.map((fatwa) => (
                <Card 
                  key={fatwa.id} 
                  className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-emerald-200 dark:hover:border-emerald-800"
                >
                  {/* Card Header */}
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-emerald-50 dark:from-slate-800 dark:to-emerald-900/20">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 space-y-3">
                        <CardTitle className="text-xl md:text-2xl text-gray-900 dark:text-white leading-relaxed">
                          {fatwa.question.split('\n')[0].substring(0, 100)}{fatwa.question.length > 100 ? '...' : ''}
                        </CardTitle>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(fatwa.created_date).toLocaleDateString('ar-SA', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                          {fatwa.mufti && (
                            <span className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              {fatwa.mufti}
                            </span>
                          )}
                          {fatwa.answer && (
                            <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                              <CheckCircle className="w-3 h-3 ml-1" />
                              تمت الإجابة
                            </Badge>
                          )}
                        </div>
                      </div>
                      {fatwa.category && (
                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 px-4 py-2">
                          {fatwa.category}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  
                  {/* Card Content */}
                  <CardContent className="pt-6 space-y-6">
                    
                    {/* Question Section */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded">
                          <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200">
                          السؤال:
                        </h4>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 leading-loose text-lg pr-10">
                        {fatwa.question}
                      </p>
                    </div>
                    
                    {/* Answer Section (if exists) */}
                    {fatwa.answer && (
                      <div className="bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 p-6 rounded-xl border-r-4 border-emerald-500 dark:border-emerald-400 space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="bg-emerald-100 dark:bg-emerald-900 p-2 rounded">
                            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <h4 className="font-bold text-lg text-emerald-800 dark:text-emerald-300">
                            الجواب:
                          </h4>
                        </div>
                        <p className="text-gray-800 dark:text-gray-200 leading-loose text-lg pr-10">
                          {fatwa.answer}
                        </p>
                        {fatwa.reference && (
                          <div className="pt-3 border-t border-emerald-200 dark:border-emerald-700">
                            <p className="text-sm text-emerald-700 dark:text-emerald-400">
                              <span className="font-semibold">المرجع:</span> {fatwa.reference}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Pending Answer Badge */}
                    {!fatwa.answer && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                          <Clock className="w-5 h-5" />
                          <span className="font-semibold">في انتظار الإجابة من العلماء</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}