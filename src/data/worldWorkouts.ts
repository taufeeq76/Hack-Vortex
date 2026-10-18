export interface ExerciseStep {
  name: string;
  sets: number;
  reps: string;
  restSec: number;
  tempo?: string;
  cues: string[];
  targetMuscles: string[];
}

export interface WorkoutProgram {
  id: string;
  title: string;
  discipline: 
    | 'calisthenics'
    | 'powerlifting'
    | 'bodybuilding'
    | 'olympic_weightlifting'
    | 'crossfit_functional'
    | 'plyometrics_speed'
    | 'combat_boxing'
    | 'dorm_no_equipment'
    | 'mobility_yoga'
    | 'rehab_prehab'
    | 'strongman'
    | 'endurance_vo2';
  disciplineLabel: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Elite Hunter';
  durationMin: number;
  xpReward: number;
  caloriesBurnEstimate: number;
  requiredEquipment: string[];
  equipmentLabel: string;
  targetFocus: string;
  description: string;
  warmupProtocol: string;
  exercises: ExerciseStep[];
  cooldownProtocol: string;
  zyroTip: string;
}

export const WORLD_WORKOUTS: WorkoutProgram[] = [
  // 1. CALISTHENICS & GYMNASTICS
  {
    id: 'cali_01',
    title: 'Strict Muscle-Up & Explosive Pull Ascendance',
    discipline: 'calisthenics',
    disciplineLabel: 'Calisthenics & Gymnastics',
    difficulty: 'Advanced',
    durationMin: 45,
    xpReward: 260,
    caloriesBurnEstimate: 380,
    requiredEquipment: ['pullup_bar', 'rings'],
    equipmentLabel: 'Bar or Rings',
    targetFocus: 'Lats, Triceps, Scapular Retraction, False Grip',
    description: 'Master the transition from below the bar to over the bar with zero kipping. Focuses on high-chest pull-ups, deep Russian dips, and straight bar dips.',
    warmupProtocol: '5 mins: Shoulder dislocates with band, scapular pull-ups 2x10, wrist flexion circles.',
    zyroTip: 'Do not pull straight up. Pull diagonally away and then drive your chest over the bar like an arc, rotating wrists quickly.',
    exercises: [
      {
        name: 'False Grip / High Chest-to-Bar Pull-ups',
        sets: 4,
        reps: '5-6 reps',
        restSec: 90,
        tempo: '2-0-X-1',
        cues: ['Pull bar down to sternum', 'Drive elbows backward', 'Engage core tightly'],
        targetMuscles: ['Lats', 'Biceps', 'Rhomboids'],
      },
      {
        name: 'Straight Bar Dips at Top Lockout',
        sets: 4,
        reps: '8-10 reps',
        restSec: 90,
        tempo: '2-1-1-0',
        cues: ['Lower chest to touch bar', 'Flare elbows back 45 degrees', 'Press to full lockout'],
        targetMuscles: ['Triceps', 'Lower Chest', 'Anterior Deltoid'],
      },
      {
        name: 'Slow Eccentric Muscle-Up Negatives',
        sets: 3,
        reps: '4 reps (5 sec descend)',
        restSec: 120,
        tempo: '5-0-1-0',
        cues: ['Control through the transition zone', 'Keep feet together in hollow position'],
        targetMuscles: ['Full Upper Body', 'Core'],
      },
      {
        name: 'Hanging L-Sit Knee/Toe Raises',
        sets: 3,
        reps: '12 reps',
        restSec: 60,
        cues: ['No swinging', 'Flex quads and depress shoulders'],
        targetMuscles: ['Abs', 'Hip Flexors', 'Grip'],
      }
    ],
    cooldownProtocol: 'Dead hangs 3x30 sec for spine decompression and lat stretch.',
  },
  {
    id: 'cali_02',
    title: 'Full Planche & Straight-Arm Core Mastery',
    discipline: 'calisthenics',
    disciplineLabel: 'Calisthenics & Gymnastics',
    difficulty: 'Elite Hunter',
    durationMin: 40,
    xpReward: 300,
    caloriesBurnEstimate: 340,
    requiredEquipment: ['parallettes', 'bodyweight'],
    equipmentLabel: 'Floor or Parallettes',
    targetFocus: 'Anterior Deltoids, Serratus Anterior, Straight-Arm Bicep Tendons',
    description: 'The pinnacle of gymnastic balance. Progressions from pseudo planche leans to tuck planche, straddle isometric holds, and hollow protraction.',
    warmupProtocol: '10 mins: Wrist push-ups, seal stretch, band pull-aparts, thoracic extensions.',
    zyroTip: 'Lock your elbows completely! Bending the arms transfers load off the tendon adaptation. Protract shoulders like a dome.',
    exercises: [
      {
        name: 'Planche Lean with Feet Elevated',
        sets: 4,
        reps: '15-20 sec hold',
        restSec: 90,
        cues: ['Lean shoulders ahead of wrists by 3-4 inches', 'Protract scapula maximally', 'Squeeze glutes'],
        targetMuscles: ['Anterior Deltoid', 'Serratus Anterior', 'Wrist Flexors'],
      },
      {
        name: 'Tuck Planche / Advanced Tuck Hold',
        sets: 5,
        reps: '8-12 sec hold',
        restSec: 120,
        cues: ['Hips level with shoulders', 'Knees tucked into ribs', 'Depress shoulder blades down'],
        targetMuscles: ['Shoulders', 'Biceps', 'Core'],
      },
      {
        name: 'Scapular Protraction Push-Ups (Plus Push-Ups)',
        sets: 3,
        reps: '15 reps',
        restSec: 60,
        cues: ['Keep arms locked', 'Only move shoulder blades apart and together'],
        targetMuscles: ['Serratus Anterior'],
      },
    ],
    cooldownProtocol: 'Forearm flexor/extensor stretches and passive child pose.',
  },

  // 2. POWERLIFTING & MAX STRENGTH
  {
    id: 'power_01',
    title: 'The Big 3 Peak: Squat, Bench & Deadlift Max Protocol',
    discipline: 'powerlifting',
    disciplineLabel: 'Powerlifting & Strength',
    difficulty: 'Advanced',
    durationMin: 60,
    xpReward: 280,
    caloriesBurnEstimate: 450,
    requiredEquipment: ['barbell', 'power_rack', 'bench'],
    equipmentLabel: 'Power Rack, Barbell & Bench',
    targetFocus: 'Posterior Chain, Glutes, Quads, Pectorals, Central Nervous System',
    description: 'Competition-grade strength framework. Utilizes RPE 8-9 heavy triples with paused isometric discipline to build raw absolute power.',
    warmupProtocol: 'Dynamic hip 90/90, barbell empty bar reps, glute bridges, band tear-aparts.',
    zyroTip: 'Create total-body tension before the bar leaves the rack. Pack your lats down into your back pockets and brace 360 degrees into your belt.',
    exercises: [
      {
        name: 'Competition Low-Bar Back Squat',
        sets: 4,
        reps: '3 reps (85-88% 1RM)',
        restSec: 180,
        tempo: '3-1-X-0',
        cues: ['Bar seated below spine of scapula', 'Screw feet into floor', 'Drive hips up out of hole'],
        targetMuscles: ['Quads', 'Glutes', 'Erectors', 'Core'],
      },
      {
        name: 'Paused Competition Bench Press',
        sets: 4,
        reps: '3 reps (85% 1RM)',
        restSec: 150,
        tempo: '2-1-X-0',
        cues: ['Full 1-second motionless pause on sternum', 'Drive heels through floor for leg drive', 'Flare lats wide'],
        targetMuscles: ['Pecs', 'Triceps', 'Front Delts'],
      },
      {
        name: 'Conventional Deadlift (Dead Stop)',
        sets: 3,
        reps: '3 reps (85-90% 1RM)',
        restSec: 180,
        tempo: '1-0-X-1',
        cues: ['Pull slack out of barbell until click', 'Push floor away with feet', 'Lockout with glutes not lower back'],
        targetMuscles: ['Hamstrings', 'Glutes', 'Lats', 'Traps'],
      },
    ],
    cooldownProtocol: 'Light bike cooldown 5 mins + foam rolling glutes and hamstrings.',
  },

  // 3. BODYBUILDING & HYPERTROPHY
  {
    id: 'body_01',
    title: 'Hypertrophy Push Protocol: Chest, Shoulders & Triceps',
    discipline: 'bodybuilding',
    disciplineLabel: 'Bodybuilding & Hypertrophy',
    difficulty: 'Intermediate',
    durationMin: 50,
    xpReward: 220,
    caloriesBurnEstimate: 410,
    requiredEquipment: ['dumbbells', 'barbell', 'bench'],
    equipmentLabel: 'Dumbbells & Bench',
    targetFocus: 'Clavicular Pecs, Lateral Deltoids, Tricep Lateral & Long Heads',
    description: 'High mechanical tension combined with metabolic pump work. Targets deep muscular stretch under load for maximal muscle fiber recruitment.',
    warmupProtocol: 'Rotator cuff face-pulls 2x15, pushups 2x12, dynamic arm circles.',
    zyroTip: 'Hypertrophy occurs near failure (0-2 RIR). Emphasize the deep eccentric 3-second stretch where muscle titin molecules trigger growth signals.',
    exercises: [
      {
        name: 'Incline Dumbbell Press (30° angle)',
        sets: 4,
        reps: '8-10 reps',
        restSec: 90,
        tempo: '3-1-1-0',
        cues: ['Lower dumbbells deep to touch outer chest', 'Tuck elbows 45-60 degrees', 'Contract clavicular pecs at top'],
        targetMuscles: ['Upper Chest', 'Anterior Delts', 'Triceps'],
      },
      {
        name: 'Flat Dumbbell Flye with Deep Stretch',
        sets: 3,
        reps: '10-12 reps',
        restSec: 75,
        tempo: '3-2-1-0',
        cues: ['Slight elbow bend locked throughout', 'Feel ribcage expansion at bottom', 'Bring hands together smoothly'],
        targetMuscles: ['Sternal Pectoralis Major'],
      },
      {
        name: 'Lean-Away Dumbbell Lateral Raises',
        sets: 4,
        reps: '12-15 reps (Last set drop-set)',
        restSec: 60,
        tempo: '2-1-1-0',
        cues: ['Lead with elbows, not wrists', 'Pour water forward slightly at top', 'Zero body swinging'],
        targetMuscles: ['Lateral Deltoids (Side Cap)'],
      },
      {
        name: 'Overhead Dumbbell Tricep Extension',
        sets: 3,
        reps: '10-12 reps',
        restSec: 75,
        tempo: '3-1-1-0',
        cues: ['Flare elbows minimally', 'Full deep stretch behind head to recruit long head'],
        targetMuscles: ['Triceps Long Head'],
      },
    ],
    cooldownProtocol: 'Doorway chest stretch and overhead tricep stretch 3x30 sec.',
  },
  {
    id: 'body_02',
    title: 'The Golden Era Arnold Chest & Back Superset',
    discipline: 'bodybuilding',
    disciplineLabel: 'Bodybuilding & Hypertrophy',
    difficulty: 'Advanced',
    durationMin: 55,
    xpReward: 250,
    caloriesBurnEstimate: 480,
    requiredEquipment: ['barbell', 'dumbbells', 'pullup_bar'],
    equipmentLabel: 'Barbell, Dumbbells & Pull-up Bar',
    targetFocus: 'Agonist/Antagonist Massive Upper Body Expansion',
    description: 'Inspired by Arnold Schwarzenegger’s favorite routine: alternating heavy chest presses directly with wide back rows for unprecedented pump and posture.',
    warmupProtocol: 'Lat pulldowns 2x15, band dislocates, push-ups 2x15.',
    zyroTip: 'Alternate between chest and back without resting between pairs. The antagonist pump expands the thorax and protects shoulder balance.',
    exercises: [
      {
        name: 'SUPERSET 1A: Flat Barbell Bench Press',
        sets: 4,
        reps: '8-10 reps',
        restSec: 0,
        cues: ['Arch upper back, plant feet', 'Controlled descent to lower sternum'],
        targetMuscles: ['Chest', 'Triceps'],
      },
      {
        name: 'SUPERSET 1B: Wide-Grip Weighted Pull-ups',
        sets: 4,
        reps: '6-8 reps',
        restSec: 90,
        cues: ['Pull chest up to touch bar', 'Squeeze lats down and together'],
        targetMuscles: ['Lats', 'Biceps', 'Upper Back'],
      },
      {
        name: 'SUPERSET 2A: Incline Dumbbell Press',
        sets: 3,
        reps: '10-12 reps',
        restSec: 0,
        cues: ['Focus on upper pectoral squeeze'],
        targetMuscles: ['Upper Pecs'],
      },
      {
        name: 'SUPERSET 2B: Chest-Supported Dumbbell Rows',
        sets: 3,
        reps: '10-12 reps',
        restSec: 90,
        cues: ['Pull with elbows toward back hips', 'Pause 1 sec at peak squeeze'],
        targetMuscles: ['Rhomboids', 'Mid Traps', 'Lats'],
      },
    ],
    cooldownProtocol: 'Passive hanging from bar + doorway pec stretch.',
  },

  // 4. OLYMPIC WEIGHTLIFTING
  {
    id: 'oly_01',
    title: 'Explosive Snatch & Clean-and-Jerk Triple Extension',
    discipline: 'olympic_weightlifting',
    disciplineLabel: 'Olympic Weightlifting',
    difficulty: 'Advanced',
    durationMin: 50,
    xpReward: 270,
    caloriesBurnEstimate: 420,
    requiredEquipment: ['barbell', 'bumper_plates'],
    equipmentLabel: 'Olympic Bar & Bumper Plates',
    targetFocus: 'Ankle-Knee-Hip Triple Extension, Trapezius Shrug, Velocity',
    description: 'Dynamic power training to maximize rate of force development (RFD). Trains the nervous system to produce immense wattage in milliseconds.',
    warmupProtocol: 'Burgener warmup with PVC pipe, snatch balance, overhead squat mobility.',
    zyroTip: 'Speed under the bar matters more than pulling height. Meet the bar in the deep squat pocket with an aggressive locked-out punch overhead.',
    exercises: [
      {
        name: 'Hang Snatch (Above Knee)',
        sets: 5,
        reps: '2 reps (70-80% 1RM)',
        restSec: 120,
        tempo: 'Explosive',
        cues: ['Keep bar glued to thighs', 'Violent hip pop + high elbows', 'Punch overhead into deep overhead squat'],
        targetMuscles: ['Full Body', 'Glutes', 'Traps', 'Shoulders'],
      },
      {
        name: 'Clean and Split Jerk',
        sets: 4,
        reps: '2 reps (75-85% 1RM)',
        restSec: 120,
        tempo: 'Explosive',
        cues: ['Stand out of front squat before dip', 'Vertical dip-drive, split feet aggressively', 'Lock elbows instantly'],
        targetMuscles: ['Legs', 'Traps', 'Shoulders', 'Core'],
      },
      {
        name: 'Snatch Grip High Pulls',
        sets: 3,
        reps: '4 reps (90-100% snatch)',
        restSec: 90,
        cues: ['Drive through heels', 'Full vertical shrug without looping bar out'],
        targetMuscles: ['Traps', 'Hamstrings', 'Back'],
      },
    ],
    cooldownProtocol: 'Wrist and ankle mobility drills + deep Asian squat hold for 3 mins.',
  },

  // 5. CROSSFIT & FUNCTIONAL FITNESS
  {
    id: 'cross_01',
    title: 'The "Murph" Hero Engine & Aerobic Lactate Test',
    discipline: 'crossfit_functional',
    disciplineLabel: 'Functional Fitness & CrossFit',
    difficulty: 'Elite Hunter',
    durationMin: 45,
    xpReward: 320,
    caloriesBurnEstimate: 620,
    requiredEquipment: ['pullup_bar', 'bodyweight', 'weighted_vest'],
    equipmentLabel: 'Pull-up Bar & Optional 20lb Vest',
    targetFocus: 'Aerobic Capacity, Muscular Endurance under Fatigue, Mental Fortitude',
    description: 'The legendary benchmark: 1 Mile Run, 100 Pull-ups, 200 Push-ups, 300 Air Squats, 1 Mile Run. Can be partitioned into 20 rounds of Cindy (5/10/15).',
    warmupProtocol: '800m light jog, 10 leg swings, 10 inchworms, 10 air squats.',
    zyroTip: 'Pace your push-ups from round 1! Never go to muscle failure early; break into crisp sets of 5 to preserve tricep endurance.',
    exercises: [
      {
        name: 'Initial 1-Mile Aerobic Run',
        sets: 1,
        reps: '1.6 km (Paced at 70% VO2 max)',
        restSec: 0,
        cues: ['Steady nasal or relaxed mouth breathing', 'Maintain 175-180 cadence'],
        targetMuscles: ['Cardiovascular System', 'Legs'],
      },
      {
        name: 'Partitioned Circuit: 20 Rounds of Cindy',
        sets: 20,
        reps: '5 Pull-ups + 10 Push-ups + 15 Air Squats',
        restSec: 15,
        cues: ['Chin clearly over bar', 'Chest touches floor on pushups', 'Hip crease below knee on squats'],
        targetMuscles: ['Lats', 'Chest', 'Triceps', 'Quads', 'Core'],
      },
      {
        name: 'Final 1-Mile All-Out Finishing Run',
        sets: 1,
        reps: '1.6 km (Empty the gas tank)',
        restSec: 0,
        cues: ['Lean forward from ankles', 'Pump arms to sustain stride frequency'],
        targetMuscles: ['Full Body Engine'],
      },
    ],
    cooldownProtocol: '10 min slow walk + 1L water with electrolyte minerals.',
  },

  // 6. DORM ROOM & ZERO EQUIPMENT
  {
    id: 'dorm_01',
    title: 'Campus Dorm Room 20-Min Hypertrophy Protocol',
    discipline: 'dorm_no_equipment',
    disciplineLabel: 'Dorm & Zero-Equipment',
    difficulty: 'Beginner',
    durationMin: 20,
    xpReward: 160,
    caloriesBurnEstimate: 240,
    requiredEquipment: ['bodyweight'],
    equipmentLabel: 'Dorm Bed & Backpack',
    targetFocus: 'Upper Body & Core with zero gym equipment',
    description: 'Created specifically for busy college students stuck in a tiny dorm room. Uses your study backpack loaded with textbooks for progressive overload.',
    warmupProtocol: 'Arm circles, wrist rolls, 15 jumping jacks, 10 air squats.',
    zyroTip: 'Pack your heaviest textbooks tightly in your backpack. You can generate 15-25kg of resistance for rows, squats, and push-ups without spending a dime.',
    exercises: [
      {
        name: 'Feet-Elevated Bedframe Decline Push-ups',
        sets: 4,
        reps: '12-15 reps',
        restSec: 60,
        cues: ['Toes resting on dorm bed mattress', 'Body stiff as a plank', 'Chest touches floor'],
        targetMuscles: ['Upper Chest', 'Triceps', 'Serratus'],
      },
      {
        name: 'Backpack Inverted Rows / Doorway Rows',
        sets: 4,
        reps: '10-12 reps',
        restSec: 60,
        cues: ['Grab sturdy doorframe or study desk edge', 'Drive elbows back, pinch shoulder blades'],
        targetMuscles: ['Upper Back', 'Lats', 'Biceps'],
      },
      {
        name: 'Backpack-Loaded Bulgarian Split Squat (Rear foot on chair)',
        sets: 3,
        reps: '10 reps each leg',
        restSec: 60,
        cues: ['Wear backpack on chest or back', 'Drop rear knee toward carpet', 'Drive through front heel'],
        targetMuscles: ['Quads', 'Glutes'],
      },
      {
        name: 'Desk Chair Tricep Dips with Straight Legs',
        sets: 3,
        reps: '15 reps',
        restSec: 45,
        cues: ['Hands on seat edge', 'Keep back close to chair edge', 'Lower to 90 degree elbow bend'],
        targetMuscles: ['Triceps'],
      },
    ],
    cooldownProtocol: 'Child’s pose on dorm rug + doorframe chest stretch 2 mins.',
  },

  // 7. COMBAT & BOXING CONDITIONING
  {
    id: 'combat_01',
    title: '12-Round Championship Boxer Conditioning & Rotational Core',
    discipline: 'combat_boxing',
    disciplineLabel: 'Combat & Boxing Conditioning',
    difficulty: 'Intermediate',
    durationMin: 36,
    xpReward: 240,
    caloriesBurnEstimate: 460,
    requiredEquipment: ['bodyweight'],
    equipmentLabel: 'Jump Rope & Gloves or Shadow',
    targetFocus: 'Rotational Power, Kinetic Chain Footwork, Anaerobic Capacity',
    description: 'Simulates 12 championship rounds of 3-minute combat intervals. Develops knockout kinetic chain power transferring from back foot through hips to fists.',
    warmupProtocol: '3 mins shadowboxing, neck rolls, hip rotations, 100 jump rope skips.',
    zyroTip: 'Punching power comes from the floor. Pivot the back ball of your foot on crosses and hooks, snapping your hips before the arm extends.',
    exercises: [
      {
        name: 'Boxer Double-Under & Speed Rope Intervals',
        sets: 4,
        reps: '3 mins on / 45 sec rest',
        restSec: 45,
        cues: ['Stay light on the balls of your feet', 'Turn rope purely with wrists, not shoulders'],
        targetMuscles: ['Calves', 'Shoulders', 'Aerobic Engine'],
      },
      {
        name: 'Shadowboxing Combination Drills (1-2-3-2 + Slip & Roll)',
        sets: 4,
        reps: '3 mins continuous',
        restSec: 45,
        cues: ['Jab - Cross - Lead Hook - Cross', 'Slip right, roll left underneath counter', 'Keep hands glued to chin'],
        targetMuscles: ['Obliques', 'Shoulders', 'Lats', 'Core'],
      },
      {
        name: 'Rotational Russian Medicine Ball / Floor Twists',
        sets: 3,
        reps: '30 reps (Fast cadence)',
        restSec: 45,
        cues: ['Rotate ribcage from side to side', 'Keep heels off floor in V-hold'],
        targetMuscles: ['Internal & External Obliques', 'Rectus Abdominis'],
      },
    ],
    cooldownProtocol: 'Neck and shoulder mobility rolls + deep breathing.',
  },

  // 8. MOBILITY, YOGA & FLEXIBILITY
  {
    id: 'mob_01',
    title: 'Full Body Joint Decompression & Anterior Pelvic Tilt Reset',
    discipline: 'mobility_yoga',
    disciplineLabel: 'Mobility & Yoga Flexibility',
    difficulty: 'Beginner',
    durationMin: 25,
    xpReward: 150,
    caloriesBurnEstimate: 120,
    requiredEquipment: ['bodyweight'],
    equipmentLabel: 'Mat or Carpet',
    targetFocus: 'Spine, Hip Flexor Psoas Lengthening, Glute Activation',
    description: 'Counteracts 8+ hours of lecture hall slouching. Re-aligns the pelvis, opens tight psoas and chest, and decompresses lower lumbar vertebra.',
    warmupProtocol: 'Cat-Cow spinal waves 10 reps with diaphragmatic breathing.',
    zyroTip: 'Never force joint pain. Exhale deeply on each stretch to down-regulate your sympathetic nervous system into parasympathetic recovery.',
    exercises: [
      {
        name: 'Active 90/90 Hip Switches with Forward Fold',
        sets: 3,
        reps: '10 switches + 30 sec hold each side',
        restSec: 30,
        cues: ['Both knees bent at 90 degrees', 'Keep torso tall as you rotate', 'Hinge forward over front shin'],
        targetMuscles: ['Hip Rotators', 'Glute Medius', 'Piriformis'],
      },
      {
        name: 'Couch Stretch (Deep Psoas & Quad Opener)',
        sets: 3,
        reps: '60 sec per leg',
        restSec: 30,
        cues: ['Back shin vertical against wall or couch', 'Squeeze glute of trailing leg to push hip forward', 'Keep ribs pulled down'],
        targetMuscles: ['Psoas', 'Rectus Femoris', 'Hip Flexors'],
      },
      {
        name: 'Thoracic Spine Bench Extension with Foam Roller',
        sets: 3,
        reps: '8 deep pulses + 45 sec hold',
        restSec: 30,
        cues: ['Roller under mid-back', 'Hands behind head, extend upper back backward without flaring ribs'],
        targetMuscles: ['Thoracic Spine', 'Lats', 'Pectorals'],
      },
      {
        name: 'Dead Hang from Pull-Up Bar with Passive Exhales',
        sets: 3,
        reps: '45-60 sec hold',
        restSec: 45,
        cues: ['Completely relax shoulders and hips', 'Feel vertebrae gently decompress'],
        targetMuscles: ['Lats', 'Spinal Decompressors', 'Grip'],
      }
    ],
    cooldownProtocol: 'Savasana lying flat on floor with nasal breathing for 3 minutes.',
  },

  // 9. REHAB & PREHAB (PHYSICAL THERAPY)
  {
    id: 'rehab_01',
    title: 'The McGill Big 3 Bulletproof Lower Back Protocol',
    discipline: 'rehab_prehab',
    disciplineLabel: 'Rehab & Prehab (Physical Therapy)',
    difficulty: 'Beginner',
    durationMin: 20,
    xpReward: 140,
    caloriesBurnEstimate: 110,
    requiredEquipment: ['bodyweight'],
    equipmentLabel: 'Bodyweight Floor Only',
    targetFocus: 'Lumbar Spine Stability, Core Endurance without Spinal Flexion',
    description: 'Designed by world-renowned spine biomechanist Dr. Stuart McGill. Builds endurance in the deep muscular corset without placing compressive shearing forces on spinal discs.',
    warmupProtocol: 'Cat-camel 5 cycles (gentle range only, no forcing).',
    zyroTip: 'Do not twist or flex your lower back! The goal of the spine is to resist motion while hips and shoulders produce motion.',
    exercises: [
      {
        name: 'McGill Curl-Up (Hands under lumbar spine)',
        sets: 3,
        reps: 'Descending pyramid (6-4-2 reps, 8 sec hold each)',
        restSec: 45,
        cues: ['One knee bent, one straight', 'Hands under lumbar to preserve natural curve', 'Lift head and upper shoulders only 1 inch off floor'],
        targetMuscles: ['Rectus Abdominis without lumbar strain'],
      },
      {
        name: 'Side Bridge (Side Plank from Knees or Toes)',
        sets: 3,
        reps: 'Descending pyramid (6-4-2 reps, 8 sec hold each side)',
        restSec: 45,
        cues: ['Straight line from head to ankles', 'Bridge hips up and forward', 'Brace abdominal wall'],
        targetMuscles: ['Quadratus Lumborum', 'Glute Medius', 'Obliques'],
      },
      {
        name: 'The Bird-Dog with Clenched Fists',
        sets: 3,
        reps: 'Descending pyramid (6-4-2 reps, 8 sec hold each side)',
        restSec: 45,
        cues: ['Opposite arm and leg reach out straight', 'Make a tight fist, kick heel back with toes down', 'Zero hip tilting or back arching'],
        targetMuscles: ['Multifidus', 'Glute Max', 'Rear Deltoid'],
      },
    ],
    cooldownProtocol: 'Child pose gentle stretch 2 mins.',
  },

  // 10. PLYOMETRICS, SPEED & VERTICAL JUMP
  {
    id: 'plyo_01',
    title: 'Vertical Jump Explosion & 40-Yard Sprint Acceleration',
    discipline: 'plyometrics_speed',
    disciplineLabel: 'Plyometrics, Speed & Jump',
    difficulty: 'Intermediate',
    durationMin: 35,
    xpReward: 230,
    caloriesBurnEstimate: 360,
    requiredEquipment: ['bodyweight'],
    equipmentLabel: 'Box or Bleachers & Open Ground',
    targetFocus: 'Stretch-Shortening Cycle (SSC), Achilles Tendon Elasticity, RFD',
    description: 'Used by collegiate track and basketball athletes to add 3-6 inches to vertical jump and slash tenths off acceleration splits.',
    warmupProtocol: 'Ankle pogo hops 2x20, A-skips 2x30m, dynamic hamstring scoops.',
    zyroTip: 'Minimize ground contact time! Treat the turf like hot lava. Explode the instant your forefoot strikes.',
    exercises: [
      {
        name: 'Depth Jumps from 18-inch Box (Max Vertical Rebound)',
        sets: 4,
        reps: '4 reps',
        restSec: 90,
        cues: ['Step off box, do NOT jump off', 'Absorb and immediately rocket upward with two-arm swing', 'Ground contact <0.2 seconds'],
        targetMuscles: ['Achilles Tendon', 'Calves', 'Quads', 'Glutes'],
      },
      {
        name: 'Max Effort Broad Jumps into Stick Landing',
        sets: 4,
        reps: '5 reps',
        restSec: 75,
        cues: ['Violent hip hinge backwards', 'Throw arms forward, jump as far horizontal as possible', 'Stick landing softly in athletic squat'],
        targetMuscles: ['Glutes', 'Hamstrings', 'Core'],
      },
      {
        name: '10-Yard Acceleration Sprints from 2-Point Stance',
        sets: 6,
        reps: '10 yards all out',
        restSec: 90,
        cues: ['Lean forward 45 degrees', 'Punch knees high, drive elbows back violently', 'Strike ground beneath hips'],
        targetMuscles: ['Hip Flexors', 'Glutes', 'Central Nervous System'],
      },
    ],
    cooldownProtocol: 'Calf eccentric heel drops on step + quad stretches.',
  },

  // 11. STRONGMAN & FUNCTIONAL CARRIES
  {
    id: 'strong_01',
    title: 'Heavy Farmer’s Walk & Core Armor Grip Protocol',
    discipline: 'strongman',
    disciplineLabel: 'Strongman & Heavy Carries',
    difficulty: 'Intermediate',
    durationMin: 30,
    xpReward: 210,
    caloriesBurnEstimate: 370,
    requiredEquipment: ['dumbbells', 'kettlebells'],
    equipmentLabel: 'Heavy Dumbbells, Trap Bar or Kettlebells',
    targetFocus: 'Crushing Grip, Trapezius Hypertrophy, Anti-Lateral Core Stability',
    description: 'Carrying heavy loads develops thick neck, trapezius, and bulletproof obliques that cannot be replicated by stationary lifts.',
    warmupProtocol: 'Wrist curls, suitcase deadlifts light 2x8, shoulder shrugs.',
    zyroTip: 'Do not take huge strides when walking with heavy loads. Take short, rapid, heel-to-toe heel strikes with chest puffed tall.',
    exercises: [
      {
        name: 'Heavy Farmer’s Carry (50% bodyweight per hand)',
        sets: 5,
        reps: '40 meters walk',
        restSec: 90,
        cues: ['Chest tall, shoulders packed back', 'Short, rapid footsteps', 'Do not allow weights to swing against thighs'],
        targetMuscles: ['Forearms', 'Traps', 'Glutes', 'Obliques'],
      },
      {
        name: 'Single-Arm Suitcase Carry (Anti-lateral flexion)',
        sets: 3,
        reps: '30 meters per arm',
        restSec: 60,
        cues: ['Carry weight on one side only', 'Torso must remain completely perpendicular to floor without leaning'],
        targetMuscles: ['Contralateral Quadratus Lumborum', 'Obliques'],
      },
      {
        name: 'Zercher Squats or Zercher Carries',
        sets: 3,
        reps: '8 reps or 30m carry',
        restSec: 90,
        cues: ['Barbell or heavy bag cradled in crooks of elbows', 'Upright posture, brace upper back against rounding'],
        targetMuscles: ['Upper Back', 'Core', 'Biceps', 'Quads'],
      },
    ],
    cooldownProtocol: 'Forearm flexor stretches + seated spinal twists.',
  },

  // 12. ENDURANCE & VO2 MAX ENGINE
  {
    id: 'end_01',
    title: 'Norwegian 4x4 VO2 Max Cardio Engine Protocol',
    discipline: 'endurance_vo2',
    disciplineLabel: 'Endurance & VO2 Max Engine',
    difficulty: 'Advanced',
    durationMin: 35,
    xpReward: 240,
    caloriesBurnEstimate: 490,
    requiredEquipment: ['bodyweight'],
    equipmentLabel: 'Running Track, Bike, Rower or Stairs',
    targetFocus: 'Cardiac Output, Stroke Volume, Mitochondrial Density',
    description: 'The clinically proven golden protocol developed by the Norwegian University of Science and Technology. Increases VO2 Max by up to 0.5% per session.',
    warmupProtocol: '6 minutes progressive jogging, warming up heart rate to 70% max.',
    zyroTip: 'Your 4-minute work intervals must sit at 85-95% maximum heart rate. You should be breathing hard enough that you cannot speak in full sentences.',
    exercises: [
      {
        name: 'Interval 1: 4 Minutes at 90-95% Max HR',
        sets: 1,
        reps: '4 minutes continuous hard run/sprint',
        restSec: 180,
        cues: ['Maintain steady intense pace, do not sprint and die in min 1', 'Focus on rhythmic deep nasal/mouth exchange'],
        targetMuscles: ['Myocardium', 'Lungs', 'Legs'],
      },
      {
        name: 'Interval 2: 4 Minutes at 90-95% Max HR',
        sets: 1,
        reps: '4 minutes continuous',
        restSec: 180,
        cues: ['Dig in mentally', 'Control stride efficiency'],
        targetMuscles: ['Full Body Engine'],
      },
      {
        name: 'Interval 3: 4 Minutes at 90-95% Max HR',
        sets: 1,
        reps: '4 minutes continuous',
        restSec: 180,
        cues: ['Focus on posture when fatigue peaks'],
        targetMuscles: ['Aerobic Enzymes'],
      },
      {
        name: 'Interval 4: 4 Minutes Final VO2 Max Ascendance',
        sets: 1,
        reps: '4 minutes all out',
        restSec: 0,
        cues: ['Empty everything left in your engine', 'High knee cadence'],
        targetMuscles: ['Maximal Oxygen Uptake'],
      },
    ],
    cooldownProtocol: '5 minutes slow recovery walk + quad and calf stretch.',
  }
];
