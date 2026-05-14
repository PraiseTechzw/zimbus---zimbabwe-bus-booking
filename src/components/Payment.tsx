import React, { useState } from 'react';
import { CreditCard, AlertCircle, CheckCircle2, Loader2, ChevronLeft, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { PassengerDetails } from '../types';

interface PaymentProps {
  amount: number;
  bookingId: string;
  passengerDetails: PassengerDetails;
  onSuccess: (paymentId: string, paymentMethod: string) => void;
  onBack: () => void;
}

interface PayNowConfig {
  apiUrl: string;
  apiKey: string;
}

export const Payment: React.FC<PaymentProps> = ({ 
  amount, 
  bookingId, 
  passengerDetails,
  onSuccess,
  onBack 
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'paynow' | 'card' | 'wallet'>('paynow');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // PayNow Payment Handler
  const handlePayNowPayment = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // In production, this would call your backend API which would handle PayNow integration
      const response = await fetch('/api/payments/paynow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          bookingId,
          passengerEmail: passengerDetails.email,
          passengerPhone: passengerDetails.phone,
          returnUrl: window.location.origin + '/booking-confirmation'
        })
      });

      if (!response.ok) {
        throw new Error('Payment initialization failed');
      }

      const data = await response.json();
      
      if (data.redirectUrl) {
        // Redirect to PayNow gateway
        window.location.href = data.redirectUrl;
      } else {
        throw new Error('No redirect URL provided');
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed. Please try again.');
      setIsLoading(false);
    }
  };

  // Card Payment Handler
  const handleCardPayment = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // In production, this would integrate with Stripe, PayPal, etc.
      // For now, we'll simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const paymentId = `CARD-${Date.now()}`;
      setSuccessMsg('Card payment successful! Processing your booking...');
      setTimeout(() => onSuccess(paymentId, 'card'), 1500);
    } catch (err: any) {
      setError('Card payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Wallet Payment Handler
  const handleWalletPayment = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/payments/wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          bookingId,
          userId: passengerDetails.email
        })
      });

      if (!response.ok) {
        throw new Error('Wallet payment failed');
      }

      const data = await response.json();
      setSuccessMsg('Wallet payment successful! Processing your booking...');
      setTimeout(() => onSuccess(data.paymentId, 'wallet'), 1500);
    } catch (err: any) {
      setError(err.message || 'Wallet payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = () => {
    if (paymentMethod === 'paynow') {
      handlePayNowPayment();
    } else if (paymentMethod === 'card') {
      handleCardPayment();
    } else if (paymentMethod === 'wallet') {
      handleWalletPayment();
    }
  };

  if (successMsg) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-morphism rounded-[3rem] p-16 shadow-2xl border-white/50 max-w-2xl mx-auto text-center space-y-8"
      >
        <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
          <CheckCircle2 size={48} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-gray-900">Payment Successful!</h2>
          <p className="text-gray-500 mt-2">{successMsg}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-morphism rounded-[3rem] p-10 shadow-2xl border-white/50 max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="p-3 rounded-2xl bg-white border border-gray-100 hover:bg-orange-50 hover:border-orange-100 transition-all disabled:opacity-50"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h2 className="text-3xl font-black text-gray-900">Payment</h2>
          <p className="text-gray-500 text-sm mt-1">Choose your preferred payment method</p>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-2xl p-6 mb-8 space-y-4 border border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount to Pay</p>
            <p className="text-4xl font-black text-gray-900 mt-2">${amount.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Booking ID</p>
            <p className="text-sm font-black text-orange-600 mt-2">#{bookingId.substring(0, 8).toUpperCase()}</p>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Passenger:</span>
            <span className="font-bold text-gray-900">{passengerDetails.name}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-600">Email:</span>
            <span className="font-bold text-gray-900">{passengerDetails.email}</span>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="space-y-4 mb-8">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Select Payment Method</h3>

        {/* PayNow Option */}
        <label className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${
          paymentMethod === 'paynow'
            ? 'border-orange-500 bg-orange-50'
            : 'border-gray-100 bg-white hover:border-orange-200'
        }`}>
          <input
            type="radio"
            name="payment"
            value="paynow"
            checked={paymentMethod === 'paynow'}
            onChange={(e) => setPaymentMethod(e.target.value as any)}
            disabled={isLoading}
            className="absolute opacity-0"
          />
          <div className="flex items-start gap-4">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
              paymentMethod === 'paynow'
                ? 'border-orange-500 bg-orange-500'
                : 'border-gray-300'
            }`}>
              {paymentMethod === 'paynow' && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
            <div className="flex-1">
              <h4 className="font-black text-gray-900 flex items-center gap-2">
                <img src="https://www.paynow.co.zw/favicon.ico" alt="PayNow" className="w-5 h-5" />
                PayNow
              </h4>
              <p className="text-sm text-gray-600 mt-1">Zimbabwe's unified mobile payments platform</p>
              <p className="text-xs text-green-600 font-bold mt-2">✓ Fast & Secure</p>
            </div>
          </div>
        </label>

        {/* Card Option */}
        <label className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${
          paymentMethod === 'card'
            ? 'border-orange-500 bg-orange-50'
            : 'border-gray-100 bg-white hover:border-orange-200'
        }`}>
          <input
            type="radio"
            name="payment"
            value="card"
            checked={paymentMethod === 'card'}
            onChange={(e) => setPaymentMethod(e.target.value as any)}
            disabled={isLoading}
            className="absolute opacity-0"
          />
          <div className="flex items-start gap-4">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
              paymentMethod === 'card'
                ? 'border-orange-500 bg-orange-500'
                : 'border-gray-300'
            }`}>
              {paymentMethod === 'card' && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
            <div className="flex-1">
              <h4 className="font-black text-gray-900 flex items-center gap-2">
                <CreditCard size={20} /> Credit/Debit Card
              </h4>
              <p className="text-sm text-gray-600 mt-1">Visa, Mastercard, and other major cards</p>
              <p className="text-xs text-green-600 font-bold mt-2">✓ International & Local</p>
            </div>
          </div>
        </label>

        {/* Wallet Option */}
        <label className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${
          paymentMethod === 'wallet'
            ? 'border-orange-500 bg-orange-50'
            : 'border-gray-100 bg-white hover:border-orange-200'
        }`}>
          <input
            type="radio"
            name="payment"
            value="wallet"
            checked={paymentMethod === 'wallet'}
            onChange={(e) => setPaymentMethod(e.target.value as any)}
            disabled={isLoading}
            className="absolute opacity-0"
          />
          <div className="flex items-start gap-4">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
              paymentMethod === 'wallet'
                ? 'border-orange-500 bg-orange-500'
                : 'border-gray-300'
            }`}>
              {paymentMethod === 'wallet' && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
            <div className="flex-1">
              <h4 className="font-black text-gray-900 flex items-center gap-2">
                💳 ZimBus Wallet
              </h4>
              <p className="text-sm text-gray-600 mt-1">Use your wallet balance</p>
              <p className="text-xs text-amber-600 font-bold mt-2">ⓘ Coming Soon</p>
            </div>
          </div>
        </label>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-8 flex items-start gap-3">
        <Lock size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700 font-bold">
          Your payment is secured with encryption. We never store your full card details.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8 flex items-start gap-3"
        >
          <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 font-bold">{error}</p>
        </motion.div>
      )}

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="flex-1 px-6 py-4 rounded-2xl border-2 border-gray-100 text-gray-900 font-black text-sm uppercase tracking-widest hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <button
          onClick={handlePayment}
          disabled={isLoading || paymentMethod === 'wallet'}
          className="flex-1 custom-gradient text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:shadow-xl hover:shadow-orange-500/30 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/10 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Lock size={18} /> Pay ${amount.toFixed(2)}
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};
