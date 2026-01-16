import { useState, useEffect } from 'react';
import { ChatMessage } from '../types';

export function useChatHistory(key: string, enabled: boolean) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (enabled && !isLoaded) {
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setMessages(parsed);
          }
        }
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
      setIsLoaded(true);
    }
  }, [key, enabled, isLoaded]);

  // Save to localStorage when messages change
  useEffect(() => {
    if (enabled && isLoaded && messages.length > 0) {
      try {
        localStorage.setItem(key, JSON.stringify(messages));
      } catch (error) {
        console.error('Failed to save chat history:', error);
      }
    }
  }, [messages, key, enabled, isLoaded]);

  const clearHistory = () => {
    try {
      localStorage.removeItem(key);
      setMessages([]);
    } catch (error) {
      console.error('Failed to clear chat history:', error);
    }
  };

  return { 
    messages, 
    setMessages, 
    clearHistory,
    isLoaded 
  };
}
