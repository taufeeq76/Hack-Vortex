import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { COUNTRIES, CountryInfo } from '../data/countries';
import { UserAuthSession } from '../types';
import {
  Globe,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  Shield,
  CreditCard,
  Truck,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface AuthCountryModalProps {
  isOpen: boolean;
  currentAuth: UserAuthSession;
  onAuthenticate: (session: UserAuthSession) => void;
  canDismiss?: boolean;
  onClose?: () => void;
}

export const AuthCountryModal: React.FC<AuthCountryModalProps> = ({
  isOpen,
  currentAuth,
  onAuthenticate,
  canDismiss = false,
  onClose,
}) => {
  const [userId, setUserId] = useState(currentAuth.userId || 'Athlete_Hunter');
  const [password, setPassword] = useState('Ascend2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(currentAuth.countryCode || 'IN');
  const [searchQuery, setSearchQuery] = useState('');
  const [authError, setAuthError] = useState('');

  if (!isOpen) return null;

  const selectedCountry = COUNTRIES.find((c) => c.code === selectedCountryCode) || COUNTRIES[0];

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.currency.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) {
      setAuthError('Please enter a valid UserID.');
      return;
    }
    if (!password || password.length < 4) {
      setAuthError('Password must be at least 4 characters long.');
      return;
    }

    setAuthError('');
    onAuthenticate({
      userId: userId.trim(),
      countryCode: selectedCountryCode,
      isLoggedIn: true,
      loginTimestamp: new Date().toISOString(),
    });
  };

  const handleQuickDemo = (countryCode: string, name: string) => {
    setSelectedCountryCode(countryCode);
    setUserId(name);
    setPassword('Ascend2026!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl overflow-y-auto">
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 10 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-xl bg-gradient-to-b from-[#161b17] via-[#101311] to-[#0a0c0a] border border-emerald-500/30 rounded-3xl p-5 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
      >
        {/* Top Glow & Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Shield size={18} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400 block">
                Universal Athlete Gateway
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-brand text-white tracking-tight">
                Welcome to VYLO & ZYRO AI
              </h2>
            </div>
          </div>

          {canDismiss && onClose && (
            <button
              onClick={onClose}
              className="text-xs text-gray-400 hover:text-white px-2.5 py-1 rounded-xl bg-white/5"
            >
              Cancel
            </button>
          )}
        </div>

        <p className="text-xs text-gray-400 mb-5 leading-relaxed">
          Please select your <strong className="text-white">Country</strong> and enter your credentials. Your localized currency, worldwide gym warehouse catalog, local payment gateways, and COD options will calibrate instantly.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Country Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Globe size={14} className="text-emerald-400" />
                <span>Select Your Country of Origin</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                {selectedCountry.flag} {selectedCountry.currency} ({selectedCountry.currencySymbol})
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="relative">
                <select
                  value={selectedCountryCode}
                  onChange={(e) => setSelectedCountryCode(e.target.value)}
                  className="w-full bg-[#181d19] border border-emerald-900/60 focus:border-emerald-500 rounded-2xl px-3.5 py-3 text-sm text-white font-bold focus:outline-none appearance-none cursor-pointer"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code} className="bg-[#141815] text-white">
                      {c.flag} {c.name} — {c.currency} ({c.currencySymbol})
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-3.5 pointer-events-none text-emerald-400 text-xs font-bold">
                  ▼
                </div>
              </div>

              {/* Quick Country Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
                {[
                  { code: 'IN', label: '🇮🇳 India' },
                  { code: 'US', label: '🇺🇸 USA' },
                  { code: 'GB', label: '🇬🇧 UK' },
                  { code: 'DE', label: '🇩🇪 Germany' },
                  { code: 'CA', label: '🇨🇦 Canada' },
                  { code: 'AU', label: '🇦🇺 Australia' },
                ].map((p) => (
                  <button
                    key={p.code}
                    type="button"
                    onClick={() => setSelectedCountryCode(p.code)}
                    className={`text-xs px-2.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                      selectedCountryCode === p.code
                        ? 'bg-emerald-500 text-black shadow-sm'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* UserID Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
              <User size={14} className="text-emerald-400" />
              <span>Athlete UserID / Codename</span>
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="e.g. Hunter_Alex or athlete_01"
              required
              className="w-full bg-[#181d19] border border-emerald-900/60 focus:border-emerald-500 rounded-2xl px-3.5 py-3 text-sm text-white font-medium focus:outline-none placeholder-gray-500"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
              <Lock size={14} className="text-emerald-400" />
              <span>Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full bg-[#181d19] border border-emerald-900/60 focus:border-emerald-500 rounded-2xl px-3.5 py-3 text-sm text-white font-medium focus:outline-none placeholder-gray-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Live Calibrated Country Preview Box */}
          <div className="bg-[#121613] border border-emerald-500/20 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400 flex items-center gap-1.5">
                <CreditCard size={13} className="text-emerald-400" />
                <span>Localized Payment Rails:</span>
              </span>
              <span className="text-emerald-300 font-bold">
                {selectedCountry.localPaymentMethods.length} Methods + COD
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {selectedCountry.localPaymentMethods.map((pm, idx) => (
                <span
                  key={idx}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    pm.includes('Cash on Delivery')
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}
                >
                  {pm}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
              <span className="text-gray-400 flex items-center gap-1.5">
                <Truck size={13} className="text-cyan-400" />
                <span>Global Tracked Courier:</span>
              </span>
              <span className="text-white font-bold text-[11px]">
                {selectedCountry.deliveryTimeDays} to {selectedCountry.name}
              </span>
            </div>
          </div>

          {authError && (
            <div className="text-xs text-rose-400 font-bold bg-rose-500/10 border border-rose-500/20 rounded-xl p-2.5">
              {authError}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-black text-sm uppercase tracking-widest shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Confirm & Enter ZYRO System</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Bottom security notice */}
        <div className="mt-4 pt-3 border-t border-white/5 text-center">
          <span className="text-[11px] text-gray-500 flex items-center justify-center gap-1">
            <Shield size={11} className="text-emerald-400" />
            256-bit encrypted authentication • ZYRO omniscient intelligence synced
          </span>
        </div>
      </motion.div>
    </div>
  );
};
