import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Headphones, Mail, MessageSquare, Send, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/components/api/supabaseClient";
import { useLanguage } from "@/components/LanguageContext";

export default function Support() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.title = "Support | الدعم الفني - طريق النور";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('ContactRequest').insert({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        request_type: "support",
        status: "معلق"
      });

      if (error) throw error;

      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error('Error submitting support request:', error);
      alert(language === 'ar' ? 'حدث خطأ أثناء الإرسال' : 'Error submitting request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-cyan-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-cyan-100 px-4 py-2 rounded-full mb-4">
            <Headphones className="w-5 h-5 text-cyan-700" />
            <span className="text-cyan-800 font-semibold">{t('support')} / Support</span>
          </div>
        </div>

        {/* Back to Home Button */}
        <button 
          onClick={() => navigate('/')}
          className="inline-flex items-center text-cyan-600 hover:text-cyan-700 mb-6 group"
        >
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
        </button>

        {/* Arabic Section */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-8" dir="rtl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <Headphones className="w-8 h-8 text-cyan-600" />
              <h1 className="text-3xl font-bold text-gray-900">الدعم الفني</h1>
            </div>

            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">تم إرسال رسالتك بنجاح!</h2>
                <p className="text-gray-600 mb-6">سنتواصل معك في أقرب وقت ممكن</p>
                <Button onClick={() => setSubmitted(false)} className="bg-cyan-600 hover:bg-cyan-700">
                  إرسال رسالة أخرى
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  نحن هنا لمساعدتك. إذا كان لديك أي استفسار أو مشكلة، يرجى ملء النموذج أدناه وسنتواصل معك في أقرب وقت ممكن.
                </p>

                <div className="bg-cyan-50 p-6 rounded-xl border border-cyan-100">
                  <h2 className="text-xl font-bold text-cyan-900 mb-3 flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    طرق التواصل
                  </h2>
                  <ul className="space-y-2 text-gray-800">
                    <li className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-cyan-600" />
                      نموذج الدعم أدناه
                    </li>
                    <li className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-cyan-600" />
                      أو عبر صفحة <button onClick={() => navigate('/ContactPreacher')} className="text-cyan-600 hover:text-cyan-700 underline">التواصل</button>
                    </li>
                  </ul>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الاسم</label>
                    <Input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="أدخل اسمك"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                    <Input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="example@email.com"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">رسالتك</label>
                    <Textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="اكتب رسالتك هنا..."
                      className="w-full h-32"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        جاري الإرسال...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        إرسال الرسالة
                      </span>
                    )}
                  </Button>
                </form>
              </div>
            )}
          </CardContent>
        </Card>

        {/* English Section */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-8" dir="ltr">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <Headphones className="w-8 h-8 text-cyan-600" />
              <h1 className="text-3xl font-bold text-gray-900">Technical Support</h1>
            </div>

            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Message sent successfully!</h2>
                <p className="text-gray-600 mb-6">We will contact you as soon as possible</p>
                <Button onClick={() => setSubmitted(false)} className="bg-cyan-600 hover:bg-cyan-700">
                  Send another message
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  We are here to help you. If you have any questions or issues, please fill out the form below and we will get back to you as soon as possible.
                </p>

                <div className="bg-cyan-50 p-6 rounded-xl border border-cyan-100">
                  <h2 className="text-xl font-bold text-cyan-900 mb-3 flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Contact Methods
                  </h2>
                  <ul className="space-y-2 text-gray-800">
                    <li className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-cyan-600" />
                      Support form below
                    </li>
                    <li className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-cyan-600" />
                      Or via the <button onClick={() => navigate('/ContactPreacher')} className="text-cyan-600 hover:text-cyan-700 underline">Contact page</button>
                    </li>
                  </ul>
                </div>

                <p className="text-sm text-gray-600">
                  This support page is available for both web and mobile app users. We strive to respond to all inquiries within 24-48 hours.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Back to Home at Bottom */}
        <div className="text-center mt-8">
          <button 
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-xl hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl"
          >
            <ArrowRight className="w-5 h-5" />
            {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
          </button>
        </div>
      </div>
    </div>
  );
}