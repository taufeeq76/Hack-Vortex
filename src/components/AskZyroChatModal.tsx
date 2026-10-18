import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  X,
  Sparkles,
  Paperclip,
  Mic,
  MicOff,
  Maximize2,
  Minimize2,
  Sliders,
  PanelLeftClose,
  PanelLeft,
  Compass,
  BookOpen,
  Code,
  Calculator,
  FileText,
  Search,
  Image as ImageIcon,
  StopCircle,
  RotateCcw,
  Loader2,
  CornerDownLeft,
  ChevronDown
} from 'lucide-react';
import { ChatMessage, ZyroAiMode, ZyroAttachment, ZyroConversation, ZyroStudyLevel, ZyroUserPreferences } from '../types';
import { ZyroService } from '../services/zyroService';
import { ZyroSidebar } from './zyro/ZyroSidebar';
import { ZyroMessageItem } from './zyro/ZyroMessageItem';
import { ZyroSettingsModal } from './zyro/ZyroSettingsModal';
import { ZyroImageModal } from './zyro/ZyroImageModal';

interface AskZyroChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
  userName?: string;
  countryName?: string;
}

const MODES: { id: ZyroAiMode; label: string; icon: React.FC<{ size?: number; className?: string }>; desc: string }[] = [
  { id: 'general', label: 'Universal', icon: Compass, desc: 'General intelligence, everyday tasks & reasoning' },
  { id: 'research', label: 'Deep Research', icon: Sparkles, desc: 'Exhaustive reports with live web search citations' },
  { id: 'study', label: 'Study & Tutor', icon: BookOpen, desc: 'Socratic explanations, practice questions & analogies' },
  { id: 'coding', label: 'Code & Dev', icon: Code, desc: 'Architecture, debugging, algorithms & full tests' },
  { id: 'math', label: 'Math & Data', icon: Calculator, desc: 'Step-by-step rigorous computation & data analysis' },
  { id: 'creative', label: 'Writing & Voice', icon: FileText, desc: 'Compelling essays, emails, prose & storytelling' },
];

