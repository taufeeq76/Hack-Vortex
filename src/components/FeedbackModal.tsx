import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserFeedbackItem } from '../types';
import {
  MessageSquare,
  Sparkles,
  Star,
  CheckCircle2,
  X,
  History,
  Send,
  Flame,
  Zap,
  Tag
} from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const COMMUNITY_PATCH_NOTES = [
  {
    version: 'v2.8.0 (Current Release)',
    title: 'ZYRO Omniscience, Global Currencies & World Workout Engine',
    date: 'September 2026',
    requestedBy: 'Balaji & Campus Global Athletes',
    items: [
      'Country & Credentials Gateway: Select country at startup with instant national currency conversion (₹, $, €, £, ¥, etc.)',
      'All Gym Products Catalog: Added 27 high quality gym items across weights, racks, calisthenics, belts, supplements, and recovery tech.',
      'Cash on Delivery (COD) & Local Payment Rails: Added country-specific payment options (UPI, NetBanking, Pix, iDEAL, Apple Pay) + COD for all territories.',
      'AI Engine Reborn as ZYRO: Hyper-intelligent sports scientist capable of answering every question in the universe.',
      'World Workout Encyclopedia: 12 disciplines covering Calisthenics, Powerlifting, Olympic Lifting, CrossFit, Boxing, Dorm, and Physical Therapy.',
      'Urgent Incomplete Task Warning System: Alerts user if even a single daily quest is unfinished.',
      'Neat Clean Campus & Worldwide Delivery Map: Vectorized high-contrast map with global tracked courier delivery.',
    ],
  },
  {
    version: 'v2.7.2',
    title: 'International Language Synchronization & RTL Matrix',
    date: 'August 2026',
    requestedBy: 'International Student Exchange Council',
    items: [
      '16 Language multi-lingual engine with Arabic RTL support.',
      'Transparent Diet Formula working calculations with Harris-Benedict & Katch-McArdle formulas.',
    ],
  },
];

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, userId }) => {
  const [activeTab, setActiveTab] = useState<'submit' | 'patch_notes'>('submit');
  const [category, setCategory] = useState<'workout' | 'diet' | 'store' | 'map' | 'ai_zyro' | 'general'>('ai_zyro');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittedFeedback, setSubmittedFeedback] = useState<UserFeedbackItem[]>([]);
  const [successMessage, setSuccessMessage] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newItem: UserFeedbackItem = {
      id: 'fb_' + Date.now(),
      userId,
      category,
      rating,
      comment: comment.trim(),
      submittedAt: 'Just now',
      status: 'under_review',
    };

    setSubmittedFeedback((prev) => [newItem, ...prev]);
    setComment('');
    setSuccessMessage(true);
    setTimeout(() => setSuccessMessage(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-2xl bg-[#111612] border border-emerald-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Zap size={16} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 block">
                Athlete Voice & Evolution
              </span>
              <h3 className="text-lg sm:text-xl font-black font-brand text-white">
                User Feedback & Community Patch Notes
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-white bg-white/5"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-black/40 rounded-2xl border border-white/5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('submit')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'submit' ? 'bg-emerald-500 text-black shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            Submit Feedback & Feature Request
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('patch_notes')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'patch_notes' ? 'bg-emerald-500 text-black shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            Community Patch Notes ({COMMUNITY_PATCH_NOTES.length})
          </button>
        </div>

        {activeTab === 'submit' ? (
          <div className="space-y-4">
            <p className="text-xs text-gray-400 leading-relaxed">
              VYLO and ZYRO AI evolve directly from student-athlete and hunter requests. Suggest a new workout discipline, gym item, campus hotspot, or diet recipe.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Category */}
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1.5">
                  Target Section to Improve:
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {[
                    { id: 'ai_zyro', label: 'ZYRO AI' },
                    { id: 'workout', label: 'Workouts' },
                    { id: 'diet', label: 'VYLO Diet' },
                    { id: 'store', label: 'Gym Store' },
                    { id: 'map', label: 'Campus Map' },
                    { id: 'general', label: 'Progress' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id as any)}
                      className={`text-xs py-1.5 px-2 rounded-xl font-bold transition-all ${
                        category === cat.id
                          ? 'bg-emerald-500 text-black'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">
                  Overall System Rating:
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        size={22}
                        className={
                          star <= rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-600'
                        }
                      />
                    </button>
                  ))}
                  <span className="text-xs text-amber-400 font-bold ml-2">
                    {rating} / 5 Stars
                  </span>
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">
                  Your Suggestions / What should we add next?
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder="e.g. Please add Olympic Barbell drops to the campus quad, or add custom macro recipes for vegan athletes..."
                  className="w-full bg-[#161a17] border border-emerald-900/60 focus:border-emerald-500 rounded-2xl p-3 text-xs text-white focus:outline-none placeholder-gray-500"
                />
              </div>

              {successMessage && (
                <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>Feedback received! ZYRO AI has queued this for the next campus update cycle.</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-black text-xs uppercase tracking-widest shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send size={15} />
                <span>Transmit Feedback to ZYRO Team</span>
              </button>
            </form>

            {/* Past Feedback Log */}
            {submittedFeedback.length > 0 && (
              <div className="pt-3 border-t border-white/5 space-y-2">
                <span className="text-xs font-bold text-gray-400 block">Your Submitted Requests:</span>
                {submittedFeedback.map((fb) => (
                  <div
                    key={fb.id}
                    className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-white block">{fb.comment}</span>
                      <span className="text-[10px] text-emerald-400 capitalize">
                        Target: {fb.category} • Rating: {fb.rating}★
                      </span>
                    </div>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Under Review
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Patch Notes View */
          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
            {COMMUNITY_PATCH_NOTES.map((patch, idx) => (
              <div
                key={idx}
                className="bg-black/30 border border-emerald-500/20 rounded-2xl p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                    {patch.version}
                  </span>
                  <span className="text-[10px] text-gray-400">{patch.date}</span>
                </div>
                <h4 className="text-sm font-bold text-white">{patch.title}</h4>
                <div className="text-[10px] text-amber-300 font-medium">
                  Requested by: {patch.requestedBy}
                </div>
                <ul className="space-y-1 pt-1">
                  {patch.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="text-xs text-gray-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};
