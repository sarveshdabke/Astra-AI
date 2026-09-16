import React from 'react';
import { Sparkles, Code2, BookOpen, Lightbulb, Globe, Zap } from 'lucide-react';

const suggestions = [
  {
    icon: <Code2 size={18} />,
    title: 'Write Code',
    prompt: 'Write a Python function to sort a list of objects by multiple fields.',
    color: '#7c3aed',
  },
  {
    icon: <Lightbulb size={18} />,
    title: 'Brainstorm Ideas',
    prompt: 'Give me 10 creative startup ideas in the AI space for 2025.',
    color: '#06b6d4',
  },
  {
    icon: <BookOpen size={18} />,
    title: 'Explain a Concept',
    prompt: 'Explain quantum computing in simple terms with real-world examples.',
    color: '#8b5cf6',
  },
  {
    icon: <Globe size={18} />,
    title: 'Translate & Rewrite',
    prompt: 'Rewrite this paragraph in a more professional tone: [paste your text]',
    color: '#0891b2',
  },
  {
    icon: <Zap size={18} />,
    title: 'Summarize',
    prompt: 'Summarize the key points of the React 19 release and what changed.',
    color: '#6d28d9',
  },
  {
    icon: <Sparkles size={18} />,
    title: 'Creative Writing',
    prompt: 'Write a short sci-fi story set on Mars in the year 2150.',
    color: '#0e7490',
  },
];

const EmptyState = ({ onSelectPrompt, userName }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 pb-8"
      style={{ animation: 'fade-in 0.5s ease forwards' }}>

      {/* Logo glow */}
      <div className="mb-6 relative">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black logo-glow"
          style={{ background: 'var(--gradient-brand)' }}
        >
          A
        </div>
      </div>

      {/* Greeting */}
      <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center"
        style={{ color: 'var(--text-primary)' }}>
        Hello, {userName || 'there'}!
      </h2>
      <p className="mb-8 text-center" style={{ color: 'var(--text-secondary)' }}>
        Ask me anything — I'm here to help.
      </p>

      {/* Suggestions grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-3xl">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSelectPrompt(s.prompt)}
            className="text-left p-4 rounded-2xl transition-all group"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              animationDelay: `${i * 60}ms`,
              animation: 'fade-in-up 0.4s ease forwards',
              opacity: 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = s.color + '55';
              e.currentTarget.style.background = s.color + '11';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border-default)';
              e.currentTarget.style.background = 'var(--bg-elevated)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div className="flex items-center gap-2 mb-2 font-semibold text-sm"
              style={{ color: s.color }}>
              {s.icon}
              {s.title}
            </div>
            <p className="text-xs leading-relaxed line-clamp-2"
              style={{ color: 'var(--text-secondary)' }}>
              {s.prompt}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmptyState;
