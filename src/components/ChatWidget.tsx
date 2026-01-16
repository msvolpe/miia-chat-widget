import React, { useEffect, useMemo, useRef } from 'react';
import { ChatWidgetProps } from '../types';
import { ChatContext } from '../contexts/ChatContext';
import { useChat } from '../hooks/useChat';
import { useI18n } from '../hooks/useI18n';
import { FloatingWrapper } from './FloatingWrapper';
import { ChatContainer } from './ChatContainer';
import { generateId } from '../lib/utils';
import '../styles/globals.css';

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  mode = 'floating',
  position = 'bottom-right',
  apiEndpoint,
  apiKey,
  theme,
  welcomeMessage,
  placeholder,
  suggestedActions,
  botName,
  avatar,
  plugins,
  customHeaders,
  enableMarkdown = true,
  enableHistory = true,
  historyKey,
  demoMode = false,
  onMessageSent,
  onMessageReceived,
  onError,
  onOpen,
  onClose,
  locale = 'en',
  translations,
  maxHeight,
  maxWidth,
}) => {
  // Generate a unique instance ID for this widget instance
  const instanceIdRef = useRef<string | null>(null);
  
  // Generate unique history key if not provided
  // This ensures each widget instance has its own history
  const uniqueHistoryKey = useMemo(() => {
    if (historyKey) {
      return historyKey;
    }
    
    // Generate a unique ID for this instance if not already generated
    if (!instanceIdRef.current) {
      instanceIdRef.current = generateId();
    }
    
    // Create a key based on apiEndpoint (if available) and instance ID
    // This ensures different endpoints have different histories, and
    // multiple widgets on the same page have different histories
    const baseKey = apiEndpoint 
      ? `miia-chat-history-${btoa(apiEndpoint).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16)}`
      : 'miia-chat-history';
    
    return `${baseKey}-${instanceIdRef.current}`;
  }, [historyKey, apiEndpoint]);

  // Initialize chat hook
  const chatState = useChat({
    apiEndpoint,
    apiKey,
    customHeaders,
    plugins,
    onMessageSent,
    onMessageReceived,
    onError,
    demoMode: demoMode || !apiEndpoint,
    enableHistory,
    historyKey: uniqueHistoryKey,
  });

  // Initialize i18n
  const { t } = useI18n(locale, translations);

  // Apply theme dynamically
  useEffect(() => {
    if (theme) {
      const root = document.documentElement;
      
      if (theme.primaryColor) {
        // Convert hex to HSL for CSS variables
        root.style.setProperty('--primary', theme.primaryColor);
      }
      
      if (theme.backgroundColor) {
        root.style.setProperty('--background', theme.backgroundColor);
      }
      
      if (theme.accentColor) {
        root.style.setProperty('--accent', theme.accentColor);
      }
      
      if (theme.borderRadius) {
        root.style.setProperty('--radius', theme.borderRadius);
      }
      
      if (theme.fontFamily) {
        root.style.fontFamily = theme.fontFamily;
      }
    }
  }, [theme]);

  // Create context value
  const contextValue = useMemo(
    () => ({
      messages: chatState.messages,
      isLoading: chatState.isLoading,
      error: chatState.error,
      sendMessage: chatState.sendMessage,
      clearMessages: chatState.clearMessages,
      t,
      enableMarkdown,
    }),
    [chatState, t, enableMarkdown]
  );

  const chatContainerProps = {
    welcomeMessage,
    suggestedActions,
    botName,
    avatar,
    placeholder,
    maxHeight,
    maxWidth,
  };

  return (
    <ChatContext.Provider value={contextValue}>
      <div className="miia-chat-widget">
        {mode === 'floating' ? (
          <FloatingWrapper 
            position={position}
            onOpen={onOpen}
            onClose={onClose}
          >
            <ChatContainer {...chatContainerProps} />
          </FloatingWrapper>
        ) : (
          <ChatContainer {...chatContainerProps} />
        )}
      </div>
    </ChatContext.Provider>
  );
};
