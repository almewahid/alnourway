import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function BulkUploadModal({ open, onClose, entityType }) {
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setResults(null);

    try {
      // رفع الملف
      const { file_url } = await base44.integrations.Core.UploadFile({ file });

      // استخراج البيانات
      const schema = await base44.entities[entityType].schema();
      const extractResult = await base44.integrations.Core.ExtractDataFromUploadedFile({
        file_url,
        json_schema: {
          type: "object",
          properties: {
            items: {
              type: "array",
              items: schema
            }
          }
        }
      });

      if (extractResult.status === "success" && extractResult.output?.items) {
        // إدراج البيانات
        const items = extractResult.output.items;
        await base44.entities[entityType].bulkCreate(items);
        
        setResults({
          success: true,
          count: items.length
        });

        // تحديث بعد 2 ثانية وإغلاق
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setError(extractResult.details || "فشل استخراج البيانات");
      }
    } catch (err) {
      setError(err.message || "حدث خطأ أثناء الرفع");
    } finally {
      setUploading(false);
    }
  };

  const getEntityName = () => {
    const names = {
      Lecture: "المحاضرات",
      Book: "الكتب",
      Story: "القصص",
      Fatwa: "الفتاوى"
    };
    return names[entityType] || entityType;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>رفع {getEntityName()} بشكل جماعي</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Alert>
            <FileText className="w-4 h-4" />
            <AlertDescription>
              قم برفع ملف CSV أو Excel يحتوي على البيانات. يجب أن يحتوي الملف على أعمدة تطابق حقول {getEntityName()}.
            </AlertDescription>
          </Alert>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-emerald-500 transition-colors">
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <label htmlFor="bulk-upload" className="cursor-pointer">
              <p className="text-lg font-semibold text-gray-700 mb-2">
                اضغط لاختيار ملف
              </p>
              <p className="text-sm text-gray-500">
                CSV, Excel (.xlsx, .xls)
              </p>
              <input
                id="bulk-upload"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>

          {uploading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-gray-600">جاري الرفع والمعالجة...</p>
            </div>
          )}

          {results?.success && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <AlertDescription className="text-green-800">
                تم رفع {results.count} عنصر بنجاح! سيتم تحديث الصفحة...
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">نصائح:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• تأكد من أن أسماء الأعمدة تطابق الحقول المطلوبة</li>
              <li>• املأ جميع الحقول المطلوبة</li>
              <li>• استخدم التنسيق الصحيح للبيانات</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}