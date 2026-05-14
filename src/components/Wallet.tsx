import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, ArrowDown, ArrowUp, Eye, EyeOff, AlertCircle, CheckCircle2, History, Zap } from 'lucide-react';
import { UserWallet, WalletTransaction } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface WalletProps {
  userId: string;
  onBack?: () => void;
}

export const Wallet: React.FC<WalletProps> = ({ userId, onBack }) => {
  const [wallet, setWallet] = useState<UserWallet>({
    userId,
    balance: 0,
    totalCredited: 0,
    totalUsed: 0,
    transactions: []
  });
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(50);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'paynow' | 'card'>('paynow');
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch wallet data
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        // In production, fetch from Firestore
        const mockWallet: UserWallet = {
          userId,
          balance: 250.50,
          totalCredited: 1200,
          totalUsed: 949.50,
          transactions: [
            {
              id: '1',
              type: 'debit',
              amount: 125.00,
              description: 'Bus ticket - Harare to Bulawayo',
              date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              bookingId: 'BOOKING001'
            },
            {
              id: '2',
              type: 'credit',
              amount: 50,
              description: 'Sign-up bonus',
              date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: '3',
              type: 'debit',
              amount: 80.75,
              description: 'Bus ticket - Bulawayo to Harare',
              date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
              bookingId: 'BOOKING002'
            },
            {
              id: '4',
              type: 'credit',
              amount: 200,
              description: 'Top-up via PayNow',
              date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
            }
          ]
        };
        setWallet(mockWallet);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching wallet:', error);
        setLoading(false);
      }
    };

    fetchWallet();
  }, [userId]);

  const handleTopUp = async () => {
    if (topUpAmount < 10) {
      alert('Minimum top-up amount is $10');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Add transaction
      const newTransaction: WalletTransaction = {
        id: Date.now().toString(),
        type: 'credit',
        amount: topUpAmount,
        description: `Top-up via ${selectedPaymentMethod.toUpperCase()}`,
        date: new Date().toISOString()
      };

      setWallet(prev => ({
        ...prev,
        balance: prev.balance + topUpAmount,
        totalCredited: prev.totalCredited + topUpAmount,
        transactions: [newTransaction, ...prev.transactions]
      }));

      setShowTopUp(false);
      setTopUpAmount(50);
    } catch (error) {
      alert('Top-up failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { day: 'short', month: 'short', year: '2-digit' });
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded-2xl" />
          <div className="h-64 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-4"
        >
          <span>← Back</span>
        </button>
      )}

      <div>
        <h1 className="text-3xl font-black text-gray-900">ZimBus Wallet</h1>
        <p className="text-gray-500 font-medium">Manage your travel credits</p>
      </div>

      {/* Main Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-orange-600 to-orange-500 rounded-[2rem] p-8 text-white shadow-2xl shadow-orange-200 overflow-hidden group"
      >
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-white/5 rounded-full blur-3xl" />

        <div className="relative z-10 space-y-8">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-orange-200 text-sm font-bold uppercase tracking-widest mb-2">Available Balance</p>
              <div className="flex items-center gap-3">
                <p className="text-5xl font-black tracking-tighter">${wallet.balance.toFixed(2)}</p>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  {showBalance ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
              <CreditCard size={28} />
            </div>
          </div>

          <div className="h-px bg-white/20" />

          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-orange-200 text-xs font-bold uppercase tracking-widest mb-1">Total Credited</p>
              <p className="text-2xl font-black">${wallet.totalCredited.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-orange-200 text-xs font-bold uppercase tracking-widest mb-1">Total Used</p>
              <p className="text-2xl font-black">${wallet.totalUsed.toFixed(2)}</p>
            </div>
          </div>

          <button
            onClick={() => setShowTopUp(!showTopUp)}
            className="w-full bg-white text-orange-600 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-orange-50 transition-all flex items-center justify-center gap-2 shadow-xl"
          >
            <Plus size={20} /> Add Money to Wallet
          </button>
        </div>
      </motion.div>

      {/* Top-Up Form */}
      <AnimatePresence>
        {showTopUp && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 rounded-2xl p-8 border-2 border-orange-200 space-y-6"
          >
            <h3 className="font-black text-lg text-gray-900">Add Money to Wallet</h3>

            {/* Amount Selection */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-900">Amount</label>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[10, 25, 50, 100].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setTopUpAmount(amount)}
                    className={`py-3 rounded-lg font-black text-sm transition-all ${
                      topUpAmount === amount
                        ? 'custom-gradient text-white shadow-lg shadow-orange-200'
                        : 'bg-white border-2 border-gray-200 text-gray-900 hover:border-orange-400'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-600">Custom amount:</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 font-bold">$</span>
                  <input
                    type="number"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(Number(e.target.value))}
                    className="w-full pl-7 pr-4 py-2 border-2 border-gray-200 rounded-lg font-bold focus:border-orange-500 outline-none"
                    min="10"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-900">Payment Method</label>
              <div className="grid grid-cols-2 gap-4">
                {(['paynow', 'card'] as const).map(method => (
                  <label
                    key={method}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedPaymentMethod === method
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 bg-white hover:border-orange-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method}
                      checked={selectedPaymentMethod === method}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value as any)}
                      className="mb-2"
                    />
                    <p className="font-bold text-gray-900 capitalize">{method}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {method === 'paynow' ? 'Instant' : '2-3 hours'}
                    </p>
                  </label>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Amount to add:</span>
                <span className="font-black text-lg text-gray-900">${topUpAmount.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
                <span className="text-gray-600">New balance:</span>
                <span className="font-black text-lg text-orange-600">
                  ${(wallet.balance + topUpAmount).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowTopUp(false)}
                className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-200 text-gray-900 font-bold uppercase tracking-widest hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleTopUp}
                disabled={isProcessing}
                className="flex-1 custom-gradient text-white py-3 rounded-lg font-bold uppercase tracking-widest hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap size={18} /> Add ${topUpAmount}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transaction History */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <History size={24} className="text-orange-600" />
          <h2 className="text-2xl font-black text-gray-900">Transaction History</h2>
        </div>

        <div className="space-y-3">
          {wallet.transactions.length > 0 ? (
            wallet.transactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl p-4 border border-gray-100 hover:border-orange-200 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${
                      transaction.type === 'credit'
                        ? 'bg-green-50 text-green-600'
                        : 'bg-blue-50 text-blue-600'
                    }`}>
                      {transaction.type === 'credit' ? (
                        <ArrowDown size={20} />
                      ) : (
                        <ArrowUp size={20} />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{transaction.description}</p>
                      <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                    </div>
                  </div>
                  <div className={`font-black text-lg ${
                    transaction.type === 'credit'
                      ? 'text-green-600'
                      : 'text-blue-600'
                  }`}>
                    {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <CreditCard size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 font-bold">No transactions yet</p>
              <p className="text-sm text-gray-400">Start by adding money to your wallet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
