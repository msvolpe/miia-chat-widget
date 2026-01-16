import React, { useMemo } from 'react';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { SuggestedActions } from './SuggestedActions';
import { ChatInput } from './ChatInput';
import { ChatFooter } from './ChatFooter';
import { useChatContext } from '../contexts/ChatContext';
import { cn } from '@/lib/utils';

interface ChatContainerProps {
  welcomeMessage?: string;
  suggestedActions?: string[];
  botName?: string;
  avatar?: string;
  placeholder?: string;
  maxHeight?: string;
  maxWidth?: string;
  className?: string;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  welcomeMessage,
  suggestedActions = [],
  botName,
  avatar,
  placeholder,
  maxHeight = '600px',
  maxWidth = '384px',
  className,
}) => {
  const { messages, isLoading, sendMessage, t, enableMarkdown } = useChatContext();

  // Show suggested actions only when there are no user messages yet
  const showSuggestedActions = useMemo(() => {
    return messages.filter(msg => msg.role === 'user').length === 0;
  }, [messages]);

  const handleActionClick = (action: string) => {
    sendMessage(action);
  };

  return (
    <div
      className={cn(
        'flex flex-col bg-white rounded-lg shadow-xl overflow-hidden',
        className
      )}
      style={{ 
        maxHeight,
        maxWidth,
        width: '100%',
        height: '100%'
      }}
    >
      <ChatHeader
        botName={botName}
        avatar={avatar}
      />

      <MessageList
        messages={messages}
        welcomeMessage={welcomeMessage}
        botName={botName}
        avatar={avatar}
        enableMarkdown={enableMarkdown}
        isLoading={isLoading}
      />

      <SuggestedActions
        actions={suggestedActions}
        onActionClick={handleActionClick}
        visible={showSuggestedActions}
      />

      <ChatInput
        onSendMessage={sendMessage}
        placeholder={placeholder || t('placeholder')}
        isLoading={isLoading}
      />

      <ChatFooter
        botName={botName}
        poweredByText={t('poweredBy')}
      />
    </div>
  );
};
