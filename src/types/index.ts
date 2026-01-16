export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface ChatWidgetTheme {
  primaryColor?: string;
  backgroundColor?: string;
  accentColor?: string;
  borderRadius?: string;
  fontFamily?: string;
}

export interface ChatPlugin {
  name: string;
  onInit?: () => void | Promise<void>;
  onBeforeMessageSent?: (message: string) => string | Promise<string>;
  onAfterMessageReceived?: (response: ChatMessage) => ChatMessage | Promise<ChatMessage>;
  onError?: (error: Error) => void;
}

export type DisplayMode = 'floating' | 'embedded';
export type FloatingPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

export interface ChatWidgetProps {
  // Core
  mode?: DisplayMode;
  apiEndpoint?: string;
  apiKey?: string;
  
  // Appearance
  theme?: ChatWidgetTheme;
  position?: FloatingPosition;
  maxHeight?: string;
  maxWidth?: string;
  
  // Content
  welcomeMessage?: string;
  placeholder?: string;
  suggestedActions?: string[];
  botName?: string;
  avatar?: string;
  
  // Behavior
  plugins?: ChatPlugin[];
  customHeaders?: Record<string, string>;
  enableMarkdown?: boolean;
  enableHistory?: boolean;
  historyKey?: string;
  demoMode?: boolean;
  
  // Callbacks
  onMessageSent?: (message: string) => void;
  onMessageReceived?: (response: ChatMessage) => void;
  onError?: (error: Error) => void;
  onOpen?: () => void;
  onClose?: () => void;
  
  // i18n
  locale?: string;
  translations?: Record<string, Record<string, string>>;
}

export interface UseChatOptions {
  apiEndpoint?: string;
  apiKey?: string;
  customHeaders?: Record<string, string>;
  plugins?: ChatPlugin[];
  onMessageSent?: (message: string) => void;
  onMessageReceived?: (response: ChatMessage) => void;
  onError?: (error: Error) => void;
  demoMode?: boolean;
  enableHistory?: boolean;
  historyKey?: string;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: Error | null;
}

export interface ChatContextValue {
  messages: ChatMessage[];
  isLoading: boolean;
  error: Error | null;
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
  t: (key: string) => string;
  enableMarkdown: boolean;
}
