import React from 'react';
import { Bell, ChevronLeft, CheckCircle2, AlertCircle, Calendar, Info, Trash2, Clock, Filter, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'booking' | 'alert' | 'promo' | 'info';
  isRead: boolean;
}

interface NotificationsProps {
  onBack: () => void;
}

export const Notifications: React.FC<NotificationsProps> = ({ onBack }) => {
  const [notifications, setNotifications] = React.useState<Notification[]>([
    {
      id: '1',
      title: 'Booking Confirmed!',
      message: 'Your trip from Harare to Bulawayo scheduled for tomorrow has been confirmed. Your seat is A1.',
      date: new Date().toISOString(),
      type: 'booking',
      isRead: false,
    },
    {
      id: '2',
      title: 'New Promo Available',
      message: 'Enjoy 20% off your next trip to Mutare! Use code ZIM20 at checkout.',
      date: new Date(Date.now() - 86400000).toISOString(),
      type: 'promo',
      isRead: true,
    },
    {
      id: '3',
      title: 'Bus Delay Alert',
      message: 'The 09:00 City Link service to Gweru is experiencing a 15-minute delay due to traffic.',
      date: new Date(Date.now() - 172800000).toISOString(),
      type: 'alert',
      isRead: true,
    },
    {
      id: '4',
      title: 'Review Your Trip',
      message: 'How was your recent journey with Intercape? Share your experience and help others!',
      date: new Date(Date.now() - 259200000).toISOString(),
      type: 'info',
      isRead: true,
    },
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getTypeStyles = (type: Notification['type']) => {
    switch (type) {
      case 'booking': return { bg: 'bg-green-50', border: 'border-green-100', text: 'text-green-600', icon: <CheckCircle2 size={18} /> };
      case 'alert': return { bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-600', icon: <AlertCircle size={18} /> };
      case 'promo': return { bg: 'bg-orange-50', border: 'border-orange-100', text: 'text-orange-600', icon: <Bell size={18} /> };
      case 'info': return { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-600', icon: <Info size={18} /> };
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-3 text-gray-400 hover:text-orange-600 transition-all group"
        >
          <div className="p-3 rounded-2xl bg-white border border-gray-100 group-hover:bg-orange-50 group-hover:border-orange-100 transition-all shadow-sm transform group-hover:-translate-x-1">
            <ChevronLeft size={20} className="text-gray-600 group-hover:text-orange-600" />
          </div>
          <span className="font-black text-xs uppercase tracking-[0.2em] group-hover:text-orange-600">Go Back</span>
        </button>
        <div className="text-right">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-none mb-2">Notifications</h2>
          <p className="text-gray-500 font-medium">Stay updated with your travel activities</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button className="px-6 py-2.5 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:shadow-xl transition-all shadow-sm active:scale-95 flex items-center gap-2">
            <Filter size={12} /> All
          </button>
          <button className="px-6 py-2.5 bg-white border border-gray-100 text-gray-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm active:scale-95 flex items-center gap-2">
            Unread ({notifications.filter(n => !n.isRead).length})
          </button>
        </div>
        <button 
          onClick={markAllAsRead}
          className="flex items-center gap-2 text-[10px] font-black text-orange-600 uppercase tracking-widest hover:text-orange-700 transition-all group"
        >
          <CheckCheck size={16} className="group-hover:scale-110 transition-transform" />
          Mark all as read
        </button>
      </div>

      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {notifications.length > 0 ? (
            notifications.map((notification, i) => {
              const styles = getTypeStyles(notification.type);
              return (
                <motion.div
                  key={notification.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className={`group bg-white rounded-[2rem] p-8 border hover:shadow-2xl hover:shadow-orange-500/5 transition-all relative overflow-hidden ${
                    notification.isRead ? 'border-gray-50' : 'border-orange-100 ring-2 ring-orange-50'
                  }`}
                >
                  {!notification.isRead && (
                    <div className="absolute top-0 right-0 p-8">
                      <div className="w-2.5 h-2.5 bg-orange-600 rounded-full animate-ping" />
                      <div className="w-2.5 h-2.5 bg-orange-600 rounded-full absolute top-8 right-8" />
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row justify-between gap-10">
                    <div className="flex-1 flex gap-6">
                      <div className={`p-4 rounded-2xl shrink-0 h-fit ${styles.bg} ${styles.text}`}>
                        {styles.icon}
                      </div>
                      <div className="space-y-3">
                        <div className="flex flex-col gap-1">
                          <h3 className={`text-xl font-black tracking-tight ${notification.isRead ? 'text-gray-900 opacity-70' : 'text-gray-900'}`}>
                            {notification.title}
                          </h3>
                          <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <div className="flex items-center gap-1.5">
                              <Calendar size={12} className="text-orange-500" />
                              <span>{new Date(notification.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock size={12} className="text-orange-500" />
                              <span>{new Date(notification.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                        </div>
                        <p className={`text-sm leading-relaxed ${notification.isRead ? 'text-gray-400' : 'text-gray-500 font-medium'}`}>
                          {notification.message}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col justify-end items-center gap-4 border-t md:border-t-0 md:border-l border-gray-50 pt-6 md:pt-0 md:pl-10">
                      <button 
                        onClick={() => deleteNotification(notification.id)}
                        className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-90"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-gray-100 text-center space-y-6"
            >
              <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-gray-200">
                <Bell size={48} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">All caught up!</h3>
                <p className="text-gray-500 font-medium max-w-sm mx-auto">
                  You have no new notifications. Check back later for booking updates and official alerts.
                </p>
              </div>
              <button 
                onClick={onBack}
                className="bg-orange-600 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:shadow-xl hover:shadow-orange-200 transition-all shadow-sm active:scale-95"
              >
                Return to Home
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {notifications.length > 0 && (
        <div className="bg-gray-900 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left shadow-2xl shadow-orange-950/20">
          <div className="space-y-3">
            <h4 className="text-2xl font-black text-white tracking-tight">Never miss an update</h4>
            <p className="text-gray-400 font-medium max-w-sm leading-relaxed">
              Enable SMS notifications to receive real-time alerts about bus delays and schedule changes.
            </p>
          </div>
          <button className="custom-gradient text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:shadow-2xl hover:shadow-orange-500/30 transition-all active:scale-95 shrink-0">
            Setup SMS Alerts
          </button>
        </div>
      )}
    </div>
  );
};
