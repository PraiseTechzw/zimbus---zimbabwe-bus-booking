import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Mail, Lock, UserPlus, LogIn, RefreshCw, ShieldCheck } from 'lucide-react';

export type AuthMode = 'signin' | 'signup';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoogleSignIn: () => Promise<void>;
  onEmailSubmit: (payload: { email: string; password: string; mode: AuthMode }) => Promise<void>;
  onResetPassword: (email: string) => Promise<void>;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onGoogleSignIn,
  onEmailSubmit,
  onResetPassword,
}) => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setMode('signin');
      setEmail('');
      setPassword('');
      setLoading(false);
      setResetting(false);
      setError('');
      setMessage('');
    }
  }, [isOpen]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!email.trim() || !password.trim()) {
      setError('Enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      await onEmailSubmit({ email: email.trim(), password, mode });
      setMessage(mode === 'signup' ? 'Account created successfully.' : 'Signed in successfully.');
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Authentication failed.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await onGoogleSignIn();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Google sign-in failed.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setError('');
    setMessage('');

    if (!email.trim()) {
      setError('Enter your email first so we can send the reset link.');
      return;
    }

    setResetting(true);
    try {
      await onResetPassword(email.trim());
      setMessage('Password reset email sent. Check your inbox.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not send reset email.';
      setError(message);
    } finally {
      setResetting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/50 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            className="w-full max-w-lg bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">ZimBus Access</p>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight mt-1">
                  {mode === 'signin' ? 'Sign in to book' : 'Create your account'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label="Close authentication modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-2 rounded-2xl bg-gray-100 p-1">
                <button
                  onClick={() => setMode('signin')}
                  className={`py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
                    mode === 'signin' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setMode('signup')}
                  className={`py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
                    mode === 'signup' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <button
                onClick={handleGoogle}
                className="w-full flex items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 font-black text-gray-900 hover:border-orange-200 hover:bg-orange-50 transition-all"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  G
                </span>
                Continue with Google
              </button>

              <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 flex items-center gap-2">
                    <Mail size={12} className="text-orange-500" /> Email Address
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium"
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 flex items-center gap-2">
                    <Lock size={12} className="text-orange-500" /> Password
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium"
                    placeholder="Your password"
                    autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  />
                </label>

                {error && (
                  <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {error}
                  </div>
                )}

                {message && (
                  <div className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 flex items-center gap-2">
                    <ShieldCheck size={16} /> {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl custom-gradient px-5 py-4 font-black text-white shadow-lg shadow-orange-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {mode === 'signin' ? <LogIn size={18} /> : <UserPlus size={18} />}
                  {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
                </button>
              </form>

              <button
                onClick={handleReset}
                disabled={resetting}
                className="w-full rounded-2xl border border-gray-200 px-5 py-3 font-black text-sm uppercase tracking-widest text-gray-600 hover:border-orange-200 hover:text-orange-600 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <RefreshCw size={16} className={resetting ? 'animate-spin' : ''} />
                {resetting ? 'Sending reset email...' : 'Forgot password?'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
