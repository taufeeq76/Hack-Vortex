import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UserHealthProfile,
  BodyShape,
  PrimaryGoal,
  PreferredTime,
  EquipmentItem
} from '../types';
import { ALL_EQUIPMENT_ITEMS, INITIAL_USER_PROFILE } from '../data/mockData';
import { Logo } from './Logo';
import { Mascot } from './Mascot';
import {
  Search,
  Plus,
  Check,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  ShieldCheck,
  Dumbbell,
  Clock,
  Calendar,
  Flame,
  Globe
} from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../i18n/translations';

interface ExtendedOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProfile?: UserHealthProfile;
  currentProfile?: UserHealthProfile;
  currentLanguage?: string;
  onLanguageChange?: (code: string) => void;
  onSaveProfile: (profile: UserHealthProfile) => void;
  isEditing?: boolean;
}

export const ExtendedOnboardingModal: React.FC<ExtendedOnboardingModalProps> = ({
  isOpen,
  onClose,
  initialProfile,
  currentProfile,
  currentLanguage = 'en',
  onLanguageChange,
  onSaveProfile,
  isEditing = false,
}) => {
  const baseProfile = currentProfile || initialProfile || INITIAL_USER_PROFILE;
  const [step, setStep] = useState<number>(1);
  const [profile, setProfile] = useState<UserHealthProfile>(baseProfile);
  const [equipmentSearch, setEquipmentSearch] = useState('');
  const [customEquipInput, setCustomEquipInput] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [isGeneratedSummary, setIsGeneratedSummary] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setProfile(currentProfile || initialProfile || INITIAL_USER_PROFILE);
    }
  }, [isOpen, currentProfile, initialProfile]);

  if (!isOpen) return null;

  // Weight & Height conversions
  const handleWeightToggle = (unit: 'kg' | 'lb') => {
    if (unit === profile.weightUnit) return;
    const newWeight = unit === 'lb' ? Math.round(profile.weightKg * 2.20462) : Math.round(profile.weightKg / 2.20462);
    setProfile({ ...profile, weightUnit: unit, weightKg: newWeight });
  };

  const handleHeightToggle = (unit: 'cm' | 'ft-in') => {
    setProfile({ ...profile, heightUnit: unit });
  };

  const toggleEquipment = (id: string) => {
    const exists = profile.ownedEquipment.includes(id);
    let updated: string[];
    if (id === 'eq_none') {
      updated = exists ? [] : ['eq_none'];
    } else {
      updated = exists
        ? profile.ownedEquipment.filter((x) => x !== id)
        : [...profile.ownedEquipment.filter((x) => x !== 'eq_none'), id];
    }
    setProfile({ ...profile, ownedEquipment: updated });
  };

  const addCustomEquipment = () => {
    if (!customEquipInput.trim()) return;
    const text = customEquipInput.trim();
    if (!profile.customEquipment.includes(text)) {
      setProfile({
        ...profile,
        customEquipment: [...profile.customEquipment, text],
      });
    }
    setCustomEquipInput('');
  };

  const removeCustomEquipment = (item: string) => {
    setProfile({
      ...profile,
      customEquipment: profile.customEquipment.filter((x) => x !== item),
    });
  };

  const filteredEquipment = ALL_EQUIPMENT_ITEMS.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(equipmentSearch.toLowerCase()) ||
      item.categoryLabel.toLowerCase().includes(equipmentSearch.toLowerCase());
    const matchesCategory = selectedCategoryFilter === 'all' || item.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const bodyShapes: { id: BodyShape; title: string; desc: string; icon: string; traits: string }[] = [
    {
      id: 'ectomorph',
      title: 'Ectomorph',
      desc: 'Naturally lean, narrower shoulders & hips, fast metabolism.',
      icon: '🏃‍♂️',
      traits: 'Focus on progressive overload, surplus calories & posture stability.',
    },
    {
      id: 'mesomorph',
      title: 'Mesomorph',
      desc: 'Athletic build, medium bone structure, responds quickly to resistance training.',
      icon: '⚡',
      traits: 'Balanced macro ratio, explosive athletic conditioning & agility.',
    },
    {
      id: 'endomorph',
      title: 'Endomorph',
      desc: 'Sturdier frame, gains muscle easily, tends to store reserves.',
      icon: '🛡️',
      traits: 'HIIT metabolic conditioning, steady-state cardio & clean protein timing.',
    },
    {
      id: 'not_sure',
      title: 'Hybrid / Not Sure',
      desc: 'A mix of traits or discovering your fitness baseline.',
      icon: '🌱',
      traits: 'ZYRO AI adapts dynamically as your activity logs evolve.',
    },
  ];

  const goals: { id: PrimaryGoal; title: string; badge: string; desc: string }[] = [
    {
      id: 'gain_muscle_posture',
      title: 'Gain Muscle & Posture Mobility',
      badge: 'Ascend & Build',
      desc: 'Hypertrophy, core stability, spinal decompression, growth & posture-safe college athletic training.',
    },
    {
      id: 'lose_weight_fat',
      title: 'Lose Weight & Burn Fat',
      badge: 'Shred & Deficit',
      desc: 'Caloric efficiency, high-density calorie burning circuits, metabolic conditioning.',
    },
    {
      id: 'general_fitness_active',
      title: 'General Fitness & Daily Energy',
      badge: 'Vigorous Vitality',
      desc: 'Elevate stamina, crush dorm fatigue, keep heart and brain healthy for exams.',
    },
  ];

  const totalSteps = 4;

  const handleFinish = () => {
    onSaveProfile(profile);
    setIsGeneratedSummary(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#101318] border border-emerald-500/20 rounded-3xl p-5 sm:p-8 shadow-[0_10px_50px_rgba(0,0,0,0.8)] my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <div className="h-4 w-[1px] bg-white/20" />
            <span className="text-xs font-bold tracking-wider uppercase text-emerald-400">
              {isEditing ? 'Edit Body Profile' : 'Health & Body Architecture'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Generated Summary Card View */}
        {isGeneratedSummary ? (
          <div className="py-6 space-y-6 overflow-y-auto">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto">
                <Sparkles size={24} />
              </div>
              <h2 className="text-2xl font-bold font-brand tracking-tight text-white">
                Health & Body Profile Generated
              </h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                ZYRO AI has compiled your baseline biometrics into your personal athletic profile.
              </p>
            </div>

            {/* Profile Card Output */}
            <div className="bg-gradient-to-br from-[#161a22] to-[#0d1015] border border-emerald-500/30 rounded-2xl p-5 space-y-4 shadow-xl relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                    ZYRO Athlete ID #8492
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    {goals.find((g) => g.id === profile.primaryGoal)?.title}
                  </h3>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                  {profile.bodyShape.toUpperCase()}
                </div>
              </div>

              {/* Grid Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-black/30 rounded-xl p-3 border border-white/5">
                  <span className="text-[11px] text-slate-400 block">Weight</span>
                  <span className="text-lg font-extrabold text-white">
                    {profile.weightKg} {profile.weightUnit}
                  </span>
                </div>
                <div className="bg-black/30 rounded-xl p-3 border border-white/5">
                  <span className="text-[11px] text-slate-400 block">Height</span>
                  <span className="text-lg font-extrabold text-white">
                    {profile.heightUnit === 'cm'
                      ? `${profile.heightCm} cm`
                      : `${Math.floor(profile.heightCm / 30.48)}'${Math.round((profile.heightCm % 30.48) / 2.54)}"`}
                  </span>
                </div>
                <div className="bg-black/30 rounded-xl p-3 border border-white/5">
                  <span className="text-[11px] text-slate-400 block">Daily Target</span>
                  <span className="text-lg font-extrabold text-emerald-400">
                    {profile.dailyWorkoutMinutes} min
                  </span>
                </div>
                <div className="bg-black/30 rounded-xl p-3 border border-white/5">
                  <span className="text-[11px] text-slate-400 block">Preferred Slot</span>
                  <span className="text-lg font-extrabold text-slate-200 capitalize">
                    {profile.preferredTime}
                  </span>
                </div>
              </div>

              {/* Equipment Inventory Summary */}
              <div className="bg-black/20 rounded-xl p-3 border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Dumbbell size={14} className="text-emerald-400" />
                    Equipment Access ({profile.ownedEquipment.length + profile.customEquipment.length} items)
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1 max-h-24 overflow-y-auto">
                  {profile.ownedEquipment.map((id) => {
                    const item = ALL_EQUIPMENT_ITEMS.find((x) => x.id === id);
                    return (
                      <span
                        key={id}
                        className="text-[11px] bg-emerald-950/60 border border-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md"
                      >
                        {item ? item.name : id}
                      </span>
                    );
                  })}
                  {profile.customEquipment.map((cust, i) => (
                    <span
                      key={i}
                      className="text-[11px] bg-teal-950/60 border border-teal-500/20 text-teal-300 px-2 py-0.5 rounded-md"
                    >
                      {cust} (Custom)
                    </span>
                  ))}
                </div>
              </div>

              {/* Routine Snapshot */}
              <div className="bg-black/20 rounded-xl p-3 border border-white/5 space-y-1 text-xs">
                <span className="font-semibold text-slate-300 block mb-1">Daily Schedule Snapshot</span>
                <p className="text-slate-400">📚 Classes: <span className="text-slate-200">{profile.routine.classWorkHours}</span></p>
                <p className="text-slate-400">🚌 Commute: <span className="text-slate-200">{profile.routine.commuteTime}</span></p>
                <p className="text-slate-400">🌙 Sleep: <span className="text-slate-200">{profile.routine.sleepSchedule}</span></p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/5">
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <ShieldCheck size={14} /> Synchronized with Fit Score & Diet Engine
                </span>
                <span className="text-[11px] text-slate-500">Edit anytime in Settings → Body Profile</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-extrabold text-sm tracking-wide uppercase hover:opacity-95 shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
            >
              Enter VYLO Campus Dashboard →
            </button>
          </div>
        ) : (
          /* Multi-step onboarding form */
          <div className="flex-1 flex flex-col overflow-hidden py-4">
            {/* Step indicator */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400">
                Step {step} of {totalSteps}
              </span>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((s) => (
                  <div
                    key={s}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      s === step ? 'w-8 bg-emerald-400' : s < step ? 'w-4 bg-emerald-600' : 'w-4 bg-white/10'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Scrollable Step Content */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-5">
              {/* STEP 1: Biometrics & Body Shape */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                  <div>
                    <h3 className="text-lg font-bold text-white">Body Architecture</h3>
                    <p className="text-xs text-slate-400">Configure your biometrics for tailored energy calculation.</p>
                  </div>

                  {/* Weight Toggle & Input */}
                  <div className="bg-[#141820] border border-white/5 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-300">Weight</label>
                      <div className="flex bg-black/40 p-0.5 rounded-lg border border-white/10 text-xs">
                        <button
                          type="button"
                          onClick={() => handleWeightToggle('kg')}
                          className={`px-3 py-1 rounded-md font-bold transition-all ${
                            profile.weightUnit === 'kg' ? 'bg-emerald-500 text-black' : 'text-slate-400'
                          }`}
                        >
                          KG
                        </button>
                        <button
                          type="button"
                          onClick={() => handleWeightToggle('lb')}
                          className={`px-3 py-1 rounded-md font-bold transition-all ${
                            profile.weightUnit === 'lb' ? 'bg-emerald-500 text-black' : 'text-slate-400'
                          }`}
                        >
                          LB
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        value={profile.weightKg}
                        onChange={(e) => setProfile({ ...profile, weightKg: Number(e.target.value) || 0 })}
                        className="w-32 bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xl font-bold text-white text-center focus:outline-none focus:border-emerald-500"
                      />
                      <span className="text-sm font-semibold text-slate-400">{profile.weightUnit}</span>
                    </div>
                  </div>

                  {/* Height Toggle & Input */}
                  <div className="bg-[#141820] border border-white/5 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-300">Height</label>
                      <div className="flex bg-black/40 p-0.5 rounded-lg border border-white/10 text-xs">
                        <button
                          type="button"
                          onClick={() => handleHeightToggle('cm')}
                          className={`px-3 py-1 rounded-md font-bold transition-all ${
                            profile.heightUnit === 'cm' ? 'bg-emerald-500 text-black' : 'text-slate-400'
                          }`}
                        >
                          CM
                        </button>
                        <button
                          type="button"
                          onClick={() => handleHeightToggle('ft-in')}
                          className={`px-3 py-1 rounded-md font-bold transition-all ${
                            profile.heightUnit === 'ft-in' ? 'bg-emerald-500 text-black' : 'text-slate-400'
                          }`}
                        >
                          FT-IN
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        value={profile.heightCm}
                        onChange={(e) => setProfile({ ...profile, heightCm: Number(e.target.value) || 0 })}
                        className="w-32 bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xl font-bold text-white text-center focus:outline-none focus:border-emerald-500"
                      />
                      <span className="text-sm font-semibold text-slate-400">
                        {profile.heightUnit === 'cm'
                          ? 'cm'
                          : `(~${Math.floor(profile.heightCm / 30.48)}'${Math.round((profile.heightCm % 30.48) / 2.54)}")`}
                      </span>
                    </div>
                  </div>

                  {/* Body Shape / Structure Cards */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Body Structure Archetype
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {bodyShapes.map((shape) => {
                        const isSelected = profile.bodyShape === shape.id;
                        return (
                          <div
                            key={shape.id}
                            onClick={() => setProfile({ ...profile, bodyShape: shape.id })}
                            className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-emerald-950/40 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                                : 'bg-[#141820] border-white/5 hover:border-white/20'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xl">{shape.icon}</span>
                              <span className="font-bold text-sm text-white">{shape.title}</span>
                              {isSelected && <Check size={16} className="text-emerald-400 ml-auto" />}
                            </div>
                            <p className="text-[11px] text-slate-400 leading-tight mb-1.5">{shape.desc}</p>
                            <p className="text-[10px] text-emerald-400/90 font-medium">{shape.traits}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Goal & Daily Routine */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                  <div>
                    <h3 className="text-lg font-bold text-white">Goals & Daily Rhythm</h3>
                    <p className="text-xs text-slate-400">We calibrate your training around classes and exams.</p>
                  </div>

                  {/* Primary Goal Selection */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-semibold text-slate-300">Primary Objective</label>
                    <div className="space-y-2">
                      {goals.map((g) => {
                        const isSelected = profile.primaryGoal === g.id;
                        return (
                          <div
                            key={g.id}
                            onClick={() => setProfile({ ...profile, primaryGoal: g.id })}
                            className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-emerald-950/40 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                                : 'bg-[#141820] border-white/5 hover:border-white/20'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-sm text-white">{g.title}</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                                {g.badge}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400">{g.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Available workout time slider */}
                  <div className="bg-[#141820] border border-white/5 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Clock size={14} className="text-emerald-400" />
                        Today’s Available Workout Time
                      </label>
                      <span className="text-sm font-extrabold text-emerald-400">
                        {profile.dailyWorkoutMinutes} Minutes
                      </span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={75}
                      step={5}
                      value={profile.dailyWorkoutMinutes}
                      onChange={(e) => setProfile({ ...profile, dailyWorkoutMinutes: Number(e.target.value) })}
                      className="w-full accent-emerald-400 h-2 bg-black/40 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                      <span>10m (Express)</span>
                      <span>20m</span>
                      <span>30m</span>
                      <span>45m (Optimal)</span>
                      <span>60m+</span>
                    </div>
                  </div>

                  {/* Preferred Time Slot */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">Preferred Routine Slot</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(['morning', 'afternoon', 'evening', 'late_night'] as PreferredTime[]).map((slot) => {
                        const labels = {
                          morning: '🌅 Morning',
                          afternoon: '☀️ Afternoon',
                          evening: '🌆 Evening',
                          late_night: '🌙 Late Night',
                        };
                        const isSelected = profile.preferredTime === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setProfile({ ...profile, preferredTime: slot })}
                            className={`py-2 px-3 rounded-xl border text-xs font-bold capitalize transition-all ${
                              isSelected
                                ? 'bg-emerald-500 text-black border-emerald-400 shadow-md'
                                : 'bg-[#141820] border-white/5 text-slate-300 hover:border-white/20'
                            }`}
                          >
                            {labels[slot]}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Daily Routine Snapshot */}
                  <div className="bg-[#141820] border border-white/5 rounded-2xl p-4 space-y-3">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Calendar size={14} className="text-emerald-400" />
                      Daily Campus Routine Snapshot
                    </label>
                    <div className="space-y-2">
                      <div>
                        <span className="text-[11px] text-slate-400 block mb-1">Class / Work Hours</span>
                        <input
                          type="text"
                          value={profile.routine.classWorkHours}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              routine: { ...profile.routine, classWorkHours: e.target.value },
                            })
                          }
                          placeholder="e.g. 9:00 AM – 4:00 PM"
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <span className="text-[11px] text-slate-400 block mb-1">Commute / Transit</span>
                          <input
                            type="text"
                            value={profile.routine.commuteTime}
                            onChange={(e) =>
                              setProfile({
                                ...profile,
                                routine: { ...profile.routine, commuteTime: e.target.value },
                              })
                            }
                            placeholder="e.g. 20m walking"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <span className="text-[11px] text-slate-400 block mb-1">Sleep Schedule</span>
                          <input
                            type="text"
                            value={profile.routine.sleepSchedule}
                            onChange={(e) =>
                              setProfile({
                                ...profile,
                                routine: { ...profile.routine, sleepSchedule: e.target.value },
                              })
                            }
                            placeholder="e.g. 11:30 PM – 7:00 AM"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Equipment Inventory Search & Checklist */}
              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Equipment Inventory</h3>
                    <p className="text-xs text-slate-400">
                      Search and select everything you have access to. Workouts and the VYLO Store adjust automatically.
                    </p>
                  </div>

                  {/* Search bar & Category filters */}
                  <div className="space-y-2">
                    <div className="relative">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={equipmentSearch}
                        onChange={(e) => setEquipmentSearch(e.target.value)}
                        placeholder="Search equipment (e.g., dumbbells, pullup bar, gym)..."
                        className="w-full bg-[#141820] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                      {equipmentSearch && (
                        <button
                          onClick={() => setEquipmentSearch('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    {/* Filter chips */}
                    <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px]">
                      {[
                        { id: 'all', label: 'All Equipment' },
                        { id: 'bodyweight', label: 'Bodyweight' },
                        { id: 'home_basics', label: 'Home Basics' },
                        { id: 'free_weights', label: 'Free Weights' },
                        { id: 'machines', label: 'Machines' },
                        { id: 'bodyweight_tools', label: 'Bars & Rings' },
                        { id: 'sports_gear', label: 'Sports Gear' },
                        { id: 'gym_access', label: 'Gym Access' },
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setSelectedCategoryFilter(cat.id)}
                          className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors ${
                            selectedCategoryFilter === cat.id
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                              : 'bg-black/30 text-slate-400 border border-white/5 hover:text-white'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Filterable Equipment List */}
                  <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
                    {filteredEquipment.map((item) => {
                      const isSelected = profile.ownedEquipment.includes(item.id);
                      return (
                        <div
                          key={item.id}
                          onClick={() => toggleEquipment(item.id)}
                          className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-emerald-950/40 border-emerald-500/60 text-white'
                              : 'bg-[#141820] border-white/5 text-slate-300 hover:border-white/20'
                          }`}
                        >
                          <div>
                            <span className="text-xs font-semibold block">{item.name}</span>
                            <span className="text-[10px] text-slate-400">{item.categoryLabel}</span>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                              isSelected
                                ? 'bg-emerald-500 border-emerald-400 text-black'
                                : 'border-white/20 bg-black/40'
                            }`}
                          >
                            {isSelected && <Check size={14} strokeWidth={3} />}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add Custom Equipment Free Text */}
                  <div className="bg-[#141820] border border-white/5 rounded-2xl p-3.5 space-y-2">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Plus size={14} className="text-emerald-400" />
                      Add Custom Equipment (Free Text)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customEquipInput}
                        onChange={(e) => setCustomEquipInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addCustomEquipment();
                          }
                        }}
                        placeholder="e.g. 20kg Ruck pack, Campus stairs, Sandbag..."
                        className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={addCustomEquipment}
                        className="px-4 py-2 rounded-xl bg-emerald-500 text-black text-xs font-bold hover:bg-emerald-400 transition-colors"
                      >
                        Add
                      </button>
                    </div>

                    {/* Custom Items Tags */}
                    {profile.customEquipment.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {profile.customEquipment.map((cItem, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 text-[11px] bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-lg"
                          >
                            {cItem}
                            <button
                              type="button"
                              onClick={() => removeCustomEquipment(cItem)}
                              className="hover:text-red-400"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Language & Confirmation */}
              {step === 4 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Language & Final Review</h3>
                    <p className="text-xs text-slate-400">Choose your preferred language across VYLO modules.</p>
                  </div>

                  {/* Language Selector Grid */}
                  <div className="bg-[#141820] border border-white/5 rounded-2xl p-4 space-y-3">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Globe size={14} className="text-emerald-400" />
                      App Language (16+ World Languages)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
                      {SUPPORTED_LANGUAGES.map((lang) => {
                        const isSelected = currentLanguage === lang.code;
                        return (
                          <button
                            key={lang.code}
                            type="button"
                            onClick={() => onLanguageChange(lang.code)}
                            className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                              isSelected
                                ? 'bg-emerald-500/20 border-emerald-400 text-white font-bold'
                                : 'bg-black/30 border-white/5 text-slate-300 hover:border-white/20'
                            }`}
                          >
                            <span className="text-base">{lang.flag}</span>
                            <div className="truncate">
                              <span className="text-xs block leading-none">{lang.nativeName}</span>
                              <span className="text-[9px] text-slate-500">{lang.name}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[11px] text-slate-500 italic">
                      More languages are added regularly across global student campuses.
                    </p>
                  </div>

                  {/* Mascot cheer */}
                  <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-4">
                    <Mascot state="happy" size="sm" showBubble={false} />
                    <div>
                      <h4 className="text-xs font-bold text-emerald-400">ZYRO AI is ready to generate your plan!</h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Your equipment, college schedule, and physical biometrics will now feed our AI Diet & Form check engines.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white px-3 py-2 rounded-xl transition-colors"
                >
                  <ChevronLeft size={16} /> Back
                </button>
              ) : (
                <div />
              )}

              {step < totalSteps ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s + 1)}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-extrabold text-xs tracking-wider uppercase hover:bg-emerald-400 shadow-md transition-all cursor-pointer"
                >
                  Next Step <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinish}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-extrabold text-xs tracking-wider uppercase hover:opacity-95 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
                >
                  Generate Health Profile <Sparkles size={16} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