const PROMPT_SUGGESTIONS: Record<ZyroAiMode, { label: string; prompt: string }[]> = {
  general: [
    { label: '🏋️ Biomechanics', prompt: 'Analyze the force vectors and joint moments in a low-bar vs high-bar squat.' },
    { label: '🧬 Leucine & mTOR', prompt: 'What is the optimal leucine threshold for muscle protein synthesis and how does it signal mTOR?' },
    { label: '⚡ Creatine Kinetics', prompt: 'Explain the creatine kinase bioenergetic cycle and whether loading is scientifically necessary.' },
    { label: '🌍 First Law of Thermo', prompt: 'How does the first law of thermodynamics apply to human metabolic adaptation during a calorie deficit?' },
  ],
  research: [
    { label: '🔬 Autophagy & Fasting', prompt: 'Perform a structured deep research report on the cellular mechanisms of autophagy induced by intermittent fasting.' },
    { label: '⚡ Cold Exposure & Dopamine', prompt: 'Synthesize research on cold water immersion: effects on dopamine baseline, norepinephrine, and muscle recovery.' },
    { label: '📈 Creatine & Cognition', prompt: 'Research the neuroprotective and cognitive effects of creatine monohydrate supplementation in sleep-deprived individuals.' },
    { label: '🧠 Deep Sleep & HRV', prompt: 'Conduct a comprehensive review on how slow-wave Stage 3 NREM sleep affects human growth hormone and autonomic balance.' },
  ],
  study: [
    { label: '🎓 Socratic Physics', prompt: 'Teach me the concept of entropy and the Second Law of Thermodynamics using simple everyday analogies, then quiz me.' },
    { label: '🧬 Cellular Respiration', prompt: 'Walk me step-by-step through the Krebs Cycle and oxidative phosphorylation as if I am an intermediate biology student.' },
    { label: '📐 Calculus & Derivatives', prompt: 'Explain what a derivative really is geometrically, why the limit definition works, and give me a practice problem.' },
    { label: '💻 Big-O Complexity', prompt: 'Break down Big-O notation, amortized time complexity, and how to analyze recursive divide-and-conquer algorithms.' },
  ],
  coding: [
    { label: '💻 LRU Cache in TS', prompt: 'Implement an optimal O(1) Least Recently Used (LRU) Cache in TypeScript using a doubly-linked list and Map.' },
    { label: '⚡ React Hook Patterns', prompt: 'Explain race condition mitigation in React useEffect hooks using AbortController with a complete production example.' },
    { label: '🐍 Python Fast Parallel', prompt: 'Write an asynchronous Python pipeline using asyncio.gather and a Semaphore for high-concurrency data processing.' },
    { label: '🛡️ SQL Injection Defense', prompt: 'Show parameterized query best practices and index optimization for high-throughput Postgres databases.' },
  ],
  math: [
    { label: '🧮 Baye\'s Theorem', prompt: 'Derive Bayes\' Theorem from conditional probability and solve a realistic medical diagnostic test false-positive problem.' },
    { label: '📊 T-Test vs ANOVA', prompt: 'Explain when to use a Student\'s t-test versus a one-way ANOVA with F-statistic calculation steps.' },
    { label: '🔢 Matrix Eigenvalues', prompt: 'Solve for the eigenvalues and eigenvectors of a 2x2 symmetric transformation matrix step-by-step.' },
    { label: '📈 Compound Interest Model', prompt: 'Calculate the total accumulation of $500 monthly contributions over 20 years at 8.5% annual return compounded monthly.' },
  ],
  creative: [
    { label: '✍️ Executive Proposal', prompt: 'Write a persuasive, polished executive proposal advocating for a modern campus fitness & wellness center.' },
    { label: '🎙️ Inspiring Keynote', prompt: 'Draft a short, electrifying 3-minute keynote speech on personal transformation, discipline, and relentless consistency.' },
    { label: '✉️ Professional Pitch', prompt: 'Craft a compelling cold email to an elite sports scientist requesting a collaborative research mentorship.' },
    { label: '📖 Narrative Story', prompt: 'Write a vivid, atmospheric short scene of a mountaineer conquering a storm-lashed peak at dawn.' },
  ],
};

