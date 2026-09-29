import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  Code, Play, RotateCcw, Sparkles, Terminal, Copy, Check,
  Download, Eye, ShieldCheck, Zap, AlertCircle, FileCode, SplitSquareVertical, Menu
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { API_URL as API } from '../config';


const TEMPLATES = {
  javascript: {
    name: 'JavaScript / DOM',
    code: `// Interactive Canvas Particle Animation
const canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

const particles = Array.from({ length: 50 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  vx: (Math.random() - 0.5) * 2,
  vy: (Math.random() - 0.5) * 2,
  size: Math.random() * 3 + 2,
  color: \`hsl(\${Math.random() * 60 + 250}, 80%, 65%)\`
}));

function animate() {
  ctx.fillStyle = 'rgba(10, 10, 20, 0.2)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = p.color;
    ctx.fill();
  });

  requestAnimationFrame(animate);
}
animate();
console.log("🚀 Particle Simulation initialized in sandbox!");
`,
  },
  html: {
    name: 'HTML & CSS & Glassmorphism',
    code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at top right, #7c3aed, #0a0a14);
      font-family: system-ui, sans-serif;
      color: white;
    }
    .glass-card {
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.18);
      padding: 32px;
      border-radius: 24px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.5);
      text-align: center;
      max-width: 360px;
      animation: float 4s ease-in-out infinite;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-12px); }
    }
    .badge {
      background: linear-gradient(135deg, #7c3aed, #06b6d4);
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.5px;
      display: inline-block;
      margin-bottom: 12px;
    }
    h2 { margin: 8px 0; font-size: 22px; font-weight: 800; }
    p { font-size: 13px; color: #cbd5e1; line-height: 1.6; }
    button {
      margin-top: 16px;
      background: linear-gradient(135deg, #06b6d4, #7c3aed);
      border: none;
      color: white;
      padding: 10px 24px;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: 0.2s;
    }
    button:hover { transform: scale(1.05); }
  </style>
</head>
<body>
  <div class="glass-card">
    <div class="badge">LIVE PREVIEW</div>
    <h2>Astra AI Sandbox</h2>
    <p>Run full HTML, CSS, animations, and JS directly in your browser without leaving the chat app.</p>
    <button onclick="alert('⚡ Interactive Live Sandbox works!')">Click Me</button>
  </div>
</body>
</html>
`,
  },
  algorithms: {
    name: 'Algorithm / Data Structures',
    code: `// QuickSort Benchmark & Visualization in JS
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[arr.length - 1];
  const left = [];
  const right = [];

  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) left.push(arr[i]);
    else right.push(arr[i]);
  }

  return [...quickSort(left), pivot, ...quickSort(right)];
}

// Generate random array
const sample = Array.from({ length: 20 }, () => Math.floor(Math.random() * 100));
console.log("Unsorted Array:", JSON.stringify(sample));

const t0 = performance.now();
const sorted = quickSort(sample);
const t1 = performance.now();

console.log("Sorted Array:  ", JSON.stringify(sorted));
console.log(\`⚡ Sorted 20 items in \${(t1 - t0).toFixed(4)} ms\`);
`,
  },
};

