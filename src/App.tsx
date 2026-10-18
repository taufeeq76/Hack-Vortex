import React, { useState, useEffect } from 'react';
import { AppTab, UserHealthProfile, DailyQuest, HunterRank, SupportedLanguage, UserAuthSession } from './types';
import {
  INITIAL_USER_PROFILE,
  INITIAL_DIET_PLAN,
  INITIAL_QUESTS,
} from './data/mockData';
import { COUNTRIES, CountryInfo, getCountryByCode } from './data/countries';
import { Logo } from './components/Logo';
import { ExtendedOnboardingModal } from './components/ExtendedOnboardingModal';
import { MealScannerModal } from './components/MealScannerModal';
import { LiveFormCheckModal } from './components/LiveFormCheckModal';
import { AskZyroChatModal } from './components/AskZyroChatModal';
import { AuthCountryModal } from './components/AuthCountryModal';
import { SmartMotivationalNotifications } from './components/SmartMotivationalNotifications';
import { FeedbackModal } from './components/FeedbackModal';
import { BottomNav } from './components/BottomNav';
import { UniversalQuickActionFab } from './components/UniversalQuickActionFab';
import { ActiveWorkoutSessionModal } from './components/ActiveWorkoutSessionModal';
import { WORLD_WORKOUTS, WorkoutProgram } from './data/worldWorkouts';

// Views
import { HomeView } from './views/HomeView';
import { WorkoutsView } from './views/WorkoutsView';
import { DietView } from './views/DietView';
import { ChallengesView } from './views/ChallengesView';
import { CampusMapView } from './views/CampusMapView';
import { StoreView } from './views/StoreView';
import { ProgressView } from './views/ProgressView';

import { Globe, UserCheck, Sparkles, MessageSquareHeart, Shield, LogOut } from 'lucide-react';
import { useLanguage } from './i18n/LanguageContext';

