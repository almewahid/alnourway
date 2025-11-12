import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Video, Music, Clock, User, Heart, Eye, ThumbsUp, Share2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import ShareButtons from "./ShareButtons";

export default function LectureCard({ lecture, onClick }) {
  const [user, setUser] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [viewsCounted, setViewsCounted] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    // Count view only once per session
    if (!viewsCounted && lecture.id) {
      incrementViews();
      setViewsCounted(true);
    }
  }, [lecture.id]);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
      checkIfFavorite(userData.email);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const checkIfFavorite = async (email) => {
    try {
      const favorites = await base44.entities.Favorite.filter({ 
        user_email: email, 
        item_type: 'lecture',
        item_id: lecture.id 
      });
      setIsFavorite(favorites.length > 0);
    } catch (error) {
      console.error("Error checking favorite:", error);
    }
  };

  const incrementViews = async () => {
    try {
      await base44.entities.Lecture.update(lecture.id, {
        views_count: (lecture.views_count || 0) + 1
      });
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (isFavorite) {
        const favorites = await base44.entities.Favorite.filter({ 
          user_email: user.email, 
          item_type: 'lecture',
          item_id: lecture.id 
        });
        if (favorites[0]) {
          await base44.entities.Favorite.delete(favorites[0].id);
        }
      } else {
        await base44.entities.Favorite.create({
          user_email: user.email,
          item_type: 'lecture',
          item_id: lecture.id,
          item_title: lecture.title,
          item_data: lecture
        });
      }
    },
    onSuccess: () => {
      setIsFavorite(!isFavorite);
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  const categoryLabels = {
    learn_islam: "التعرف على الإسلام",
    repentance: "التوبة",
    general: "عام"
  };

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm h-full group hover:-translate-y-1">
      <CardContent className="p-0">
        {lecture.thumbnail_url ? (
          <div className="relative h-48 overflow-hidden rounded-t-xl">
            <img
              src={lecture.thumbnail_url}
              alt={lecture.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute top-3 left-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  user && toggleFavoriteMutation.mutate();
                }}
                className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                  isFavorite 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white/80 text-gray-700 hover:bg-red-500 hover:text-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>
            <div className="absolute bottom-3 left-3 right-3">
              <div className="flex items-center gap-2 text-white">
                {lecture.type === "video" ? (
                  <Video className="w-5 h-5" />
                ) : (
                  <Music className="w-5 h-5" />
                )}
                <span className="text-sm font-medium">
                  {lecture.type === "video" ? "مرئية" : "صوتية"}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-purple-400 to-purple-600 rounded-t-xl flex items-center justify-center relative">
            <div className="absolute top-3 left-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  user && toggleFavoriteMutation.mutate();
                }}
                className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                  isFavorite 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white/80 text-gray-700 hover:bg-red-500 hover:text-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>
            {lecture.type === "video" ? (
              <Video className="w-16 h-16 text-white/80" />
            ) : (
              <Music className="w-16 h-16 text-white/80" />
            )}
          </div>
        )}

        <div className="p-5 space-y-3">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-snug">
            {lecture.title}
          </h3>

          <div className="flex items-center gap-2 text-gray-600">
            <User className="w-4 h-4" />
            <span className="text-sm font-medium">{lecture.speaker}</span>
          </div>

          {lecture.topic && (
            <p className="text-sm text-gray-600 line-clamp-2">{lecture.topic}</p>
          )}

          {/* إحصائيات */}
          <div className="flex items-center gap-4 text-xs text-gray-500 pt-2">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{lecture.views_count || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4" />
              <span>{lecture.likes_count || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Share2 className="w-4 h-4" />
              <span>{lecture.shares_count || 0}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {lecture.duration && (
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <Clock className="w-4 h-4" />
                <span>{lecture.duration}</span>
              </div>
            )}

            <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
              {categoryLabels[lecture.category] || lecture.category}
            </span>
          </div>

          <div className="flex gap-2 pt-3 border-t">
            {lecture.url && (
              <a
                href={lecture.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
                onClick={(e) => e.stopPropagation()}
              >
                <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-sm">
                  مشاهدة / استماع
                </Button>
              </a>
            )}
            <ShareButtons 
              title={lecture.title}
              description={`محاضرة ${lecture.speaker}`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}