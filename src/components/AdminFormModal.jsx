import React, { useState, useEffect } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import YouTubeAutoFill from "./YouTubeAutoFill";

export default function AdminFormModal({ entity, fields, item, open, onClose }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      const defaultData = {};
      fields.forEach(field => {
        defaultData[field.key] = '';
      });
      setFormData(defaultData);
    }
  }, [item, fields]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      console.log('💾 محاولة حفظ البيانات:', { entity, isEdit: !!item, data });
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('انتهت مهلة الطلب (timeout) - يرجى المحاولة مرة أخرى')), 10000);
      });
      
      const savePromise = (async () => {
        if (item) {
          const { data: result, error } = await supabase
            .from(entity)
            .update(data)
            .eq('id', item.id)
            .select();
          
          if (error) {
            console.error('❌ خطأ في التحديث:', error);
            throw error;
          }
          console.log('✅ تم التحديث بنجاح:', result);

          if (entity === 'FatwaRequest' && data.status === 'answered' && data.answer && item.email) {
             const { error: notifError } = await supabase
               .from('Notification')
               .insert({
                  user_email: item.email,
                  title: "تمت الإجابة على سؤالك",
                  message: "أجاب أحد العلماء على سؤالك: " + item.question.substring(0, 30) + "...",
                  type: "fatwa_answer",
                  is_read: false,
                  link: `/Fatwa`
               })
               .select();
             
             if (notifError) {
               console.error('❌ خطأ في إرسال الإشعار:', notifError);
             } else {
               console.log('✅ تم إرسال الإشعار');
             }
          }

        } else {
          const { data: result, error } = await supabase
            .from(entity)
            .insert(data)
            .select();
          
          if (error) {
            console.error('❌ خطأ في الإدراج:', error);
            throw error;
          }
          console.log('✅ تم الإدراج بنجاح:', result);
        }
      })();
      
      return Promise.race([savePromise, timeoutPromise]);
    },
    onSuccess: () => {
      console.log('✅ العملية اكتملت بنجاح!');
      queryClient.invalidateQueries({ queryKey: [entity] });
      alert('✅ تم الحفظ بنجاح!');
      onClose();
    },
    onError: (error) => {
      console.error("❌ خطأ في الحفظ:", error);
      alert(
        "حدث خطأ أثناء الحفظ:\n\n" + 
        (error.message || "خطأ غير معروف") + 
        "\n\nتحقق من Console للمزيد من التفاصيل (اضغط F12)"
      );
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // تنظيف البيانات: إرسال الحقول الموجودة في fields فقط
    const cleanedData = {};
    
    fields.forEach(field => {
      const value = formData[field.key];
      
      // إذا كان الحقل number وقيمته فارغة، نضع null
      if (field.type === 'number' && value === '') {
        cleanedData[field.key] = null;
      }
      // إذا كان الحقل text/textarea وقيمته فارغة وليس required
      else if (value === '' && !field.required) {
        cleanedData[field.key] = null;
      }
      // إذا كان الحقل له قيمة
      else if (value !== undefined && value !== '') {
        cleanedData[field.key] = value;
      }
    });
    
    console.log('📤 إرسال النموذج:', cleanedData);
    saveMutation.mutate(cleanedData);
  };

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto dark:bg-slate-800 dark:text-white dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold dark:text-white">
            {item ? 'تعديل' : 'إضافة جديد'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {entity === "Lecture" && !item && (
            <YouTubeAutoFill
              onDataFetched={(data) => {
                setFormData({
                  ...formData,
                  title: data.title || '',
                  speaker: data.speaker || '',
                  description: data.description || '',
                  url: data.url || '',
                  type: data.type || 'video',
                  category: data.category || 'general',
                  topic: data.topic || '',
                  duration: data.duration || '',
                  thumbnail_url: data.thumbnail_url || '',
                });
              }}
            />
          )}

          {fields.map((field) => (
            <div key={field.key}>
              <Label htmlFor={field.key} className="dark:text-gray-200 font-medium">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </Label>
              
              {field.type === 'textarea' ? (
                <Textarea
                  id={field.key}
                  value={formData[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  required={field.required}
                  rows={4}
                  className="mt-2 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                />
              ) : field.type === 'select' ? (
                <Select
                  value={String(formData[field.key] || '')}
                  onValueChange={(value) => {
                    const parsedValue = value === 'true' ? true : value === 'false' ? false : value;
                    handleChange(field.key, parsedValue);
                  }}
                  required={field.required}
                >
                  <SelectTrigger className="mt-2 dark:bg-slate-900 dark:border-slate-700 dark:text-white">
                    <SelectValue placeholder={`اختر ${field.label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={String(option.value)}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={field.key}
                  type={field.type || 'text'}
                  value={formData[field.key] || ''}
                  onChange={(e) => {
                    const value = field.type === 'number' ? Number(e.target.value) : e.target.value;
                    handleChange(field.key, value);
                  }}
                  required={field.required}
                  className="mt-2 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                />
              )}
            </div>
          ))}

          <div className="flex justify-end gap-3 pt-4 border-t dark:border-slate-700">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="dark:border-slate-600 dark:text-white dark:hover:bg-slate-700"
            >
              إلغاء
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? (
                <>
                  <div className="w-4 h-4 ml-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                'حفظ'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}