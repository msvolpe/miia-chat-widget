import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage as ChatMessageType } from '../types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: ChatMessageType;
  botName?: string;
  avatar?: string;
  enableMarkdown?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  botName = 'AI',
  avatar,
  enableMarkdown = false,
}) => {
  const { role, content } = message;
  const isUser = role === 'user';

  return (
    <div
      className={cn(
        'flex gap-3 mb-4 animate-fade-in',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {!isUser && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          {avatar && <AvatarImage src={avatar} alt={botName} />}
          <AvatarFallback className="bg-gray-200 text-gray-700 text-xs">
            {botName[0]?.toUpperCase() || 'AI'}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div
        className={cn(
          'rounded-2xl px-4 py-2.5 max-w-[85%] break-words',
          isUser
            ? 'bg-black text-white rounded-br-md'
            : 'bg-gray-100 text-gray-900 rounded-bl-md'
        )}
      >
        {enableMarkdown ? (
          <div className={cn(
            'text-sm',
            'prose prose-sm max-w-none',
            isUser ? 'prose-invert' : '',
            // Custom markdown styles
            '[&>*]:my-2 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0',
            '[&_p]:leading-relaxed',
            '[&_a]:text-blue-600 hover:[&_a]:text-blue-800 [&_a]:underline',
            '[&_code]:bg-black/10 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs',
            '[&_pre]:bg-black/10 [&_pre]:p-2 [&_pre]:rounded [&_pre]:overflow-x-auto',
            '[&_ul]:list-disc [&_ul]:pl-4',
            '[&_ol]:list-decimal [&_ol]:pl-4',
            '[&_li]:my-1',
            '[&_h1]:text-lg [&_h1]:font-bold',
            '[&_h2]:text-base [&_h2]:font-bold',
            '[&_h3]:text-sm [&_h3]:font-bold',
            '[&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-3 [&_blockquote]:italic'
          )}>
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <p className="text-sm whitespace-pre-wrap m-0">{content}</p>
        )}
      </div>
    </div>
  );
};
