import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // Less than 1 minute
  if (diff < 60000) {
    return 'Just now';
  }
  
  // Less than 1 hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes}m ago`;
  }
  
  // Less than 24 hours
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours}h ago`;
  }
  
  // Show time
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
}

/**
 * Gets or creates a unique session ID that persists in localStorage.
 * The session ID is used to maintain conversation history on the server.
 * 
 * @param storageKey - Optional custom key for localStorage. Defaults to 'miia-chat-session-id'
 * @returns A unique session ID string
 */
export function getOrCreateSessionId(storageKey: string = 'miia-chat-session-id'): string {
  // Check if we're in a browser environment
  if (typeof window === 'undefined' || !window.localStorage) {
    // Fallback for SSR or non-browser environments
    return generateId();
  }

  try {
    // Try to get existing session ID from localStorage
    const existingSessionId = localStorage.getItem(storageKey);
    
    if (existingSessionId) {
      return existingSessionId;
    }
    
    // Generate a new session ID
    const newSessionId = generateId();
    
    // Store it in localStorage
    localStorage.setItem(storageKey, newSessionId);
    
    return newSessionId;
  } catch (error) {
    // If localStorage is not available (e.g., private browsing), generate a new ID
    console.warn('Failed to access localStorage, generating new session ID:', error);
    return generateId();
  }
}
