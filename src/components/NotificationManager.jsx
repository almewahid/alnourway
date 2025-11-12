import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Bell } from "lucide-react";

export default function NotificationManager() {
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    loadUser();
    checkScheduledMeetings();
    checkLiveStreams();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
      requestNotificationPermission();
    } catch (error) {
      console.log("User not logged in");
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  const createNotificationMutation = useMutation({
    mutationFn: (data) => base44.entities.Notification.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const sendNotification = (title, message, link, icon = 'general') => {
    if (!user) return;

    // إنشاء إشعار في قاعدة البيانات
    createNotificationMutation.mutate({
      user_email: user.email,
      title,
      message,
      type: icon,
      link,
      icon
    });

    // إشعار المتصفح
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/render/image/public/base44-prod/public/68ecdfbb3578091a5f1e1c54/3f7f97347_android-chrome-192x192.png',
        badge: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/render/image/public/base44-prod/public/68ecdfbb3578091a5f1e1c54/3f7f97347_android-chrome-192x192.png',
        dir: 'rtl',
        lang: 'ar'
      });
    }

    // toast notification
    toast.success(title, {
      description: message,
      icon: <Bell className="w-4 h-4" />
    });
  };

  const checkScheduledMeetings = async () => {
    try {
      const now = new Date();
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

      // فحص البثوث المباشرة القادمة
      const liveStreams = await base44.entities.LiveStream.filter({
        is_live: false,
        notification_sent: false
      });

      liveStreams.forEach(stream => {
        const scheduledTime = new Date(stream.scheduled_time);
        if (scheduledTime <= oneHourFromNow && scheduledTime > now) {
          sendNotification(
            '🔴 بث مباشر قريباً',
            `${stream.title} - ${stream.speaker} سيبدأ خلال ساعة`,
            `/LiveStreams?id=${stream.id}`,
            'live_stream'
          );
          
          // تحديث لتجنب إرسال الإشعار مرة أخرى
          base44.entities.LiveStream.update(stream.id, { notification_sent: true });
        }
      });

      // فحص دورات القرآن
      const courses = await base44.entities.QuranCourse.filter({ is_active: true });
      // يمكن إضافة منطق مشابه للدورات
    } catch (error) {
      console.error('Error checking meetings:', error);
    }
  };

  const checkLiveStreams = async () => {
    try {
      const liveStreams = await base44.entities.LiveStream.filter({ is_live: true });
      
      if (liveStreams.length > 0) {
        liveStreams.forEach(stream => {
          sendNotification(
            '🔴 بث مباشر الآن',
            `${stream.title} - انضم الآن`,
            `/LiveStreams?id=${stream.id}`,
            'live_stream'
          );
        });
      }
    } catch (error) {
      console.error('Error checking live streams:', error);
    }
  };

  // فحص دوري كل 5 دقائق
  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        checkScheduledMeetings();
        checkLiveStreams();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user]);

  return null; // هذا مكون خلفي لا يعرض شيئاً
}