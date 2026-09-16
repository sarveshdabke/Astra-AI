import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import toast, { Toaster } from 'react-hot-toast';
import {
  SendHorizonal, Square, ChevronDown, RotateCcw,
  Sparkles, Menu, Globe, Volume2, VolumeX, Mic, MicOff
} from 'lucide-react';
import ChatMessage from './components/ChatMessage';
import EmptyState from './components/EmptyState';
import TypingIndicator from './components/TypingIndicator';
import Sidebar from './components/Sidebar';
import RoomView from './components/RoomView';
import PromptMarketplace from './components/PromptMarketplace';
import MemoryCards from './components/MemoryCards';
import LearningRoadmaps from './components/LearningRoadmaps';
import RoomChallenges from './components/RoomChallenges';
import CodePlayground from './components/CodePlayground';
import Login from './Login';
import { useVoice } from './hooks/useVoice';
import { API_URL } from './config';

const API = API_URL;

const INITIAL_ROOMS = [
  {
    id: "web-dev",
    name: "Web Development",
    icon: "Globe",
    category: "Development",
    description: "Frontend, Backend, APIs, React, Next.js, Node.js & CSS frameworks.",
    color: "#06b6d4",
  },
  {
    id: "app-dev",
    name: "App Development",
    icon: "Smartphone",
    category: "Mobile",
    description: "React Native, Flutter, iOS, Android, Swift & Kotlin discussions.",
    color: "#8b5cf6",
  },
  {
    id: "ai-tech",
    name: "AI & Emerging Tech",
    icon: "Bot",
    category: "Artificial Intelligence",
    description: "LLMs, Groq, Agents, Prompt Engineering & Neural Networks.",
    color: "#7c3aed",
  },
  {
    id: "ui-ux",
    name: "UI/UX & Design Systems",
    icon: "Palette",
    category: "Design",
    description: "Tailwind, Framer Motion, Figma, modern animations & user experience.",
    color: "#ec4899",
  },
  {
    id: "cloud-devops",
    name: "Cloud & DevOps",
    icon: "Cloud",
    category: "Infrastructure",
    description: "Docker, Kubernetes, AWS, MongoDB Atlas, CI/CD & deployment pipelines.",
    color: "#3b82f6",
  },
  {
    id: "general",
    name: "General Lounge",
    icon: "MessageSquare",
    category: "Community",
    description: "Open community chat, tech news, banter, questions & networking.",
    color: "#10b981",
  },
];

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [mode, setMode] = useState('direct');

  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [currentChatTitle, setCurrentChatTitle] = useState('');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [currentSpeakingText, setCurrentSpeakingText] = useState(null);

  const [rooms, setRooms] = useState(INITIAL_ROOMS);
  const [currentRoomId, setCurrentRoomId] = useState('web-dev');
  const [roomMessages, setRoomMessages] = useState([]);
  const [roomOnlineCount, setRoomOnlineCount] = useState(1);
  const [isRoomAiTyping, setIsRoomAiTyping] = useState(false);

  const socketRef = useRef(null);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const messagesAreaRef = useRef(null);

  const handleTranscript = (transcript, isFinal) => {
    setInput(transcript);
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 160) + 'px';
    }
  };

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

  const handleSpeakMessage = (text) => {
    if (isSpeaking && currentSpeakingText === text) {
      stopSpeaking();
      setCurrentSpeakingText(null);
    } else {
      setCurrentSpeakingText(text);
      speak(text);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        if (user && mode === 'direct') createNewChat();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [user, mode]);

  useEffect(() => {
    if (user?._id) {
      const init = async () => {
        try {
          const res = await axios.get(`${API}/api/chat/history/${user._id}`);
          setChatHistory(res.data);
          if (res.data.length > 0) {
            await loadConversation(res.data[0]._id);
          } else {
            await createNewChat();
          }
        } catch (error) {
          console.error('Error fetching chat history on login:', error);
          await createNewChat();
        }
      };
      init();
    }
  }, [user]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get(`${API}/api/rooms`);
        if (res.data.success && res.data.rooms) {
          setRooms(res.data.rooms);
        }
      } catch (err) {
        console.warn('Could not fetch dynamic rooms, using defaults');
      }
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    if (!user) return;

    const socket = io(API, {
      transports: ['websocket', 'polling'],
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      if (mode === 'room' && currentRoomId) {
        socket.emit('join_room', { roomId: currentRoomId, user });
      }
    });

    socket.on('new_room_message', (message) => {
      setRoomMessages((prev) => [...prev, message]);
    });

    socket.on('room_presence', ({ onlineCount }) => {
      setRoomOnlineCount(onlineCount);
    });

    socket.on('ai_typing', ({ roomId, isTyping }) => {
      setIsRoomAiTyping(isTyping);
    });

    socket.on('disconnect', () => {});

    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (!user || mode !== 'room' || !currentRoomId) return;

    if (socketRef.current?.connected) {
      socketRef.current.emit('join_room', { roomId: currentRoomId, user });
    }

    const loadRoomHistory = async () => {
      try {
        const res = await axios.get(`${API}/api/rooms/${currentRoomId}/messages`);
        if (res.data.success) {
          setRoomMessages(res.data.messages);
        }
      } catch (err) {
        console.error('Failed to load room messages:', err);
      }
    };

    loadRoomHistory();
  }, [currentRoomId, mode, user]);

  useEffect(() => {
    if (mode === 'direct') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, mode]);

  const handleScroll = () => {
    const el = messagesAreaRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBtn(distFromBottom > 200);
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChatHistory = async () => {
    if (!user?._id) return;
    try {
      const res = await axios.get(`${API}/api/chat/history/${user._id}`);
      setChatHistory(res.data);
    } catch (err) {
      console.error('Failed to refresh history:', err);
    }
  };

  const createNewChat = async () => {
    if (!user) return;
    try {
      const res = await axios.post(`${API}/api/chat/create`, { userId: user._id });
      setCurrentChatId(res.data.chat._id);
      setCurrentChatTitle('');
      setMessages([]);
      await fetchChatHistory();
      toast.success('New conversation started!', { duration: 1500 });
    } catch (error) {
      console.error('Error creating new chat:', error);
      toast.error('Failed to create new chat');
    }
  };

  const loadConversation = async (chatId) => {
    try {
      const res = await axios.get(`${API}/api/chat/conversation/${chatId}`);
      if (res.data?.messages?.length > 0) {
        setMessages(
          res.data.messages.map((m) => ({
            role: m.role,
            text: m.text,
            timestamp: m.timestamp,
          }))
        );
      } else {
        setMessages([]);
      }
      setCurrentChatId(chatId);
      setCurrentChatTitle(res.data?.title || '');
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const handleDeleteChat = async (chatId) => {
    try {
      await axios.delete(`${API}/api/chat/${chatId}`);
      toast.success('Chat deleted');

      if (chatId === currentChatId) {
        const remaining = chatHistory.filter((c) => c._id !== chatId);
        if (remaining.length > 0) {
          await loadConversation(remaining[0]._id);
        } else {
          await createNewChat();
        }
      }
      await fetchChatHistory();
    } catch (err) {
      toast.error('Failed to delete chat');
    }
  };

  const handleRenameChat = async (chatId, newTitle) => {
    try {
      await axios.put(`${API}/api/chat/${chatId}/rename`, { title: newTitle });
      if (chatId === currentChatId) setCurrentChatTitle(newTitle);
      await fetchChatHistory();
      toast.success('Chat renamed');
    } catch (err) {
      toast.error('Failed to rename chat');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setMessages([]);
    setChatHistory([]);
    setCurrentChatId(null);
    setCurrentChatTitle('');
    if (socketRef.current) socketRef.current.disconnect();
  };

  const handleSend = async (overrideText) => {
    const userInput = (overrideText ?? input).trim();
    if (!userInput || loading) return;

    setMessages((prev) => [
      ...prev,
      { role: 'user', text: userInput, timestamp: new Date().toISOString() },
    ]);
    setInput('');
    setLoading(true);

    if (!currentChatId) {
      toast.error('No active chat session.');
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${API}/api/chat/message`, {
        chatId: currentChatId,
        role: 'user',
        text: userInput,
      });

      const response = await axios.post(`${API}/api/chat`, {
        chatId: currentChatId,
        message: userInput,
        userId: user?._id,
      });

      const aiReply = response.data.reply;

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: aiReply,
          timestamp: new Date().toISOString(),
        },
      ]);

      if (autoSpeak) {
        setCurrentSpeakingText(aiReply);
        speak(aiReply);
      }

      if (messages.length === 0) {
        const newTitle = userInput.substring(0, 40);
        setCurrentChatTitle(newTitle);
      }

      await fetchChatHistory();
    } catch (error) {
      console.error('Send error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: '⚠️ Sorry, I encountered an error connecting to the server. Please try again.',
          timestamp: new Date().toISOString(),
        },
      ]);
      toast.error('Failed to get AI response');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    if (!lastUserMsg) return;

    setMessages((prev) => {
      const copy = [...prev];
      for (let i = copy.length - 1; i >= 0; i--) {
        if (copy[i].role === 'assistant') {
          copy.splice(i, 1);
          break;
        }
      }
      return copy;
    });

    await handleSend(lastUserMsg.text);
  };

  const handleSendRoomMessage = ({ roomId, text, askAi }) => {
    if (!socketRef.current?.connected) {
      toast.error('Reconnecting to live channel...');
      return;
    }
    socketRef.current.emit('send_room_message', {
      roomId,
      user,
      text,
      askAi,
    });
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (showSplash) {
    return (
      <div
        className="h-screen flex flex-col items-center justify-center relative overflow-hidden select-none"
        style={{ background: '#07070c' }}
      >
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-30 animate-pulse pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)',
            top: '25%',
            left: '20%',
          }}
        />
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-25 animate-pulse pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)',
            bottom: '25%',
            right: '20%',
            animationDelay: '1s',
          }}
        />

        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="flex flex-col items-center z-10 max-w-md w-full px-6 text-center animate-fade-in">
          <div className="relative mb-6">
            <div
              className="absolute -inset-4 rounded-3xl opacity-75 blur-xl animate-pulse"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
            />
            <div
              className="relative w-28 h-28 rounded-3xl p-1 shadow-2xl flex items-center justify-center overflow-hidden border border-white/20"
              style={{ background: 'rgba(15, 15, 26, 0.9)', backdropFilter: 'blur(20px)' }}
            >
              <img
                src="/favicon.png"
                alt="Astra AI Logo"
                className="w-full h-full object-contain rounded-2xl drop-shadow-[0_0_25px_rgba(124,58,237,0.8)]"
              />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight gradient-text mb-2">
            Astra AI
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-medium max-w-xs mb-8 tracking-wide">
            Developer AI Workspace & Collaborative Community
          </p>

          <div className="w-full max-w-xs space-y-3">
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden relative">
              <div
                className="h-full rounded-full animate-pulse"
                style={{
                  background: 'linear-gradient(90deg, #7c3aed, #06b6d4, #7c3aed)',
                  width: '100%',
                }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono">
              <span className="flex items-center gap-1.5 text-purple-300">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                Initializing Engine
              </span>
              <span className="text-cyan-400 font-semibold">Ready</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 text-[11px] text-gray-600 font-medium">
          Astra AI © 2026 · Powered by Groq AI & WebSocket Cluster
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLoginSuccess={(u) => setUser(u)} />;
  }

  const activeRoom = rooms.find((r) => r.id === currentRoomId) || rooms[0];
  const canRegenerate = messages.length >= 2 && messages[messages.length - 1]?.role === 'assistant';

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-default)',
            borderRadius: '12px',
            fontSize: '13px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          },
          success: { iconTheme: { primary: '#06b6d4', secondary: '#0a0a0f' } },
          error: { iconTheme: { primary: '#f87171', secondary: '#0a0a0f' } },
        }}
      />

      <Sidebar
        user={user}
        mode={mode}
        onSelectMode={(newMode) => {
          setMode(newMode);
          if (newMode === 'room' && socketRef.current?.connected) {
            socketRef.current.emit('join_room', { roomId: currentRoomId, user });
          }
        }}
        chatHistory={chatHistory}
        currentChatId={currentChatId}
        onNewChat={createNewChat}
        onLoadConversation={loadConversation}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
        rooms={rooms}
        currentRoomId={currentRoomId}
        onSelectRoom={(roomId) => {
          setCurrentRoomId(roomId);
          if (socketRef.current?.connected) {
            socketRef.current.emit('join_room', { roomId, user });
          }
        }}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex flex-col flex-1 min-w-0 relative">
        {mode === 'prompts' ? (
          <PromptMarketplace
            user={user}
            onUsePrompt={(promptText) => {
              setInput(promptText);
              setMode('direct');
              setTimeout(() => inputRef.current?.focus(), 100);
            }}
            onOpenSidebar={() => setSidebarOpen(true)}
          />
        ) : mode === 'memory' ? (
          <MemoryCards
            user={user}
            onOpenSidebar={() => setSidebarOpen(true)}
          />
        ) : mode === 'roadmaps' ? (
          <LearningRoadmaps
            user={user}
            onOpenSidebar={() => setSidebarOpen(true)}
            onSelectRoom={(roomId) => {
              setCurrentRoomId(roomId);
              setMode('room');
            }}
          />
        ) : mode === 'challenges' ? (
          <RoomChallenges
            user={user}
            onOpenSidebar={() => setSidebarOpen(true)}
            onSelectRoom={(roomId) => {
              setCurrentRoomId(roomId);
              setMode('room');
            }}
          />
        ) : mode === 'playground' ? (
          <CodePlayground
            onOpenSidebar={() => setSidebarOpen(true)}
          />
        ) : mode === 'room' ? (
          <div className="flex-1 flex flex-col min-h-0 relative">
            <div className="md:hidden flex items-center justify-between p-3 border-b border-white/5 bg-slate-950/80 backdrop-blur-lg">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-xl text-gray-400 hover:text-white"
              >
                <Menu size={20} />
              </button>
              <span className="text-xs font-bold text-white flex items-center gap-1">
                <Globe size={13} className="text-cyan-400" /> #{activeRoom.name}
              </span>
              <div className="w-8" />
            </div>

            <RoomView
              room={activeRoom}
              messages={roomMessages}
              user={user}
              onlineCount={roomOnlineCount}
              isAiTyping={isRoomAiTyping}
              onSendMessage={handleSendRoomMessage}
              onOpenSidebar={() => setSidebarOpen(true)}
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0 relative">
            <div
              className="flex items-center gap-3 px-5 py-4 border-b flex-shrink-0"
              style={{
                background: 'rgba(10,10,15,0.85)',
                backdropFilter: 'blur(20px)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 rounded-xl transition-colors text-gray-400 hover:text-white"
              >
                <Menu size={20} />
              </button>

              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-sm truncate text-white">
                  {currentChatTitle || 'New Conversation'}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleAutoSpeak}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
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
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: 'var(--accent-purple-dim)',
                    border: '1px solid rgba(124,58,237,0.3)',
                    color: '#a78bfa',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  Groq AI Engine
                </div>
              </div>
            </div>

            <div
              ref={messagesAreaRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto relative p-5 md:p-8"
            >
              {messages.length === 0 && !loading ? (
                <EmptyState
                  userName={user.firstName}
                  onSelectPrompt={(p) => {
                    setInput(p);
                    inputRef.current?.focus();
                  }}
                />
              ) : (
                <div className="max-w-3xl mx-auto space-y-6 pb-4">
                  {messages.map((msg, i) => (
                    <ChatMessage
                      key={i}
                      message={msg}
                      userPicture={user.picture}
                      onSpeak={handleSpeakMessage}
                      isSpeakingMessage={isSpeaking && currentSpeakingText === msg.text}
                      onSaveMemory={async (text) => {
                        try {
                          const res = await axios.post(`${API}/api/memory/extract`, {
                            userId: user._id,
                            text,
                          });
                          if (res.data.success && res.data.count > 0) {
                            toast.success(`Saved ${res.data.count} memory card(s)!`, { icon: '🧠' });
                          } else {
                            toast('Memory details saved for future chats.', { icon: '🧠' });
                          }
                        } catch (err) {
                          toast.error('Failed to extract memory card');
                        }
                      }}
                    />
                  ))}
                  {loading && <TypingIndicator />}
                  <div ref={chatEndRef} />
                </div>
              )}
            </div>

            {showScrollBtn && (
              <button onClick={scrollToBottom} className="scroll-to-bottom" title="Scroll to bottom">
                <ChevronDown size={18} style={{ color: 'var(--text-secondary)' }} />
              </button>
            )}

            {canRegenerate && !loading && (
              <div className="flex justify-center py-2">
                <button
                  onClick={handleRegenerate}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105"
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-secondary)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  <RotateCcw size={12} />
                  Regenerate response
                </button>
              </div>
            )}

            <div className="px-4 pb-5 pt-2 flex-shrink-0">
              {isListening && (
                <div className="max-w-3xl mx-auto mb-2 flex items-center justify-between px-2 text-xs text-red-400 font-medium animate-pulse">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    Listening to you... Speak now
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="speech-wave-bar" style={{ animationDelay: '0s' }} />
                    <span className="speech-wave-bar" style={{ animationDelay: '0.2s' }} />
                    <span className="speech-wave-bar" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}

              <div
                className="max-w-3xl mx-auto rounded-2xl p-3 flex items-end gap-3 input-container transition-all duration-300"
                style={{
                  background: 'var(--bg-elevated)',
                  border: isListening ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid var(--border-default)',
                  boxShadow: isListening ? '0 0 20px rgba(239, 68, 68, 0.2)' : 'var(--shadow-md)',
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
                      : 'Message Astra AI… (Enter to send, Shift+Enter for newline)'
                  }
                  disabled={loading}
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
                    maxHeight: '160px',
                    overflowY: 'auto',
                  }}
                />

                <div className="flex items-center gap-2 flex-shrink-0">
                  {input.length > 0 && (
                    <span className="text-[10px] hidden sm:block text-gray-500">
                      {input.length}
                    </span>
                  )}

                  {voiceSupported && (
                    <button
                      type="button"
                      onClick={toggleListening}
                      disabled={loading}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
                        isListening
                          ? 'mic-recording'
                          : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10'
                      }`}
                      title={isListening ? 'Stop listening' : 'Talk with Voice'}
                    >
                      {isListening ? <MicOff size={15} /> : <Mic size={15} />}
                    </button>
                  )}

                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() && !loading}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 text-white"
                    style={{
                      background: loading ? 'var(--accent-purple-dim)' : 'var(--gradient-brand)',
                      border: loading ? '1px solid rgba(124,58,237,0.4)' : 'none',
                      cursor: !input.trim() && !loading ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {loading ? (
                      <Square size={14} fill="currentColor" />
                    ) : (
                      <SendHorizonal size={16} />
                    )}
                  </button>
                </div>
              </div>

              <p className="text-center text-[10px] mt-2 hidden sm:block text-gray-500">
                <kbd className="px-1 py-0.5 rounded text-[9px] bg-white/5 border border-white/10">Ctrl+N</kbd>
                {' '}New chat &nbsp;·&nbsp;
                <kbd className="px-1 py-0.5 rounded text-[9px] bg-white/5 border border-white/10">Ctrl+K</kbd>
                {' '}Focus input &nbsp;·&nbsp;
                <kbd className="px-1 py-0.5 rounded text-[9px] bg-white/5 border border-white/10">Shift+↵</kbd>
                {' '}New line
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;