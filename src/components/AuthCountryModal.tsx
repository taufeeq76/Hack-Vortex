import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { COUNTRIES, CountryInfo } from '../data/countries';
import { UserAuthSession } from '../types';
import {
  validateLogin,
  registerAccount,
  resetPassword,
  findAccountByIdentifier,
  getStoredAccounts,
  UserAccount,
} from '../services/authStorage';
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
  ArrowRight,
  KeyRound,
  UserPlus,
  LogIn,
  AlertCircle,
  Mail,
  Check,
  HelpCircle,
} from 'lucide-react';

export type AuthMode = 'signin' | 'signup' | 'forgot';

interface AuthCountryModalProps {
  isOpen: boolean;
  currentAuth: UserAuthSession;
  onAuthenticate: (session: UserAuthSession) => void;
  canDismiss?: boolean;
  onClose?: () => void;
  initialMode?: AuthMode;
}

export const AuthCountryModal: React.FC<AuthCountryModalProps> = ({
  isOpen,
  currentAuth,
  onAuthenticate,
  canDismiss = false,
  onClose,
  initialMode = 'signin',
}) => {
  const [authMode, setAuthMode] = useState<AuthMode>(initialMode);

  // Common Fields
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(
    currentAuth.countryCode || 'IN'
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign In Fields
  const [signInIdentifier, setSignInIdentifier] = useState(currentAuth.userId || '');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up Fields
  const [signUpUserId, setSignUpUserId] = useState('');
  const [signUpFullName, setSignUpFullName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // Forgot Password Fields
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotVerificationCode, setForgotVerificationCode] = useState('849201');
  const [isAccountVerified, setIsAccountVerified] = useState(false);

  // Status & Feedback
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Reset errors when mode changes
  useEffect(() => {
    setErrorMessage('');
    setSuccessMessage('');
  }, [authMode]);

  // Sync initial identifier if provided
  useEffect(() => {
    if (currentAuth.userId && !signInIdentifier) {
      setSignInIdentifier(currentAuth.userId);
    }
  }, [currentAuth.userId]);

  if (!isOpen) return null;

  const selectedCountry = COUNTRIES.find((c) => c.code === selectedCountryCode) || COUNTRIES[0];

  // -------------------------------------------------------------
  // Sign In Submission
  // -------------------------------------------------------------
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const result = validateLogin(signInIdentifier, signInPassword);

      if (!result.success || !result.account) {
        setErrorMessage(result.error || 'Failed to sign in. Please verify your credentials.');
        setIsLoading(false);
        return;
      }

      const acc = result.account;
      setSuccessMessage(`Welcome back, ${acc.fullName || acc.userId}! Synchronizing athlete telemetry...`);

      setTimeout(() => {
        setIsLoading(false);
        onAuthenticate({
          userId: acc.userId,
          email: acc.email,
          fullName: acc.fullName,
          countryCode: selectedCountryCode || acc.countryCode,
          isLoggedIn: true,
          loginTimestamp: new Date().toISOString(),
        });
      }, 500);
    }, 350);
  };

  // -------------------------------------------------------------
  // Sign Up / Create Account Submission
  // -------------------------------------------------------------
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (signUpPassword !== signUpConfirmPassword) {
      setErrorMessage('Passwords do not match. Please ensure both passwords match.');
      return;
    }

    if (signUpPassword.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }

    if (!agreedToTerms) {
      setErrorMessage('Please agree to the VYLO Athletic Code & Terms of Service to continue.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const result = registerAccount({
        userId: signUpUserId,
        fullName: signUpFullName,
        email: signUpEmail,
        password: signUpPassword,
        countryCode: selectedCountryCode,
      });

      if (!result.success || !result.account) {
        setErrorMessage(result.error || 'Registration failed. Please try a different User ID or Email.');
        setIsLoading(false);
        return;
      }

      const acc = result.account;
      setSuccessMessage(`🎉 Account created successfully for ${acc.userId}! Logging you in...`);

      setTimeout(() => {
        setIsLoading(false);
        onAuthenticate({
          userId: acc.userId,
          email: acc.email,
          fullName: acc.fullName,
          countryCode: acc.countryCode,
          isLoggedIn: true,
          loginTimestamp: new Date().toISOString(),
        });
      }, 700);
    }, 400);
  };

  // -------------------------------------------------------------
  // Forgot / Reset Password Submission
  // -------------------------------------------------------------
  const handleVerifyAccount = () => {
    setErrorMessage('');
    const clean = forgotIdentifier.trim();
    if (!clean) {
      setErrorMessage('Please enter your User ID or registered Email.');
      return;
    }

    const found = findAccountByIdentifier(clean);
    if (!found) {
      setErrorMessage(`No account found matching "${clean}". Check spelling or create a new account.`);
      return;
    }

    setIsAccountVerified(true);
    setSuccessMessage(`Verified account for athlete: ${found.userId} (${found.email}). Enter your new password below.`);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!forgotIdentifier.trim()) {
      setErrorMessage('Please enter your User ID or Email.');
      return;
    }

    if (!forgotNewPassword) {
      setErrorMessage('Please enter a new password.');
      return;
    }

    if (forgotNewPassword.length < 4) {
      setErrorMessage('New password must be at least 4 characters long.');
      return;
    }

    if (forgotNewPassword !== forgotConfirmPassword) {
      setErrorMessage('New passwords do not match. Please verify both fields.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const result = resetPassword(forgotIdentifier, forgotNewPassword);

      if (!result.success || !result.account) {
        setErrorMessage(result.error || 'Unable to update password. Please check your details.');
        setIsLoading(false);
        return;
      }

      setSuccessMessage(
        `✅ Password updated successfully for ${result.account.userId}! You can now sign in with your new credentials.`
      );
      setIsLoading(false);

      // Pre-fill Sign In and switch after a brief moment
      setTimeout(() => {
        setSignInIdentifier(result.account?.userId || forgotIdentifier);
        setSignInPassword(forgotNewPassword);
        setAuthMode('signin');
        setForgotNewPassword('');
        setForgotConfirmPassword('');
        setIsAccountVerified(false);
      }, 1500);
    }, 450);
  };

  // Quick Demo Account Helper
  const handleSelectDemoAccount = (demoUser: UserAccount) => {
    setSignInIdentifier(demoUser.userId);
    setSignInPassword(demoUser.password);
    setSelectedCountryCode(demoUser.countryCode);
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 12 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-xl bg-gradient-to-b from-[#161b17] via-[#101311] to-[#0a0c0a] border border-emerald-500/30 rounded-3xl p-5 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.85)] max-h-[92vh] overflow-y-auto scrollbar-thin"
      >
        {/* Top Header Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              {authMode === 'signin' && <LogIn size={18} />}
              {authMode === 'signup' && <UserPlus size={18} />}
              {authMode === 'forgot' && <KeyRound size={18} />}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400 block">
                Universal Athlete Gateway
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-brand text-white tracking-tight">
                {authMode === 'signin' && 'Sign In to VYLO'}
                {authMode === 'signup' && 'Create Your Account'}
                {authMode === 'forgot' && 'Reset Your Password'}
              </h2>
            </div>
          </div>

          {canDismiss && onClose && (
            <button
              onClick={onClose}
              type="button"
              className="text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Tab Switcher Pills */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#121613] border border-white/10 rounded-2xl mb-4">
          <button
            type="button"
            onClick={() => setAuthMode('signin')}
            className={`py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'signin'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <LogIn size={13} />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('signup')}
            className={`py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'signup'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <UserPlus size={13} />
            <span>Create Account</span>
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('forgot')}
            className={`py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'forgot'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <KeyRound size={13} />
            <span>Forgot Password</span>
          </button>
        </div>

        {/* Informative Subtitle Banner */}
        <p className="text-xs text-gray-400 mb-4 leading-relaxed">
          {authMode === 'signin' &&
            'Welcome back! Enter your athlete credentials to sync your training telemetry, quests, and localized sports science.'}
          {authMode === 'signup' &&
            'Create your athlete identity. Calibrate your origin country, daily calorie targets, and unlock your ZYRO AI copilot.'}
          {authMode === 'forgot' &&
            'Lost your credentials? Enter your User ID or registered Email to verify your identity and set a new password.'}
        </p>

        {/* Error / Success Feedback Banners */}
        <AnimatePresence mode="wait">
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mb-4 text-xs text-rose-300 font-bold bg-rose-500/15 border border-rose-500/30 rounded-xl p-3 flex items-start gap-2"
            >
              <AlertCircle size={15} className="text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mb-4 text-xs text-emerald-300 font-bold bg-emerald-500/15 border border-emerald-500/30 rounded-xl p-3 flex items-start gap-2"
            >
              <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ======================================================== */}
        {/* MODE 1: SIGN IN FORM */}
        {/* ======================================================== */}
        {authMode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            {/* Quick Demo Pre-fills for Quick Testing */}
            <div className="bg-[#121613] border border-white/10 rounded-2xl p-3">
              <div className="flex items-center justify-between text-[11px] mb-2">
                <span className="text-gray-400 font-bold flex items-center gap-1.5">
                  <Sparkles size={12} className="text-emerald-400" />
                  <span>Existing Demo Accounts (1-Click Fill):</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">Ready to Test</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {getStoredAccounts()
                  .slice(0, 3)
                  .map((demo) => (
                    <button
                      key={demo.userId}
                      type="button"
                      onClick={() => handleSelectDemoAccount(demo)}
                      className="text-xs px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-emerald-500/20 hover:border-emerald-500/40 border border-white/10 text-gray-300 hover:text-white transition-all flex items-center gap-1.5"
                    >
                      <span>
                        {demo.countryCode === 'IN' ? '🇮🇳' : demo.countryCode === 'US' ? '🇺🇸' : '🇬🇧'}
                      </span>
                      <span className="font-bold">{demo.userId}</span>
                      <span className="text-[10px] text-gray-500">({demo.password})</span>
                    </button>
                  ))}
              </div>
            </div>

            {/* Country Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Globe size={14} className="text-emerald-400" />
                  <span>Country of Origin & Currency</span>
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
                    className="w-full bg-[#181d19] border border-emerald-900/60 focus:border-emerald-500 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-bold focus:outline-none appearance-none cursor-pointer"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code} className="bg-[#141815] text-white">
                        {c.flag} {c.name} — {c.currency} ({c.currencySymbol})
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3.5 top-3 pointer-events-none text-emerald-400 text-xs font-bold">
                    ▼
                  </div>
                </div>

                {/* Popular Country Quick Pills */}
                <div className="flex items-center gap-1 overflow-x-auto py-0.5 scrollbar-none">
                  {[
                    { code: 'IN', label: '🇮🇳 India' },
                    { code: 'US', label: '🇺🇸 USA' },
                    { code: 'GB', label: '🇬🇧 UK' },
                    { code: 'DE', label: '🇩🇪 Germany' },
                    { code: 'CA', label: '🇨🇦 Canada' },
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

            {/* User ID / Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                <User size={14} className="text-emerald-400" />
                <span>Athlete User ID or Registered Email</span>
              </label>
              <input
                type="text"
                value={signInIdentifier}
                onChange={(e) => setSignInIdentifier(e.target.value)}
                placeholder="e.g. Hunter_Balaji or balaji@vylo.fit"
                required
                className="w-full bg-[#181d19] border border-emerald-900/60 focus:border-emerald-500 rounded-2xl px-3.5 py-3 text-sm text-white font-medium focus:outline-none placeholder-gray-500 transition-colors"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                  <Lock size={14} className="text-emerald-400" />
                  <span>Password</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotIdentifier(signInIdentifier);
                    setAuthMode('forgot');
                  }}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-bold transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-[#181d19] border border-emerald-900/60 focus:border-emerald-500 rounded-2xl px-3.5 py-3 text-sm text-white font-medium focus:outline-none placeholder-gray-500 pr-10 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-white"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-gray-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-emerald-800 text-emerald-500 focus:ring-0 bg-[#181d19] w-4 h-4 cursor-pointer"
                />
                <span>Remember me on this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-black text-sm uppercase tracking-widest shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating Telemetry...</span>
              ) : (
                <>
                  <span>Sign In to VYLO</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            {/* Switch to Sign Up */}
            <div className="text-center pt-2 border-t border-white/5">
              <p className="text-xs text-gray-400">
                New to VYLO and don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className="text-emerald-400 hover:text-emerald-300 font-black hover:underline cursor-pointer"
                >
                  Create an Account
                </button>
              </p>
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* MODE 2: CREATE AN ACCOUNT (SIGN UP) */}
        {/* ======================================================== */}
        {authMode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3.5">
            {/* User ID & Full Name in Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                  <User size={14} className="text-emerald-400" />
                  <span>Athlete User ID / Codename</span>
                </label>
                <input
                  type="text"
                  value={signUpUserId}
                  onChange={(e) => setSignUpUserId(e.target.value)}
                  placeholder="e.g. IronHunter_99"
                  required
                  className="w-full bg-[#181d19] border border-emerald-900/60 focus:border-emerald-500 rounded-2xl px-3.5 py-2.5 text-sm text-white font-medium focus:outline-none placeholder-gray-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                  <span>Full Display Name</span>
                </label>
                <input
                  type="text"
                  value={signUpFullName}
                  onChange={(e) => setSignUpFullName(e.target.value)}
                  placeholder="e.g. Jordan Hayes"
                  required
                  className="w-full bg-[#181d19] border border-emerald-900/60 focus:border-emerald-500 rounded-2xl px-3.5 py-2.5 text-sm text-white font-medium focus:outline-none placeholder-gray-500"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                <Mail size={14} className="text-emerald-400" />
                <span>Email Address (for telemetry & recovery)</span>
              </label>
              <input
                type="email"
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
                placeholder="e.g. jordan@athlete.io"
                required
                className="w-full bg-[#181d19] border border-emerald-900/60 focus:border-emerald-500 rounded-2xl px-3.5 py-2.5 text-sm text-white font-medium focus:outline-none placeholder-gray-500"
              />
            </div>

            {/* Country Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Globe size={14} className="text-emerald-400" />
                  <span>Country of Residence</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                  {selectedCountry.flag} {selectedCountry.name}
                </span>
              </label>
              <div className="relative">
                <select
                  value={selectedCountryCode}
                  onChange={(e) => setSelectedCountryCode(e.target.value)}
                  className="w-full bg-[#181d19] border border-emerald-900/60 focus:border-emerald-500 rounded-2xl px-3.5 py-2.5 text-sm text-white font-bold focus:outline-none appearance-none cursor-pointer"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code} className="bg-[#141815] text-white">
                      {c.flag} {c.name} — {c.currency} ({c.currencySymbol})
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-3 pointer-events-none text-emerald-400 text-xs font-bold">
                  ▼
                </div>
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                  <Lock size={14} className="text-emerald-400" />
                  <span>Create Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="Min 4 characters"
                    required
                    className="w-full bg-[#181d19] border border-emerald-900/60 focus:border-emerald-500 rounded-2xl px-3.5 py-2.5 text-sm text-white font-medium focus:outline-none placeholder-gray-500 pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                  <Check size={14} className="text-emerald-400" />
                  <span>Confirm Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={signUpConfirmPassword}
                    onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    required
                    className="w-full bg-[#181d19] border border-emerald-900/60 focus:border-emerald-500 rounded-2xl px-3.5 py-2.5 text-sm text-white font-medium focus:outline-none placeholder-gray-500 pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-2.5 text-xs text-gray-300 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 rounded border-emerald-800 text-emerald-500 focus:ring-0 bg-[#181d19] w-4 h-4 cursor-pointer"
              />
              <span>
                I agree to the VYLO Athletic Code, Privacy Policy, and Localized Telemetry Sync.
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-black text-sm uppercase tracking-widest shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <UserPlus size={16} />
                  <span>Create Account & Ascend</span>
                </>
              )}
            </button>

            {/* Switch to Sign In */}
            <div className="text-center pt-2 border-t border-white/5">
              <p className="text-xs text-gray-400">
                Already registered with an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className="text-emerald-400 hover:text-emerald-300 font-black hover:underline cursor-pointer"
                >
                  Sign In here
                </button>
              </p>
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* MODE 3: FORGOT PASSWORD / CHANGE PASSWORD */}
        {/* ======================================================== */}
        {authMode === 'forgot' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="bg-[#121613] border border-amber-500/20 rounded-2xl p-3.5 flex items-start gap-2.5">
              <KeyRound size={16} className="text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-gray-300 leading-relaxed">
                <span className="text-amber-300 font-bold block mb-0.5">Password Recovery Protocol</span>
                Enter your registered User ID or Email. You can immediately set and save your new password to regain access to your hunter telemetry.
              </div>
            </div>

            {/* User ID / Email Input with Verify Action */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <User size={14} className="text-emerald-400" />
                  <span>Athlete User ID or Email</span>
                </span>
                {isAccountVerified && (
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 size={12} /> Account Verified
                  </span>
                )}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={forgotIdentifier}
                  onChange={(e) => {
                    setForgotIdentifier(e.target.value);
                    setIsAccountVerified(false);
                  }}
                  placeholder="e.g. Hunter_Balaji or balaji@vylo.fit"
                  required
                  className="flex-1 bg-[#181d19] border border-emerald-900/60 focus:border-emerald-500 rounded-2xl px-3.5 py-3 text-sm text-white font-medium focus:outline-none placeholder-gray-500"
                />
                <button
                  type="button"
                  onClick={handleVerifyAccount}
                  className="px-3.5 py-3 rounded-2xl bg-white/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold whitespace-nowrap transition-colors"
                >
                  Verify Account
                </button>
              </div>
            </div>

            {/* Simulated 6-digit Security Pin Code */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Shield size={14} className="text-emerald-400" />
                  <span>Security Authorization PIN</span>
                </span>
                <span className="text-[10px] text-gray-400">Auto-generated for your session</span>
              </label>
              <input
                type="text"
                value={forgotVerificationCode}
                onChange={(e) => setForgotVerificationCode(e.target.value)}
                maxLength={6}
                className="w-full bg-[#181d19] border border-emerald-900/60 focus:border-emerald-500 rounded-2xl px-3.5 py-2.5 text-center font-mono tracking-[0.3em] text-emerald-400 font-bold text-base focus:outline-none"
              />
            </div>

            {/* New Password & Confirm New Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                  <Lock size={14} className="text-emerald-400" />
                  <span>New Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    placeholder="Enter new password"
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

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                  <Check size={14} className="text-emerald-400" />
                  <span>Confirm New Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={forgotConfirmPassword}
                    onChange={(e) => setForgotConfirmPassword(e.target.value)}
                    placeholder="Re-type new password"
                    required
                    className="w-full bg-[#181d19] border border-emerald-900/60 focus:border-emerald-500 rounded-2xl px-3.5 py-3 text-sm text-white font-medium focus:outline-none placeholder-gray-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-3.5 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Reset Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 text-black font-black text-sm uppercase tracking-widest shadow-[0_0_25px_rgba(251,191,36,0.3)] hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Updating Password...</span>
              ) : (
                <>
                  <KeyRound size={16} />
                  <span>Change & Update Password</span>
                </>
              )}
            </button>

            {/* Back to Sign In */}
            <div className="text-center pt-2 border-t border-white/5">
              <p className="text-xs text-gray-400">
                Remember your password or finished updating?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className="text-emerald-400 hover:text-emerald-300 font-black hover:underline cursor-pointer"
                >
                  Back to Sign In
                </button>
              </p>
            </div>
          </form>
        )}

        {/* Live Calibrated Country Preview Box */}
        <div className="mt-5 bg-[#121613] border border-emerald-500/20 rounded-2xl p-3.5 space-y-2">
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
