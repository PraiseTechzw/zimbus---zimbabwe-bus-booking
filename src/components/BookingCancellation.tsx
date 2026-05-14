import React, { useState } from 'react';
import { AlertCircle, Clock, DollarSign, Send, CheckCircle2, X } from 'lucide-react';
import { Booking, Bus } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface BookingCancellationProps {
  booking: Booking;
  bus: Bus | undefined;
  onCancel: (bookingId: string, reason: string) => Promise<void>;
  onClose: () => void;
}

export const BookingCancellation: React.FC<BookingCancellationProps> = ({ 
  booking, 
  bus, 
  onCancel, 
  onClose 
}) => {
  const [cancellationReason, setCancellationReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  // Calculate refund based on cancellation policy
  const calculateRefund = (): { amount: number; percentage: number; reason: string } => {
    const now = new Date();
    const bookingDate = new Date(booking.bookingDate);
    // Assuming the journey date is the booking date (you might want to add journey date to booking)
    const hoursUntilTrip = 24; // This should come from the actual trip details
    
    if (hoursUntilTrip > 48) {
      // Full refund within 48 hours of booking
      return { 
        amount: booking.totalPrice, 
        percentage: 100, 
        reason: 'Full refund (cancelled more than 24 hours before departure)' 
      };
    } else if (hoursUntilTrip > 24) {
      // 75% refund
      const refundAmount = Math.round(booking.totalPrice * 0.75);
      return { 
        amount: refundAmount, 
        percentage: 75, 
        reason: '75% refund (cancelled 12-24 hours before departure)' 
      };
    } else if (hoursUntilTrip > 0) {
      // 50% refund
      const refundAmount = Math.round(booking.totalPrice * 0.5);
      return { 
        amount: refundAmount, 
        percentage: 50, 
        reason: '50% refund (cancelled less than 12 hours before departure)' 
      };
    } else {
      // No refund - trip already started
      return { 
        amount: 0, 
        percentage: 0, 
        reason: 'No refund available - trip has already started' 
      };
    }
  };

  const refundInfo = calculateRefund();

  const handleCancellation = async () => {
    if (!cancellationReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }

    setIsLoading(true);
    try {
      await onCancel(booking.id, cancellationReason);
      setCancelled(true);
    } catch (error) {
      alert('Failed to cancel booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (cancelled) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-6"
        >
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
              <CheckCircle2 size={48} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900">Booking Cancelled</h3>
            <p className="text-gray-500 text-sm mt-2">Your booking has been successfully cancelled</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 space-y-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Refund Amount</p>
            <p className="text-3xl font-black text-green-600">${refundInfo.amount}</p>
            <p className="text-[10px] text-green-700">{refundInfo.reason}</p>
            <p className="text-[10px] text-gray-500 mt-3">
              💡 Refund will be credited to your original payment method within 5-7 business days.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full custom-gradient text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:shadow-xl hover:shadow-orange-500/30 transition-all"
          >
            Back to My Bookings
          </button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100 p-8 flex items-start justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-gray-900">Cancel Booking</h2>
            <p className="text-gray-600 text-sm">Booking ID: #{booking.id.substring(0, 8).toUpperCase()}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Booking Details */}
          <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
            <h3 className="font-black text-sm text-gray-900 uppercase tracking-widest">Booking Details</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Route</p>
                <p className="font-bold text-gray-900">{bus?.from} → {bus?.to}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Seat</p>
                <p className="font-bold text-gray-900">{booking.seatNumber}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Booked Amount</p>
                <p className="font-bold text-gray-900">${booking.totalPrice}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                <span className="inline-block px-3 py-1 bg-green-50 text-green-700 text-xs font-black rounded-full">
                  {booking.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Refund Policy */}
          <div className="border-2 border-orange-100 rounded-2xl p-6 space-y-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-black text-gray-900 mb-2">Refund Policy</h4>
                <p className="text-sm text-gray-600 space-y-2">
                  <span className="block">• <strong>More than 48 hours:</strong> Full refund (100%)</span>
                  <span className="block">• <strong>24-48 hours:</strong> 75% refund</span>
                  <span className="block">• <strong>Less than 24 hours:</strong> 50% refund</span>
                  <span className="block">• <strong>Trip started:</strong> No refund</span>
                </p>
              </div>
            </div>
          </div>

          {/* Estimated Refund */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2">
              <DollarSign size={18} className="text-green-600" />
              <span className="font-black text-gray-900">Your Estimated Refund</span>
            </div>
            <div className="space-y-1">
              <p className="text-4xl font-black text-green-600">${refundInfo.amount}</p>
              <p className="text-sm text-green-700 font-bold">{refundInfo.reason}</p>
            </div>
          </div>

          {/* Cancellation Reason */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block">
              Reason for Cancellation (Optional)
            </label>
            <textarea
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="Tell us why you're cancelling (this helps us improve our service)"
              rows={4}
              className="w-full p-4 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all resize-none"
              disabled={isLoading}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-6 py-4 rounded-2xl border-2 border-gray-100 text-gray-900 font-black text-sm uppercase tracking-widest hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Keep Booking
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              disabled={isLoading}
              className="flex-1 px-6 py-4 rounded-2xl bg-red-600 text-white font-black text-sm uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <AlertCircle size={16} /> Cancel Booking
            </button>
          </div>
        </div>

        {/* Confirmation Modal */}
        <AnimatePresence>
          {showConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center space-y-6"
              >
                <AlertCircle size={48} className="text-red-500 mx-auto" />
                <div>
                  <h3 className="text-xl font-black text-gray-900">Confirm Cancellation?</h3>
                  <p className="text-gray-600 text-sm mt-2">
                    Once cancelled, your booking cannot be restored. An estimated refund of <strong className="text-green-600">${refundInfo.amount}</strong> will be processed.
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowConfirm(false)}
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-100 text-gray-900 font-bold text-sm uppercase transition-all disabled:opacity-50"
                  >
                    No, Keep It
                  </button>
                  <button
                    onClick={handleCancellation}
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 rounded-xl bg-red-600 text-white font-bold text-sm uppercase hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Cancelling...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={16} /> Yes, Cancel
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
