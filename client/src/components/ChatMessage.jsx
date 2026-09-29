import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, User, Volume2, VolumeX, Brain } from 'lucide-react';
import toast from 'react-hot-toast';


/* ─── Code block with copy button ─────────────────────────────── */

const CodeBlock = ({ language, children }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
    setCopied(true);
    toast.success('Code copied!', { duration: 1500 });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <span>{language || 'code'}</span>
        <button className="code-copy-btn" onClick={handleCopy}>
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        style={oneDark}
        language={language || 'text'}
        PreTag="div"
        customStyle={{
          margin: 0,
          padding: '16px',
          background: 'rgba(0,0,0,0.5)',
          fontSize: '13px',
          lineHeight: '1.6',
        }}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  );
};

/* ─── Markdown renderer ────────────────────────────────────────── */
const MarkdownContent = ({ text }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      code({ node, inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || '');
        return !inline ? (
          <CodeBlock language={match?.[1]}>{children}</CodeBlock>
        ) : (
          <code
            {...props}
            style={{
              background: 'rgba(124,58,237,0.2)',
              color: '#c4b5fd',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '13px',
              fontFamily: 'monospace',
            }}
          >
            {children}
          </code>
        );
      },
      h1: ({ children }) => (
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>{children}</h1>
      ),
      h2: ({ children }) => (
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>{children}</h2>
      ),
      h3: ({ children }) => (
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '4px', color: 'var(--text-primary)' }}>{children}</h3>
      ),
      p: ({ children }) => (
        <p style={{ marginBottom: '8px', lineHeight: '1.7', color: 'var(--text-primary)' }}>{children}</p>
      ),
      ul: ({ children }) => (
        <ul style={{ paddingLeft: '20px', marginBottom: '8px', listStyleType: 'disc' }}>{children}</ul>
      ),
      ol: ({ children }) => (
        <ol style={{ paddingLeft: '20px', marginBottom: '8px', listStyleType: 'decimal' }}>{children}</ol>
      ),
      li: ({ children }) => (
        <li style={{ marginBottom: '4px', lineHeight: '1.6', color: 'var(--text-primary)' }}>{children}</li>
      ),
      strong: ({ children }) => (
        <strong style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{children}</strong>
      ),
      em: ({ children }) => (
        <em style={{ color: 'var(--text-secondary)' }}>{children}</em>
      ),
      blockquote: ({ children }) => (
        <blockquote style={{
          borderLeft: '3px solid var(--accent-purple)',
          paddingLeft: '12px',
          margin: '8px 0',
          color: 'var(--text-secondary)',
          fontStyle: 'italic',
        }}>
          {children}
        </blockquote>
      ),
      a: ({ href, children }) => (
        <a href={href} target="_blank" rel="noopener noreferrer"
          style={{ color: 'var(--accent-cyan)', textDecoration: 'underline' }}>
          {children}
        </a>
      ),
      table: ({ children }) => (
        <div style={{ overflowX: 'auto', marginBottom: '8px' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '13px' }}>{children}</table>
        </div>
      ),
      th: ({ children }) => (
        <th style={{
          padding: '8px 12px',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-default)',
          color: 'var(--text-primary)',
          fontWeight: 600,
          textAlign: 'left',
        }}>{children}</th>
      ),
      td: ({ children }) => (
        <td style={{
          padding: '8px 12px',
          border: '1px solid var(--border-subtle)',
          color: 'var(--text-secondary)',
        }}>{children}</td>
      ),
      hr: () => (
        <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '12px 0' }} />
      ),
    }}
  >
    {text}
  </ReactMarkdown>
);

/* ─── Individual chat message ──────────────────────────────────── */
const ChatMessage = ({ message, userPicture, onSpeak, isSpeakingMessage, onSaveMemory }) => {
  const [copied, setCopied] = useState(false);
  const [savedMemory, setSavedMemory] = useState(false);
  const isUser = message.role === 'user';

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    toast.success('Copied to clipboard!', { duration: 1500 });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToMemory = () => {
    if (onSaveMemory) {
      onSaveMemory(message.text);
      setSavedMemory(true);
      setTimeout(() => setSavedMemory(false), 2500);
    }
  };

  const timeString = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div
      className={`flex items-end gap-3 message-enter ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-sm font-bold"
        style={isUser
          ? { background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }
          : { background: 'var(--gradient-brand)' }
        }
      >
        {isUser ? (
          userPicture
            ? <img src={userPicture} alt="you" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            : <User size={14} style={{ color: 'var(--text-secondary)' }} />
        ) : (
          'A'
        )}
      </div>

      {/* Bubble + actions */}
      <div className={`group flex flex-col gap-1 max-w-[94%] sm:max-w-[85%] md:max-w-[78%] lg:max-w-[72%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className="relative px-3.5 sm:px-5 py-2.5 sm:py-3.5 rounded-[18px] sm:rounded-[20px] shadow-sm max-w-full overflow-hidden break-words"
          style={isUser ? {
            background: 'var(--gradient-user-bubble)',
            color: '#fff',
            borderBottomRightRadius: '4px',
          } : {
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            color: 'var(--text-primary)',
            borderBottomLeftRadius: '4px',
          }}
        >
          {isUser ? (
            <p className="leading-relaxed whitespace-pre-wrap text-sm break-words">{message.text}</p>
          ) : (
            <div className="prose prose-invert max-w-none text-sm break-words overflow-hidden">
              <MarkdownContent text={message.text} />
            </div>
          )}
        </div>

        {/* Timestamp + copy + speak + save to memory */}
        <div className={`flex items-center gap-1.5 sm:gap-2 flex-wrap opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 ${isUser ? 'flex-row-reverse' : ''}`}>
          {timeString && (
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{timeString}</span>
          )}
          <button
            onClick={handleCopyMessage}
            className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md transition-all"
            style={{
              color: 'var(--text-muted)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}
            title="Copy text"
          >
            {copied ? <Check size={10} /> : <Copy size={10} />}
            {copied ? 'Copied' : 'Copy'}
          </button>

          {!isUser && onSpeak && (
            <button
              onClick={() => onSpeak(message.text)}
              className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md transition-all"
              style={{
                color: isSpeakingMessage ? '#a78bfa' : 'var(--text-muted)',
                background: isSpeakingMessage ? 'rgba(124, 58, 237, 0.2)' : 'var(--bg-card)',
                border: isSpeakingMessage ? '1px solid #7c3aed' : '1px solid var(--border-subtle)',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = isSpeakingMessage ? '#a78bfa' : 'var(--text-muted)'; }}
              title={isSpeakingMessage ? 'Stop speaking' : 'Read out loud'}
            >
              {isSpeakingMessage ? <VolumeX size={10} /> : <Volume2 size={10} />}
              {isSpeakingMessage ? 'Stop' : 'Listen'}
            </button>
          )}

          {!isUser && onSaveMemory && (
            <button
              onClick={handleSaveToMemory}
              className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md transition-all"
              style={{
                color: savedMemory ? '#06b6d4' : 'var(--text-muted)',
                background: savedMemory ? 'rgba(6, 182, 212, 0.15)' : 'var(--bg-card)',
                border: savedMemory ? '1px solid #06b6d4' : '1px solid var(--border-subtle)',
              }}
              onMouseEnter={e => { if (!savedMemory) e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { if (!savedMemory) e.currentTarget.style.color = 'var(--text-muted)'; }}
              title="Extract & save key points to Memory Cards"
            >
              {savedMemory ? <Check size={10} /> : <Brain size={10} />}
              {savedMemory ? 'Saved' : 'Remember'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
