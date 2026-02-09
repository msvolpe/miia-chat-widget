export { ChatWidget } from './components/ChatWidget';

export type {
  ChatWidgetProps,
  ChatMessage,
  ChatPlugin,
  ChatWidgetTheme,
  DisplayMode,
  FloatingPosition,
  UseChatOptions,
  ChatState,
} from './types';

export { PluginManager } from './lib/plugin-manager';

// Utility exports for advanced users
export { generateId, formatTimestamp, cn, getOrCreateSessionId } from './lib/utils';
