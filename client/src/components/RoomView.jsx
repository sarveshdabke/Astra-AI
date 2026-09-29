import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  SendHorizonal, Bot, Users, Globe, Smartphone, Palette, Cloud,
  MessageSquare, Sparkles, ChevronDown, Hash, AlertCircle, Mic, MicOff, Volume2, VolumeX, Menu
} from 'lucide-react';
import RoomMessageBubble from './RoomMessageBubble';
import { useVoice } from '../hooks/useVoice';


export const getRoomIcon = (iconName, size = 18) => {
  switch (iconName) {
    case 'Globe': return <Globe size={size} />;
    case 'Smartphone': return <Smartphone size={size} />;
    case 'Bot': return <Bot size={size} />;
    case 'Palette': return <Palette size={size} />;
    case 'Cloud': return <Cloud size={size} />;
    default: return <MessageSquare size={size} />;
  }
};

const RoomView = ({
  room,
  messages,
  user,
  onlineCount,
  isAiTyping,
  onSendMessage,
  onOpenSidebar,
}) => {
  const [input, setInput] = useState('');
  const [askAiMode, setAskAiMode] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [currentSpeakingText, setCurrentSpeakingText] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  const handleTranscript = useCallback((transcript, isFinal) => {
    setInput((prev) => {
      const updated = transcript;
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
        inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 140) + 'px';
      }
      return updated;
    });
  }, []);

  const {
    isListening,
    isSpeaking,
    voiceSupported,
    autoSpeak,
    toggleListening,
    speak,
    stopSpeaking,
    toggleAutoSpeak,
  } = useVoice({ onTranscript: handleTranscript });

  const handleSpeakMessage = useCallback((text) => {
    if (isSpeaking && currentSpeakingText === text) {
      stopSpeaking();
      setCurrentSpeakingText(null);
    } else {
      setCurrentSpeakingText(text);
      speak(text);
    }
  }, [isSpeaking, currentSpeakingText, speak, stopSpeaking]);

  const prevMessagesLengthRef = useRef(messages.length);
  useEffect(() => {
    if (autoSpeak && messages.length > prevMessagesLengthRef.current) {
      const latestMsg = messages[messages.length - 1];
      if (latestMsg?.isAi && latestMsg.text) {
        setCurrentSpeakingText(latestMsg.text);
        speak(latestMsg.text);
      }
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages, autoSpeak, speak]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);

  const handleScroll = () => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBtn(distFromBottom > 150);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage({
      roomId: room.id,
      text: input.trim(),
      askAi: askAiMode,
    });
    setInput('');
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 140) + 'px';
  };

  const insertPrompt = (promptText) => {
    setInput(promptText);
    setAskAiMode(true);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full relative" style={{ background: 'var(--bg-primary)' }}>
      {/* Room Header */}
      <div
        className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-b flex-shrink-0 z-10 gap-2"
        style={{
          background: 'rgba(15, 15, 26, 0.85)',
          backdropFilter: 'blur(20px)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {onOpenSidebar && (
            <button
              onClick={onOpenSidebar}
              className="md:hidden p-1.5 sm:p-2 rounded-xl text-gray-400 hover:text-white flex-shrink-0"
              title="Open Navigation"
            >
              <Menu size={20} />
            </button>
          )}

          <div
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${room.color || '#7c3aed'}, #06b6d4)`,
            }}
          >
            {getRoomIcon(room.icon, 18)}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h2 className="font-bold text-sm sm:text-base text-white truncate flex items-center gap-1">
                <Hash size={14} className="text-gray-400 flex-shrink-0" />
                {room.name}
              </h2>
              <span
                className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold"
                style={{
                  background: `${room.color || '#7c3aed'}22`,
                  color: room.color || '#a78bfa',
                  border: `1px solid ${room.color || '#7c3aed'}44`,
                }}
              >
                {room.category}
              </span>
            </div>
            <p className="text-xs text-gray-400 truncate max-w-lg mt-0.5">
              {room.description}
            </p>
          </div>
        </div>

        {/* Live Presence Badge + Voice Mute Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={toggleAutoSpeak}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              autoSpeak
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
            }`}
            title={autoSpeak ? 'Auto Voice: ON (AI speaks responses)' : 'Auto Voice: OFF'}
          >
            {autoSpeak ? <Volume2 size={13} className="text-purple-400" /> : <VolumeX size={13} />}
            <span className="hidden sm:inline">{autoSpeak ? 'Voice ON' : 'Voice OFF'}</span>
          </button>

          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34d399',
            }}
            title="Connected users in this room"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">{onlineCount} Online</span>
            <Users size={14} className="sm:hidden" />
          </div>
        </div>
      </div>

      {/* Messages Feed */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2 relative"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-xl"
              style={{
                background: `linear-gradient(135deg, ${room.color || '#7c3aed'}, #06b6d4)`,
              }}
            >
              {getRoomIcon(room.icon, 30)}
            </div>
            <h3 className="text-xl font-bold text-white mb-1">
              Welcome to #{room.name}!
            </h3>
            <p className="text-sm text-gray-400 max-w-md mb-6">
              This is the official public channel for {room.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-xl w-full">
              <button
                onClick={() => insertPrompt(`@ai what are the top best practices for ${room.name}?`)}
                className="p-3.5 rounded-xl text-left bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
                  <Sparkles size={14} /> Ask AI
                </div>
                <p className="text-xs text-gray-300">
                  "What are the top best practices for {room.name}?"
                </p>
              </button>

              <button
                onClick={() => insertPrompt(`@ai explain common beginner mistakes in ${room.name} and how to avoid them`)}
                className="p-3.5 rounded-xl text-left bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 mb-1">
                  <Sparkles size={14} /> Ask AI
                </div>
                <p className="text-xs text-gray-300">
                  "Common beginner mistakes in {room.name}"
                </p>
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-2">
            {messages.map((msg, idx) => (
              <RoomMessageBubble
                key={msg._id || idx}
                message={msg}
                currentUserId={user?._id}
                onSpeak={handleSpeakMessage}
                isSpeakingMessage={isSpeaking && currentSpeakingText === msg.text}
              />
            ))}

            {isAiTyping && (
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-purple-950/20 border border-purple-500/20 animate-pulse">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
                  style={{ background: 'var(--gradient-brand)' }}
                >
                  <Bot size={16} />
                </div>
                <span className="text-xs text-purple-300 font-medium flex items-center gap-1.5">
                  Astra AI is formulating a response for this channel...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Scroll to Bottom Button */}
      {showScrollBtn && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-24 right-8 w-10 h-10 rounded-full bg-slate-900 border border-white/20 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-20"
          title="Scroll to latest message"
        >
          <ChevronDown size={18} />
        </button>
      )}

      {/* Room Input Bar */}
      <div className="px-2 sm:px-4 md:px-6 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          {/* Ask AI Toggle Pill Bar */}
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAskAiMode(!askAiMode)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
                  askAiMode
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white/5 hover:bg-white/10 text-gray-400 border border-white/10'
                }`}
              >
                <Bot size={13} />
                {askAiMode ? '🤖 AI Mention Active' : 'Mention @ai'}
              </button>
              <span className="text-[11px] text-gray-500 hidden sm:inline">
                (Type <code className="text-purple-400">@ai</code> to get an instant AI answer for everyone)
              </span>
            </div>

            {/* Listening indicator */}
            {isListening && (
              <div className="flex items-center gap-2 text-xs text-red-400 font-medium animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Listening... Speak now
              </div>
            )}
          </div>

          {/* Input Box */}
          <div
            className={`rounded-2xl p-2.5 sm:p-3 flex items-end gap-2 sm:gap-3 transition-all duration-300 ${
              askAiMode
                ? 'border-purple-500/50 shadow-lg shadow-purple-500/10'
                : 'border-white/10 shadow-md'
            }`}
            style={{
              background: 'var(--bg-elevated)',
              borderWidth: '1px',
              borderStyle: 'solid',
            }}
          >
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={
                isListening
                  ? 'Listening to your voice...'
                  : `Message #${room.name}... (Enter to send, Shift+Enter for newline)`
              }
              style={{
                flex: 1,
                background: 'transparent',
                color: 'var(--text-primary)',
                outline: 'none',
                resize: 'none',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '14px',
                lineHeight: '1.6',
                padding: '4px 8px',
                maxHeight: '140px',
                overflowY: 'auto',
              }}
            />

            {/* Mic Button */}
            {voiceSupported && (
              <button
                type="button"
                onClick={toggleListening}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                  isListening
                    ? 'mic-recording'
                    : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10'
                }`}
                title={isListening ? 'Click to stop listening' : 'Talk with Voice'}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            )}

            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 flex-shrink-0"
              style={{
                background: askAiMode
                  ? 'var(--gradient-brand)'
                  : `linear-gradient(135deg, ${room.color || '#7c3aed'}, #06b6d4)`,
              }}
            >
              <SendHorizonal size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomView;
