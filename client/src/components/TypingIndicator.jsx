import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex justify-start items-end gap-3 message-enter">
      {/* AI Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
        style={{ background: 'var(--gradient-brand)' }}>
        A
      </div>

      {/* Bubble */}
      <div
        className="px-5 py-4 rounded-[20px] rounded-bl-sm flex items-center gap-2"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-default)',
        }}
      >
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  );
};

export default TypingIndicator;
