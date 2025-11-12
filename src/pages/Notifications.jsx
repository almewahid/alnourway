import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle, Trash2, Video, BookOpen, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Notifications() {
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (error) {
      console.log("User not logged in");
    }
  };

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications', user?.email],
    queryFn: () => user ? base44.entities.Notification.filter({ user_email: user.email }) : [],
    enabled: !!user,
    initialData: [],
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id) => base44.entities.Notification.update(id, { is_read: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (id) => base44.entities.Notification.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const unreadNotifications = notifications.filter(n => !n.is_read);
      await Promise.all(
        unreadNotifications.map(n => base44.entities.Notification.update(n.id, { is_read: true }))
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const deleteAllMutation = useMutation({
    mutationFn: async () => {
      await Promise.all(
        notifications.map(n => base44.entities.Notification.delete(n.id))
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const getIcon = (type) => {
    switch(type) {
      case 'live_stream': return Video;
      case 'new_content': return BookOpen;
      case 'comment_reply': return MessageCircle;
      default: return Bell;
    }
  };

  const sortedNotifications = [...notifications].sort((a, b) => 
    new Date(b.created_date) - new Date(a.created_date)
  );

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Bell className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            الإشعارات
          </h1>
          <p className="text-xl text-gray-600">
            {unreadCount > 0 ? `لديك ${unreadCount} إشعار جديد` : 'لا توجد إشعارات جديدة'}
          </p>
        </motion.div>

        {!user ? (
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                يرجى تسجيل الدخول
              </h3>
              <p className="text-gray-600">
                سجل الدخول لعرض إشعاراتك
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {notifications.length > 0 && (
              <div className="flex gap-3 justify-end mb-6">
                {unreadCount > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => markAllAsReadMutation.mutate()}
                    disabled={markAllAsReadMutation.isPending}
                  >
                    <CheckCircle className="w-4 h-4 ml-2" />
                    تحديد الكل كمقروء
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    if (confirm('هل أنت متأكد من حذف جميع الإشعارات؟')) {
                      deleteAllMutation.mutate();
                    }
                  }}
                  disabled={deleteAllMutation.isPending}
                >
                  <Trash2 className="w-4 h-4 ml-2" />
                  حذف الكل
                </Button>
              </div>
            )}

            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : sortedNotifications.length > 0 ? (
                sortedNotifications.map((notification, index) => {
                  const Icon = getIcon(notification.type);
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
                        !notification.is_read ? 'bg-blue-50/50' : 'bg-white/80'
                      } backdrop-blur-sm`}>
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            <div className={`w-12 h-12 rounded-xl ${
                              !notification.is_read 
                                ? 'bg-gradient-to-br from-blue-400 to-blue-600' 
                                : 'bg-gray-200'
                            } flex items-center justify-center flex-shrink-0 shadow-md`}>
                              <Icon className={`w-6 h-6 ${!notification.is_read ? 'text-white' : 'text-gray-500'}`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="text-lg font-bold text-gray-900">
                                  {notification.title}
                                </h3>
                                <div className="flex gap-2">
                                  {!notification.is_read && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => markAsReadMutation.mutate(notification.id)}
                                      className="text-blue-600 hover:text-blue-700"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      if (confirm('هل تريد حذف هذا الإشعار؟')) {
                                        deleteNotificationMutation.mutate(notification.id);
                                      }
                                    }}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-gray-600 leading-relaxed mb-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-500">
                                  {new Date(notification.created_date).toLocaleString('ar-SA')}
                                </p>
                                {notification.link && (
                                  <Link to={notification.link}>
                                    <Button variant="link" size="sm" className="text-blue-600">
                                      عرض التفاصيل ←
                                    </Button>
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })
              ) : (
                <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-12 text-center">
                    <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      لا توجد إشعارات
                    </h3>
                    <p className="text-gray-600">
                      سنرسل لك إشعاراً عند وجود جديد
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}