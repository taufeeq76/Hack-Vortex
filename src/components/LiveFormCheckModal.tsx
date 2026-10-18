import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Camera,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  X,
  Play,
  Pause,
  Award,
  ShieldAlert,
  Dumbbell
} from 'lucide-react';
import { Mascot } from './Mascot';

interface LiveFormCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  workoutTitle?: string;
  onCompleteWorkout?: (xpEarned: number, accuracy: number) => void;
}

interface RepFeedback {
  repNumber: number;
  isGoodForm: boolean;
  message: string;
  metric: string;
}

export const LiveFormCheckModal: React.FC<LiveFormCheckModalProps> = ({
  isOpen,
  onClose,
  workoutTitle = 'Dopamine Squat & Mobility Circuit',
  onCompleteWorkout,
}) => {
  const [useRealCamera, setUseRealCamera] = useState(false);
  const [cameraStreamActive, setCameraStreamActive] = useState(false);
  const [isExercising, setIsExercising] = useState(true);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [repCount, setRepCount] = useState(0);
  const [goodRepsCount, setGoodRepsCount] = useState(0);
  const [currentFeedback, setCurrentFeedback] = useState<{
    status: 'good' | 'warning' | 'info';
    text: string;
  }>({
    status: 'info',
    text: 'Position yourself in full frame. BlazePose model initializing...',
  });
  const [jointAngles, setJointAngles] = useState({
    kneeAngle: 168,
    hipAngle: 172,
    backAngle: 88,
  });
  const [historyFeedback, setHistoryFeedback] = useState<RepFeedback[]>([]);
  const [showSummary, setShowSummary] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const exercises = [
    {
      name: 'Bodyweight Depth Squats',
      targetReps: 10,
      trackingFocus: 'Knee Depth (90°) & Upright Torso',
      idealKnee: '85°–95°',
    },
    {
      name: 'Push-Ups & Core Alignment',
      targetReps: 8,
      trackingFocus: 'Elbow Flare (45°) & Hip Sag Prevention',
      idealKnee: 'Straight 180°',
    },
    {
      name: 'Dynamic Reverse Lunges',
      targetReps: 10,
      trackingFocus: 'Front Knee Over Ankle & Hip Stability',
      idealKnee: '90° front / 90° back',
    },
  ];

  const currentExercise = exercises[exerciseIndex];

  // Try real camera if toggled
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (useRealCamera && isOpen) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: 'user' } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            setCameraStreamActive(true);
          }
        })
        .catch(() => {
          setUseRealCamera(false);
          setCameraStreamActive(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [useRealCamera, isOpen]);

  // Simulating motion rep progression
  const triggerRep = (forcedGoodForm?: boolean) => {
    if (repCount >= currentExercise.targetReps) {
      finishWorkout();
      return;
    }

    const nextRep = repCount + 1;
    setRepCount(nextRep);

    // Form variation logic: 80% good, 20% warning
    const isGood = forcedGoodForm !== undefined ? forcedGoodForm : Math.random() > 0.25;

    if (isGood) {
      setGoodRepsCount((prev) => prev + 1);
      const goodMsgs = [
        'Good depth on that squat! Hip crease below parallel.',
        'Impeccable chest angle — spine strictly neutral!',
        'Explosive drive through the heels. Perfect tempo!',
        'Flawless core brace on that descent!',
      ];
      const msg = goodMsgs[Math.floor(Math.random() * goodMsgs.length)];
      setCurrentFeedback({ status: 'good', text: msg });
      setJointAngles({ kneeAngle: 89, hipAngle: 94, backAngle: 82 });
      setHistoryFeedback((prev) => [
        ...prev,
        { repNumber: nextRep, isGoodForm: true, message: msg, metric: '90° Depth' },
      ]);
    } else {
      const warnMsgs = [
        'Keep your back straighter — you’re leaning too far forward.',
        'Knees caving inward slightly — push knees out tracking toes.',
        'Short of parallel depth — sink 2 inches deeper.',
        'Deceleration too fast — control the eccentric phase.',
      ];
      const msg = warnMsgs[Math.floor(Math.random() * warnMsgs.length)];
      setCurrentFeedback({ status: 'warning', text: msg });
      setJointAngles({ kneeAngle: 115, hipAngle: 62, backAngle: 54 });
      setHistoryFeedback((prev) => [
        ...prev,
        { repNumber: nextRep, isGoodForm: false, message: msg, metric: 'Forward Lean 54°' },
      ]);
    }

    if (nextRep >= currentExercise.targetReps) {
      setTimeout(() => {
        finishWorkout();
      }, 1000);
    }
  };

  const finishWorkout = () => {
    setIsExercising(false);
    setShowSummary(true);
    const accuracy = Math.round(((goodRepsCount + 1) / Math.max(1, repCount + 1)) * 100);
    if (onCompleteWorkout) {
      onCompleteWorkout(120, accuracy);
    }
  };

  const resetSession = () => {
    setRepCount(0);
    setGoodRepsCount(0);
    setHistoryFeedback([]);
    setShowSummary(false);
    setIsExercising(true);
    setCurrentFeedback({
      status: 'info',
      text: 'Stand back so your entire frame is captured. Rep counter primed.',
    });
  };

  if (!isOpen) return null;

  const accuracyPct = repCount > 0 ? Math.round((goodRepsCount / repCount) * 100) : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-lg overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0d1016] border border-emerald-500/30 rounded-3xl p-4 sm:p-6 shadow-[0_20px_80px_rgba(0,0,0,0.9)] my-auto max-h-[95vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white">Live Form Check AI</h3>
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  MoveNet BlazePose 3D
                </span>
              </div>
              <span className="text-xs text-slate-400">{currentExercise.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Real Camera / Simulated Feed */}
            <button
              onClick={() => setUseRealCamera(!useRealCamera)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                useRealCamera
                  ? 'bg-emerald-500 text-black border-emerald-400'
                  : 'bg-black/40 text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              <Camera size={14} />
              {useRealCamera ? 'Device Camera On' : 'Simulated Feed'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Workout or Post-Workout Summary */}
        {!showSummary ? (
          <div className="flex-1 flex flex-col py-3 space-y-3 overflow-hidden">
            {/* Camera View / Simulated Skeletal Tracking Viewport */}
            <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-[#07090c] rounded-2xl overflow-hidden border border-emerald-500/30 shadow-inner flex items-center justify-center">
              {/* Real camera video feed if active */}
              {useRealCamera && (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                />
              )}

              {/* Ambient Grid Background for biomechanical laboratory look */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #10b981 1px, transparent 1px), linear-gradient(to bottom, #10b981 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />

              {/* Simulated Skeletal Pose Overlay */}
              <svg
                viewBox="0 0 400 300"
                className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_0_8px_rgba(16,185,129,0.7)]"
              >
                {/* Torso Center Line */}
                <line
                  x1="200"
                  y1="90"
                  x2="200"
                  y2="170"
                  stroke="#34d399"
                  strokeWidth="3.5"
                  strokeDasharray="4 2"
                />

                {/* Shoulder Line */}
                <line x1="160" y1="95" x2="240" y2="95" stroke="#10b981" strokeWidth="4" />
                {/* Left Arm */}
                <line x1="160" y1="95" x2="135" y2="130" stroke="#10b981" strokeWidth="3" />
                <line x1="135" y1="130" x2="120" y2="165" stroke="#10b981" strokeWidth="3" />
                {/* Right Arm */}
                <line x1="240" y1="95" x2="265" y2="130" stroke="#10b981" strokeWidth="3" />
                <line x1="265" y1="130" x2="280" y2="165" stroke="#10b981" strokeWidth="3" />

                {/* Hips */}
                <line x1="175" y1="170" x2="225" y2="170" stroke="#10b981" strokeWidth="4" />

                {/* Squat Animation / Pose Shift */}
                {/* Left Leg */}
                <line
                  x1="175"
                  y1="170"
                  x2={jointAngles.kneeAngle < 100 ? '145' : '165'}
                  y2={jointAngles.kneeAngle < 100 ? '220' : '225'}
                  stroke={jointAngles.kneeAngle < 100 ? '#34d399' : '#f59e0b'}
                  strokeWidth="4"
                />
                <line
                  x1={jointAngles.kneeAngle < 100 ? '145' : '165'}
                  y1={jointAngles.kneeAngle < 100 ? '220' : '225'}
                  x2="155"
                  y2="280"
                  stroke="#10b981"
                  strokeWidth="4"
                />

                {/* Right Leg */}
                <line
                  x1="225"
                  y1="170"
                  x2={jointAngles.kneeAngle < 100 ? '255' : '235'}
                  y2={jointAngles.kneeAngle < 100 ? '220' : '225'}
                  stroke={jointAngles.kneeAngle < 100 ? '#34d399' : '#f59e0b'}
                  strokeWidth="4"
                />
                <line
                  x1={jointAngles.kneeAngle < 100 ? '255' : '235'}
                  y1={jointAngles.kneeAngle < 100 ? '220' : '225'}
                  x2="245"
                  y2="280"
                  stroke="#10b981"
                  strokeWidth="4"
                />

                {/* Skeletal Keypoint Nodes */}
                {[
                  { x: 200, y: 65, label: 'Head' },
                  { x: 160, y: 95, label: 'L Shoulder' },
                  { x: 240, y: 95, label: 'R Shoulder' },
                  { x: 135, y: 130, label: 'L Elbow' },
                  { x: 265, y: 130, label: 'R Elbow' },
                  { x: 175, y: 170, label: 'L Hip' },
                  { x: 225, y: 170, label: 'R Hip' },
                  { x: jointAngles.kneeAngle < 100 ? 145 : 165, y: jointAngles.kneeAngle < 100 ? 220 : 225, label: 'L Knee' },
                  { x: jointAngles.kneeAngle < 100 ? 255 : 235, y: jointAngles.kneeAngle < 100 ? 220 : 225, label: 'R Knee' },
                  { x: 155, y: 280, label: 'L Ankle' },
                  { x: 245, y: 280, label: 'R Ankle' },
                ].map((pt, i) => (
                  <g key={i}>
                    <circle cx={pt.x} cy={pt.y} r="5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                    <circle cx={pt.x} cy={pt.y} r="8" fill="none" stroke="#34d399" strokeWidth="1" opacity="0.6" />
                  </g>
                ))}

                {/* Knee Angle overlay text */}
                <rect
                  x={jointAngles.kneeAngle < 100 ? '90' : '110'}
                  y={jointAngles.kneeAngle < 100 ? '208' : '212'}
                  width="48"
                  height="18"
                  rx="4"
                  fill="#090a0d"
                  stroke="#10b981"
                  strokeWidth="1"
                />
                <text
                  x={jointAngles.kneeAngle < 100 ? '114' : '134'}
                  y={jointAngles.kneeAngle < 100 ? '221' : '225'}
                  fill="#6ee7b7"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {jointAngles.kneeAngle}°
                </text>
              </svg>

              {/* Top Viewport Floating Counters */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                {/* Rep Counter Badge */}
                <div className="bg-black/70 backdrop-blur-md border border-emerald-500/40 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-lg">
                  <span className="text-xs text-slate-300">Reps:</span>
                  <span className="text-xl font-black text-emerald-400">
                    {repCount}
                    <span className="text-xs font-semibold text-slate-400">/{currentExercise.targetReps}</span>
                  </span>
                </div>

                {/* Form Accuracy Badge */}
                <div className="bg-black/70 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-lg">
                  <span className="text-xs text-slate-300">Form Score:</span>
                  <span className="text-base font-extrabold text-white">
                    {goodRepsCount}/{repCount || 1}
                  </span>
                  <span
                    className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                      accuracyPct >= 80 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {accuracyPct}%
                  </span>
                </div>
              </div>

              {/* Bottom Real-time Feedback Banner */}
              <div className="absolute bottom-3 left-3 right-3 pointer-events-none">
                <motion.div
                  key={currentFeedback.text}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-2.5 rounded-xl backdrop-blur-md border flex items-center gap-2 shadow-xl ${
                    currentFeedback.status === 'good'
                      ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200'
                      : currentFeedback.status === 'warning'
                      ? 'bg-amber-950/85 border-amber-400 text-amber-200'
                      : 'bg-black/75 border-white/15 text-slate-200'
                  }`}
                >
                  {currentFeedback.status === 'good' ? (
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                  ) : currentFeedback.status === 'warning' ? (
                    <AlertTriangle size={18} className="text-amber-400 shrink-0" />
                  ) : (
                    <Sparkles size={18} className="text-emerald-400 shrink-0" />
                  )}
                  <span className="text-xs font-bold leading-tight">{currentFeedback.text}</span>
                </motion.div>
              </div>
            </div>

            {/* Interactive Control Deck */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Target Depth: <strong className="text-emerald-400">{currentExercise.idealKnee}</strong></span>
                <span>Focus: <strong className="text-slate-200">{currentExercise.trackingFocus}</strong></span>
              </div>

              {/* Manual Rep simulation buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => triggerRep(true)}
                  className="py-2.5 px-3 rounded-xl bg-emerald-500/20 border border-emerald-500/50 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <CheckCircle2 size={15} /> Simulate Good Form Rep
                </button>
                <button
                  type="button"
                  onClick={() => triggerRep(false)}
                  className="py-2.5 px-3 rounded-xl bg-amber-500/20 border border-amber-500/50 hover:bg-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <AlertTriangle size={15} /> Simulate Posture Warning
                </button>
                <button
                  type="button"
                  onClick={finishWorkout}
                  className="col-span-2 sm:col-span-1 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  Finish & View Form Summary
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Post-Workout Form Summary Card */
          <div className="py-5 space-y-5 overflow-y-auto">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto">
                <Award size={28} />
              </div>
              <h2 className="text-xl font-bold font-brand text-white">Live Form Check Complete!</h2>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {currentExercise.name} • Biomechanical telemetry logged successfully.
              </p>
            </div>

            {/* Mascot reaction & Form Summary Card */}
            <div className="bg-gradient-to-br from-[#141822] to-[#0c0f14] border border-emerald-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <Mascot
                  state={accuracyPct >= 80 ? 'happy' : 'encouraging'}
                  customMessage={
                    accuracyPct >= 80
                      ? 'Elite biomechanics! 8+ reps in razor-sharp form!'
                      : 'Solid effort! Focus on keeping that chest proud on the next set.'
                  }
                  size="sm"
                />
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Reward</span>
                  <span className="text-lg font-black text-emerald-400">+120 XP</span>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-black/30 p-3 rounded-xl border border-white/5 text-center">
                  <span className="text-[10px] text-slate-400 block">Total Reps</span>
                  <span className="text-xl font-extrabold text-white">{repCount}</span>
                </div>
                <div className="bg-black/30 p-3 rounded-xl border border-white/5 text-center">
                  <span className="text-[10px] text-slate-400 block">Clean Form Reps</span>
                  <span className="text-xl font-extrabold text-emerald-400">{goodRepsCount}</span>
                </div>
                <div className="bg-black/30 p-3 rounded-xl border border-white/5 text-center">
                  <span className="text-[10px] text-slate-400 block">Form Accuracy</span>
                  <span className="text-xl font-extrabold text-teal-300">{accuracyPct}%</span>
                </div>
              </div>

              {/* Reps Breakdown log */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-300 block">Rep Telemetry Log</span>
                <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                  {historyFeedback.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        {item.isGoodForm ? (
                          <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                        ) : (
                          <AlertTriangle size={14} className="text-amber-400 shrink-0" />
                        )}
                        <span className="font-bold text-white">Rep #{item.repNumber}:</span>
                        <span className="text-slate-300 text-[11px] truncate max-w-[240px]">
                          {item.message}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                        {item.metric}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={resetSession}
                className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw size={15} /> Retest Set
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-extrabold text-xs tracking-wider uppercase hover:opacity-95 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
              >
                Log Form Check & Return to Home →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
