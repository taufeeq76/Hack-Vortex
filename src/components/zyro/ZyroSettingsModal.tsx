import React, { useState } from 'react';
import { X, Check, Sliders, Shield, Trash2, Globe, Sparkles, BookOpen } from 'lucide-react';
import { ZyroUserPreferences, ZyroStudyLevel } from '../../types';

interface ZyroSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: ZyroUserPreferences;
  onSavePreferences: (prefs: ZyroUserPreferences) => void;
  onClearAllConversations: () => void;
}

const LANGUAGES = [
  'English',
  'Hindi (हिन्दी)',
  'Hinglish (Hindi in Latin script)',
  'Tamil (தமிழ்)',
  'Telugu (తెలుగు)',
  'Kannada (ಕನ್ನಡ)',
  'Malayalam (മലയാളം)',
  'Bengali (বাংলা)',
  'Marathi (मराठी)',
  'Spanish (Español)',
  'French (Français)',
  'German (Deutsch)',
  'Japanese (日本語)',
  'Arabic (العربية)',
];

export const ZyroSettingsModal: React.FC<ZyroSettingsModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onSavePreferences,
  onClearAllConversations,
}) => {
  const [formData, setFormData] = useState<ZyroUserPreferences>(preferences);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePreferences(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#0C1510] border border-emerald-900/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-emerald-950/60 bg-[#080E0A]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sliders size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">ZYRO AI Intelligence Preferences</h2>
              <p className="text-[11px] text-gray-400">Tailor behavior, memory, and cognitive tone</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-emerald-950/50 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Custom Instructions */}
          <div className="space-y-1.5">
            <label className="block font-bold text-gray-200">
              Custom Instructions & Memory Context
            </label>
            <p className="text-[11px] text-gray-400">
              What should ZYRO know about your goals, study subjects, or working style?
            </p>
            <textarea
              rows={3}
              value={formData.customInstructions}
              onChange={(e) => setFormData({ ...formData, customInstructions: e.target.value })}
              placeholder="e.g., I am a CS undergrad preparing for technical interviews and a powerlifter peaking for a meet. Explain complex algorithms with code, and biomechanics with force vector analysis."
              className="w-full px-3 py-2 rounded-xl bg-[#070D09] border border-emerald-950 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-emerald-500/60 text-xs leading-relaxed"
            />
          </div>

          {/* Tone Selector */}
          <div className="space-y-1.5">
            <label className="block font-bold text-gray-200">Response Style & Tone</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'natural', label: 'Balanced & Natural' },
                { id: 'concise', label: 'Crisp & Direct' },
                { id: 'detailed', label: 'Deep & Exhaustive' },
                { id: 'academic', label: 'Rigorous Academic' },
                { id: 'casual', label: 'Friendly & Casual' },
              ].map((tone) => (
                <button
                  key={tone.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, tone: tone.id as any })}
                  className={`px-3 py-2 rounded-xl border text-center transition-all cursor-pointer ${
                    formData.tone === tone.id
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-[#070D09] border-emerald-950 text-gray-400 hover:text-white'
                  }`}
                >
                  {tone.label}
                </button>
              ))}
            </div>
          </div>

          {/* Study / Tutor Level */}
          <div className="space-y-1.5">
            <label className="block font-bold text-gray-200 flex items-center gap-1.5">
              <BookOpen size={13} className="text-emerald-400" />
              <span>Socratic Tutor Difficulty</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'beginner', label: 'Beginner (Intuitive analogies)' },
                { id: 'intermediate', label: 'Intermediate (Practical rigor)' },
                { id: 'advanced', label: 'Advanced (First-principles)' },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, studyLevel: lvl.id as ZyroStudyLevel })}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    formData.studyLevel === lvl.id
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-[#070D09] border-emerald-950 text-gray-400 hover:text-white'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Language */}
          <div className="space-y-1.5">
            <label className="block font-bold text-gray-200 flex items-center gap-1.5">
              <Globe size={13} className="text-emerald-400" />
              <span>Preferred Output Language</span>
            </label>
            <select
              value={formData.outputLanguage}
              onChange={(e) => setFormData({ ...formData, outputLanguage: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#070D09] border border-emerald-950 text-gray-200 focus:outline-none focus:border-emerald-500/60"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* Web Search Grounding Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#070D09] border border-emerald-950">
            <div className="space-y-0.5">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Sparkles size={13} className="text-emerald-400" />
                <span>Google Search Web Grounding</span>
              </div>
              <p className="text-[11px] text-gray-400">
                Automatically ground answers in verified real-time web search citations
              </p>
            </div>
            <input
              type="checkbox"
              checked={formData.enableSearchGrounding}
              onChange={(e) => setFormData({ ...formData, enableSearchGrounding: e.target.checked })}
              className="w-4 h-4 accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Clear Conversations */}
          <div className="pt-2 border-t border-emerald-950/60 flex items-center justify-between">
            {showClearConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-rose-400 font-medium">Delete all history?</span>
                <button
                  type="button"
                  onClick={() => {
                    onClearAllConversations();
                    setShowClearConfirm(false);
                  }}
                  className="px-2.5 py-1 rounded bg-rose-600 text-white font-bold text-[10px] hover:bg-rose-500 cursor-pointer"
                >
                  Yes, Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="px-2.5 py-1 rounded bg-gray-800 text-gray-300 text-[10px] cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center gap-1.5 text-[11px] text-rose-400 hover:text-rose-300 cursor-pointer"
              >
                <Trash2 size={12} />
                <span>Clear All Chat History</span>
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-emerald-950/40 font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              <Check size={14} />
              <span>Save Preferences</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
