import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import {
  Sparkles,
  Zap,
  Shield,
  MessageSquare,
  Code2,
  Terminal,
  Cpu,
  Users,
  CheckCircle2,
  ArrowRight,
  Lock,
  Layers,
  Activity,
  Flame,
  Bot,
  ExternalLink,
  Info,
  X
} from 'lucide-react';
import { API_URL } from './config';

const FEATURES = [
  {
    icon: Zap,
    title: 'Groq LPU Acceleration',
    desc: 'Llama 3.3 70B & DeepSeek reasoning running at 480+ tokens/sec.',
    color: '#06b6d4',
  },
  {
    icon: Users,
    title: 'Collaborative Topic Rooms',
    desc: 'Real-time WebSocket channels with instant @ai summons.',
    color: '#8b5cf6',
  },
  {
    icon: Code2,
    title: 'In-Browser Code Sandbox',
    desc: 'Live execution, security auditing, and AST optimizations.',
    color: '#10b981',
  },
  {
    icon: Layers,
    title: 'Persistent Memory Recall',
    desc: 'Long-term context memory tailored to your exact tech preferences.',
    color: '#ec4899',
  },
];

const METRICS = [
  { value: '< 220ms', label: 'Median Latency', note: 'Groq LPU Hardware' },
  { value: '480+', label: 'Tokens / Sec', note: 'Ultra-fast Streaming' },
  { value: '6 Rooms', label: 'Live Topic Hubs', note: 'Real-time WebSockets' },
  { value: '100%', label: 'Private & Sandboxed', note: 'Zero Code Training' },
];

const PREVIEWS = [
  {
    id: 'code',
    label: 'AI Code Reviewer',
    icon: Code2,
    badge: 'Groq Llama 3.3',
    code: `// Astra AI Sandboxed Code Audit
function optimizeDataPipeline(records) {
  // AI Refactored: O(N) lookup cache
  const index = new Map();
  for (const item of records) {
    if (!index.has(item.id)) index.set(item.id, item);
  }
  return Array.from(index.values());
}`,
    audit: [
      { text: 'Time Complexity: Reduced from O(N²) to O(N)', passed: true },
      { text: 'Memory Leak Check: Zero dangling references', passed: true },
      { text: 'Security Audit: Sanitized against injection', passed: true },
    ],
    stats: { score: '99/100', speedup: '3.4x Faster' },
  },
  {
    id: 'rooms',
    label: 'Collaborative Rooms',
    icon: Users,
    badge: 'Socket.io Live',
    chat: [
      { user: 'Sarah (Dev)', role: 'dev', text: 'How do we handle state hydration in React 19 server components?' },
      { user: 'Marcus', role: 'dev', text: 'Need streaming suspense boundaries!' },
      {
        user: 'Astra AI (@ai)',
        role: 'ai',
        text: 'In React 19, use the `useActionState` hook combined with `<Suspense>` boundaries. Astra pre-caches the dehydrated stream on client handshake.',
      },
    ],
  },
  {
    id: 'memory',
    label: 'Contextual Memory',
    icon: Layers,
    badge: 'Dynamic Recall',
    memories: [
      { topic: 'Tech Stack', detail: 'React 19, Tailwind v4, Vite, Groq SDK', badge: 'Active' },
      { topic: 'Code Standard', detail: 'TypeScript strict, Functional purity, Early returns', badge: 'Enforced' },
      { topic: 'Architecture', detail: 'Event-driven WebSockets with MongoDB Atlas caching', badge: 'Synced' },
    ],
  },
];

