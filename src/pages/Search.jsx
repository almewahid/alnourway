import React, { useState } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, BookOpen, Video, MessageSquare, Heart, X } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "الكل", icon: SearchIcon },
    { id: "Lecture", label: "المحاضرات", icon: Video },
    { id: "Book", label: "الكتب", icon: BookOpen },
    { id: "Fatwa", label: "الفتاوى", icon: MessageSquare },
    { id: "Story", label: "القصص", icon: Heart },
  ];

  const { data: results, isLoading } = useQuery({
    queryKey: ['search', activeSearch, selectedCategory],
    queryFn: async () => {
      if (!activeSearch) return [];
      
      const searchResults = [];
      
      if (selectedCategory === "all" || selectedCategory === "Lecture") {
        const { data, error } = await supabase
          .from('Lecture')
          .select('*')
          .or(`title.ilike.%${activeSearch}%,description.ilike.%${activeSearch}%`)
          .limit(10);
        
        if (!error && data) {
          searchResults.push(...data.map(item => ({ ...item, type: 'Lecture' })));
        }
      }

      if (selectedCategory === "all" || selectedCategory === "Book") {
        const { data, error } = await supabase
          .from('Book')
          .select('*')
          .or(`title.ilike.%${activeSearch}%,author.ilike.%${activeSearch}%,description.ilike.%${activeSearch}%`)
          .limit(10);
        
        if (!error && data) {
          searchResults.push(...data.map(item => ({ ...item, type: 'Book' })));
        }
      }

      if (selectedCategory === "all" || selectedCategory === "Fatwa") {
        const { data, error } = await supabase
          .from('Fatwa')
          .select('*')
          .or(`question.ilike.%${activeSearch}%,answer.ilike.%${activeSearch}%`)
          .limit(10);
        
        if (!error && data) {
          searchResults.push(...data.map(item => ({ ...item, type: 'Fatwa' })));
        }
      }

      if (selectedCategory === "all" || selectedCategory === "Story") {
        const { data, error } = await supabase
          .from('Story')
          .select('*')
          .or(`title.ilike.%${activeSearch}%,content.ilike.%${activeSearch}%`)
          .limit(10);
        
        if (!error && data) {
          searchResults.push(...data.map(item => ({ ...item, type: 'Story' })));
        }
      }

      return searchResults;
    },
    enabled: !!activeSearch,
    initialData: [],
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveSearch(searchQuery.trim());
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setActiveSearch("");
  };

  const getTypeLabel = (type) => {
    const category = categories.find(cat => cat.id === type);
    return category?.label || type;
  };

  const getTypeIcon = (type) => {
    const category = categories.find(cat => cat.id === type);
    const Icon = category?.icon || SearchIcon;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <Breadcrumb items={[{ label: "البحث" }]} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            البحث في المحتوى
          </h1>
          <p className="text-base md:text-lg text-white/90">
            ابحث في المحاضرات، الكتب، الفتاوى، والقصص
          </p>
        </motion.div>

        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm rounded-3xl mb-6">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-3 mb-6">
              <div className="relative flex-1">
                <Input
                  placeholder="ابحث عن محاضرة، كتاب، فتوى، أو قصة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 rounded-2xl text-lg py-6"
                />
                <SearchIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 px-8 rounded-2xl text-lg"
              >
                بحث
              </Button>
            </form>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                      selectedCategory === category.id
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{category.label}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {activeSearch && (
          <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm rounded-3xl">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                نتائج البحث عن "{activeSearch}"
              </h2>

              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-4">جاري البحث...</p>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-4">
                  {results.map((item) => (
                    <Link
                      key={`${item.type}-${item.id}`}
                      to={`/${item.type.toLowerCase()}s/${item.id}`}
                      className="block p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1 text-blue-600">
                          {getTypeIcon(item.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                              {getTypeLabel(item.type)}
                            </span>
                          </div>
                          <h3 className="font-bold text-gray-900 mb-1">
                            {item.title || item.question}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {item.description || item.content || item.answer}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">
                    لم يتم العثور على نتائج
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    جرب البحث بكلمات مختلفة أو في فئة أخرى
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {!activeSearch && (
          <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm rounded-3xl">
            <CardContent className="p-12 text-center">
              <SearchIcon className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                ابدأ البحث
              </h3>
              <p className="text-gray-600 text-lg">
                أدخل كلمة البحث للعثور على المحتوى المناسب
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}