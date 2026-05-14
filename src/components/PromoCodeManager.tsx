import React, { useState, useEffect } from 'react';
import { Ticket, AlertCircle, CheckCircle2, X, Zap } from 'lucide-react';
import { PromoCode } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface PromoCodeManagerProps {
  onApplyCode: (code: string, discount: { type: string; value: number }) => void;
  baseAmount: number;
  appliedCode?: string;
  onRemoveCode: () => void;
}

export const PromoCodeManager: React.FC<PromoCodeManagerProps> = ({
  onApplyCode,
  baseAmount,
  appliedCode,
  onRemoveCode
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [validCodes, setValidCodes] = useState<PromoCode[]>([]);

  // Fetch available promo codes
  useEffect(() => {
    const fetchPromoCodes = async () => {
      try {
        // In production, fetch from Firestore
        const codes: PromoCode[] = [
          {
            id: '1',
            code: 'WELCOME20',
            discountType: 'percentage',
            discountValue: 20,
            maxUses: 100,
            currentUses: 45,
            expiryDate: '2025-12-31',
            isActive: true,
            minBookingAmount: 50
          },
          {
            id: '2',
            code: 'SAVE50',
            discountType: 'fixed',
            discountValue: 50,
            maxUses: 50,
            currentUses: 48,
            expiryDate: '2025-06-30',
            isActive: true
          },
          {
            id: '3',
            code: 'SUMMER15',
            discountType: 'percentage',
            discountValue: 15,
            maxUses: 200,
            currentUses: 120,
            expiryDate: '2025-08-31',
            isActive: true,
            minBookingAmount: 100
          }
        ];
        setValidCodes(codes);
      } catch (err) {
        console.error('Error fetching promo codes:', err);
      }
    };

    fetchPromoCodes();
  }, []);

  const validateCode = (code: string): PromoCode | null => {
    if (!code) return null;

    const found = validCodes.find(c => c.code.toUpperCase() === code.toUpperCase());
    if (!found) return null;

    // Check if code is active
    if (!found.isActive) {
      setError('This promo code is no longer active');
      return null;
    }

    // Check if code has reached max uses
    if (found.currentUses >= found.maxUses) {
      setError('This promo code has reached its maximum uses');
      return null;
    }

    // Check expiry date
    if (new Date(found.expiryDate) < new Date()) {
      setError('This promo code has expired');
      return null;
    }

    // Check minimum booking amount
    if (found.minBookingAmount && baseAmount < found.minBookingAmount) {
      setError(`Minimum booking amount of $${found.minBookingAmount} required`);
      return null;
    }

    return found;
  };

  const handleApplyCode = async (codeToApply?: string) => {
    const code = codeToApply || promoCode;
    setError('');
    setSuccessMsg('');

    if (!code.trim()) {
      setError('Please enter a promo code');
      return;
    }

    setIsLoading(true);

    try {
      const validCode = validateCode(code);
      if (!validCode) {
        setIsLoading(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      onApplyCode(validCode.code, {
        type: validCode.discountType,
        value: validCode.discountValue
      });

      setSuccessMsg(`Code "${validCode.code}" applied successfully!`);
      setPromoCode('');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDiscount = (code: PromoCode) => {
    if (code.discountType === 'percentage') {
      return Math.round(baseAmount * (code.discountValue / 100));
    }
    return code.discountValue;
  };

  return (
    <div className="space-y-4">
      {/* Applied Code Display */}
      <AnimatePresence>
        {appliedCode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 size={20} className="text-green-600" />
              <div>
                <p className="font-bold text-gray-900">Promo Code Applied</p>
                <p className="text-sm text-green-700">{appliedCode}</p>
              </div>
            </div>
            <button
              onClick={onRemoveCode}
              className="p-2 hover:bg-green-100 rounded-lg transition-colors"
            >
              <X size={18} className="text-green-600" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Code Input */}
      {!appliedCode && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => {
                setPromoCode(e.target.value.toUpperCase());
                setError('');
                setSuccessMsg('');
              }}
              placeholder="Enter promo code"
              className="flex-1 p-3 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-bold text-sm uppercase"
              disabled={isLoading}
            />
            <button
              onClick={() => handleApplyCode()}
              disabled={isLoading || !promoCode}
              className="px-6 py-3 bg-orange-600 text-white rounded-2xl font-bold text-sm uppercase hover:bg-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
            >
              {isLoading ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Applying...
                </>
              ) : (
                <>
                  <Ticket size={16} /> Apply
                </>
              )}
            </button>
          </div>

          {/* Error or Success Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-red-500 text-xs font-bold"
            >
              <AlertCircle size={14} /> {error}
            </motion.div>
          )}
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-green-600 text-xs font-bold"
            >
              <CheckCircle2 size={14} /> {successMsg}
            </motion.div>
          )}
        </div>
      )}

      {/* Available Codes Display */}
      {!appliedCode && validCodes.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Available Promo Codes</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {validCodes.slice(0, 4).map(code => (
              <motion.button
                key={code.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setPromoCode(code.code);
                  handleApplyCode(code.code);
                }}
                disabled={isLoading || code.currentUses >= code.maxUses}
                className="text-left p-3 bg-white border-2 border-orange-100 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="font-bold text-xs text-orange-600 group-hover:text-orange-700">{code.code}</span>
                  {code.currentUses >= code.maxUses && (
                    <span className="text-[8px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">USED UP</span>
                  )}
                </div>
                <p className="text-[10px] text-gray-600">
                  {code.discountType === 'percentage' ? (
                    <>
                      Save <strong>{code.discountValue}%</strong> (up to ${calculateDiscount(code)})
                    </>
                  ) : (
                    <>
                      Save <strong>${code.discountValue}</strong>
                    </>
                  )}
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Admin component to manage promo codes
export const PromoCodeAdmin: React.FC = () => {
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [newCode, setNewCode] = useState<Partial<PromoCode>>({
    discountType: 'percentage',
    isActive: true
  });
  const [showForm, setShowForm] = useState(false);

  const handleAddCode = async () => {
    // In production, this would save to Firestore
    const code: PromoCode = {
      id: Date.now().toString(),
      code: (newCode.code || '').toUpperCase(),
      discountType: newCode.discountType as 'percentage' | 'fixed',
      discountValue: newCode.discountValue || 0,
      maxUses: newCode.maxUses || 100,
      currentUses: 0,
      expiryDate: newCode.expiryDate || '2025-12-31',
      isActive: newCode.isActive ?? true,
      minBookingAmount: newCode.minBookingAmount
    };

    setCodes([...codes, code]);
    setNewCode({ discountType: 'percentage', isActive: true });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-gray-900">Promo Codes</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="custom-gradient text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2"
        >
          <Zap size={16} /> Add Code
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 rounded-2xl p-6 space-y-4 border border-gray-100"
        >
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              value={newCode.code || ''}
              onChange={(e) => setNewCode({ ...newCode, code: e.target.value })}
              placeholder="Code"
              className="p-3 border border-gray-200 rounded-lg font-bold uppercase"
            />
            <select
              value={newCode.discountType}
              onChange={(e) => setNewCode({ ...newCode, discountType: e.target.value as any })}
              className="p-3 border border-gray-200 rounded-lg font-bold"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
            <input
              type="number"
              value={newCode.discountValue || ''}
              onChange={(e) => setNewCode({ ...newCode, discountValue: Number(e.target.value) })}
              placeholder="Discount Value"
              className="p-3 border border-gray-200 rounded-lg"
            />
            <input
              type="number"
              value={newCode.maxUses || ''}
              onChange={(e) => setNewCode({ ...newCode, maxUses: Number(e.target.value) })}
              placeholder="Max Uses"
              className="p-3 border border-gray-200 rounded-lg"
            />
            <input
              type="date"
              value={newCode.expiryDate || ''}
              onChange={(e) => setNewCode({ ...newCode, expiryDate: e.target.value })}
              className="p-3 border border-gray-200 rounded-lg col-span-2"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddCode}
              className="flex-1 custom-gradient text-white py-2 rounded-lg font-bold"
            >
              Create Code
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 bg-gray-200 text-gray-900 py-2 rounded-lg font-bold"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Codes List */}
      <div className="space-y-2">
        {codes.map(code => (
          <div key={code.id} className="bg-white p-4 rounded-lg border border-gray-100 flex items-center justify-between">
            <div>
              <p className="font-black text-gray-900">{code.code}</p>
              <p className="text-sm text-gray-500">
                {code.discountType === 'percentage' ? `${code.discountValue}%` : `$${code.discountValue}`} •
                {code.currentUses}/{code.maxUses} uses
              </p>
            </div>
            <button className="text-red-500 hover:text-red-700">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};