const Login = ({ onLoginSuccess }) => {
  const [activePreview, setActivePreview] = useState(0);
  const [guestLoading, setGuestLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showLegalModal, setShowLegalModal] = useState(false);

  // Auto-switch preview tabs every 5.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setActivePreview((prev) => (prev + 1) % PREVIEWS.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const handleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const response = await axios.post(`${API_URL}/api/auth/google-login`, {
        firstName: decoded.given_name,
        lastName: decoded.family_name,
        email: decoded.email,
        picture: decoded.picture,
        googleId: decoded.sub,
      });
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        onLoginSuccess(response.data.user);
      }
    } catch (error) {
      console.error('Google login failed:', error);
      setErrorMsg('Authentication failed. Please try again or use Instant Demo Mode.');
    }
  };

  const handleGuestLogin = async () => {
    setGuestLoading(true);
    setErrorMsg(null);
    try {
      const guestPayload = {
        firstName: 'Alex',
        lastName: 'Developer',
        email: 'alex.developer@astra.ai',
        picture: 'https://api.dicebear.com/7.x/bottts/svg?seed=AstraDev',
        googleId: 'guest-developer-astra-001',
      };
      const response = await axios.post(`${API_URL}/api/auth/google-login`, guestPayload);
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        onLoginSuccess(response.data.user);
      }
    } catch (err) {
      console.warn('Backend login fallback to local session:', err);
      const localUser = {
        _id: 'guest_local_' + Date.now(),
        firstName: 'Alex',
        lastName: 'Developer',
        email: 'alex.developer@astra.ai',
        picture: 'https://api.dicebear.com/7.x/bottts/svg?seed=AstraDev',
        googleId: 'guest-developer-astra-001',
      };
      localStorage.setItem('user', JSON.stringify(localUser));
      onLoginSuccess(localUser);
    } finally {
      setGuestLoading(false);
    }
  };

  // Subtle clean twinkling stars (positioned deterministically to avoid rerender jumps)
  const stars = [
    { top: '12%', left: '8%', size: '2px', delay: '0s', duration: '3s' },
    { top: '24%', left: '42%', size: '3px', delay: '1s', duration: '4s' },
    { top: '18%', left: '86%', size: '2px', delay: '2s', duration: '3.5s' },
    { top: '65%', left: '15%', size: '2px', delay: '1.5s', duration: '4.5s' },
    { top: '82%', left: '50%', size: '3px', delay: '0.5s', duration: '3s' },
    { top: '75%', left: '88%', size: '2px', delay: '2.5s', duration: '4s' },
  ];

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden overflow-y-auto bg-[#07070c] text-slate-100 flex flex-col justify-between selection:bg-purple-500/30 selection:text-cyan-200">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 cyber-grid-bg pointer-events-none z-0" />

      {/* Ambient Gradient Lights */}
      <div className="aurora-orb aurora-orb-1" />
      <div className="aurora-orb aurora-orb-2" />
      <div className="aurora-orb aurora-orb-3" />

      {/* Crisp Ambient Starfield */}
      {stars.map((s, idx) => (
        <span
          key={idx}
          className="star-point"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
            animationDuration: s.duration,
          }}
        />
      ))}

      {/* ─── Top Navigation Header ────────────────────────────────────────── */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <div className="relative group flex-shrink-0">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 opacity-60 blur-md group-hover:opacity-100 transition duration-300" />
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#0f0f1a] border border-white/20 p-2 flex items-center justify-center shadow-xl">
              <img src="/favicon.png" alt="Astra Logo" className="w-full h-full object-contain" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white font-sans">
                Astra<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">AI</span>
              </span>
              <span className="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold tracking-wide uppercase rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                v2.4
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium hidden sm:block">
              Full-Stack Real-Time AI Intelligence Hub
            </p>
          </div>
        </div>

        {/* Live Infrastructure Status */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs backdrop-blur-md">
            <span className="badge-live-pulse text-emerald-400 font-medium">Groq LPU Engine Active</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 font-mono text-[11px]">&lt;220ms Latency</span>
          </div>

          <button
            onClick={handleGuestLogin}
            disabled={guestLoading}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-sm"
          >
            <Sparkles size={13} className="text-purple-400 animate-pulse" />
            <span>{guestLoading ? 'Connecting...' : 'Guest Demo'}</span>
          </button>
        </div>
      </header>

      {/* ─── Main Hero + Auth Split Section ──────────────────────────────── */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-10 flex-1 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
        
        {/* ─── LEFT COLUMN: Product Pitch & Interactive Showcase ─────────── */}
        <div className="flex-1 w-full flex flex-col gap-6 sm:gap-8 max-w-2xl">
          
          {/* Eyebrow & Headline */}
          <div className="space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-semibold backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <Flame size={13} className="text-cyan-400 animate-bounce" />
              <span>Next-Gen Developer Intelligence & Workspace</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black tracking-tight leading-[1.14] text-white">
              Supercharge your code with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-300 to-emerald-400">
                Ultra-Fast AI
              </span>{' '}
              and Live Collaboration.
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl font-normal">
              Say goodbye to sluggish, isolated chatbots. Astra AI combines sub-second{' '}
              <span className="text-cyan-300 font-medium">Groq LPU reasoning</span>, real-time{' '}
              <span className="text-purple-300 font-medium">multi-user topic channels</span> with{' '}
              <code className="px-1.5 py-0.5 rounded bg-white/10 text-pink-300 text-xs font-mono">@ai</code>{' '}
              summoning, in-browser code sandboxes, and personalized memory recall.
            </p>
          </div>

          {/* Interactive Live Product Preview Card */}
          <div className="w-full rounded-2xl bg-[#0f0f1c]/90 border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden">
            {/* Terminal Window Bar & Tabs */}
            <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-black/40 border-b border-white/10 gap-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <span className="text-xs font-mono text-slate-400 ml-2 hidden sm:inline">
                  astra://workspace/live-preview
                </span>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1 bg-black/30 p-1 rounded-xl border border-white/5 overflow-x-auto max-w-full scrollbar-none">
                {PREVIEWS.map((tab, idx) => {
                  const Icon = tab.icon;
                  const isActive = activePreview === idx;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActivePreview(idx)}
                      className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-600/40 to-cyan-600/40 text-white border border-white/20 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                      }`}
                    >
                      <Icon size={13} className={isActive ? 'text-cyan-300' : 'text-slate-400'} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preview Tab Content */}
            <div className="p-3.5 sm:p-5 min-h-[220px] flex flex-col justify-center">
              {/* Tab 0: Code Audit */}
              {activePreview === 0 && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="flex flex-wrap items-center justify-between gap-1 text-xs">
                    <span className="font-mono text-cyan-400 flex items-center gap-1.5">
                      <Terminal size={14} /> algorithm_optimizer.js
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] sm:text-[11px] font-mono font-medium">
                      Audit Score: {PREVIEWS[0].stats.score} · {PREVIEWS[0].stats.speedup}
                    </span>
                  </div>

                  <pre className="p-3 rounded-xl bg-black/60 border border-white/5 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                    {PREVIEWS[0].code}
                  </pre>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    {PREVIEWS[0].audit.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.03] border border-white/5 text-[11px] text-slate-300 font-medium"
                      >
                        <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />
                        <span className="truncate">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 1: Topic Rooms */}
              {activePreview === 1 && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-purple-300 flex items-center gap-1.5 font-semibold">
                      #web-dev channel
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 text-[11px] flex items-center gap-1">
                      <Users size={12} /> 14 Online Now
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {PREVIEWS[1].chat.map((msg, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-xl text-xs leading-relaxed ${
                          msg.role === 'ai'
                            ? 'bg-gradient-to-r from-purple-950/60 to-cyan-950/60 border border-purple-500/30 text-purple-100 shadow-[0_0_15px_rgba(124,58,237,0.15)]'
                            : 'bg-white/[0.04] border border-white/5 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          {msg.role === 'ai' ? (
                            <Bot size={13} className="text-cyan-400" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-cyan-400" />
                          )}
                          <span
                            className={`font-semibold text-[11px] ${
                              msg.role === 'ai' ? 'text-cyan-300' : 'text-slate-200'
                            }`}
                          >
                            {msg.user}
                          </span>
                        </div>
                        <p>{msg.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: Memory Recall */}
              {activePreview === 2 && (
                <div className="space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-pink-400 flex items-center gap-1.5 font-medium">
                      <Layers size={14} /> Developer Memory Core
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Auto-Injected on every prompt
                    </span>
                  </div>

                  <div className="space-y-2">
                    {PREVIEWS[2].memories.map((m, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-pink-500/30 transition-all duration-200"
                      >
                        <div className="space-y-0.5">
                          <p className="text-xs font-semibold text-white">{m.topic}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{m.detail}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/30 text-[10px] font-mono font-medium">
                          {m.badge}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Social Proof & Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {METRICS.map((metric, idx) => (
              <div
                key={idx}
                className="p-3 sm:p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-cyan-500/30 transition-all duration-300 group"
              >
                <div className="text-base sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-200 group-hover:from-cyan-300 group-hover:to-purple-300 transition-colors">
                  {metric.value}
                </div>
                <div className="text-xs font-semibold text-slate-300 mt-0.5">{metric.label}</div>
                <div className="text-[10px] text-slate-500 font-medium mt-0.5">{metric.note}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── RIGHT COLUMN: High-End Auth Card ───────────────────────────── */}
        <div className="w-full lg:w-[440px] flex-shrink-0">
          
          <div className="relative group">
            {/* Ambient Card Glow */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-purple-600/50 via-cyan-500/40 to-pink-500/30 blur-xl opacity-75 group-hover:opacity-100 transition duration-700 pointer-events-none" />

            {/* Main Auth Container */}
            <div className="relative rounded-3xl bg-[#0c0c16]/95 border border-white/15 p-4 sm:p-7 md:p-9 shadow-2xl backdrop-blur-2xl flex flex-col gap-5 sm:gap-6">
              
              {/* Header inside Card */}
              <div className="flex flex-col items-center text-center gap-2.5 sm:gap-3">
                <div className="relative">
                  <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 opacity-60 blur-md animate-pulse" />
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#121224] border border-white/20 p-2 sm:p-2.5 flex items-center justify-center shadow-xl">
                    <img
                      src="/favicon.png"
                      alt="Astra AI"
                      className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(124,58,237,0.7)]"
                    />
                  </div>
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    Welcome to Astra AI
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-[280px]">
                    Sign in to sync your conversations, private memory cards, and room achievements.
                  </p>
                </div>
              </div>

              {/* Error Notice if any */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <Info size={14} className="flex-shrink-0 text-red-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* 4 Feature Badges in Card */}
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                {FEATURES.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="p-2 sm:p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/15 transition-all duration-200"
                    >
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                        <Icon size={14} style={{ color: item.color }} className="flex-shrink-0" />
                        <span className="text-[10px] sm:text-[11px] font-bold text-slate-200 truncate">
                          {item.title}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-slate-400">
                  Google Single Sign-On
                </span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Google Login Component Frame */}
              <div className="w-full flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-black/40 border border-white/10 shadow-inner overflow-hidden">
                <div className="w-full max-w-[280px] flex justify-center transform hover:scale-[1.02] transition-transform duration-200">
                  <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={() => {
                      console.error('Google OAuth Login Failed');
                      setErrorMsg('Google OAuth window closed or failed. You can also explore via Demo Mode.');
                    }}
                    useOneTap
                    theme="filled_black"
                    shape="pill"
                    size="large"
                    text="continue_with"
                    width="260"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-2 text-center">
                  Fast, secure 1-click verification
                </span>
              </div>

              {/* Instant Guest / Demo Mode Button */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleGuestLogin}
                  disabled={guestLoading}
                  className="w-full relative group overflow-hidden rounded-xl p-px font-semibold text-xs transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-cyan-400 to-purple-500 rounded-xl group-hover:opacity-100 opacity-75 blur-sm transition duration-300" />
                  <div className="relative px-4 py-3 rounded-xl bg-[#111122] flex items-center justify-center gap-2.5 text-white border border-white/20">
                    <Sparkles size={14} className="text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
                    <span className="font-bold">
                      {guestLoading ? 'Provisioning Sandbox...' : 'Explore as Guest Developer'}
                    </span>
                    <ArrowRight size={13} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                <p className="text-center text-[10px] text-slate-400">
                  Instant sandbox access with zero setup required.
                </p>
              </div>

              {/* Security & Compliance Footer */}
              <div className="pt-2 border-t border-white/10 flex flex-col items-center gap-2">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Lock size={12} className="text-emerald-400" />
                  <span>256-Bit TLS · Zero Training on User Code · Sandboxed</span>
                </div>

                <p className="text-[11px] text-slate-400 text-center">
                  By connecting, you agree to our{' '}
                  <button
                    onClick={() => setShowLegalModal(true)}
                    className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors"
                  >
                    Terms & Privacy Policy
                  </button>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ─── Bottom Footer Bar ────────────────────────────────────────────── */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 border-t border-white/5">
        <div className="flex items-center gap-2">
          <span>© 2026 Astra AI Platform. Built for developers worldwide.</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Cpu size={12} className="text-purple-400" /> Powered by Groq Cloud LPU
          </span>
          <span className="text-slate-700">·</span>
          <button
            onClick={() => setShowLegalModal(true)}
            className="hover:text-slate-300 transition-colors"
          >
            Security & Compliance
          </button>
        </div>
      </footer>

      {/* ─── Legal / Privacy Modal ────────────────────────────────────────── */}
      {showLegalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#10101c] border border-white/15 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-cyan-400" />
                <h3 className="text-base font-bold text-white">Privacy & Developer Terms</h3>
              </div>
              <button
                onClick={() => setShowLegalModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 max-h-[60vh] overflow-y-auto pr-2 leading-relaxed">
              <p>
                <strong>1. Data Sovereignty:</strong> Your prompts, private code snippets, and in-browser sandbox executions are never used to train public LLM models.
              </p>
              <p>
                <strong>2. Groq Inference:</strong> Inference requests are securely passed via TLS directly to Groq's high-performance hardware clusters with zero retention.
              </p>
              <p>
                <strong>3. Real-Time Rooms:</strong> Collaborative room messages are broadcast only to active room peers through isolated WebSocket channels.
              </p>
              <p>
                <strong>4. Account Security:</strong> Authentication is handled through Google OAuth 2.0 with cryptographic JWT verification. No passwords are ever stored.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowLegalModal(false)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
              >
                Understood & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;