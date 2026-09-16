import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, User, Bot, Sparkles, Volume2, VolumeX } from 'lucide-react';
import toast from 'react-hot-toast';


const CodeBlock = ({ language, children }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
    setCopied(true);
    toast.success('Code copied!', { duration: 1500 });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block-wrapper my-2">
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
          padding: '14px',
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
              background: 'rgba(124,58,237,0.25)',
              color: '#c4b5fd',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '12px',
              fontFamily: 'monospace',
            }}
          >
            {children}
          </code>
        );
      },
      p: ({ children }) => <p className="mb-2 leading-relaxed text-sm">{children}</p>,
      ul: ({ children }) => <ul className="pl-5 mb-2 list-disc text-sm">{children}</ul>,
      ol: ({ children }) => <ol className="pl-5 mb-2 list-decimal text-sm">{children}</ol>,
      li: ({ children }) => <li className="mb-1">{children}</li>,
      strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
      table: ({ children }) => (
        <div className="overflow-x-auto my-2">
          <table className="w-full text-xs border-collapse">{children}</table>
        </div>
      ),
      th: ({ children }) => (
        <th className="p-2 text-left bg-white/10 border border-white/10 font-semibold">{children}</th>
      ),
      td: ({ children }) => (
        <td className="p-2 border border-white/5 text-gray-300">{children}</td>
      ),
    }}
  >
    {text}
  </ReactMarkdown>
);

const RoomMessageBubble = ({ message, currentUserId, onSpeak, isSpeakingMessage }) => {
  const [copied, setCopied] = useState(false);
  const isMe = message.user?._id === currentUserId;
  const isAi = message.isAi;

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    toast.success('Copied to clipboard!', { duration: 1500 });
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedTime = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div
      className={`group flex items-start gap-3.5 p-3 rounded-2xl transition-colors duration-150 ${
        isAi
          ? 'bg-purple-950/20 border border-purple-500/20 shadow-sm'
          : 'hover:bg-white/[0.03] border border-transparent'
      }`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 mt-0.5">
        {isAi ? (
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md shadow-purple-500/20"
            style={{ background: 'var(--gradient-brand)' }}
          >
            <Sparkles size={16} />
          </div>
        ) : message.user?.picture ? (
          <img
            src={message.user.picture}
            alt={message.user.name}
            className="w-9 h-9 rounded-xl object-cover border border-white/10"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-gray-400 border border-white/10">
            <User size={16} />
          </div>
        )}
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        {/* Header (Author, Badge, Timestamp, Actions) */}
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="font-semibold text-sm text-white">
            {message.user?.name || (isAi ? 'Astra AI' : 'Member')}
          </span>

          {isAi && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
              <Bot size={10} /> AI BOT
            </span>
          )}

          {isMe && !isAi && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-cyan-500/15 text-cyan-300 border border-cyan-500/25">
              YOU
            </span>
          )}

          <span className="text-[11px] text-gray-500">{formattedTime}</span>

          {/* Action buttons */}
          <div className="opacity-0 group-hover:opacity-100 ml-auto flex items-center gap-1 transition-opacity">
            {isAi && onSpeak && (
              <button
                onClick={() => onSpeak(message.text)}
                className={`p-1 rounded text-xs flex items-center gap-1 transition-colors ${
                  isSpeakingMessage ? 'text-purple-400 bg-purple-500/20' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                }`}
                title={isSpeakingMessage ? 'Stop speaking' : 'Listen to AI'}
              >
                {isSpeakingMessage ? <VolumeX size={12} /> : <Volume2 size={12} />}
              </button>
            )}

            <button
              onClick={handleCopy}
              className="text-gray-500 hover:text-gray-300 p-1 rounded hover:bg-white/5"
              title="Copy message"
            >
              {copied ? <Check size={12} className="text-cyan-400" /> : <Copy size={12} />}
            </button>
          </div>
        </div>

        {/* Text Body */}
        <div className="text-gray-200">
          <MarkdownContent text={message.text} />
        </div>
      </div>
    </div>
  );
};

export default RoomMessageBubble;
