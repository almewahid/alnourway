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
      
      if (item) {
        // تحديث سجل موجود
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

        // إرسال إشعار تلقائي عند الإجابة على فتوى
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
        // إضافة سجل جديد
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
    console.log('📝 إرسال النموذج:', formData);
    saveMutation.mutate(formData);
  };

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item ? 'تعديل' : 'إضافة جديد'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.key}>
              <Label htmlFor={field.key}>
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </Label>
              
              {field.type === 'textarea' ? (
                <Textarea
                  id={field.key}
                  value={formData[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  required={field.required}
                  rows={4}
                  className="mt-2"
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
                  <SelectTrigger className="mt-2">
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
                  className="mt-2"
                />
              )}
            </div>
          ))}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? 'جارٍ الحفظ...' : 'حفظ'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}