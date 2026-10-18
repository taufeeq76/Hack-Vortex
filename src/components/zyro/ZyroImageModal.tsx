import React, { useState } from 'react';
import { X, Image as ImageIcon, Sparkles, Download, ArrowRight, Loader2 } from 'lucide-react';
import { ZyroService } from '../../services/zyroService';

interface ZyroImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertToChat: (imageUrl: string, prompt: string) => void;
}

const INSPIRATION_PROMPTS = [
  'Futuristic biomechanical hologram of human muscle fibers firing during a maximal squat, cybernetic obsidian emerald aesthetic',
  'Scientific 3D cross-section diagram of cellular mitochondria synthesizing ATP, ultra-detailed bioluminescent rendering',
  'Epic cinematic athlete ascending an ancient emerald mountain summit at dawn, volumetric mist and dramatic lighting',
  'Minimalist modern isometric workspace with data analytics dashboards and neural network visualizations',
];

export const ZyroImageModal: React.FC<ZyroImageModalProps> = ({
  isOpen,
  onClose,
  onInsertToChat,
}) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3'>('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{ imageUrl: string; caption: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setError(null);

    try {
      const result = await ZyroService.generateImage(prompt.trim(), aspectRatio);
      setGeneratedResult(result);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate image with Gemini model.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedResult?.imageUrl) return;
    const a = document.createElement('a');
    a.href = generatedResult.imageUrl;
    a.download = `zyro_ai_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSendToChat = () => {
    if (!generatedResult?.imageUrl) return;
    onInsertToChat(generatedResult.imageUrl, prompt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-[#0C1510] border border-emerald-900/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-emerald-950/60 bg-[#080E0A]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ImageIcon size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Multimodal Image Generator</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-1.5 py-0.2 rounded border border-emerald-500/30">
                  AI
                </span>
              </h2>
              <p className="text-[11px] text-gray-400">Synthesize visual concepts with Gemini</p>
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          <form onSubmit={handleGenerate} className="space-y-3">
            <div>
              <label className="block font-bold text-gray-200 mb-1">Visual Prompt</label>
              <textarea
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the scene, scientific diagram, technical concept, or character in rich detail..."
                className="w-full px-3 py-2 rounded-xl bg-[#070D09] border border-emerald-950 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-emerald-500/60 leading-relaxed text-xs"
              />
            </div>

            {/* Aspect Ratio */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-400">Aspect Ratio:</span>
              {(['1:1', '16:9', '9:16', '4:3'] as const).map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => setAspectRatio(ratio)}
                  className={`px-2.5 py-1 rounded-lg border text-xs cursor-pointer ${
                    aspectRatio === ratio
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-[#070D09] border-emerald-950 text-gray-400 hover:text-white'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>

            {/* Inspiration Chips */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-gray-400">Suggestions:</span>
              <div className="flex flex-wrap gap-1.5">
                {INSPIRATION_PROMPTS.map((insp, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPrompt(insp)}
                    className="text-[10px] px-2 py-1 rounded-lg bg-[#070D09] hover:bg-emerald-950/50 border border-emerald-950 hover:border-emerald-800 text-gray-400 hover:text-emerald-300 text-left transition-colors cursor-pointer"
                  >
                    {insp.slice(0, 50)}...
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Synthesizing Image with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  <span>Generate Concept Art / Diagram</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Generated Result */}
          {generatedResult && (
            <div className="space-y-3 pt-2 border-t border-emerald-950/60">
              <div className="rounded-xl overflow-hidden border border-emerald-900/60 bg-[#070D09] flex justify-center">
                <img
                  src={generatedResult.imageUrl}
                  alt={generatedResult.caption}
                  className="max-h-80 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <p className="text-[11px] text-gray-400 italic text-center">
                "{generatedResult.caption}"
              </p>

              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex-1 py-2 rounded-xl bg-[#070D09] hover:bg-emerald-950/60 border border-emerald-950 text-gray-300 hover:text-white font-medium flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download size={13} />
                  <span>Download Image</span>
                </button>
                <button
                  type="button"
                  onClick={handleSendToChat}
                  className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.25)]"
                >
                  <span>Insert to Chat</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
