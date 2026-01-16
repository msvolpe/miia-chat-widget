import { useState, useCallback, useRef, useEffect } from 'react';
import { ChatMessage, UseChatOptions } from '../types';
import { generateId } from '../lib/utils';
import { sendChatMessage, sendDemoMessage } from '../lib/api';
import { useChatHistory } from './useChatHistory';
import { PluginManager } from '../lib/plugin-manager';

export function useChat(options: UseChatOptions) {
  const {
    apiEndpoint,
    apiKey,
    customHeaders,
    plugins = [],
    onMessageSent,
    onMessageReceived,
    onError,
    demoMode = false,
    enableHistory = true,
    historyKey = 'miia-chat-history',
  } = options;

  const pluginManager = useRef(new PluginManager(plugins));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const { messages, setMessages, clearHistory: clearStoredHistory, isLoaded } = useChatHistory(
    historyKey,
    enableHistory
  );

  // Initialize plugins
  useEffect(() => {
    pluginManager.current = new PluginManager(plugins);
    pluginManager.current.init().catch(err => {
      console.error('Failed to initialize plugins:', err);
    });
  }, [plugins]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    setError(null);
    setIsLoading(true);

    try {
      // Run pre-send plugins
      let processedContent = content;
      try {
        processedContent = await pluginManager.current.beforeSend(content);
      } catch (err) {
        console.error('Plugin beforeSend error:', err);
      }

      // Add user message
      const userMessage: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: processedContent,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, userMessage]);
      
      // Call onMessageSent callback
      if (onMessageSent) {
        try {
          onMessageSent(processedContent);
        } catch (err) {
          console.error('onMessageSent callback error:', err);
        }
      }

      // Send to API or demo
      let assistantMessage: ChatMessage;
      
      if (demoMode || !apiEndpoint) {
        assistantMessage = await sendDemoMessage(processedContent);
      } else {
        assistantMessage = await sendChatMessage(processedContent, {
          apiEndpoint,
          apiKey,
          customHeaders,
        });
      }

      // Run post-receive plugins
      try {
        assistantMessage = await pluginManager.current.afterReceive(assistantMessage);
      } catch (err) {
        console.error('Plugin afterReceive error:', err);
      }

      // Add assistant message
      setMessages(prev => [...prev, assistantMessage]);

      // Call onMessageReceived callback
      if (onMessageReceived) {
        try {
          onMessageReceived(assistantMessage);
        } catch (err) {
          console.error('onMessageReceived callback error:', err);
        }
      }

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to send message');
      setError(error);
      
      // Notify plugins of error
      pluginManager.current.onError(error);
      
      // Call onError callback
      if (onError) {
        try {
          onError(error);
        } catch (callbackErr) {
          console.error('onError callback error:', callbackErr);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [
    isLoading,
    demoMode,
    apiEndpoint,
    apiKey,
    customHeaders,
    onMessageSent,
    onMessageReceived,
    onError,
    setMessages,
  ]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    clearStoredHistory();
    setError(null);
  }, [setMessages, clearStoredHistory]);

  const retryLastMessage = useCallback(async () => {
    if (messages.length === 0 || isLoading) return;
    
    // Find the last user message
    const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user');
    
    if (lastUserMessage) {
      // Remove messages after the last user message
      const lastUserIndex = messages.findIndex(msg => msg.id === lastUserMessage.id);
      setMessages(messages.slice(0, lastUserIndex + 1));
      
      // Resend
      await sendMessage(lastUserMessage.content);
    }
  }, [messages, isLoading, sendMessage, setMessages]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    retryLastMessage,
    isHistoryLoaded: isLoaded,
  };
}
