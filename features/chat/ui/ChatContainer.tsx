import { ReactNode } from 'react';

interface ChatContainerProps {
  header: ReactNode;
  messages: ReactNode;
  input: ReactNode;
}

export function ChatContainer({ header, messages, input }: ChatContainerProps) {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)]">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-4 mb-4">{header}</div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto mb-4 px-1">
        {messages}
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-[var(--background)] pt-4 border-t border-zinc-800">
        {input}
      </div>
    </div>
  );
}
