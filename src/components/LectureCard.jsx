import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Video, Music, Clock, User, Heart, Eye, ThumbsUp, Share2, Play } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import ShareButtons from "./ShareButtons";
import VideoPlayer from "./VideoPlayer";

export default function LectureCard({ lecture, onClick, isDetailView = false }) {
  const [user, setUser] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [viewsCounted, setViewsCounted] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (!viewsCounted && lecture.id && isDetailView) {
      incrementViews();
      setViewsCounted(true);
    }
  }, [lecture.id, isDetailView]);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
      checkIfFavorite(userData.email);
    } catch (error) {
      console.log("User not logged in");
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
      console.log("Error checking favorite");
    }
  };

  const incrementViews = async () => {
    try {
      await base44.entities.Lecture.update(lecture.id, {
        views_count: (lecture.views_count || 0) + 1
      });
    } catch (error) {
      console.log("Error incrementing views");
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

  if (isDetailView) {
    return (
      <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm rounded-3xl overflow-hidden">
        <CardContent className="p-4 md:p-8 space-y-6">
          {lecture.url && <VideoPlayer url={lecture.url} title={lecture.title} />}

          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{lecture.title}</h2>
              <button
                onClick={() => user && toggleFavoriteMutation.mutate()}
                className={`p-3 rounded-full transition-all duration-300 flex-shrink-0 ${
                  isFavorite 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-red-500 hover:text-white'
                }`}
              >
                <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="flex items-center gap-3 text-gray-600">
              <User className="w-5 h-5" />
              <span className="font-semibold text-lg">{lecture.speaker}</span>
            </div>

            {lecture.topic && (
              <p className="text-gray-700 leading-relaxed">{lecture.topic}</p>
            )}

            <div className="flex flex-wrap items-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                <span>{lecture.views_count || 0} مشاهدة</span>
              </div>
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-5 h-5" />
                <span>{lecture.likes_count || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                <span>{lecture.shares_count || 0}</span>
              </div>
              {lecture.duration && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{lecture.duration}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-medium">
                {categoryLabels[lecture.category] || lecture.category}
              </span>
              {lecture.type && (
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium flex items-center gap-2">
                  {lecture.type === "video" ? <Video className="w-4 h-4" /> : <Music className="w-4 h-4" />}
                  {lecture.type === "video" ? "مرئية" : "صوتية"}
                </span>
              )}
            </div>

            <ShareButtons 
              title={lecture.title}
              description={`محاضرة ${lecture.speaker}`}
              url={window.location.href}
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm h-full group hover:-translate-y-1 overflow-hidden">
      <CardContent className="p-0">
        {lecture.thumbnail_url ? (
          <div className="relative h-48 overflow-hidden">
            <img
              src={lecture.thumbnail_url}
              alt={lecture.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                <Play className="w-8 h-8 text-purple-600 mr-1" />
              </div>
            </div>
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
          <div className="h-48 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center relative">
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

        <div className="p-4 md:p-5 space-y-3">
          <h3 className="text-base md:text-lg font-bold text-gray-900 line-clamp-2 leading-snug">
            {lecture.title}
          </h3>

          <div className="flex items-center gap-2 text-gray-600">
            <User className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-medium truncate">{lecture.speaker}</span>
          </div>

          {lecture.topic && (
            <p className="text-sm text-gray-600 line-clamp-2">{lecture.topic}</p>
          )}

          <div className="flex items-center gap-3 md:gap-4 text-xs text-gray-500 pt-2">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{lecture.views_count || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4" />
              <span>{lecture.likes_count || 0}</span>
            </div>
            {lecture.duration && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{lecture.duration}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 flex-wrap gap-2">
            <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
              {categoryLabels[lecture.category] || lecture.category}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}