export const App: React.FC = () => {
  const { currentLanguage, setLanguage, t, supportedLanguages, isRtl } = useLanguage();
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [userProfile, setUserProfile] = useState<UserHealthProfile>(INITIAL_USER_PROFILE);
  const [dietPlan, setDietPlan] = useState(INITIAL_DIET_PLAN);
  const [quests, setQuests] = useState<DailyQuest[]>(INITIAL_QUESTS);
  const [streakDays, setStreakDays] = useState<number>(14);
  const [streakFreezeAvailable, setStreakFreezeAvailable] = useState<number>(2);
  const [userXP, setUserXP] = useState<number>(1420);
  const [hunterRank, setHunterRank] = useState<HunterRank>('C');
  const [hydrationLiters, setHydrationLiters] = useState<number>(1.75);
  const [sleepHours, setSleepHours] = useState<number>(7.5);

  // Authentication & Session State: Gate newly opened app with Sign In / Register / Forgot Password
  const [authSession, setAuthSession] = useState<UserAuthSession>(() => {
    try {
      const saved = localStorage.getItem('zyro_auth_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.isLoggedIn && parsed.userId) {
          return parsed;
        }
      }
    } catch (e) {
      // ignore
    }
    return {
      userId: '',
      countryCode: 'IN', // Default to India, can switch to any of 21+ global countries
      isLoggedIn: false, // Newly opened app asks user to sign in or create an account
    };
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('zyro_auth_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        return !(parsed && parsed.isLoggedIn);
      }
    } catch (e) {
      // ignore
    }
    return true; // Newly opened app: automatically prompt user to sign in or create account
  });
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // Modals state
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isMealScannerOpen, setIsMealScannerOpen] = useState(false);
  const [isFormCheckOpen, setIsFormCheckOpen] = useState(false);
  const [formCheckWorkoutTitle, setFormCheckWorkoutTitle] = useState('Dopamine Squat & Mobility Circuit');
  const [isAskAiOpen, setIsAskAiOpen] = useState(false);
  const [zyroInitialPrompt, setZyroInitialPrompt] = useState<string | undefined>(undefined);

  // Dynamic Connected Nutrition State
  const [consumedCalories, setConsumedCalories] = useState<number>(1740);
  const [consumedProtein, setConsumedProtein] = useState<number>(108);
  const [consumedCarbs, setConsumedCarbs] = useState<number>(184);
  const [consumedFats, setConsumedFats] = useState<number>(52);

  // Immersive Active Workout State
  const [hasTrainedToday, setHasTrainedToday] = useState<boolean>(false);
  const [activeWorkoutProgram, setActiveWorkoutProgram] = useState<WorkoutProgram | null>(null);

  const currentCountry: CountryInfo = getCountryByCode(authSession.countryCode);

  const handleStartWorkoutSession = (workoutTitle: string) => {
    const found =
      WORLD_WORKOUTS.find(
        (w) =>
          w.title.toLowerCase().includes(workoutTitle.toLowerCase()) ||
          workoutTitle.toLowerCase().includes(w.title.toLowerCase())
      ) || WORLD_WORKOUTS[0];
    setActiveWorkoutProgram(found);
  };

  const handleCompleteActiveWorkout = (earnedXP: number, workoutTitle: string) => {
    setUserXP((prev) => prev + earnedXP);
    setHasTrainedToday(true);
    setQuests((prev) =>
      prev.map((q) => (q.category === 'workout' || q.id === 'quest-1' ? { ...q, completed: true } : q))
    );
  };

  const handleSaveAuth = (session: UserAuthSession) => {
    setAuthSession(session);
    setIsAuthModalOpen(false);
    try {
      localStorage.setItem('zyro_auth_session', JSON.stringify(session));
    } catch (e) {
      // ignore
    }
  };

  const handleLogout = () => {
    const clearedSession: UserAuthSession = {
      userId: '',
      countryCode: authSession.countryCode || 'IN',
      isLoggedIn: false,
    };
    setAuthSession(clearedSession);
    try {
      localStorage.removeItem('zyro_auth_session');
    } catch (e) {
      // ignore
    }
    setIsAuthModalOpen(true);
  };

  // Quest Toggle handler
  const handleToggleQuest = (id: string) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          const nextState = !q.completed;
          if (nextState) {
            setUserXP((xp) => xp + q.xpReward);
          }
          return { ...q, completed: nextState };
        }
        return q;
      })
    );
  };

  // Complete single quest directly (e.g. from alert notification)
  const handleCompleteQuestDirect = (id: string) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === id && !q.completed) {
          setUserXP((xp) => xp + q.xpReward);
          return { ...q, completed: true };
        }
        return q;
      })
    );
  };

  // Streak Freeze handler
  const handleUseStreakFreeze = () => {
    if (streakFreezeAvailable > 0) {
      setStreakFreezeAvailable((prev) => prev - 1);
    }
  };

  // Live Form Check workout completion
  const handleCompleteFormWorkout = (earnedXP: number) => {
    setUserXP((prev) => prev + earnedXP);
  };

  const handleLaunchFormCheck = (workoutTitle?: string) => {
    if (workoutTitle) setFormCheckWorkoutTitle(workoutTitle);
    setIsFormCheckOpen(true);
  };

  const handleOpenZyroWithPrompt = (prompt?: string) => {
    setZyroInitialPrompt(prompt);
    setIsAskAiOpen(true);
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#0A0A0A] text-white flex flex-col font-sans selection:bg-emerald-500 selection:text-black"
    >
      {/* Top Brand Header */}
      <header className="sticky top-0 z-30 border-b border-emerald-900/30 bg-gradient-to-b from-[#0F1711] via-[#0A0A0A]/95 to-[#0A0A0A]/80 backdrop-blur-xl px-4 sm:px-8 py-3 sm:py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Tagline Badge */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="cursor-pointer" onClick={() => setActiveTab('home')}>
              <Logo showTagline={false} size="md" />
            </div>

            <div className="hidden lg:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
              <Sparkles size={12} />
              <span>ZYRO System • {currentCountry.currency}</span>
            </div>
          </div>

          {/* Right Controls: Country Switcher + Streak + Language + Feedback + Profile */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            {/* Country & Account Switcher + Sign Out */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 bg-[#141b16] hover:bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-500 text-white px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
                title={authSession.isLoggedIn ? "Account & Country Settings" : "Sign In / Register"}
              >
                <span className="text-sm">{currentCountry.flag}</span>
                <span className="hidden sm:inline text-white font-mono text-[11px] font-bold">
                  {currentCountry.code} ({currentCountry.currencySymbol})
                </span>
                <span className="text-[10px] text-gray-400 font-normal">|</span>
                <span className="text-[11px] text-emerald-400 font-bold truncate max-w-[80px]">
                  {authSession.userId || 'Sign In'}
                </span>
              </button>

              {authSession.isLoggedIn && (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="bg-[#141b16] hover:bg-rose-950/40 border border-white/10 hover:border-rose-500/40 text-gray-400 hover:text-rose-300 p-2 rounded-xl text-xs transition-colors cursor-pointer"
                  title="Sign Out / Switch Account"
                >
                  <LogOut size={13} />
                </button>
              )}
            </div>

            {/* Streak Badge */}
            <div
              onClick={() => setActiveTab('home')}
              className="hidden md:flex items-center gap-1 cursor-pointer hover:opacity-90 transition-opacity"
            >
              <span className="text-lg leading-none">🔥</span>
              <span className="font-black text-xs tracking-tight text-white whitespace-nowrap uppercase">
                {streakDays}D
              </span>
            </div>

            {/* Language Selector */}
            <div className="relative hidden sm:flex items-center gap-1 bg-[#161616] border border-emerald-900/40 rounded-xl px-2 py-1.5 text-xs text-slate-300">
              <Globe size={13} className="text-emerald-400" />
              <select
                value={currentLanguage}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
                title={t('languageSelector', 'Choose Language')}
              >
                {supportedLanguages.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-[#161616] text-white">
                    {lang.flag} {lang.nativeName}
                  </option>
                ))}
              </select>
            </div>

            {/* Community Patch Notes & Feedback */}
            <button
              type="button"
              onClick={() => setIsFeedbackModalOpen(true)}
              className="flex items-center gap-1.5 bg-[#161616] hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              title="Community Patch Notes & Feedback"
            >
              <MessageSquareHeart size={14} className="text-emerald-400" />
              <span className="hidden lg:inline text-[11px]">Updates & Feedback</span>
            </button>

            {/* Health & Body Profile Button */}
            <button
              type="button"
              onClick={() => setIsOnboardingOpen(true)}
              className="flex items-center gap-2 bg-[#161616] hover:bg-emerald-500/10 border border-emerald-900/50 hover:border-emerald-500/40 text-white px-2.5 sm:px-3 py-1.5 rounded-2xl text-xs font-bold transition-all cursor-pointer group"
              title={t('bodyProfile', 'Health & Body Profile')}
            >
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-black font-black text-[11px] flex items-center justify-center shadow-[0_0_10px_#10B981]">
                {(userProfile?.bodyShape || 'M')[0].toUpperCase()}
              </div>
              <span className="hidden sm:inline font-bold text-xs group-hover:text-emerald-300 transition-colors">
                Profile
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Smart Motivational Notification System (Duolingo-style emotional nudges without alarmist symbols) */}
      <SmartMotivationalNotifications
        quests={quests}
        onCompleteQuest={handleCompleteQuestDirect}
        onOpenZyroChat={handleOpenZyroWithPrompt}
        onNavigateToTab={(tab) => setActiveTab(tab as AppTab)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 pt-4 sm:pt-6">
        {activeTab === 'home' && (
          <HomeView
            userProfile={userProfile}
            userName={authSession.fullName || authSession.userId || 'Athlete'}
            quests={quests}
            onToggleQuest={handleToggleQuest}
            streakDays={streakDays}
            streakFreezeAvailable={streakFreezeAvailable}
            onUseStreakFreeze={handleUseStreakFreeze}
            userXP={userXP}
            hunterRank={hunterRank}
            hydrationLiters={hydrationLiters}
            onAddHydration={(amount) => {
              setHydrationLiters((prev) => +(prev + amount).toFixed(2));
              if (hydrationLiters + amount >= 2.0) {
                setQuests((prev) =>
                  prev.map((q) =>
                    q.id === 'quest-3' || q.category === 'hydration' ? { ...q, completed: true } : q
                  )
                );
              }
            }}
            sleepHours={sleepHours}
            dietPlan={dietPlan}
            consumedCalories={consumedCalories}
            consumedProtein={consumedProtein}
            consumedCarbs={consumedCarbs}
            consumedFats={consumedFats}
            hasTrainedToday={hasTrainedToday}
            onNavigateTab={(tab) => setActiveTab(tab as AppTab)}
            onOpenLiveFormCheck={handleLaunchFormCheck}
            onStartActiveWorkout={handleStartWorkoutSession}
            onOpenMealScanner={() => setIsMealScannerOpen(true)}
            onOpenAskAi={(prompt) => handleOpenZyroWithPrompt(prompt)}
            onOpenBodyProfile={() => setIsOnboardingOpen(true)}
          />
        )}

        {activeTab === 'workouts' && (
          <WorkoutsView
            userProfile={userProfile}
            onOpenLiveFormCheck={handleLaunchFormCheck}
            onOpenZyroChat={handleOpenZyroWithPrompt}
            onStartActiveWorkout={(workout) => setActiveWorkoutProgram(workout)}
          />
        )}

        {activeTab === 'diet' && (
          <DietView
            dietPlan={dietPlan}
            userProfile={userProfile}
            hydrationLiters={hydrationLiters}
            onAddHydration={(amount) => setHydrationLiters((prev) => +(prev + amount).toFixed(2))}
            sleepHours={sleepHours}
            onLogSleep={(hrs) => setSleepHours(hrs)}
            onOpenMealScanner={() => setIsMealScannerOpen(true)}
            onOpenZyroChat={handleOpenZyroWithPrompt}
          />
        )}

        {activeTab === 'challenges' && (
          <ChallengesView
            userXP={userXP}
            hunterRank={hunterRank}
            streakDays={streakDays}
          />
        )}

        {activeTab === 'campus' && (
          <CampusMapView userCountry={currentCountry} />
        )}

        {activeTab === 'store' && (
          <StoreView
            userProfile={userProfile}
            userCountry={currentCountry}
            onOpenCountryModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressView
            userProfile={userProfile}
            hunterRank={hunterRank}
            userXP={userXP}
            streakDays={streakDays}
            onOpenBodyProfile={() => setIsOnboardingOpen(true)}
          />
        )}
      </main>

      {/* Persistent Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenAskAi={() => handleOpenZyroWithPrompt()}
      />

      {/* Universal Athlete Gateway: Sign In / Create Account / Forgot Password */}
      <AuthCountryModal
        isOpen={isAuthModalOpen || !authSession.isLoggedIn}
        currentAuth={authSession}
        onAuthenticate={handleSaveAuth}
        canDismiss={authSession.isLoggedIn}
        onClose={() => {
          if (authSession.isLoggedIn) {
            setIsAuthModalOpen(false);
          }
        }}
      />

      {/* User Feedback & Community Patch Notes Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        userId={authSession.userId}
      />

      {/* Health & Body Shape Calibration Modal */}
      <ExtendedOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        initialProfile={userProfile}
        currentProfile={userProfile}
        currentLanguage={currentLanguage}
        onLanguageChange={(code) => setLanguage(code as SupportedLanguage)}
        onSaveProfile={(updated) => setUserProfile(updated)}
        isEditing
      />

      {/* Meal Scanner Modal */}
      <MealScannerModal
        isOpen={isMealScannerOpen}
        onClose={() => setIsMealScannerOpen(false)}
        userProfile={userProfile}
        userWeightKg={userProfile.weightKg}
        remainingCalories={Math.max(0, (dietPlan.targetDailyCalories || 2600) - consumedCalories)}
        onAddMealToLog={(scanned) => {
          setConsumedCalories((prev) => prev + scanned.macros.calories);
          setConsumedProtein((prev) => prev + scanned.macros.protein);
          setConsumedCarbs((prev) => prev + scanned.macros.carbs);
          setConsumedFats((prev) => prev + scanned.macros.fats);
          setUserXP((prev) => prev + 50);
          setQuests((prev) =>
            prev.map((q) => (q.id === 'quest-2' || q.category === 'nutrition' ? { ...q, completed: true } : q))
          );
        }}
      />

      {/* Universal Quick Action Floating System (Prompt Requirement 17) */}
      <UniversalQuickActionFab
        onOpenWorkout={() => handleStartWorkoutSession('Power Squat & Athletic Ascend Circuit')}
        onOpenScanFood={() => setIsMealScannerOpen(true)}
        onLogWater={() => {
          setHydrationLiters((prev) => {
            const next = +(prev + 0.5).toFixed(2);
            if (next >= 2.0) {
              setQuests((qList) =>
                qList.map((q) =>
                  q.id === 'quest-3' || q.category === 'hydration' ? { ...q, completed: true } : q
                )
              );
            }
            return next;
          });
          setUserXP((prev) => prev + 30);
        }}
        onOpenAskZyro={() => handleOpenZyroWithPrompt('What should I do right now to optimize my performance?')}
        onOpenGoals={() => {
          setActiveTab('home');
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
        onOpenProgress={() => setActiveTab('progress')}
      />

      {/* Immersive Active Workout Session Player Modal (Prompt Requirement 9 & 15) */}
      {activeWorkoutProgram && (
        <ActiveWorkoutSessionModal
          isOpen={Boolean(activeWorkoutProgram)}
          workout={activeWorkoutProgram}
          onClose={() => setActiveWorkoutProgram(null)}
          onCompleteWorkout={handleCompleteActiveWorkout}
          onNavigateToStore={(_query) => {
            setActiveWorkoutProgram(null);
            setActiveTab('store');
          }}
        />
      )}

      {/* Live Form Check Modal */}
      <LiveFormCheckModal
        isOpen={isFormCheckOpen}
        onClose={() => setIsFormCheckOpen(false)}
        workoutTitle={formCheckWorkoutTitle}
        onCompleteWorkout={handleCompleteFormWorkout}
      />

      {/* ZYRO Omniscient AI Chat Modal */}
      <AskZyroChatModal
        isOpen={isAskAiOpen}
        onClose={() => {
          setIsAskAiOpen(false);
          setZyroInitialPrompt(undefined);
        }}
        initialPrompt={zyroInitialPrompt}
        userName={authSession.userId}
        countryName={currentCountry.name}
      />
    </div>
  );
};

export default App;
