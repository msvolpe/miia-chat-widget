import { createContext, useContext } from 'react';
import { ChatContextValue } from '../types';

export const ChatContext = createContext<ChatContextValue | null>(null);

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within ChatContext.Provider');
  }
  return context;
}
