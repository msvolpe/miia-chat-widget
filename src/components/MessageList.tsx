import React, { useEffect, useRef } from 'react';
import { ScrollArea } from './ui/scroll-area';
import { ChatMessage } from './ChatMessage';
import { ChatMessage as ChatMessageType } from '../types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface MessageListProps {
  messages: ChatMessageType[];
  welcomeMessage?: string;
  botName?: string;
  avatar?: string;
  enableMarkdown?: boolean;
  isLoading?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  welcomeMessage,
  botName,
  avatar,
  enableMarkdown,
  isLoading,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const showWelcome = welcomeMessage && messages.length === 0;

  return (
    <ScrollArea className="flex-1 px-4 py-3">
      <div ref={scrollRef} className="space-y-1">
        {showWelcome && (
          <div className="flex gap-3 mb-4 animate-fade-in">
            <Avatar className="w-8 h-8 flex-shrink-0">
              {avatar && <AvatarImage src={avatar} alt={botName} />}
              <AvatarFallback className="bg-gray-200 text-gray-700 text-xs">
                {botName?.[0]?.toUpperCase() || 'AI'}
              </AvatarFallback>
            </Avatar>
            <div className="bg-gray-100 text-gray-900 rounded-2xl rounded-bl-md px-4 py-2.5 max-w-[85%]">
              <p className="text-sm whitespace-pre-wrap m-0">{welcomeMessage}</p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            botName={botName}
            avatar={avatar}
            enableMarkdown={enableMarkdown}
          />
        ))}

        {isLoading && (
          <div className="flex gap-3 mb-4">
            <Avatar className="w-8 h-8 flex-shrink-0">
              {avatar && <AvatarImage src={avatar} alt={botName} />}
              <AvatarFallback className="bg-gray-200 text-gray-700 text-xs">
                {botName?.[0]?.toUpperCase() || 'AI'}
              </AvatarFallback>
            </Avatar>
            <div className="bg-gray-100 text-gray-900 rounded-2xl rounded-bl-md px-4 py-2.5">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
};
