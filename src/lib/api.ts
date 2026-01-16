import { ChatMessage } from '../types';
import { generateId } from './utils';

export interface SendMessageOptions {
  apiEndpoint: string;
  apiKey?: string;
  customHeaders?: Record<string, string>;
}

export const sendChatMessage = async (
  message: string,
  options: SendMessageOptions
): Promise<ChatMessage> => {
  const response = await fetch(options.apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(options.apiKey && { 'Authorization': `Bearer ${options.apiKey}` }),
      ...options.customHeaders,
    },
    body: JSON.stringify({ message }),
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  
  return {
    id: generateId(),
    role: 'assistant',
    content: data.message || data.response || data.content || data.text || 'No response from API',
    timestamp: Date.now(),
    metadata: data,
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
