import React, { useState } from 'react';
import {
  Copy,
  Check,
  Volume2,
  VolumeX,
  RotateCw,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  Search,
  FileText,
  FileCode,
  Image as ImageIcon,
  Sparkles,
  Bot,
  User,
  Calculator
} from 'lucide-react';
import Markdown from 'react-markdown';
import { ChatMessage, ZyroAiMode } from '../../types';
import { CodeBlock } from './CodeBlock';

interface ZyroMessageItemProps {
  message: ChatMessage;
  isLatest: boolean;
  onRegenerate?: () => void;
}

export const ZyroMessageItem: React.FC<ZyroMessageItemProps> = ({
  message,
  isLatest,
  onRegenerate,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const isAi = message.sender === 'zyro_ai' || message.sender === 'vylo_ai';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy text', e);
    }
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any pending speech
    // Clean markdown symbols for cleaner speech
    const cleanSpeech = message.text
      .replace(/[#*`_~\[\]]/g, '')
      .replace(/https?:\/\/\S+/g, 'link');

    const utterance = new SpeechSynthesisUtterance(cleanSpeech.slice(0, 1500));
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={`flex flex-col gap-2 my-4 ${isAi ? 'items-start' : 'items-end'}`}>
      {/* Sender Header Pill */}
      <div className="flex items-center gap-2 px-1 text-[11px] text-gray-400">
        {isAi ? (
          <div className="flex items-center gap-1.5 font-bold text-emerald-400">
            <div className="w-5 h-5 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[10px]">
              ⚡
            </div>
            <span>ZYRO AI</span>
            {message.mode && (
              <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-emerald-950/60 border border-emerald-900/40 text-emerald-300 font-mono">
                {message.mode}
              </span>
            )}
            {message.usedWebSearch && (
              <span className="flex items-center gap-1 text-[9px] px-1.5 py-0.2 rounded bg-sky-950/60 border border-sky-900/40 text-sky-300 font-mono">
                <Search size={9} />
                <span>Web Grounded</span>
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 font-bold text-gray-300">
            <span>You</span>
            <div className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center text-[10px]">
              <User size={11} />
            </div>
          </div>
        )}
        <span className="text-[10px] text-gray-500">{message.timestamp}</span>
      </div>

      {/* Main Message Card */}
      <div
        className={`max-w-[92%] sm:max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed transition-all shadow-md ${
          isAi
            ? 'bg-[#0E1812] border border-emerald-950/80 text-gray-200'
            : 'bg-gradient-to-br from-emerald-600 to-emerald-700 text-black font-medium selection:bg-black selection:text-white'
        }`}
      >
        {/* User Attachments Preview */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3 pb-2 border-b border-black/10">
            {message.attachments.map((att) => {
              const isImg = att.type.startsWith('image/') || Boolean(att.base64?.includes('image'));
              return (
                <div
                  key={att.id}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs ${
                    isAi
                      ? 'bg-[#070D09] border border-emerald-900/50 text-gray-300'
                      : 'bg-black/20 text-black border border-black/20'
                  }`}
                >
                  {isImg ? (
                    <>
                      {att.base64 && (
                        <img
                          src={att.base64}
                          alt={att.name}
                          className="w-7 h-7 rounded object-cover border border-white/20"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <ImageIcon size={14} />
                    </>
                  ) : att.type.includes('pdf') ? (
                    <FileText size={14} />
                  ) : (
                    <FileCode size={14} />
                  )}
                  <span className="font-bold truncate max-w-[140px]">{att.name}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* AI Generated Image (if any) */}
        {message.generatedImageUrl && (
          <div className="mb-3 rounded-xl overflow-hidden border border-emerald-900/50 bg-black/40">
            <img
              src={message.generatedImageUrl}
              alt="Generated visual"
              className="w-full max-h-96 object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {/* Markdown Text Body */}
        {isAi ? (
          <div className="markdown-body overflow-x-auto space-y-2">
            <Markdown
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeString = String(children).replace(/\n$/, '');
                  if (!inline && (match || codeString.includes('\n'))) {
                    return (
                      <CodeBlock
                        language={match ? match[1] : 'code'}
                        value={codeString}
                      />
                    );
                  }
                  return (
                    <code
                      className="bg-emerald-950/70 text-emerald-300 px-1.5 py-0.5 rounded text-[12px] font-mono border border-emerald-900/40"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                table: ({ children }) => (
                  <div className="overflow-x-auto my-3 rounded-xl border border-emerald-900/40">
                    <table className="min-w-full divide-y divide-emerald-900/30 text-xs">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="bg-emerald-950/80 px-3 py-2 text-left font-bold text-emerald-300 border-b border-emerald-900/40">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-3 py-2 border-b border-emerald-950/60 text-gray-200">
                    {children}
                  </td>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 underline font-medium inline-flex items-center gap-0.5"
                  >
                    <span>{children}</span>
                    <ExternalLink size={10} />
                  </a>
                ),
                p: ({ children }) => <p className="mb-2 leading-relaxed text-gray-200">{children}</p>,
                h1: ({ children }) => (
                  <h1 className="text-base sm:text-lg font-black text-white mt-3 mb-1.5 tracking-tight flex items-center gap-1.5">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-sm sm:text-base font-bold text-emerald-400 mt-3 mb-1">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xs sm:text-sm font-bold text-emerald-300 mt-2 mb-1">
                    {children}
                  </h3>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-1 mb-2 text-gray-200 pl-1">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside space-y-1 mb-2 text-gray-200 pl-1">
                    {children}
                  </ol>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-emerald-500 pl-3 italic text-gray-400 my-2 bg-emerald-950/20 py-1 rounded-r-lg">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {message.text}
            </Markdown>
          </div>
        ) : (
          <div className="whitespace-pre-wrap font-medium">{message.text}</div>
        )}

        {/* Web Search Sources / Grounding Citations */}
        {message.searchSources && message.searchSources.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-emerald-950/60 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
              <Search size={12} />
              <span>Verified Search Citations & Sources</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {message.searchSources.map((src, i) => (
                <a
                  key={i}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-[#070D09] hover:bg-emerald-950/80 border border-emerald-900/50 text-gray-300 hover:text-emerald-300 transition-colors"
                >
                  <span className="truncate max-w-[180px]">{src.title}</span>
                  <ExternalLink size={10} className="shrink-0 text-emerald-500" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Calculation Result Pill */}
        {message.calculationResult && (
          <div className="mt-2.5 p-2 rounded-xl bg-emerald-950/50 border border-emerald-800/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Calculator size={14} className="text-emerald-400" />
              <span className="font-mono text-gray-300">{message.calculationResult.expression}</span>
            </div>
            <span className="font-bold text-emerald-400 font-mono text-sm">
              = {message.calculationResult.result}
            </span>
          </div>
        )}
      </div>

      {/* AI Message Action Bar */}
      {isAi && (
        <div className="flex items-center gap-1 px-1 text-gray-500 text-xs">
          {/* Copy */}
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-lg hover:text-white hover:bg-emerald-950/40 transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
            title="Copy response"
          >
            {copied ? (
              <>
                <Check size={13} className="text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Text to Speech */}
          <button
            type="button"
            onClick={handleSpeak}
            className={`p-1.5 rounded-lg hover:text-white hover:bg-emerald-950/40 transition-colors cursor-pointer flex items-center gap-1 text-[11px] ${
              isSpeaking ? 'text-emerald-400 font-bold' : ''
            }`}
            title={isSpeaking ? 'Stop speech' : 'Read aloud'}
          >
            {isSpeaking ? (
              <>
                <VolumeX size={13} className="text-emerald-400 animate-pulse" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Volume2 size={13} />
                <span>Listen</span>
              </>
            )}
          </button>

          {/* Regenerate (if latest AI message) */}
          {isLatest && onRegenerate && (
            <button
              type="button"
              onClick={onRegenerate}
              className="p-1.5 rounded-lg hover:text-white hover:bg-emerald-950/40 transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
              title="Regenerate answer"
            >
              <RotateCw size={13} />
              <span>Retry</span>
            </button>
          )}

          {/* Thumbs Up / Down */}
          <div className="flex items-center gap-0.5 ml-1 border-l border-emerald-950 pl-1.5">
            <button
              type="button"
              onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
              className={`p-1 rounded hover:text-emerald-400 transition-colors cursor-pointer ${
                feedback === 'up' ? 'text-emerald-400' : ''
              }`}
              title="Helpful"
            >
              <ThumbsUp size={12} />
            </button>
            <button
              type="button"
              onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
              className={`p-1 rounded hover:text-rose-400 transition-colors cursor-pointer ${
                feedback === 'down' ? 'text-rose-400' : ''
              }`}
              title="Not helpful"
            >
              <ThumbsDown size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