const CodePlayground = ({ initialCode, initialLanguage, onOpenSidebar }) => {
  const [language, setLanguage] = useState(initialLanguage || 'javascript');
  const [code, setCode] = useState(initialCode || TEMPLATES.javascript.code);
  const [outputConsole, setOutputConsole] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('preview');

  const [aiReview, setAiReview] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mobileTab, setMobileTab] = useState('editor'); // 'editor' | 'output'

  const iframeRef = useRef(null);

  const handleSelectTemplate = (tmplKey) => {
    const tmpl = TEMPLATES[tmplKey];
    if (tmpl) {
      setCode(tmpl.code);
      if (tmplKey === 'html') setLanguage('html');
      else setLanguage('javascript');
      toast.success(`Loaded ${tmpl.name} template`);
    }
  };

  const runCode = () => {
    setIsRunning(true);
    setOutputConsole([]);
    setActiveTab(language === 'html' ? 'preview' : 'console');

    try {
      const iframe = iframeRef.current;
      if (!iframe) return;

      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      iframeDoc.open();

      const consoleScript = `
        <script>
          const logs = [];
          const originalLog = console.log;
          const originalError = console.error;
          const originalWarn = console.warn;

          window.onerror = function(msg, url, line) {
            window.parent.postMessage({ type: 'SANDBOX_CONSOLE', level: 'error', data: [msg + ' (line ' + line + ')'] }, '*');
            return false;
          };

          console.log = function(...args) {
            window.parent.postMessage({ type: 'SANDBOX_CONSOLE', level: 'log', data: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)) }, '*');
            originalLog.apply(console, args);
          };

          console.error = function(...args) {
            window.parent.postMessage({ type: 'SANDBOX_CONSOLE', level: 'error', data: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)) }, '*');
            originalError.apply(console, args);
          };

          console.warn = function(...args) {
            window.parent.postMessage({ type: 'SANDBOX_CONSOLE', level: 'warn', data: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)) }, '*');
            originalWarn.apply(console, args);
          };
        </script>
      `;

      let content = '';
      if (language === 'html') {
        content = code.includes('<head>')
          ? code.replace('<head>', '<head>' + consoleScript)
          : consoleScript + code;
      } else {
        content = `
          <!DOCTYPE html>
          <html>
          <head>
            ${consoleScript}
            <style>
              body {
                background: #0a0a14;
                color: #f1f5f9;
                font-family: system-ui, sans-serif;
                margin: 0;
                overflow: hidden;
              }
            </style>
          </head>
          <body>
            <script>
              try {
                ${code}
              } catch (err) {
                console.error(err.message);
              }
            </script>
          </body>
          </html>
        `;
      }

      iframeDoc.write(content);
      iframeDoc.close();
      setMobileTab('output');
      toast.success('Code executed live!', { icon: '⚡' });
    } catch (err) {
      setOutputConsole((prev) => [...prev, { level: 'error', text: err.message }]);
      setMobileTab('output');
      toast.error('Runtime execution error');
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data && e.data.type === 'SANDBOX_CONSOLE') {
        setOutputConsole((prev) => [
          ...prev,
          { level: e.data.level, text: e.data.data.join(' ') },
        ]);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleAiCodeReview = async () => {
    if (!code.trim()) {
      toast.error('Please write or paste code first');
      return;
    }

    try {
      setIsReviewing(true);
      setActiveTab('ai-review');
      setMobileTab('output');
      const res = await axios.post(`${API}/api/ai/review-code`, {
        code,
        language,
      });

      if (res.data.success) {
        setAiReview(res.data.review);
        toast.success('AI Code Review generated!', { icon: '🤖' });
      }
    } catch (err) {
      toast.error('Failed to generate AI code review');
    } finally {
      setIsReviewing(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Top Header */}
      <div
        className="p-3 sm:p-4 md:p-5 border-b flex-shrink-0 flex flex-wrap items-center justify-between gap-3"
        style={{
          background: 'rgba(15, 15, 26, 0.85)',
          backdropFilter: 'blur(20px)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
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
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-500/20 flex-shrink-0"
            style={{ background: 'var(--gradient-brand)' }}
          >
            <Code size={18} />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-lg font-bold text-white flex items-center gap-2 truncate">
              In-Browser Code Playground
            </h1>
            <p className="text-xs text-gray-400 hidden sm:block">
              Write, test, execute JS/HTML snippets live, and get instant senior-level AI code reviews.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Templates dropdown */}
          <select
            onChange={(e) => handleSelectTemplate(e.target.value)}
            defaultValue=""
            className="px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 outline-none hover:bg-white/10 transition-colors"
          >
            <option value="" disabled>Presets / Templates</option>
            <option value="javascript">Particle Canvas (JS)</option>
            <option value="html">Glassmorphism UI (HTML/CSS)</option>
            <option value="algorithms">QuickSort Benchmark (Algo)</option>
          </select>

          {/* AI Review Button */}
          <button
            onClick={handleAiCodeReview}
            disabled={isReviewing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-purple-300 bg-purple-500/15 border border-purple-500/30 hover:bg-purple-500/25 transition-all shadow-sm disabled:opacity-50"
          >
            <Sparkles size={13} />
            {isReviewing ? 'Analyzing...' : '🤖 Review AI'}
          </button>

          {/* Run Code Button */}
          <button
            onClick={runCode}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-xl text-xs font-semibold text-white shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            style={{ background: 'var(--gradient-brand)' }}
          >
            <Play size={13} fill="currentColor" />
            <span>Run Live</span>
          </button>
        </div>
      </div>

      {/* Mobile Switcher (Editor vs Output) */}
      <div className="md:hidden flex items-center justify-center p-2 bg-black/50 border-b border-white/5 gap-2 flex-shrink-0">
        <button
          onClick={() => setMobileTab('editor')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            mobileTab === 'editor'
              ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40 shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <FileCode size={13} />
          <span>Editor</span>
        </button>
        <button
          onClick={() => setMobileTab('output')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            mobileTab === 'output'
              ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Eye size={13} />
          <span>Output & Review</span>
        </button>
      </div>

      {/* Main Split Workspace */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
        {/* LEFT COLUMN: Code Editor */}
        <div className={`flex-1 flex flex-col border-b md:border-b-0 md:border-r border-white/10 ${mobileTab === 'editor' ? 'flex' : 'hidden md:flex'}`}>
          {/* Editor Sub-Header */}
          <div className="px-4 py-2.5 bg-black/40 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
              <FileCode size={14} className="text-cyan-400" />
              <span>Editor</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-400 uppercase">
                {language}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="p-1 rounded text-gray-400 hover:text-white transition-colors"
                title="Copy code"
              >
                {copied ? <Check size={13} className="text-cyan-400" /> : <Copy size={13} />}
              </button>
              <button
                onClick={() => setCode('')}
                className="p-1 rounded text-gray-400 hover:text-red-400 transition-colors"
                title="Clear code"
              >
                <RotateCcw size={13} />
              </button>
            </div>
          </div>

          {/* Textarea Editor with line numbers look */}
          <div className="flex-1 relative bg-[#0d0d17] p-3 overflow-auto">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="// Write or paste code snippet here..."
              spellCheck={false}
              className="w-full h-full bg-transparent text-gray-200 font-mono text-sm leading-relaxed outline-none resize-none border-none p-2 selection:bg-purple-500/30"
              style={{
                fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
                tabSize: 2,
              }}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Output Sandbox Tabs (Preview / Console / AI Review) */}
        <div className={`flex-1 flex flex-col bg-[#0a0a10] ${mobileTab === 'output' ? 'flex' : 'hidden md:flex'}`}>
          {/* Tabs header */}
          <div className="px-4 py-2 bg-black/40 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'preview'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Eye size={12} />
                Live Preview
              </button>

              <button
                onClick={() => setActiveTab('console')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all relative ${
                  activeTab === 'console'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Terminal size={12} />
                Console
                {outputConsole.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-purple-500 text-white text-[9px] flex items-center justify-center">
                    {outputConsole.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('ai-review')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'ai-review'
                    ? 'bg-gradient-to-r from-purple-500/30 to-cyan-500/30 text-white border border-purple-500/40'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Sparkles size={12} className="text-purple-400" />
                AI Review Report
              </button>
            </div>

            {activeTab === 'console' && outputConsole.length > 0 && (
              <button
                onClick={() => setOutputConsole([])}
                className="text-[10px] text-gray-500 hover:text-gray-300"
              >
                Clear
              </button>
            )}
          </div>

          {/* Tab Contents */}
          <div className="flex-1 relative overflow-auto p-4">
            {/* 1. Live iframe sandbox */}
            <div className={`w-full h-full ${activeTab === 'preview' ? 'block' : 'hidden'}`}>
              <iframe
                ref={iframeRef}
                title="Sandboxed Output"
                sandbox="allow-scripts allow-modals allow-same-origin"
                className="w-full h-full rounded-xl border border-white/5 bg-slate-950"
              />
            </div>

            {/* 2. Console Logs */}
            {activeTab === 'console' && (
              <div className="h-full font-mono text-xs space-y-1.5">
                {outputConsole.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center">
                    <Terminal size={32} className="mb-2 opacity-50" />
                    <p>No console logs yet. Click "Run Live" to execute your code.</p>
                  </div>
                ) : (
                  outputConsole.map((log, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded-lg border leading-relaxed ${
                        log.level === 'error'
                          ? 'bg-red-950/30 border-red-500/30 text-red-300'
                          : log.level === 'warn'
                          ? 'bg-amber-950/30 border-amber-500/30 text-amber-300'
                          : 'bg-white/5 border-white/5 text-gray-200'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-bold mr-2 opacity-60">[{log.level}]</span>
                      {log.text}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 3. AI Code Review Report */}
            {activeTab === 'ai-review' && (
              <div className="h-full">
                {isReviewing ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white animate-spin" style={{ background: 'var(--gradient-brand)' }}>
                      <Sparkles size={24} />
                    </div>
                    <h3 className="font-bold text-white text-base">Astra Senior AI is Analyzing Your Code</h3>
                    <p className="text-xs text-gray-400 max-w-sm">
                      Checking security vulnerabilities, time/space complexity, modularity, and refactoring optimizations...
                    </p>
                  </div>
                ) : aiReview ? (
                  <div className="prose prose-invert max-w-none text-xs leading-relaxed">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {aiReview}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <Sparkles size={40} className="text-purple-400 mb-3" />
                    <h3 className="font-bold text-white text-sm mb-1">Automated Senior-Level AI Code Review</h3>
                    <p className="text-xs text-gray-400 max-w-sm mb-4">
                      Click "Review with AI" to get an in-depth audit covering security, performance bottlenecks, and optimized rewrites.
                    </p>
                    <button
                      onClick={handleAiCodeReview}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-lg"
                      style={{ background: 'var(--gradient-brand)' }}
                    >
                      Run AI Code Review
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodePlayground;
