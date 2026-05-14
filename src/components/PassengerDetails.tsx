import React, { useState } from 'react';
import { ChevronLeft, User, Mail, Phone, FileText, AlertCircle } from 'lucide-react';
import { PassengerDetails as PassengerDetailsType } from '../types';
import { motion } from 'motion/react';

interface PassengerDetailsProps {
  onBack: () => void;
  onConfirm: (details: PassengerDetailsType) => void;
  isLoading?: boolean;
}

export const PassengerDetails: React.FC<PassengerDetailsProps> = ({ onBack, onConfirm, isLoading = false }) => {
  const [formData, setFormData] = useState<PassengerDetailsType>({
    name: '',
    email: '',
    phone: '',
    idNumber: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9\s\-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof PassengerDetailsType, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onConfirm(formData);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-morphism rounded-[3rem] p-10 shadow-2xl border-white/50 max-w-2xl mx-auto"
    >
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack}
          className="p-3 rounded-2xl bg-white border border-gray-100 hover:bg-orange-50 hover:border-orange-100 transition-all"
        >
          <ChevronLeft size={20} className="text-gray-600 hover:text-orange-600" />
        </button>
        <div>
          <h2 className="text-3xl font-black text-gray-900">Passenger Details</h2>
          <p className="text-gray-500 text-sm mt-1">Please provide your information to complete the booking</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-1.5">
            <User size={14} className="text-orange-500" /> Full Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter your full name"
            className={`w-full p-4 bg-white/50 border rounded-2xl focus:ring-2 focus:outline-none transition-all font-medium ${
              errors.name 
                ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' 
                : 'border-gray-100 focus:ring-orange-500/20 focus:border-orange-500'
            }`}
            disabled={isLoading}
          />
          {errors.name && (
            <div className="flex items-center gap-2 text-red-500 text-xs font-bold mt-1">
              <AlertCircle size={14} /> {errors.name}
            </div>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-1.5">
            <Mail size={14} className="text-orange-500" /> Email Address
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="your.email@example.com"
            className={`w-full p-4 bg-white/50 border rounded-2xl focus:ring-2 focus:outline-none transition-all font-medium ${
              errors.email 
                ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' 
                : 'border-gray-100 focus:ring-orange-500/20 focus:border-orange-500'
            }`}
            disabled={isLoading}
          />
          {errors.email && (
            <div className="flex items-center gap-2 text-red-500 text-xs font-bold mt-1">
              <AlertCircle size={14} /> {errors.email}
            </div>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-1.5">
            <Phone size={14} className="text-orange-500" /> Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+263 71 2345 6789"
            className={`w-full p-4 bg-white/50 border rounded-2xl focus:ring-2 focus:outline-none transition-all font-medium ${
              errors.phone 
                ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' 
                : 'border-gray-100 focus:ring-orange-500/20 focus:border-orange-500'
            }`}
            disabled={isLoading}
          />
          {errors.phone && (
            <div className="flex items-center gap-2 text-red-500 text-xs font-bold mt-1">
              <AlertCircle size={14} /> {errors.phone}
            </div>
          )}
        </div>

        {/* ID Number (Optional) */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-1.5">
            <FileText size={14} className="text-orange-500" /> National ID / Passport (Optional)
          </label>
          <input
            type="text"
            value={formData.idNumber || ''}
            onChange={(e) => handleChange('idNumber', e.target.value)}
            placeholder="Your ID number"
            className="w-full p-4 bg-white/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-medium"
            disabled={isLoading}
          />
          <p className="text-[10px] text-gray-400 font-medium">For identity verification purposes</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-8">
          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            className="flex-1 px-6 py-4 rounded-2xl border-2 border-gray-100 text-gray-900 font-black text-sm uppercase tracking-widest hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 custom-gradient text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:shadow-xl hover:shadow-orange-500/30 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/10 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              'Continue to Payment'
            )}
          </button>
        </div>
      </form>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
        <p className="text-xs text-blue-700 font-bold">
          💡 <span className="ml-2">Your information is secure and will only be used for booking confirmation and travel updates.</span>
        </p>
      </div>
    </motion.div>
  );
};