export const AskZyroChatModal: React.FC<AskZyroChatModalProps> = ({
  isOpen,
  onClose,
  initialPrompt,
  userName = 'Athlete',
  countryName = 'Earth',
}) => {
  // Conversations & History State
  const [conversations, setConversations] = useState<ZyroConversation[]>(() => ZyroService.getConversations());
  const [activeConvId, setActiveConvId] = useState<string>(() => ZyroService.getActiveConversationId());
  const [preferences, setPreferences] = useState<ZyroUserPreferences>(() => ZyroService.getUserPreferences());

  // Active Mode & UI Layout State
  const activeConversation = conversations.find((c) => c.id === activeConvId) || conversations[0];
  const [activeMode, setActiveMode] = useState<ZyroAiMode>(activeConversation?.mode || 'general');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.8-flash');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Input & Messaging State
  const [inputVal, setInputVal] = useState('');
  const [attachments, setAttachments] = useState<ZyroAttachment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatusText, setLoadingStatusText] = useState('Thinking & Analyzing...');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const speechRecognitionRef = useRef<any>(null);

  // Sync mode with active conversation
  useEffect(() => {
    if (activeConversation) {
      setActiveMode(activeConversation.mode);
    }
  }, [activeConvId]);

  // Initial prompt auto-send
  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeConversation?.messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [inputVal]);

  if (!isOpen) return null;

  // -------------------------------------------------------------
  // Message Sending & Logic
  // -------------------------------------------------------------
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend !== undefined ? textToSend : inputVal).trim();
    if ((!query && attachments.length === 0) || isLoading) return;

    const currentAtts = [...attachments];
    setInputVal('');
    setAttachments([]);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    // Create user message
    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachments: currentAtts.length > 0 ? currentAtts : undefined,
    };

    const updatedMessages = [...activeConversation.messages, userMsg];

    // Update conversation in state and storage
    const updatedConv: ZyroConversation = {
      ...activeConversation,
      mode: activeMode,
      updatedAt: new Date().toISOString(),
      messages: updatedMessages,
      // Auto-title from first user message if default
      title:
        activeConversation.messages.length <= 1 && query
          ? query.slice(0, 36) + (query.length > 36 ? '...' : '')
          : activeConversation.title,
    };

    const newConvs = conversations.map((c) => (c.id === updatedConv.id ? updatedConv : c));
    setConversations(newConvs);
    ZyroService.saveConversations(newConvs);

    // Set loading state
    setIsLoading(true);
    setLoadingStatusText(
      activeMode === 'research'
        ? 'Searching Google & Synthesizing Sources...'
        : activeMode === 'coding'
        ? 'Analyzing Code Architecture & Edge Cases...'
        : activeMode === 'math'
        ? 'Formulating Equations & Verifying Computation...'
        : 'Formulating Intelligent Analysis...'
    );

    try {
      const response = await ZyroService.sendChatMessage({
        messages: updatedMessages,
        mode: activeMode,
        studyLevel: preferences.studyLevel,
        userPreferences: preferences,
        useWebSearch: activeMode === 'research' || preferences.enableSearchGrounding,
        model: selectedModel,
      });

      const aiMsg: ChatMessage = {
        id: `msg_a_${Date.now()}`,
        sender: 'zyro_ai',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: activeMode,
        usedWebSearch: response.usedWebSearch,
        searchSources: response.searchSources,
        searchQueries: response.searchQueries,
      };

      const finalConv: ZyroConversation = {
        ...updatedConv,
        messages: [...updatedMessages, aiMsg],
      };

      const finalConvs = conversations.map((c) => (c.id === finalConv.id ? finalConv : c));
      setConversations(finalConvs);
      ZyroService.saveConversations(finalConvs);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `msg_err_${Date.now()}`,
        sender: 'zyro_ai',
        text: `### ⚠️ ZYRO AI Notice\n\nI encountered an issue processing your request: "${err.message}".\n\nPlease check your network connection or try regenerating your query.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };

      const errorConv: ZyroConversation = {
        ...updatedConv,
        messages: [...updatedMessages, errorMsg],
      };
      const finalConvs = conversations.map((c) => (c.id === errorConv.id ? errorConv : c));
      setConversations(finalConvs);
      ZyroService.saveConversations(finalConvs);
    } finally {
      setIsLoading(false);
    }
  };

  // Regenerate last AI response
  const handleRegenerate = () => {
    const lastUserIndex = [...activeConversation.messages].map((m) => m.sender).lastIndexOf('user');
    if (lastUserIndex === -1) return;

    const messagesUpToUser = activeConversation.messages.slice(0, lastUserIndex + 1);
    const lastUserMessage = activeConversation.messages[lastUserIndex];

    const trimmedConv: ZyroConversation = {
      ...activeConversation,
      messages: messagesUpToUser,
    };

    const newConvs = conversations.map((c) => (c.id === trimmedConv.id ? trimmedConv : c));
    setConversations(newConvs);
    ZyroService.saveConversations(newConvs);

    handleSendMessage(lastUserMessage.text);
  };

  // -------------------------------------------------------------
  // Attachment Handling (Drag & Drop, Click)
  // -------------------------------------------------------------
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const isImg = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf';
      const reader = new FileReader();

      if (isImg || isPdf) {
        reader.readAsDataURL(file);
        reader.onload = () => {
          const base64 = reader.result as string;
          setAttachments((prev) => [
            ...prev,
            {
              id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              name: file.name,
              size: file.size,
              type: file.type || (isPdf ? 'application/pdf' : 'image/png'),
              base64,
            },
          ]);
        };
      } else {
        // Text, CSV, JSON, Code files
        reader.readAsText(file);
        reader.onload = () => {
          const content = reader.result as string;
          setAttachments((prev) => [
            ...prev,
            {
              id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              name: file.name,
              size: file.size,
              type: file.type || 'text/plain',
              content,
            },
          ]);
        };
      }
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  // -------------------------------------------------------------
  // Voice Input (Web Speech Recognition)
  // -------------------------------------------------------------
  const toggleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isRecordingVoice) {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
      setIsRecordingVoice(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecordingVoice(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((res: any) => res[0].transcript)
          .join('');
        setInputVal(transcript);
      };

      recognition.onerror = () => {
        setIsRecordingVoice(false);
      };

      recognition.onend = () => {
        setIsRecordingVoice(false);
      };

      speechRecognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error('Failed to start speech recognition', e);
      setIsRecordingVoice(false);
    }
  };

  // -------------------------------------------------------------
  // Conversation Operations
  // -------------------------------------------------------------
  const handleNewConversation = (mode: ZyroAiMode = 'general') => {
    const newConv = ZyroService.createNewConversation(mode);
    setConversations(ZyroService.getConversations());
    setActiveConvId(newConv.id);
    setActiveMode(mode);
  };

  const handleDeleteConversation = (id: string) => {
    const remaining = ZyroService.deleteConversation(id);
    setConversations(remaining);
    setActiveConvId(ZyroService.getActiveConversationId());
  };

  const handleRenameConversation = (id: string, newTitle: string) => {
    ZyroService.renameConversation(id, newTitle);
    setConversations(ZyroService.getConversations());
  };

  const handleClearAll = () => {
    localStorage.removeItem('zyro_conversations_v2');
    const fresh = ZyroService.getConversations();
    setConversations(fresh);
    setActiveConvId(fresh[0].id);
  };

  const handleSwitchMode = (mode: ZyroAiMode) => {
    setActiveMode(mode);
    const updated = { ...activeConversation, mode };
    const newConvs = conversations.map((c) => (c.id === updated.id ? updated : c));
    setConversations(newConvs);
    ZyroService.saveConversations(newConvs);
  };

  const handleInsertGeneratedImage = (imageUrl: string, promptText: string) => {
    const imgMsg: ChatMessage = {
      id: `msg_img_${Date.now()}`,
      sender: 'zyro_ai',
      text: `### 🖼️ Multimodal Synthesis Result\n\nGenerated visual concept for: **"${promptText}"**`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      generatedImageUrl: imageUrl,
      mode: 'creative',
    };

    const updatedConv: ZyroConversation = {
      ...activeConversation,
      messages: [...activeConversation.messages, imgMsg],
    };

    const newConvs = conversations.map((c) => (c.id === updatedConv.id ? updatedConv : c));
    setConversations(newConvs);
    ZyroService.saveConversations(newConvs);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-0 sm:p-4">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        multiple
        accept="image/*,application/pdf,.txt,.csv,.json,.py,.ts,.js,.cpp,.java,.md"
        className="hidden"
      />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className={`relative bg-[#09110C] border border-emerald-900/60 flex flex-col overflow-hidden text-white transition-all shadow-[0_25px_70px_rgba(0,0,0,0.95)] ${
          isFullscreen
            ? 'w-full h-full rounded-none'
            : 'w-full max-w-6xl h-full sm:h-[92vh] sm:rounded-3xl'
        }`}
      >
        {/* Top Header Bar */}
        <header className="px-4 py-3 bg-[#070D09] border-b border-emerald-950/80 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-xl hover:bg-emerald-950/60 text-gray-400 hover:text-emerald-400 transition-colors cursor-pointer"
              title={isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
            >
              {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeft size={18} />}
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-black font-black text-sm shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                ⚡
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-black text-white tracking-tight">ZYRO AI</h1>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-800/60 text-emerald-400 font-bold">
                    MULTIMODAL
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 hidden sm:block">
                  Universal Intelligence • Deep Research • Code & Math Sandbox
                </p>
              </div>
            </div>
          </div>

          {/* Model Abstraction Switcher & Window Controls */}
          <div className="flex items-center gap-2">
            <div className="relative hidden md:flex items-center bg-[#0C1710] border border-emerald-950 rounded-xl px-2.5 py-1 text-xs text-gray-300">
              <span className="text-gray-500 mr-1.5 text-[11px]">Model:</span>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-transparent text-emerald-400 font-mono text-xs focus:outline-none cursor-pointer"
              >
                <option value="gemini-3.8-flash" className="bg-[#0C1710] text-white">
                  gemini-3.8-flash (Fast & Multimodal)
                </option>
                <option value="gemini-3.1-pro-preview" className="bg-[#0C1710] text-white">
                  gemini-3.1-pro-preview (Deep Reasoning)
                </option>
              </select>
            </div>

            {/* Quick Image Generator Button */}
            <button
              type="button"
              onClick={() => setIsImageModalOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/60 border border-emerald-800/40 text-emerald-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Generate AI Images"
            >
              <ImageIcon size={14} className="text-emerald-400" />
              <span className="hidden sm:inline">Image Gen</span>
            </button>

            {/* Settings Trigger */}
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-xl text-gray-400 hover:text-emerald-400 hover:bg-emerald-950/60 transition-colors cursor-pointer"
              title="AI Settings & Tone"
            >
              <Sliders size={17} />
            </button>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-emerald-950/60 transition-colors cursor-pointer hidden sm:block"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
            </button>

            {/* Close Modal */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </header>

        {/* Mode Selector Strip */}
        <div className="px-3 sm:px-4 py-2 bg-[#08100B] border-b border-emerald-950/70 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {MODES.map((mode) => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => handleSwitchMode(mode.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-black font-black shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                    : 'bg-[#0B150F] text-gray-400 hover:text-white hover:bg-[#112217] border border-emerald-950/80 font-medium'
                }`}
                title={mode.desc}
              >
                <Icon size={13} className={isActive ? 'text-black' : 'text-emerald-400'} />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body: Sidebar + Chat Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Conversation History Sidebar */}
          {isSidebarOpen && (
            <ZyroSidebar
              conversations={conversations}
              activeId={activeConvId}
              onSelectConversation={(id) => {
                setActiveConvId(id);
                ZyroService.setActiveConversationId(id);
              }}
              onNewConversation={handleNewConversation}
              onDeleteConversation={handleDeleteConversation}
              onRenameConversation={handleRenameConversation}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onCloseMobile={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col bg-gradient-to-b from-[#09120D] via-[#080E0A] to-[#060A07] overflow-hidden">
            {/* Messages Scroll Area */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 sm:px-8 py-5 space-y-2 scroll-smooth"
            >
              {activeConversation.messages.map((msg, index) => (
                <ZyroMessageItem
                  key={msg.id}
                  message={msg}
                  isLatest={
                    index === activeConversation.messages.length - 1 &&
                    msg.sender === 'zyro_ai'
                  }
                  onRegenerate={handleRegenerate}
                />
              ))}

              {/* Loading Indicator with Animated Status */}
              {isLoading && (
                <div className="flex items-center gap-3 my-4 p-3 rounded-2xl bg-emerald-950/30 border border-emerald-900/40 text-emerald-300 text-xs animate-pulse max-w-md">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Loader2 size={13} className="animate-spin" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="font-bold flex items-center gap-1.5">
                      <span>ZYRO Cognitive Engine Active</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    </div>
                    <div className="text-[11px] text-gray-400">{loadingStatusText}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Contextual Suggestions Chips */}
            {activeConversation.messages.length <= 2 && (
              <div className="px-4 sm:px-8 pb-3 shrink-0">
                <div className="text-[11px] font-bold text-gray-400 mb-1.5 flex items-center gap-1.5">
                  <Sparkles size={12} className="text-emerald-400" />
                  <span>Explore topics with ZYRO:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {PROMPT_SUGGESTIONS[activeMode]?.map((sug, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSendMessage(sug.prompt)}
                      className="text-left p-2 rounded-xl bg-[#0B1610]/80 hover:bg-emerald-950/70 border border-emerald-950 hover:border-emerald-800 text-xs text-gray-300 hover:text-white transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <span className="font-medium text-emerald-300 group-hover:text-emerald-200">
                        {sug.label}
                      </span>
                      <span className="text-[10px] text-gray-500 truncate max-w-[180px] ml-2">
                        {sug.prompt.slice(0, 45)}...
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form & Attachments Tray */}
            <div className="p-3 sm:p-4 bg-[#070D09] border-t border-emerald-950/80 shrink-0">
              {/* Attachment Previews */}
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2.5 pb-2 border-b border-emerald-950">
                  {attachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800/50 text-xs text-emerald-200"
                    >
                      {att.type.startsWith('image/') ? (
                        att.base64 ? (
                          <img
                            src={att.base64}
                            alt={att.name}
                            className="w-6 h-6 rounded object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <ImageIcon size={14} />
                        )
                      ) : (
                        <FileText size={14} />
                      )}
                      <span className="truncate max-w-[140px] font-medium">{att.name}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(att.id)}
                        className="text-gray-400 hover:text-rose-400 cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Main Input Box */}
              <div className="relative bg-[#0C1710] border border-emerald-900/60 rounded-2xl focus-within:border-emerald-500/80 transition-all shadow-inner p-2">
                <textarea
                  ref={textareaRef}
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={`Ask ZYRO anything in the universe (${activeMode} mode)...`}
                  rows={1}
                  className="w-full bg-transparent px-2 py-1 text-xs sm:text-sm text-gray-100 placeholder-gray-500 focus:outline-none resize-none leading-relaxed"
                />

                {/* Bottom Actions Bar inside Box */}
                <div className="flex items-center justify-between pt-2 mt-1 border-t border-emerald-950/80">
                  <div className="flex items-center gap-1 text-gray-400">
                    {/* Attach File / Image / PDF */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-1.5 rounded-lg hover:text-emerald-400 hover:bg-emerald-950/60 transition-colors cursor-pointer"
                      title="Attach image, document, PDF, or code"
                    >
                      <Paperclip size={16} />
                    </button>

                    {/* Quick Image Modal */}
                    <button
                      type="button"
                      onClick={() => setIsImageModalOpen(true)}
                      className="p-1.5 rounded-lg hover:text-emerald-400 hover:bg-emerald-950/60 transition-colors cursor-pointer"
                      title="Generate an image"
                    >
                      <ImageIcon size={16} />
                    </button>

                    {/* Voice Dictation */}
                    <button
                      type="button"
                      onClick={toggleVoiceInput}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        isRecordingVoice
                          ? 'text-rose-400 bg-rose-950/50 animate-pulse'
                          : 'hover:text-emerald-400 hover:bg-emerald-950/60'
                      }`}
                      title={isRecordingVoice ? 'Stop recording' : 'Speak to ZYRO'}
                    >
                      {isRecordingVoice ? <MicOff size={16} /> : <Mic size={16} />}
                    </button>

                    {/* Mode Indicator tag */}
                    <span className="text-[10px] text-gray-500 font-mono ml-2 hidden sm:inline">
                      {activeMode.toUpperCase()} MODE
                    </span>
                  </div>

                  {/* Send Button */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSendMessage()}
                      disabled={isLoading || (!inputVal.trim() && attachments.length === 0)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.4)] transition-all"
                    >
                      <span>Send</span>
                      <Send size={13} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Sub-footer caption */}
              <div className="flex items-center justify-between text-[10px] text-gray-500 mt-2 px-1">
                <span>
                  ZYRO uses multimodal synthetic intelligence. Grounded with Google Search.
                </span>
                <span className="hidden sm:inline">Press Shift+Enter for new line</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Settings Modal */}
      <ZyroSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        preferences={preferences}
        onSavePreferences={(updated) => {
          setPreferences(updated);
          ZyroService.saveUserPreferences(updated);
        }}
        onClearAllConversations={handleClearAll}
      />

      {/* Multimodal Image Generator Modal */}
      <ZyroImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onInsertToChat={handleInsertGeneratedImage}
      />
    </div>
  );
};
export default AskZyroChatModal;
