import React, { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';

interface CodeBlockProps {
  language?: string;
  value: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language = 'text', value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy code', e);
    }
  };

  return (
    <div className="relative my-3 rounded-xl overflow-hidden border border-emerald-900/50 bg-[#070D09] shadow-lg">
      {/* Header bar with language tag and copy button */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#0C1710] border-b border-emerald-900/40 text-xs text-gray-400">
        <div className="flex items-center gap-2 font-mono text-emerald-400 font-bold uppercase tracking-wider">
          <Terminal size={14} className="text-emerald-500" />
          <span>{language || 'code'}</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/50 border border-emerald-800/40 text-gray-300 hover:text-white transition-all cursor-pointer text-[11px]"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check size={12} className="text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code contents */}
      <div className="p-3.5 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-emerald-100/90 selection:bg-emerald-500 selection:text-black">
        <pre className="m-0">
          <code>{value}</code>
        </pre>
      </div>
    </div>
  );
};
