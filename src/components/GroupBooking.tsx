import React, { useState } from 'react';
import { Users, Plus, Trash2, AlertCircle, CheckCircle2, Ticket, Gift } from 'lucide-react';
import { PassengerDetails as PassengerDetailsType } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface GroupBookingProps {
  busPrice: number;
  availableSeats: number;
  busOperator: string;
  onConfirm: (passengers: PassengerDetailsType[]) => void;
  onBack: () => void;
}

export const GroupBooking: React.FC<GroupBookingProps> = ({
  busPrice,
  availableSeats,
  busOperator,
  onConfirm,
  onBack
}) => {
  const [passengers, setPassengers] = useState<PassengerDetailsType[]>([
    { name: '', email: '', phone: '', idNumber: '' }
  ]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<number, Record<string, string>>>({});

  const maxPassengers = Math.min(10, availableSeats);
  const groupSize = passengers.length;
  const groupDiscount = getGroupDiscount(groupSize);
  const discountedPrice = Math.round(busPrice * (1 - groupDiscount / 100));
  const totalPrice = discountedPrice * groupSize;
  const totalSavings = busPrice * groupSize - totalPrice;

  function getGroupDiscount(size: number): number {
    if (size >= 10) return 20;
    if (size >= 8) return 15;
    if (size >= 5) return 10;
    if (size >= 3) return 5;
    return 0;
  }

  const addPassenger = () => {
    if (passengers.length < maxPassengers) {
      setPassengers([
        ...passengers,
        { name: '', email: '', phone: '', idNumber: '' }
      ]);
    }
  };

  const removePassenger = (index: number) => {
    if (passengers.length > 1) {
      const newPassengers = passengers.filter((_, i) => i !== index);
      setPassengers(newPassengers);
      const newErrors = { ...errors };
      delete newErrors[index];
      setErrors(newErrors);
    }
  };

  const updatePassenger = (index: number, field: keyof PassengerDetailsType, value: string) => {
    const newPassengers = [...passengers];
    newPassengers[index] = {
      ...newPassengers[index],
      [field]: value
    };
    setPassengers(newPassengers);

    // Clear error for this field
    if (errors[index]) {
      setErrors({
        ...errors,
        [index]: {
          ...errors[index],
          [field]: ''
        }
      });
    }
  };

  const validatePassengers = (): boolean => {
    const newErrors: Record<number, Record<string, string>> = {};
    let isValid = true;

    passengers.forEach((passenger, index) => {
      const passengerErrors: Record<string, string> = {};

      if (!passenger.name.trim()) {
        passengerErrors.name = 'Name is required';
        isValid = false;
      }

      if (!passenger.email.trim()) {
        passengerErrors.email = 'Email is required';
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(passenger.email)) {
        passengerErrors.email = 'Invalid email';
        isValid = false;
      }

      if (!passenger.phone.trim()) {
        passengerErrors.phone = 'Phone is required';
        isValid = false;
      } else if (!/^\+?[0-9\s\-()]{10,}$/.test(passenger.phone)) {
        passengerErrors.phone = 'Invalid phone number';
        isValid = false;
      }

      if (Object.keys(passengerErrors).length > 0) {
        newErrors[index] = passengerErrors;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleConfirm = () => {
    if (validatePassengers()) {
      onConfirm(passengers);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-morphism rounded-[3rem] p-10 shadow-2xl border-white/50 max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-3 rounded-2xl bg-white border border-gray-100 hover:bg-orange-50 hover:border-orange-100 transition-all"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h2 className="text-3xl font-black text-gray-900">Group Booking</h2>
          <p className="text-gray-500 text-sm mt-1">Save more when you book together</p>
        </div>
      </div>

      {/* Group Discount Banner */}
      {groupDiscount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 flex items-center gap-4"
        >
          <Gift size={28} className="text-green-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-black text-gray-900">Group Discount Applied!</p>
            <p className="text-sm text-gray-600 mt-1">
              You're saving <strong className="text-green-600">${totalSavings}</strong> with your {groupSize} person group
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-green-600">{groupDiscount}%</p>
            <p className="text-xs font-bold text-green-700">OFF</p>
          </div>
        </motion.div>
      )}

      {/* Passenger Form */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-lg text-gray-900 flex items-center gap-2">
            <Users size={20} /> Passenger Information
          </h3>
          <p className="text-sm text-gray-500 font-bold">
            {groupSize}/{maxPassengers} passengers
          </p>
        </div>

        {/* Passengers List */}
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          <AnimatePresence>
            {passengers.map((passenger, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white rounded-2xl p-6 border-2 border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="font-black text-gray-900">Passenger {index + 1}</p>
                  {passengers.length > 1 && (
                    <button
                      onClick={() => removePassenger(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={passenger.name}
                      onChange={(e) => updatePassenger(index, 'name', e.target.value)}
                      placeholder="Full name"
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none transition-all font-medium ${
                        errors[index]?.name
                          ? 'border-red-500 focus:ring-red-500/20'
                          : 'border-gray-100 focus:ring-orange-500/20 focus:border-orange-500'
                      }`}
                    />
                    {errors[index]?.name && (
                      <p className="text-xs text-red-500 font-bold">{errors[index].name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Email
                    </label>
                    <input
                      type="email"
                      value={passenger.email}
                      onChange={(e) => updatePassenger(index, 'email', e.target.value)}
                      placeholder="Email address"
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none transition-all font-medium ${
                        errors[index]?.email
                          ? 'border-red-500 focus:ring-red-500/20'
                          : 'border-gray-100 focus:ring-orange-500/20 focus:border-orange-500'
                      }`}
                    />
                    {errors[index]?.email && (
                      <p className="text-xs text-red-500 font-bold">{errors[index].email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={passenger.phone}
                      onChange={(e) => updatePassenger(index, 'phone', e.target.value)}
                      placeholder="Phone number"
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none transition-all font-medium ${
                        errors[index]?.phone
                          ? 'border-red-500 focus:ring-red-500/20'
                          : 'border-gray-100 focus:ring-orange-500/20 focus:border-orange-500'
                      }`}
                    />
                    {errors[index]?.phone && (
                      <p className="text-xs text-red-500 font-bold">{errors[index].phone}</p>
                    )}
                  </div>

                  {/* ID (Optional) */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      ID (Optional)
                    </label>
                    <input
                      type="text"
                      value={passenger.idNumber || ''}
                      onChange={(e) => updatePassenger(index, 'idNumber', e.target.value)}
                      placeholder="National ID"
                      className="w-full p-3 border border-gray-100 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-medium"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Add Passenger Button */}
        {passengers.length < maxPassengers && (
          <button
            onClick={addPassenger}
            className="w-full py-3 border-2 border-dashed border-orange-300 rounded-2xl text-orange-600 font-bold text-sm uppercase tracking-widest hover:bg-orange-50 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={18} /> Add Another Passenger
          </button>
        )}
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-2xl p-6 space-y-4 border border-gray-100 mb-8">
        <h3 className="font-black text-gray-900 flex items-center gap-2">
          <Ticket size={20} className="text-orange-600" /> Booking Summary
        </h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Bus:</span>
            <span className="font-bold text-gray-900">{busOperator}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Passengers:</span>
            <span className="font-bold text-gray-900">{groupSize}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Price per person:</span>
            <div className="text-right">
              {groupDiscount > 0 && (
                <span className="block text-xs line-through text-gray-400">${busPrice}</span>
              )}
              <span className="font-bold text-gray-900">${discountedPrice}</span>
            </div>
          </div>
          {groupDiscount > 0 && (
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="text-green-600 font-bold">Group Discount ({groupDiscount}%):</span>
              <span className="font-black text-green-600">-${Math.round(busPrice * groupSize * (groupDiscount / 100))}</span>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
          <span className="font-black text-gray-900">Total Amount:</span>
          <div>
            <p className="text-3xl font-black text-orange-600">${totalPrice}</p>
            {groupDiscount > 0 && (
              <p className="text-xs text-green-600 font-bold">Save ${totalSavings}</p>
            )}
          </div>
        </div>
      </div>

      {/* Info Message */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-8 flex items-start gap-3">
        <AlertCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700 font-bold">
          All passengers will receive separate booking confirmations and tickets. Each ticket can only be used by the named passenger.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-4 rounded-2xl border-2 border-gray-100 text-gray-900 font-black text-sm uppercase tracking-widest hover:bg-gray-50 transition-all"
        >
          Back
        </button>
        <button
          onClick={handleConfirm}
          className="flex-1 custom-gradient text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:shadow-xl hover:shadow-orange-500/30 transition-all transform hover:-translate-y-1 active:scale-95 shadow-lg shadow-orange-500/10 flex items-center justify-center gap-2"
        >
          <CheckCircle2 size={18} /> Confirm Group Booking
        </button>
      </div>
    </motion.div>
  );
};
