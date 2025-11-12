
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react"; // Removed ArrowRight, Download, Heart
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

// New imports
import CommentsSection from "../components/CommentsSection";
import RatingWidget from "../components/RatingWidget";
import ShareButtons from "../components/ShareButtons";

export default function BookReader() {
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get('id');

  const [fontSize, setFontSize] = useState(parseInt(localStorage.getItem('readerFontSize') || '18'));

  const { data: book, isLoading } = useQuery({
    queryKey: ['book', bookId],
    queryFn: async () => {
      const books = await base44.entities.Book.filter({ id: bookId });
      return books[0];
    },
    enabled: !!bookId,
  });

  const handleFontSizeChange = (change) => {
    const newSize = fontSize + change;
    if (newSize >= 14 && newSize <= 28) {
      setFontSize(newSize);
      localStorage.setItem('readerFontSize', newSize.toString());
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">الكتاب غير موجود</h2>
            <Link to={createPageUrl("Library")}>
              <Button className="mt-4">العودة إلى المكتبة</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        {/* Removed motion.div wrapper */}
        <div className="flex items-center justify-between mb-6">
          <Link to={createPageUrl("Library")}>
            <Button variant="outline">
              ← العودة للمكتبة
            </Button>
          </Link>

          <ShareButtons
            title={book.title}
            description={`كتاب ${book.author}`}
          />
        </div>

        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8 md:p-12">
            <div className="mb-8 pb-6 border-b">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{book.title}</h1>
              <p className="text-xl text-gray-600 mb-2">{book.author}</p>
              {book.pages && <p className="text-sm text-gray-500">{book.pages} صفحة</p>}
            </div>

            <div
              className="prose prose-lg max-w-none leading-relaxed text-gray-800"
              style={{ fontSize: `${fontSize}px`, lineHeight: '2' }}
            >
              {book.content ? (
                <div className="whitespace-pre-wrap">{book.content}</div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>المحتوى غير متاح للقراءة المباشرة</p>
                  {book.pdf_url && (
                    <p className="mt-4">يمكنك تحميل الكتاب بصيغة PDF</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-12 space-y-6">
          <RatingWidget
            contentType="book"
            contentId={book.id}
          />

          <CommentsSection
            contentType="book"
            contentId={book.id}
            contentTitle={book.title}
          />
        </div>
      </div>
    </div>
  );
}
