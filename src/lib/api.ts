import { ChatMessage } from '../types';
import { generateId } from './utils';

export interface SendMessageOptions {
  apiEndpoint: string;
  apiKey?: string;
  customHeaders?: Record<string, string>;
  sessionId?: string;
  timeout?: number; // Timeout in milliseconds (default: 60000 = 60 seconds)
}

export const sendChatMessage = async (
  message: string,
  options: SendMessageOptions
): Promise<ChatMessage> => {
  // Build headers object
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.apiKey && { 'Authorization': `Bearer ${options.apiKey}` }),
    ...options.customHeaders,
  };

  // Try multiple CORS strategies
  const strategies = [
    // Strategy 1: Standard CORS with credentials omitted
    {
      mode: 'cors' as RequestMode,
      credentials: 'omit' as RequestCredentials,
      headers,
    },
    // Strategy 2: CORS without custom headers (if they cause issues)
    {
      mode: 'cors' as RequestMode,
      credentials: 'omit' as RequestCredentials,
      headers: {
        'Content-Type': 'application/json',
        ...(options.apiKey && { 'Authorization': `Bearer ${options.apiKey}` }),
      },
    },
  ];

  let lastError: Error | null = null;

  // Build request body with message and sessionId
  const requestBody: { message: string; sessionId?: string } = { message };
  if (options.sessionId) {
    requestBody.sessionId = options.sessionId;
  }

  // Set timeout (default: 60 seconds for LLM processing)
  const timeout = options.timeout ?? 60000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    for (const strategy of strategies) {
      try {
        const response = await fetch(options.apiEndpoint, {
          method: 'POST',
          mode: strategy.mode,
          credentials: strategy.credentials,
          headers: strategy.headers,
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        });
        
        // Clear timeout on successful response
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          // If it's a CORS error, try next strategy
          if (response.status === 0 || response.type === 'opaque') {
            lastError = new Error('CORS error');
            continue;
          }
          // For other HTTP errors, try to parse response
          try {
            const errorData = await response.json();
            throw new Error(errorData.message || `API error: ${response.status}`);
          } catch {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
          }
        }
        
        const data = await response.json();
        
        return {
          id: generateId(),
          role: 'assistant',
          content: data.message || data.response || data.content || data.text || 'No response from API',
          timestamp: Date.now(),
          metadata: data,
        };
      } catch (error) {
        // Handle timeout/abort errors
        if (error instanceof Error && error.name === 'AbortError') {
          clearTimeout(timeoutId);
          lastError = new Error(`Request timeout after ${timeout}ms. The server took too long to respond.`);
          // Don't try next strategy on timeout
          break;
        }
        
        // If it's a network/CORS error, try next strategy (timeout continues)
        if (error instanceof TypeError && error.message.includes('fetch')) {
          lastError = error as Error;
          continue;
        }
        // If it's a CORS-related error, try next strategy (timeout continues)
        if (error instanceof Error && (
          error.message.includes('CORS') || 
          error.message.includes('cross-origin') ||
          error.message.includes('network')
        )) {
          lastError = error;
          continue;
        }
        // For other errors, clear timeout and throw immediately
        clearTimeout(timeoutId);
        throw error;
      }
    }
  } finally {
    // Ensure timeout is always cleared
    clearTimeout(timeoutId);
  }

  // If all strategies failed, return a fallback response instead of throwing
  // This prevents error display while still allowing the UI to function
  return {
    id: generateId(),
    role: 'assistant',
    content: 'Unable to connect to the server. Please check your connection and try again.',
    timestamp: Date.now(),
    metadata: { error: true, originalError: lastError?.message },
  };
};

// Demo mode responses
const demoResponses = [
  "I'm a demo response! Connect a real API endpoint to see live responses.",
  "This is a simulated answer to help you test the widget. You can configure your own API endpoint via the `apiEndpoint` prop.",
  "Hello! I'm responding in demo mode. This allows you to test the chat interface without setting up an API.",
  "Demo mode is perfect for development and testing. When you're ready, just provide your API endpoint!",
  "I can help you with various tasks. In production, I would be connected to your AI backend.",
  "This is an automated response. Replace with your own API to get real AI-powered responses!",
];

export const sendDemoMessage = async (message: string): Promise<ChatMessage> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
  
  // Pick a random response or create a contextual one
  let content = demoResponses[Math.floor(Math.random() * demoResponses.length)];
  
  // Add some context-aware responses
  if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
    content = "Hello! I'm running in demo mode. How can I help you today?";
  } else if (message.toLowerCase().includes('help')) {
    content = "I'm here to help! In demo mode, I can show you how the chat interface works. Connect a real API to get actual AI responses.";
  } else if (message.toLowerCase().includes('api') || message.toLowerCase().includes('endpoint')) {
    content = "To connect to a real API, pass the `apiEndpoint` prop to the ChatWidget component along with your `apiKey` if needed.";
  }
  
  return {
    id: generateId(),
    role: 'assistant',
    content,
    timestamp: Date.now(),
    metadata: { demoMode: true },
  };
};
