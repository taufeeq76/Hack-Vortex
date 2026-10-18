import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserHealthProfile } from '../types';
import { WORLD_WORKOUTS, WorkoutProgram } from '../data/worldWorkouts';
import {
  Dumbbell,
  Play,
  Filter,
  CheckCircle2,
  Sparkles,
  Flame,
  Clock,
  ChevronRight,
  ShieldAlert,
  Search,
  BookOpen,
  X,
  Camera,
  Layers,
  Award,
  Zap,
  Target
} from 'lucide-react';

interface WorkoutsViewProps {
  userProfile: UserHealthProfile;
  onOpenLiveFormCheck: (workoutTitle: string) => void;
  onOpenZyroChat?: (prompt?: string) => void;
  onStartActiveWorkout?: (workout: WorkoutProgram) => void;
}

export const WorkoutsView: React.FC<WorkoutsViewProps> = ({
  userProfile,
  onOpenLiveFormCheck,
  onOpenZyroChat,
  onStartActiveWorkout,
}) => {
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutProgram | null>(null);
  const [completedWorkoutIds, setCompletedWorkoutIds] = useState<string[]>(['cali_01']);
  const [activeSessionSuccess, setActiveSessionSuccess] = useState(false);

  // Custom AI Protocol Generator state
  const [showAiGenerator, setShowAiGenerator] = useState(false);
  const [generatorFocus, setGeneratorFocus] = useState('Core & Abs Hyper-Density');
  const [generatorDuration, setGeneratorDuration] = useState(15);
  const [generatorDiscipline, setGeneratorDiscipline] = useState<'dorm_no_equipment' | 'calisthenics' | 'powerlifting' | 'mobility_yoga'>('dorm_no_equipment');
  const [isGeneratingProtocol, setIsGeneratingProtocol] = useState(false);
  const [customWorkouts, setCustomWorkouts] = useState<WorkoutProgram[]>([]);

  const disciplines = [
    { id: 'all', label: 'All World Disciplines' },
    { id: 'calisthenics', label: 'Calisthenics & Gymnastics' },
    { id: 'powerlifting', label: 'Powerlifting & Big 3' },
    { id: 'bodybuilding', label: 'Bodybuilding Hypertrophy' },
    { id: 'olympic_weightlifting', label: 'Olympic Weightlifting' },
    { id: 'crossfit_functional', label: 'CrossFit & Functional Engine' },
    { id: 'combat_boxing', label: 'Combat & Boxing' },
    { id: 'dorm_no_equipment', label: 'Dorm & No-Equipment' },
    { id: 'mobility_yoga', label: 'Mobility & Joint Rehab' },
    { id: 'plyometrics_speed', label: 'Speed & Plyometrics' },
    { id: 'strongman', label: 'Strongman & Heavy Carries' },
    { id: 'endurance_vo2', label: 'Norwegian VO2 Max' },
  ];

  const allWorkouts = [...customWorkouts, ...WORLD_WORKOUTS];

  const filteredWorkouts = allWorkouts.filter((w) => {
    const matchesDiscipline = selectedDiscipline === 'all' || w.discipline === selectedDiscipline;
    const matchesDifficulty = selectedDifficulty === 'all' || w.difficulty === selectedDifficulty;
    const matchesSearch =
      searchQuery.trim() === '' ||
      w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.disciplineLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.targetFocus.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.exercises.some((e) => e.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDiscipline && matchesDifficulty && matchesSearch;
  });

  const handleGenerateCustomProtocol = async () => {
    setIsGeneratingProtocol(true);

    try {
      const response = await fetch('/api/zyro/generate-protocol', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          focus: generatorFocus,
          durationMin: generatorDuration,
          modality: generatorDiscipline,
          userGoal: userProfile.primaryGoal,
        }),
      });

      if (!response.ok) {
        throw new Error(`Synthesis failed with status ${response.status}`);
      }

      const generatedProtocol: WorkoutProgram = await response.json();
      setCustomWorkouts([generatedProtocol, ...customWorkouts]);
      setIsGeneratingProtocol(false);
      setShowAiGenerator(false);

      if (onStartActiveWorkout) {
        onStartActiveWorkout(generatedProtocol);
      } else {
        setSelectedWorkout(generatedProtocol);
      }
    } catch (err) {
      console.warn('Backend workout synthesis fallback:', err);
      // Resilient client-side fallback
      const generatedId = `custom_${Date.now()}`;
      const newCustom: WorkoutProgram = {
        id: generatedId,
        title: `ZYRO Dynamic: ${generatorFocus} (${generatorDuration}m)`,
        discipline: generatorDiscipline,
        disciplineLabel:
          generatorDiscipline === 'dorm_no_equipment'
            ? 'Dorm & Quick Circuit'
            : generatorDiscipline === 'calisthenics'
            ? 'Calisthenics Conditioning'
            : generatorDiscipline === 'powerlifting'
            ? 'Strength & Power Density'
            : 'Mobility & Decompression',
        difficulty: 'Intermediate',
        durationMin: generatorDuration,
        xpReward: Math.round(generatorDuration * 4.5),
        caloriesBurnEstimate: Math.round(generatorDuration * 8.5),
        requiredEquipment: generatorDiscipline === 'dorm_no_equipment' ? ['Bodyweight only'] : ['Basic Floor / Bar'],
        equipmentLabel: generatorDiscipline === 'dorm_no_equipment' ? 'Zero Equipment Needed' : 'Minimal / Campus Gym',
        targetFocus: generatorFocus,
        description: `Bespoke neural & muscular protocol calibrated for your ${userProfile.primaryGoal ? userProfile.primaryGoal.replace(/_/g, ' ') : 'fitness'} focus in ${generatorDuration} minutes.`,
        warmupProtocol: '2 min dynamic hip circles, wrist rolls, and world greatest stretch.',
        cooldownProtocol: '3 min diaphragmatic box breathing (4s in, 4s hold, 4s out).',
        zyroTip: 'Maintain continuous core tension and execute each eccentric phase with conscious 2-second control.',
        exercises: [
          {
            name: `${generatorFocus} Prime Drill`,
            sets: 3,
            reps: '12-15 controlled',
            restSec: 45,
            cues: ['Brace transverse abdominis', 'Controlled breathing cadence', 'Full range of motion'],
            targetMuscles: ['Primary Stabilizers', 'Core'],
          },
          {
            name: 'High-Tension Isometric Hold',
            sets: 3,
            reps: '35 seconds',
            restSec: 45,
            cues: ['Lock ribcage down', 'Squeeze glutes', 'Active shoulder depression'],
            targetMuscles: ['Core Wall', 'Spinal Erectors'],
          },
          {
            name: 'Explosive Dynamic Finisher',
            sets: 3,
            reps: '15 reps',
            restSec: 60,
            cues: ['Drive through ground contact', 'Rhythmic rate of force development'],
            targetMuscles: ['Full Kinetic Chain'],
          },
        ],
      };

      setCustomWorkouts([newCustom, ...customWorkouts]);
      setIsGeneratingProtocol(false);
      setShowAiGenerator(false);

      if (onStartActiveWorkout) {
        onStartActiveWorkout(newCustom);
      } else {
        setSelectedWorkout(newCustom);
      }
    }
  };

  const handleStartWorkout = (workout: WorkoutProgram) => {
    if (onStartActiveWorkout) {
      onStartActiveWorkout(workout);
    } else {
      setSelectedWorkout(workout);
    }
  };

  const handleCompleteWorkout = (id: string) => {
    if (!completedWorkoutIds.includes(id)) {
      setCompletedWorkoutIds([...completedWorkoutIds, id]);
    }
    setActiveSessionSuccess(true);
    setTimeout(() => {
      setActiveSessionSuccess(false);
      setSelectedWorkout(null);
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#121915] via-[#101412] to-[#0a0f0c] border border-emerald-500/30 p-4 sm:p-6 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black font-brand text-white tracking-tight">
                World Workout Encyclopedia
              </h1>
              <span className="text-[10px] uppercase font-black px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                12 Disciplines
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Every single workout in the world — from Olympic lifting and collegiate powerlifting to street calisthenics, boxing conditioning, and zero-equipment dorm protocols.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
              {WORLD_WORKOUTS.length} Master Protocols
            </span>
          </div>
        </div>

        {/* Quick Discipline stats ticker */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/5 text-xs text-gray-300">
          <div className="bg-black/30 rounded-xl p-2 border border-white/5 flex items-center gap-2">
            <Target size={14} className="text-emerald-400" />
            <span>Calisthenics & Rings</span>
          </div>
          <div className="bg-black/30 rounded-xl p-2 border border-white/5 flex items-center gap-2">
            <Dumbbell size={14} className="text-amber-400" />
            <span>Power & Bodybuilding</span>
          </div>
          <div className="bg-black/30 rounded-xl p-2 border border-white/5 flex items-center gap-2">
            <Zap size={14} className="text-cyan-400" />
            <span>Combat & Murph Engine</span>
          </div>
          <div className="bg-black/30 rounded-xl p-2 border border-white/5 flex items-center gap-2">
            <Award size={14} className="text-purple-400" />
            <span>Rehab & Joint Prehab</span>
          </div>
        </div>

        {/* AI Routine Generator Trigger Toggle */}
        <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-emerald-400" />
            <span className="text-xs font-bold text-white">Need a custom training protocol tailored to your schedule or injuries?</span>
          </div>
          <button
            id="toggle-ai-routine-generator-btn"
            type="button"
            onClick={() => setShowAiGenerator(!showAiGenerator)}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
          >
            <Zap size={13} />
            <span>{showAiGenerator ? 'Hide AI Generator' : '⚡ Synthesize Custom Protocol with ZYRO'}</span>
          </button>
        </div>

        {/* Expandable AI Protocol Synthesizer Box */}
        <AnimatePresence>
          {showAiGenerator && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 p-4 rounded-2xl bg-black/60 border border-emerald-500/40 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Sparkles size={14} />
                  ZYRO Neural Protocol Synthesizer
                </span>
                <span className="text-[10px] text-gray-400 font-mono">Biomechanical Personalization</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Target Focus */}
                <div>
                  <label className="text-[11px] font-bold text-gray-300 block mb-1">Target Focus Area:</label>
                  <input
                    type="text"
                    value={generatorFocus}
                    onChange={(e) => setGeneratorFocus(e.target.value)}
                    placeholder="e.g. Posterior Chain & Glutes, Core & Abs..."
                    className="w-full bg-[#141920] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="text-[11px] font-bold text-gray-300 block mb-1">Time Budget:</label>
                  <div className="grid grid-cols-4 gap-1">
                    {[10, 15, 30, 45].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setGeneratorDuration(mins)}
                        className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          generatorDuration === mins
                            ? 'bg-emerald-500 text-black'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        {mins}m
                      </button>
                    ))}
                  </div>
                </div>

                {/* Discipline */}
                <div>
                  <label className="text-[11px] font-bold text-gray-300 block mb-1">Equipment / Modality:</label>
                  <select
                    value={generatorDiscipline}
                    onChange={(e) => setGeneratorDiscipline(e.target.value as any)}
                    className="w-full bg-[#141920] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
                  >
                    <option value="dorm_no_equipment">Dorm / Zero Equipment</option>
                    <option value="calisthenics">Calisthenics & Bodyweight</option>
                    <option value="powerlifting">Free Weights & Power</option>
                    <option value="mobility_yoga">Mobility & Posture Rehab</option>
                  </select>
                </div>
              </div>

              {/* Quick Preset Focus Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Quick Themes:</span>
                {[
                  'Dorm 6-Pack Abs & Obliques',
                  'Lower Back Decompression & McGill',
                  'High-Tension Explosive Chest & Triceps',
                  'Desk Slump Posture Fix & Scapular Control',
                  'Leg Day for Knee Soreness',
                ].map((preset, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => setGeneratorFocus(preset)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-gray-300 hover:text-emerald-300 border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer"
                  >
                    {preset}
                  </button>
                ))}
              </div>

              {/* Action Button */}
              <button
                id="synthesize-protocol-action-btn"
                type="button"
                onClick={handleGenerateCustomProtocol}
                disabled={isGeneratingProtocol}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-95 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                {isGeneratingProtocol ? (
                  <>
                    <Sparkles size={14} className="animate-spin" />
                    <span>Synthesizing Neuromuscular Program...</span>
                  </>
                ) : (
                  <>
                    <Zap size={14} />
                    <span>Synthesize & Launch Active Workout Session (+{Math.round(generatorDuration * 4.5)} XP)</span>
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search & Discipline Filter Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-3.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search every workout (e.g. Muscle-Up, Big 3 Squat, Arnold Split, Murph, Boxer, McGill Big 3)..."
            className="w-full bg-[#111613] border border-emerald-900/50 focus:border-emerald-500 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-white focus:outline-none placeholder-gray-500"
          />
        </div>

        {/* Discipline horizontal scroller */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {disciplines.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setSelectedDiscipline(d.id)}
              className={`text-xs px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedDiscipline === d.id
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Workouts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWorkouts.map((workout) => {
          const isDone = completedWorkoutIds.includes(workout.id);

          return (
            <div
              key={workout.id}
              className="rounded-3xl bg-[#111612] border border-emerald-950/70 hover:border-emerald-500/40 p-5 flex flex-col justify-between transition-all hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {workout.disciplineLabel}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      workout.difficulty === 'Elite Hunter'
                        ? 'bg-purple-500/20 text-purple-300'
                        : workout.difficulty === 'Advanced'
                        ? 'bg-red-500/20 text-red-300'
                        : workout.difficulty === 'Intermediate'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {workout.difficulty}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white leading-snug">
                  {workout.title}
                </h3>

                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                  {workout.description}
                </p>

                {/* Focus badge & equipment */}
                <div className="text-xs text-gray-300 bg-black/40 rounded-xl p-2.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Target:</span>
                    <span className="font-semibold text-emerald-300 truncate max-w-[170px]">
                      {workout.targetFocus}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Equipment:</span>
                    <span className="font-semibold text-white">{workout.equipmentLabel}</span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="flex items-center gap-3 text-xs text-gray-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock size={13} className="text-emerald-400" /> {workout.durationMin}m
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Flame size={13} className="text-amber-400" /> ~{workout.caloriesBurnEstimate} kcal
                  </span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">+{workout.xpReward} XP</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2">
                <button
                  id={`start-workout-${workout.id}`}
                  type="button"
                  onClick={() => handleStartWorkout(workout)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-95 text-black font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-[1.01]"
                  title="Launch Interactive Audio & Rest Timer Player"
                >
                  <Play size={14} fill="currentColor" />
                  <span>Start Session</span>
                </button>

                <button
                  id={`view-protocol-${workout.id}`}
                  type="button"
                  onClick={() => setSelectedWorkout(workout)}
                  className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  title="View exercise drills and biomechanical cues"
                >
                  <BookOpen size={14} />
                  <span className="hidden sm:inline">Details</span>
                </button>

                <button
                  id={`form-check-${workout.id}`}
                  type="button"
                  onClick={() => onOpenLiveFormCheck(workout.title)}
                  className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black transition-all cursor-pointer"
                  title="Live Form Check with ZYRO AI"
                >
                  <Camera size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Workout Program Modal */}
      <AnimatePresence>
        {selectedWorkout && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-[#111612] border border-emerald-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                    {selectedWorkout.disciplineLabel} • {selectedWorkout.difficulty}
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-white">{selectedWorkout.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedWorkout(null)}
                  className="p-1 rounded-full text-gray-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Overview & Warmup */}
              <div className="space-y-2">
                <p className="text-xs text-gray-300 leading-relaxed">
                  {selectedWorkout.description}
                </p>

                <div className="p-3 rounded-2xl bg-black/50 border border-emerald-500/20 text-xs text-emerald-300">
                  <strong className="text-white block mb-0.5">🔥 Warm-up Protocol:</strong>
                  {selectedWorkout.warmupProtocol}
                </div>
              </div>

              {/* ZYRO Master Coaching Cue Box */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-black to-[#0d1610] border border-emerald-500/30 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <Sparkles size={14} />
                  <span>ZYRO Master Biomechanical Cue:</span>
                </div>
                <p className="text-gray-200">{selectedWorkout.zyroTip}</p>
              </div>

              {/* Step-by-Step Exercises List */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider">
                  Exercise Progression Checklist ({selectedWorkout.exercises.length} movements):
                </h4>

                {selectedWorkout.exercises.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="text-xs font-bold text-white">
                        {idx + 1}. {ex.name}
                      </span>
                      <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
                        <span>{ex.sets} sets × {ex.reps}</span>
                        <span>•</span>
                        <span>{ex.restSec}s rest</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 text-[10px] text-gray-400">
                      {ex.cues.map((cue, cIdx) => (
                        <span key={cIdx} className="bg-white/5 px-2 py-0.5 rounded-md text-gray-300">
                          • {cue}
                        </span>
                      ))}
                    </div>

                    <div className="text-[10px] text-gray-500">
                      Targets: {ex.targetMuscles.join(', ')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Cooldown */}
              <div className="p-3 rounded-2xl bg-black/30 border border-white/5 text-xs text-gray-400">
                <strong className="text-white block mb-0.5">❄️ Cooldown & Recovery:</strong>
                {selectedWorkout.cooldownProtocol}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row items-center gap-2">
                <button
                  id="modal-form-check-btn"
                  type="button"
                  onClick={() => {
                    onOpenLiveFormCheck(selectedWorkout.title);
                    setSelectedWorkout(null);
                  }}
                  className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Camera size={16} className="text-emerald-400" />
                  <span>Form Check AI</span>
                </button>

                <button
                  id="modal-start-interactive-session-btn"
                  type="button"
                  onClick={() => {
                    handleStartWorkout(selectedWorkout);
                    setSelectedWorkout(null);
                  }}
                  className="flex-1 w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-black text-xs uppercase tracking-wider shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                >
                  <Play size={16} fill="currentColor" />
                  <span>Start Interactive Live Session (+{selectedWorkout.xpReward} XP)</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
