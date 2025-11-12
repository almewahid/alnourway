import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, Download, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Library() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: books, isLoading } = useQuery({
    queryKey: ['books'],
    queryFn: () => base44.entities.Book.list("-created_date"),
    initialData: [],
  });

  const categories = [
    { value: "all", label: "الكل" },
    { value: "hadith", label: "الحديث" },
    { value: "tafsir", label: "التفسير" },
    { value: "fiqh", label: "الفقه" },
    { value: "azkar", label: "الأذكار" },
    { value: "seerah", label: "السيرة" },
    { value: "general", label: "عام" },
  ];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title?.includes(searchQuery) || book.author?.includes(searchQuery);
    const matchesCategory = selectedCategory === "all" || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">المكتبة الإسلامية</h1>
          <p className="text-xl text-gray-600">مجموعة من الكتب والمراجع الإسلامية</p>
        </motion.div>

        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <Input placeholder="ابحث عن كتاب..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="text-lg py-6 pr-12" />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                selectedCategory === cat.value
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-blue-50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : filteredBooks.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book, index) => (
              <motion.div key={book.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-md">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{book.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{book.author}</p>
                    <p className="text-gray-500 text-sm mb-4 leading-relaxed">{book.description}</p>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <span className="text-sm text-gray-500">{book.pages} صفحة</span>
                      <div className="flex gap-2">
                        {book.content && (
                          <Link to={createPageUrl(`BookReader?id=${book.id}`)}>
                            <Button size="sm" variant="outline" className="text-blue-600 hover:text-blue-700">
                              <Eye className="w-4 h-4 ml-1" />
                              قراءة
                            </Button>
                          </Link>
                        )}
                        {book.pdf_url && (
                          <a href={book.pdf_url} download target="_blank" rel="noopener noreferrer">
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              <Download className="w-4 h-4 ml-1" />
                              تحميل
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">لا توجد كتب</h3>
              <p className="text-gray-600">{searchQuery ? "لم نجد نتائج لبحثك" : "لا توجد كتب متاحة حالياً"}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}