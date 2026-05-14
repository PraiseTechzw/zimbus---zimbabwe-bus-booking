import React, { useState, useEffect } from 'react';
import { Mail, MessageSquare, Bell, Toggle2, CheckCircle2, AlertCircle, Clock, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationPreferences {
  email: {
    bookingConfirmation: boolean;
    bookingReminder: boolean;
    promotions: boolean;
    updates: boolean;
    cancellation: boolean;
  };
  sms: {
    bookingConfirmation: boolean;
    bookingReminder: boolean;
    updates: boolean;
    cancellation: boolean;
  };
}

interface NotificationSettingsProps {
  userId: string;
  userEmail: string;
  userPhone?: string;
  onSave: (preferences: NotificationPreferences) => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  userId,
  userEmail,
  userPhone,
  onSave
}) => {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: {
      bookingConfirmation: true,
      bookingReminder: true,
      promotions: true,
      updates: true,
      cancellation: true
    },
    sms: {
      bookingConfirmation: true,
      bookingReminder: false,
      updates: false,
      cancellation: true
    }
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleToggle = (channel: 'email' | 'sms', type: keyof NotificationPreferences['email'] | keyof NotificationPreferences['sms']) => {
    setPreferences(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [type]: !prev[channel][type]
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave(preferences);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Notification Preferences</h1>
        <p className="text-gray-500 font-medium">Manage how you receive updates about your bookings</p>
      </div>

      {/* Contact Information */}
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4">
        <h2 className="font-black text-lg text-gray-900">Contact Information</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100">
            <Mail size={20} className="text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email</p>
              <p className="font-bold text-gray-900">{userEmail}</p>
            </div>
          </div>
          {userPhone ? (
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100">
              <MessageSquare size={20} className="text-green-600 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Phone</p>
                <p className="font-bold text-gray-900">{userPhone}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
              <AlertCircle size={20} className="text-amber-600 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-amber-700 uppercase tracking-widest">Phone</p>
                <p className="text-sm text-amber-700">Add your phone number to receive SMS notifications</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Email Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-8 border-2 border-blue-100 shadow-lg shadow-blue-100/50"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Mail size={24} className="text-blue-600" />
          </div>
          <div>
            <h2 className="font-black text-lg text-gray-900">Email Notifications</h2>
            <p className="text-sm text-gray-600">Stay updated via email</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            {
              key: 'bookingConfirmation',
              label: 'Booking Confirmation',
              description: 'Receive confirmation when your booking is confirmed'
            },
            {
              key: 'bookingReminder',
              label: 'Booking Reminder',
              description: 'Get a reminder 24 hours before your journey'
            },
            {
              key: 'cancellation',
              label: 'Cancellation Updates',
              description: 'Notification when you cancel a booking'
            },
            {
              key: 'updates',
              label: 'Travel Updates',
              description: 'Important updates about delays or changes'
            },
            {
              key: 'promotions',
              label: 'Promotions & Offers',
              description: 'Receive exclusive deals and discounts'
            }
          ].map(item => (
            <NotificationToggle
              key={item.key}
              label={item.label}
              description={item.description}
              enabled={preferences.email[item.key as keyof typeof preferences.email]}
              onChange={() => handleToggle('email', item.key as keyof typeof preferences.email)}
            />
          ))}
        </div>
      </motion.div>

      {/* SMS Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-8 border-2 border-green-100 shadow-lg shadow-green-100/50"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-green-100 rounded-xl">
            <MessageSquare size={24} className="text-green-600" />
          </div>
          <div>
            <h2 className="font-black text-lg text-gray-900">SMS Notifications</h2>
            <p className="text-sm text-gray-600">Get instant text updates</p>
          </div>
        </div>

        {!userPhone && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700 font-bold">
              Add your phone number in your profile to enable SMS notifications
            </p>
          </div>
        )}

        <div className="space-y-4">
          {[
            {
              key: 'bookingConfirmation',
              label: 'Booking Confirmation',
              description: 'Receive SMS when your booking is confirmed'
            },
            {
              key: 'bookingReminder',
              label: 'Booking Reminder',
              description: 'Get a text reminder 12 hours before departure'
            },
            {
              key: 'cancellation',
              label: 'Cancellation Updates',
              description: 'Notification when you cancel a booking'
            },
            {
              key: 'updates',
              label: 'Travel Updates',
              description: 'Critical updates about changes or delays'
            }
          ].map(item => (
            <NotificationToggle
              key={item.key}
              label={item.label}
              description={item.description}
              enabled={preferences.sms[item.key as keyof typeof preferences.sms]}
              onChange={() => handleToggle('sms', item.key as keyof typeof preferences.sms)}
              disabled={!userPhone}
            />
          ))}
        </div>
      </motion.div>

      {/* Save Button */}
      <div className="flex gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 custom-gradient text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <CheckCircle2 size={18} /> Save Preferences
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3"
          >
            <CheckCircle2 size={20} className="text-green-600" />
            <p className="text-sm text-green-700 font-bold">Your notification preferences have been saved</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper component for notification toggle
const NotificationToggle: React.FC<{
  label: string;
  description: string;
  enabled: boolean;
  onChange: () => void;
  disabled?: boolean;
}> = ({ label, description, enabled, onChange, disabled = false }) => {
  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.01 }}
      className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
        disabled
          ? 'border-gray-100 bg-gray-50 opacity-50'
          : enabled
            ? 'border-orange-200 bg-orange-50'
            : 'border-gray-100 bg-white hover:border-gray-200'
      }`}
    >
      <div className="flex-1">
        <p className="font-bold text-gray-900">{label}</p>
        <p className="text-xs text-gray-500 font-medium">{description}</p>
      </div>
      <button
        onClick={onChange}
        disabled={disabled}
        className={`relative w-14 h-8 rounded-full transition-all ${
          enabled ? 'bg-orange-600' : 'bg-gray-300'
        } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <motion.div
          animate={{ x: enabled ? 28 : 2 }}
          className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md"
        />
      </button>
    </motion.div>
  );
};

// Notification Center component
export const NotificationCenter: React.FC<{ userId: string }> = ({ userId }) => {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'booking',
      title: 'Booking Confirmed!',
      message: 'Your booking for Harare to Bulawayo has been confirmed',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      icon: CheckCircle2
    },
    {
      id: '2',
      type: 'reminder',
      title: 'Travel Reminder',
      message: 'Your bus departs in 24 hours. Please arrive 30 minutes early',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      read: false,
      icon: Clock
    },
    {
      id: '3',
      type: 'promotion',
      title: 'Special Offer',
      message: 'Use code SUMMER15 for 15% off your next booking',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      read: true,
      icon: Bell
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-gray-900">Notifications</h1>
        {unreadCount > 0 && (
          <span className="px-3 py-1 bg-orange-600 text-white rounded-full text-sm font-bold">
            {unreadCount} new
          </span>
        )}
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {notifications.length > 0 ? (
            notifications.map((notif, index) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => markAsRead(notif.id)}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                  notif.read
                    ? 'border-gray-100 bg-white'
                    : 'border-orange-200 bg-orange-50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg flex-shrink-0 ${
                    notif.read ? 'bg-gray-100' : 'bg-orange-200'
                  }`}>
                    <notif.icon size={20} className={notif.read ? 'text-gray-600' : 'text-orange-600'} />
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-gray-900">{notif.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                    <p className="text-xs text-gray-500 font-bold mt-2">
                      {notif.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif.id);
                    }}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <Bell size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 font-bold">No notifications</p>
              <p className="text-sm text-gray-400">You're all caught up!</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
