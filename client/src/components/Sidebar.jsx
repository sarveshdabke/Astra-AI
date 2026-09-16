import React, { useState, useRef, useEffect } from 'react';
import {
  Plus, Search, Trash2, X, MessageSquare,
  LogOut, Edit2, Check, Bot, Globe, Smartphone, Palette, Cloud, Hash, Users, Sparkles,
  BookOpen, Brain, Code, Compass, Trophy
} from 'lucide-react';
import { getRoomIcon } from './RoomView';



/* ─── Group chats by date ────────────────────────────────── */
const groupChatsByDate = (chats) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const groups = { Today: [], Yesterday: [], 'Last 7 Days': [], Older: [] };
  chats.forEach((chat) => {
    const d = new Date(chat.updatedAt);
    d.setHours(0, 0, 0, 0);
    if (d >= today) groups['Today'].push(chat);
    else if (d >= yesterday) groups['Yesterday'].push(chat);
    else if (d >= weekAgo) groups['Last 7 Days'].push(chat);
    else groups['Older'].push(chat);
  });
  return groups;
};

const Sidebar = ({
  user,
  mode,
  onSelectMode,
  chatHistory,
  currentChatId,
  onNewChat,
  onLoadConversation,
  onDeleteChat,
  onRenameChat,
  rooms = [],
  currentRoomId,
  onSelectRoom,
  onLogout,
  isOpen,
  onClose,
}) => {
  const [search, setSearch] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const renameInputRef = useRef(null);

  useEffect(() => {
    if (renamingId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingId]);

  const filteredChats = chatHistory.filter((c) =>
    c.title?.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = groupChatsByDate(filteredChats);

  const startRename = (chat, e) => {
    e.stopPropagation();
    setRenamingId(chat._id);
    setRenameValue(chat.title || 'New Chat');
  };

  const submitRename = async (chatId) => {
    if (!renameValue.trim()) return;
    await onRenameChat(chatId, renameValue.trim());
    setRenamingId(null);
    setRenameValue('');
  };

  const handleDeleteClick = (chatId, e) => {
    e.stopPropagation();
    setDeleteConfirmId(chatId);
  };

  const confirmDelete = async (chatId, e) => {
    e.stopPropagation();
    await onDeleteChat(chatId);
    setDeleteConfirmId(null);
  };

  /* ─ Chat item for 1-on-1 AI ─ */
  const ChatItem = ({ chat }) => {
    const isActive = mode === 'direct' && currentChatId === chat._id;
    const isDeleting = deleteConfirmId === chat._id;
    const isRenaming = renamingId === chat._id;

    return (
      <div
        onClick={() => {
          if (!isRenaming) {
            onSelectMode('direct');
            onLoadConversation(chat._id);
            onClose();
          }
        }}
        className="group relative flex items-center gap-2 p-2.5 rounded-xl cursor-pointer transition-all duration-200"
        style={{
          background: isActive ? 'var(--accent-purple-dim)' : 'transparent',
          border: `1px solid ${isActive ? 'rgba(124,58,237,0.3)' : 'transparent'}`,
        }}
        onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'var(--bg-card)'; }}
        onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
      >
        <MessageSquare size={14} style={{ color: isActive ? '#a78bfa' : 'var(--text-muted)', flexShrink: 0 }} />

        {isRenaming ? (
          <input
            ref={renameInputRef}
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submitRename(chat._id);
              if (e.key === 'Escape') setRenamingId(null);
            }}
            onBlur={() => submitRename(chat._id)}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: 'var(--text-primary)', caretColor: 'var(--accent-cyan)' }}
          />
        ) : (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: isActive ? '#e2d9f3' : 'var(--text-primary)' }}>
              {chat.title || 'New Chat'}
            </p>
          </div>
        )}

        {/* Action buttons */}
        {!isRenaming && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            {isDeleting ? (
              <>
                <button
                  onClick={(e) => confirmDelete(chat._id, e)}
                  className="p-1 rounded text-red-400 hover:text-red-300 transition-colors"
                  title="Confirm delete"
                >
                  <Check size={13} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(null); }}
                  className="p-1 rounded transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                  title="Cancel"
                >
                  <X size={13} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={(e) => startRename(chat, e)}
                  className="p-1 rounded text-gray-400 hover:text-white transition-colors"
                  title="Rename"
                >
                  <Edit2 size={12} />
                </button>
                <button
                  onClick={(e) => handleDeleteClick(chat._id, e)}
                  className="p-1 rounded text-gray-400 hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={12} />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  /* ─ Topic Room Channel Item ─ */
  const RoomItem = ({ room }) => {
    const isActive = mode === 'room' && currentRoomId === room.id;

    return (
      <div
        onClick={() => {
          onSelectMode('room');
          onSelectRoom(room.id);
          onClose();
        }}
        className="group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200"
        style={{
          background: isActive
            ? `linear-gradient(90deg, ${room.color || '#7c3aed'}22, transparent)`
            : 'transparent',
          borderLeft: isActive ? `3px solid ${room.color || '#7c3aed'}` : '3px solid transparent',
        }}
        onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'var(--bg-card)'; }}
        onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
          style={{
            background: isActive
              ? `linear-gradient(135deg, ${room.color || '#7c3aed'}, #06b6d4)`
              : 'rgba(255,255,255,0.06)',
            color: isActive ? '#fff' : (room.color || '#a78bfa'),
          }}
        >
          {getRoomIcon(room.icon, 16)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold truncate text-white">
              #{room.name}
            </p>
          </div>
          <p className="text-[11px] text-gray-400 truncate mt-0.5">
            {room.category}
          </p>
        </div>
      </div>
    );
  };

  /* ─ Sidebar body ─ */
  const SidebarContent = () => (
    <div
      className="flex flex-col h-full select-none"
      style={{ background: 'var(--bg-secondary)', width: '290px' }}
    >
      {/* App Branding */}
      <div className="p-4 pb-3 border-b border-white/5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl p-0.5 flex items-center justify-center border border-white/10 shadow-lg relative overflow-hidden flex-shrink-0"
              style={{ background: 'rgba(15, 15, 26, 0.9)' }}
            >
              <img
                src="/favicon.png"
                alt="Astra"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div>
              <span className="font-extrabold text-base gradient-text tracking-tight">
                Astra AI
              </span>
              <span className="block text-[10px] text-gray-500 font-medium -mt-1">
                Developer AI & Workspace
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-black/40 border border-white/10 mb-2">
          <button
            onClick={() => onSelectMode('direct')}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
              mode === 'direct'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Bot size={13} />
            AI Chat
          </button>

          <button
            onClick={() => onSelectMode('room')}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
              mode === 'room'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Globe size={13} />
            Rooms
          </button>
        </div>

        {/* Developer Tooling / USP Modes */}
        <div className="space-y-1 pt-1 border-t border-white/5">
          <button
            onClick={() => onSelectMode('prompts')}
            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'prompts'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen size={13} className={mode === 'prompts' ? 'text-purple-400' : 'text-gray-500'} />
            <span>Prompt Marketplace</span>
          </button>

          <button
            onClick={() => onSelectMode('memory')}
            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'memory'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Brain size={13} className={mode === 'memory' ? 'text-cyan-400' : 'text-gray-500'} />
            <span>Memory Cards</span>
          </button>

          <button
            onClick={() => onSelectMode('playground')}
            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'playground'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Code size={13} className={mode === 'playground' ? 'text-emerald-400' : 'text-gray-500'} />
            <span>Code Playground</span>
          </button>

          <button
            onClick={() => onSelectMode('roadmaps')}
            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'roadmaps'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass size={13} className={mode === 'roadmaps' ? 'text-blue-400' : 'text-gray-500'} />
            <span>AI Roadmaps</span>
          </button>

          <button
            onClick={() => onSelectMode('challenges')}
            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'challenges'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Trophy size={13} className={mode === 'challenges' ? 'text-amber-400' : 'text-gray-500'} />
            <span>Room Challenges</span>
          </button>
        </div>
      </div>

      {/* Mode Content: Direct AI vs Topic Rooms */}
      {mode === 'direct' ? (
        <div className="flex-1 flex flex-col min-h-0">
          {/* New Chat Button */}
          <div className="p-3 pb-1">
            <button
              onClick={() => { onNewChat(); onClose(); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/20 text-white"
              style={{ background: 'var(--gradient-brand)' }}
            >
              <Plus size={15} />
              New Conversation
            </button>
          </div>

          {/* Search */}
          <div className="px-3 py-2">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10"
            >
              <Search size={13} className="text-gray-500 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-xs text-white outline-none"
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-gray-500 hover:text-white">
                  <X size={11} />
                </button>
              )}
            </div>
          </div>

          {/* Chat History List */}
          <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-4">
            {Object.entries(grouped).map(([label, chats]) =>
              chats.length > 0 ? (
                <div key={label}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 px-2 mb-1">
                    {label}
                  </p>
                  <div className="space-y-0.5">
                    {chats.map((chat) => (
                      <ChatItem key={chat._id} chat={chat} />
                    ))}
                  </div>
                </div>
              ) : null
            )}
            {filteredChats.length === 0 && (
              <p className="text-center text-xs py-8 text-gray-500">
                {search ? 'No chats found' : 'No conversations yet'}
              </p>
            )}
          </div>
        </div>
      ) : (
        /* Topic Rooms Channel List */
        <div className="flex-1 flex flex-col min-h-0">
          <div className="p-3 pb-1">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                <Hash size={12} /> Community Channels
              </span>
              <span className="text-[10px] font-semibold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-500/20">
                Live Chat + @ai
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 space-y-1">
            {rooms.map((r) => (
              <RoomItem key={r.id} room={r} />
            ))}
          </div>

          <div className="p-3 mx-3 mb-2 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-purple-300 flex items-center gap-2">
            <Sparkles size={16} className="text-cyan-400 flex-shrink-0" />
            <p className="text-[11px] leading-tight">
              Type <strong>@ai</strong> in any room to summon Astra AI for everyone!
            </p>
          </div>
        </div>
      )}

      {/* User Profile Footer */}
      <div className="p-3 border-t border-white/5 bg-black/20">
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.03] border border-white/10 mb-2">
          <img
            src={user.picture}
            alt="profile"
            className="w-8 h-8 rounded-full border border-white/20"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold truncate text-white">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-[10px] text-gray-500 truncate">
              {user.email}
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all"
        >
          <LogOut size={13} />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex h-full border-r border-white/5">
        <SidebarContent />
      </div>

      {/* Mobile drawer */}
      {isOpen && (
        <>
          <div className="sidebar-overlay md:hidden" onClick={onClose} />
          <div
            className="fixed left-0 top-0 h-full z-50 md:hidden"
            style={{ animation: 'slide-in-left 0.25s ease forwards' }}
          >
            <SidebarContent />
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;
