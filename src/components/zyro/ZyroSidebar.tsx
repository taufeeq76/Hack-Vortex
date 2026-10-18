import React, { useState } from 'react';
import {
  Plus,
  MessageSquare,
  Trash2,
  Edit2,
  Check,
  X,
  Search,
  Settings,
  Sparkles,
  BookOpen,
  Code,
  Calculator,
  Compass,
  FileText
} from 'lucide-react';
import { ZyroConversation, ZyroAiMode } from '../../types';

interface ZyroSidebarProps {
  conversations: ZyroConversation[];
  activeId: string;
  onSelectConversation: (id: string) => void;
  onNewConversation: (mode?: ZyroAiMode) => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onOpenSettings: () => void;
  onCloseMobile?: () => void;
}

const MODE_ICONS: Record<ZyroAiMode, React.FC<{ size?: number; className?: string }>> = {
  general: Compass,
  research: Sparkles,
  study: BookOpen,
  coding: Code,
  math: Calculator,
  creative: FileText,
};

export const ZyroSidebar: React.FC<ZyroSidebarProps> = ({
  conversations,
  activeId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onRenameConversation,
  onOpenSettings,
  onCloseMobile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startRename = (c: ZyroConversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(c.id);
    setEditingTitle(c.title);
  };

  const saveRename = (id: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (editingTitle.trim()) {
      onRenameConversation(id, editingTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="w-full sm:w-72 h-full flex flex-col bg-[#080E0A] border-r border-emerald-950/60 text-gray-200">
      {/* Sidebar Header & New Chat */}
      <div className="p-3.5 border-b border-emerald-950/60 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-xs">
              ⚡
            </div>
            <span className="font-bold text-sm tracking-tight text-white">Conversations</span>
          </div>
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="sm:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-emerald-950/50 cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => onNewConversation('general')}
          className="w-full py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-all cursor-pointer"
        >
          <Plus size={15} />
          <span>New Chat</span>
        </button>

        {/* Search Chats */}
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#0C1510] border border-emerald-950 text-xs text-gray-300 placeholder-gray-500 focus:outline-none focus:border-emerald-500/60 transition-colors"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-8 text-xs text-gray-500 px-4">
            No chats match your search.
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const isActive = conv.id === activeId;
            const Icon = MODE_ICONS[conv.mode] || MessageSquare;

            if (editingId === conv.id) {
              return (
                <form
                  key={conv.id}
                  onSubmit={(e) => saveRename(conv.id, e)}
                  className="p-1.5 rounded-lg bg-emerald-950/40 border border-emerald-600/50 flex items-center gap-1"
                >
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    autoFocus
                    className="flex-1 bg-transparent text-xs text-white px-1.5 py-0.5 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="p-1 text-emerald-400 hover:text-emerald-300 cursor-pointer"
                  >
                    <Check size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="p-1 text-gray-400 hover:text-white cursor-pointer"
                  >
                    <X size={13} />
                  </button>
                </form>
              );
            }

            return (
              <div
                key={conv.id}
                onClick={() => {
                  onSelectConversation(conv.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`group relative flex items-center justify-between px-2.5 py-2 rounded-xl text-xs cursor-pointer transition-all ${
                  isActive
                    ? 'bg-emerald-950/60 text-emerald-200 border border-emerald-800/40 font-medium'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-[#0E1B13]'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
                  <Icon
                    size={14}
                    className={`shrink-0 ${isActive ? 'text-emerald-400' : 'text-gray-500'}`}
                  />
                  <span className="truncate">{conv.title}</span>
                </div>

                {/* Actions: Rename & Delete */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={(e) => startRename(conv, e)}
                    className="p-1 text-gray-400 hover:text-emerald-300 rounded hover:bg-emerald-950/50 cursor-pointer"
                    title="Rename"
                  >
                    <Edit2 size={11} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conv.id);
                    }}
                    className="p-1 text-gray-400 hover:text-rose-400 rounded hover:bg-rose-950/50 cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Sidebar Footer: Settings & Memory */}
      <div className="p-3 border-t border-emerald-950/60 bg-[#060B08]">
        <button
          type="button"
          onClick={onOpenSettings}
          className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-emerald-950/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Settings size={14} className="text-emerald-400" />
            <span>AI Settings & Tone</span>
          </div>
          <span className="text-[10px] text-emerald-500 font-mono bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-900/40">
            PRO
          </span>
        </button>
      </div>
    </div>
  );
};
