import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Heart, Bell, Shield, Settings, ChevronLeft, Save, Edit2, LogOut, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db } from '../firebase';
import { updateProfile, User as FirebaseUser } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

interface UserProfileProps {
  user: FirebaseUser;
  onBack: () => void;
  onLogout: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onBack, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [phone, setPhone] = useState(''); // This would usually come from Firestore
  const [location, setLocation] = useState('Harare, Zimbabwe');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage(null);

    try {
      // Update Auth Profile
      await updateProfile(user, { displayName });

      // Update Firestore Profile
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        displayName,
        phone,
        location,
        updatedAt: new Date().toISOString()
      });

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setIsUpdating(false);
      setTimeout(() => setMessage(null), 5000);
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
          <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-none mb-2">My Profile</h2>
          <p className="text-gray-500 font-medium">Manage your account and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-orange-600" />
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="relative">
                <img 
                  src={user.photoURL || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'}
                  alt={user.displayName || 'User'}
                  className="w-32 h-32 rounded-[2.5rem] object-cover ring-4 ring-orange-50 shadow-2xl"
                />
                <button className="absolute -bottom-2 -right-2 bg-orange-600 border-4 border-white text-white p-2.5 rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all">
                  <Edit2 size={16} />
                </button>
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">{user.displayName}</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">ZimBus Premium Member</p>
              </div>
              <div className="pt-6 border-t border-gray-50 w-full grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-xl font-black text-gray-900 leading-none">12</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Trips</p>
                </div>
                <div className="text-center border-l border-gray-50">
                  <p className="text-xl font-black text-gray-900 leading-none">4.9</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Rating</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white space-y-4 shadow-2xl shadow-orange-950/20">
            <button className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all text-left">
              <div className="p-2 bg-white/10 rounded-xl text-orange-500"><Bell size={18} /></div>
              <div>
                <p className="text-sm font-bold tracking-tight">Notifications</p>
                <p className="text-xs text-gray-400">Track your bookings</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all text-left">
              <div className="p-2 bg-white/10 rounded-xl text-orange-500"><Heart size={18} /></div>
              <div>
                <p className="text-sm font-bold tracking-tight">Saved Routes</p>
                <p className="text-xs text-gray-400">Your favorite trips</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all text-left">
              <div className="p-2 bg-white/10 rounded-xl text-orange-500"><Shield size={18} /></div>
              <div>
                <p className="text-sm font-bold tracking-tight">Security</p>
                <p className="text-xs text-gray-400">Privacy & data</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all text-left">
              <div className="p-2 bg-white/10 rounded-xl text-orange-500"><Settings size={18} /></div>
              <div>
                <p className="text-sm font-bold tracking-tight">Settings</p>
                <p className="text-xs text-gray-400">Account preferences</p>
              </div>
            </button>
            <div className="pt-4 mt-4 border-t border-white/5 space-y-2">
              <button 
                onClick={onLogout}
                className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-red-500/10 text-red-400 transition-all text-left group"
              >
                <div className="p-2 bg-red-500/10 rounded-xl group-hover:bg-red-500/20"><LogOut size={18} /></div>
                <span className="text-sm font-bold tracking-tight">Logout</span>
              </button>
              <button className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-red-900/10 text-red-900 transition-all text-left group">
                <div className="p-2 bg-red-900/10 rounded-xl group-hover:bg-red-900/20"><Trash2 size={18} /></div>
                <span className="text-sm font-bold tracking-tight">Delete Account</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-8 space-y-8">
          <AnimatePresence mode="wait">
            {message && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`p-6 rounded-[1.5rem] border flex items-center gap-4 shadow-lg ${
                  message.type === 'success' 
                    ? 'bg-green-50 border-green-100 text-green-700 shadow-green-900/5' 
                    : 'bg-red-50 border-red-100 text-red-700 shadow-red-900/5'
                }`}
              >
                <div className={`p-2 rounded-xl ${message.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                  {message.type === 'success' ? <Save size={20} /> : <Trash2 size={20} />}
                </div>
                <p className="font-bold tracking-tight">{message.text}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleUpdate} className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-xl space-y-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
              {!isEditing && (
                <button 
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-orange-50 text-orange-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all shadow-sm"
                >
                  <Edit2 size={14} /> Edit Profile
                </button>
              )}
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                  <User size={24} className="text-orange-500" /> Personal Information
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Full Name</label>
                  <div className="relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300">
                      <User size={18} />
                    </div>
                    <input 
                      type="text" 
                      disabled={!isEditing}
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-50 rounded-2xl focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 outline-none transition-all font-bold text-gray-900 disabled:opacity-60" 
                      placeholder="Enter your name" 
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300">
                      <Mail size={18} />
                    </div>
                    <input 
                      type="email" 
                      disabled
                      value={user.email || ''}
                      className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-50 rounded-2xl outline-none font-bold text-gray-400 disabled:bg-gray-50/50" 
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Phone Number</label>
                  <div className="relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300">
                      <Phone size={18} />
                    </div>
                    <input 
                      type="tel" 
                      disabled={!isEditing}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-50 rounded-2xl focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 outline-none transition-all font-bold text-gray-900 disabled:opacity-60" 
                      placeholder="+263 77..." 
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Location</label>
                  <div className="relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300">
                      <MapPin size={18} />
                    </div>
                    <input 
                      type="text" 
                      disabled={!isEditing}
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-50 rounded-2xl focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 outline-none transition-all font-bold text-gray-900 disabled:opacity-60" 
                      placeholder="City, Country" 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-50 space-y-8">
              <div>
                <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-3">
                  <Calendar size={22} className="text-orange-500" /> Account Preferences
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-center justify-between p-6 bg-gray-50/50 rounded-3xl border border-gray-50">
                  <div className="space-y-1">
                    <p className="text-sm font-black text-gray-900 tracking-tight">Email Notifications</p>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Receive booking updates</p>
                  </div>
                  <div className="w-12 h-6 bg-orange-600 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-6 bg-gray-50/50 rounded-3xl border border-gray-50">
                  <div className="space-y-1">
                    <p className="text-sm font-black text-gray-900 tracking-tight">Two-Factor Auth</p>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Secure your account</p>
                  </div>
                  <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="pt-10 flex gap-4">
                <button 
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 custom-gradient text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:shadow-2xl hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                  {isUpdating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                  Save Changes
                </button>
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-10 py-5 bg-gray-50 text-gray-400 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-100 hover:text-gray-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>

          <div className="bg-orange-50 p-8 rounded-[2.5rem] border border-orange-100 flex items-center justify-between gap-8 group">
            <div className="space-y-2">
              <h4 className="text-xl font-black text-orange-900 tracking-tight">Need help with your account?</h4>
              <p className="text-sm font-medium text-orange-800 leading-relaxed">
                Our support team is available 24/7 to assist you with any account or booking issues.
              </p>
            </div>
            <button className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:shadow-xl hover:shadow-orange-200 transition-all shadow-sm shrink-0 active:scale-95">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
