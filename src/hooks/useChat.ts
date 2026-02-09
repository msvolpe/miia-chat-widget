import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { ChatMessage, UseChatOptions } from '../types';
import { generateId, getOrCreateSessionId } from '../lib/utils';
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
    sessionId: providedSessionId,
    timeout,
  } = options;

  const pluginManager = useRef(new PluginManager(plugins));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const { messages, setMessages, clearHistory: clearStoredHistory, isLoaded } = useChatHistory(
    historyKey,
    enableHistory
  );

  // Get or create a unique session ID that persists across page reloads
  // Use provided sessionId if available, otherwise generate/retrieve from localStorage
  const sessionId = useMemo(() => {
    if (providedSessionId) {
      return providedSessionId;
    }
    
    const storageKey = apiEndpoint 
      ? `miia-chat-session-${btoa(apiEndpoint).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16)}`
      : 'miia-chat-session-id';
    return getOrCreateSessionId(storageKey);
  }, [apiEndpoint, providedSessionId]);

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
        try {
          assistantMessage = await sendChatMessage(processedContent, {
            apiEndpoint,
            apiKey,
            customHeaders,
            sessionId,
            timeout,
          });
        } catch (err) {
          // Silently handle errors - sendChatMessage now returns a fallback message
          // instead of throwing, but we catch here just in case
          assistantMessage = {
            id: generateId(),
            role: 'assistant',
            content: 'Unable to connect to the server. Please check your connection and try again.',
            timestamp: Date.now(),
            metadata: { error: true },
          };
        }
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
      // Silently handle errors - don't set error state or show errors to user
      // The API function now returns fallback messages instead of throwing
      const error = err instanceof Error ? err : new Error('Failed to send message');
      
      // Still notify plugins and callbacks for logging/debugging purposes
      // but don't display errors to the user
      pluginManager.current.onError(error);
      
      if (onError) {
        try {
          onError(error);
        } catch (callbackErr) {
          console.error('onError callback error:', callbackErr);
        }
      }
      
      // Add a fallback message instead of showing error
      const fallbackMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: 'Unable to process your request. Please try again.',
        timestamp: Date.now(),
        metadata: { error: true },
      };
      setMessages(prev => [...prev, fallbackMessage]);
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
