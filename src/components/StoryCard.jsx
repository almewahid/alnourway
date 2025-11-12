import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function StoryCard({ story }) {
  const [expanded, setExpanded] = useState(false);
  const [user, setUser] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    loadUser();
  }, []);

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
        item_type: 'story',
        item_id: story.id 
      });
      setIsFavorite(favorites.length > 0);
    } catch (error) {
      console.error("Error checking favorite:", error);
    }
  };

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (isFavorite) {
        const favorites = await base44.entities.Favorite.filter({ 
          user_email: user.email, 
          item_type: 'story',
          item_id: story.id 
        });
        if (favorites[0]) {
          await base44.entities.Favorite.delete(favorites[0].id);
        }
      } else {
        await base44.entities.Favorite.create({
          user_email: user.email,
          item_type: 'story',
          item_id: story.id,
          item_title: story.title,
          item_data: story
        });
      }
    },
    onSuccess: () => {
      setIsFavorite(!isFavorite);
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm h-full">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <CardTitle className="text-xl leading-snug">{story.title}</CardTitle>
            {story.author && (
              <p className="text-gray-600 mt-2">بقلم: {story.author}</p>
            )}
          </div>
          <button
            onClick={() => user && toggleFavoriteMutation.mutate()}
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md transition-all duration-300 ${
              isFavorite 
                ? 'bg-red-500 text-white' 
                : 'bg-gradient-to-br from-amber-400 to-amber-600 text-white hover:scale-110'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {story.country && (
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{story.country}</span>
          </div>
        )}

        {story.category && (
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
            story.category === "convert" 
              ? "bg-blue-50 text-blue-700" 
              : "bg-rose-50 text-rose-700"
          }`}>
            {story.category === "convert" ? "قصة مهتدٍ" : "قصة تائب"}
          </span>
        )}
      </CardHeader>

      <CardContent>
        {story.excerpt && !expanded && (
          <p className="text-gray-700 leading-relaxed mb-4">{story.excerpt}</p>
        )}

        {expanded && (
          <div className="text-gray-700 leading-relaxed mb-4 whitespace-pre-line">
            {story.content}
          </div>
        )}

        <Button
          variant="ghost"
          onClick={() => setExpanded(!expanded)}
          className="w-full text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4 ml-2" />
              عرض أقل
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 ml-2" />
              اقرأ القصة كاملة
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}