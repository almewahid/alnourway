import React, { useState } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, AlertCircle, Loader2, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function FatwaRequestModal({ open, onClose }) {
  const queryClient = useQueryClient();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    question: "",
    category: ""
  });
  const [errors, setErrors] = useState({});

  // ✅ 1. Validation محسّن
  const validateForm = () => {
    const newErrors = {};

    // التحقق من الاسم
    if (!formData.name.trim()) {
      newErrors.name = "الاسم مطلوب";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "الاسم يجب أن يكون 3 أحرف على الأقل";
    }

    // التحقق من البريد الإلكتروني
    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صحيح";
    }

    // التحقق من السؤال
    if (!formData.question.trim()) {
      newErrors.question = "السؤال مطلوب";
    } else if (formData.question.trim().length < 20) {
      newErrors.question = "السؤال يجب أن يكون 20 حرفاً على الأقل";
    } else if (formData.question.trim().length > 1000) {
      newErrors.question = "السؤال يجب أن لا يتجاوز 1000 حرف";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ 2. Mutation مع error handling محسّن
  const createRequestMutation = useMutation({
    mutationFn: async (data) => {
      const { data: result, error } = await supabase
        .from('FatwaRequest')
        .insert([{
          name: data.name.trim(),
          email: data.email.trim().toLowerCase(),
          question: data.question.trim(),
          category: data.category.trim() || null,
        }])
        .select();
      
      if (error) {
        console.error("Supabase error:", error);
        throw new Error(error.message || "حدث خطأ أثناء الإرسال");
      }
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fatwa_requests'] });
      setSubmitted(true);
      
      // إعادة تعيين النموذج بعد 2.5 ثانية
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setFormData({
          name: "",
          email: "",
          question: "",
          category: ""
        });
        setErrors({});
      }, 2500);
    },
    onError: (error) => {
      console.error("Fatwa request error:", error);
    }
  });

  // ✅ 3. AI Refinement محسّن
  const [isRefining, setIsRefining] = useState(false);
  const [refinedQuestion, setRefinedQuestion] = useState("");
  const [refineError, setRefineError] = useState("");

  const handleRefine = async () => {
    if (!formData.question || formData.question.length < 10) {
      setRefineError("اكتب سؤالك أولاً (10 أحرف على الأقل)");
      return;
    }
    
    setIsRefining(true);
    setRefineError("");
    
    try {
      const { data, error } = await supabase.functions.invoke('aiAssistant', {
        body: {
          action: 'refine_question',
          text: formData.question
        }
      });
      
      if (error) throw error;

      if (data && data.refined_text) {
        setRefinedQuestion(data.refined_text);
      } else {
        setRefineError("لم نتمكن من تحسين السؤال، حاول مرة أخرى");
      }
    } catch (e) {
      console.error("AI refine error:", e);
      setRefineError("حدث خطأ أثناء التحسين، حاول مرة أخرى");
    } finally {
      setIsRefining(false);
    }
  };

  const useRefined = () => {
    setFormData({ ...formData, question: refinedQuestion });
    setRefinedQuestion("");
    setRefineError("");
  };

  // ✅ 4. Form submission مع validation
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // التحقق من صحة البيانات
    if (!validateForm()) {
      return;
    }
    
    // إرسال البيانات
    createRequestMutation.mutate(formData);
  };

  // ✅ 5. تنظيف الأخطاء عند الكتابة
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    
    // إزالة الخطأ عند الكتابة
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {submitted ? (
          // ✅ شاشة النجاح المحسّنة
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              تم إرسال السؤال بنجاح! 🎉
            </h3>
            <p className="text-gray-600 leading-relaxed">
              تم استقبال رسالتكم وسيتم الرد عليها في أقرب وقت ممكن.<br />
              سنرسل الإجابة إلى بريدك الإلكتروني.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl text-center">
                إرسال سؤال شرعي
              </DialogTitle>
              <DialogDescription className="text-center text-sm text-gray-600">
                اطرح سؤالك بوضوح وسيتم الرد عليك في أقرب وقت
              </DialogDescription>
            </DialogHeader>

            {/* ✅ رسالة خطأ عامة */}
            {createRequestMutation.isError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {createRequestMutation.error?.message || 
                   "عذراً، حدث خطأ أثناء إرسال السؤال. يرجى المحاولة مرة أخرى."}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* الاسم */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  الاسم <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="أدخل اسمك الكامل"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* البريد الإلكتروني */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  البريد الإلكتروني <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="example@email.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* التصنيف */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">
                  التصنيف
                </Label>
                <Input
                  id="category"
                  placeholder="مثال: العبادات، المعاملات، الأحوال الشخصية..."
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                />
              </div>

              {/* السؤال */}
              <div className="space-y-2">
                <Label htmlFor="question" className="text-sm font-medium">
                  سؤالك الشرعي <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="question"
                  value={formData.question}
                  onChange={(e) => handleInputChange('question', e.target.value)}
                  placeholder="اكتب سؤالك بوضوح وتفصيل... (20-1000 حرف)"
                  rows={5}
                  className={errors.question ? "border-red-500" : ""}
                />
                
                {/* عداد الأحرف */}
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {formData.question.length} / 1000 حرف
                  </span>
                  
                  {/* زر التحسين بالذكاء الاصطناعي */}
                  <button 
                    type="button"
                    onClick={handleRefine}
                    disabled={isRefining || !formData.question || formData.question.length < 10}
                    className="text-xs text-purple-600 hover:text-purple-700 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
                  >
                    {isRefining ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3" />
                    )}
                    {isRefining ? "جاري التحسين..." : "تحسين الصياغة بالذكاء الاصطناعي"}
                  </button>
                </div>

                {errors.question && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.question}
                  </p>
                )}

                {/* رسالة خطأ التحسين */}
                {refineError && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-3 w-3" />
                    <AlertDescription className="text-xs">
                      {refineError}
                    </AlertDescription>
                  </Alert>
                )}
                
                {/* الاقتراح المحسن */}
                {refinedQuestion && (
                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <p className="text-sm text-purple-900 font-medium">
                        الاقتراح المحسن:
                      </p>
                    </div>
                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                      {refinedQuestion}
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        type="button" 
                        size="sm" 
                        variant="outline" 
                        onClick={() => {
                          setRefinedQuestion("");
                          setRefineError("");
                        }}
                        className="text-xs"
                      >
                        تجاهل
                      </Button>
                      <Button 
                        type="button" 
                        size="sm" 
                        onClick={useRefined} 
                        className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
                      >
                        استخدام هذا النص
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* زر الإرسال */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium py-6"
                disabled={createRequestMutation.isPending}
              >
                {createRequestMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    إرسال السؤال
                  </>
                )}
              </Button>

              {/* ملاحظة */}
              <p className="text-xs text-center text-gray-500">
                بإرسالك لهذا السؤال، فإنك توافق على سياسة الخصوصية الخاصة بنا
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}