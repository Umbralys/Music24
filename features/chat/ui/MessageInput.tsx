'use client';

import { useState, FormEvent, useRef, useEffect, KeyboardEvent } from 'react';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSendMessage, disabled }: MessageInputProps) {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize the textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 160)}px`;
    }
  }, [content]);

  const sendMessage = () => {
    if (content.trim() && !disabled) {
      onSendMessage(content.trim());
      setContent('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto w-full">
      <div className="relative flex items-end gap-2 bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-[26px] p-2 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500/50 focus-within:bg-zinc-800 transition-all shadow-sm">
        
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={disabled}
          rows={1}
          // Added 'focus:outline-none' here to remove the inner white box
          className="w-full bg-transparent border-none text-gray-100 placeholder:text-zinc-500 text-sm focus:ring-0 focus:outline-none resize-none overflow-hidden no-scrollbar py-3 px-4 min-h-[44px]"
          style={{ height: 'auto' }}
        />

        <div className="flex-shrink-0 pb-1 pr-1">
          <button
            type="submit"
            disabled={!content.trim() || disabled}
            className="p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white rounded-full transition-all duration-200 transform active:scale-95 shadow-md hover:shadow-blue-500/20 flex items-center justify-center mb-0.5"
            aria-label="Send message"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="w-4 h-4 translate-x-0.5 translate-y-px"
            >
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
}
