# Miia Chat Widget

A professional, customizable React chat widget component for embedding AI chat interfaces in your web applications.

[![npm version](https://img.shields.io/npm/v/miia-chat-widget.svg)](https://www.npmjs.com/package/miia-chat-widget)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## Features

- 🎨 **Beautiful UI** - Modern, polished design inspired by Miia
- 🔄 **Dual Modes** - Floating button or embedded chat
- 🌍 **i18n Support** - Built-in support for 5 languages (EN, ES, FR, DE, PT)
- 📝 **Markdown Rendering** - Full markdown support for rich messages
- 💾 **Chat History** - Automatic persistence via localStorage with unique keys per instance
- 🔌 **Plugin System** - Extensible architecture for custom functionality
- 🎭 **Fully Customizable** - Theme colors, avatars, messages, and more
- 📱 **Responsive** - Works perfectly on mobile and desktop
- ⚡ **TypeScript** - Fully typed for excellent DX
- 🎯 **Demo Mode** - Test without backend integration
- 🛡️ **CSS Isolation** - Styles are scoped to prevent conflicts with host applications

## Installation

```bash
npm install miia-chat-widget
```

or

```bash
yarn add miia-chat-widget
```

or

```bash
pnpm add miia-chat-widget
```

## Quick Start

```tsx
import { ChatWidget } from 'miia-chat-widget';
import 'miia-chat-widget/dist/style.css';

function App() {
  return (
    <ChatWidget
      apiEndpoint="https://api.example.com/chat"
      apiKey="your-api-key"
      welcomeMessage="👋 Hi! How can I help you today?"
      suggestedActions={[
        'What is your product?',
        'Show me pricing',
        'Contact support',
      ]}
      botName="Support Bot"
      theme={{
        primaryColor: '#000000',
        accentColor: '#3b82f6',
      }}
    />
  );
}
```

## Display Modes

### Floating Mode (Default)

A floating button appears in the corner of your page. Click to open/close the chat.

```tsx
<ChatWidget
  mode="floating"
  position="bottom-right" // or "bottom-left", "top-right", "top-left"
  apiEndpoint="https://api.example.com/chat"
/>
```

### Embedded Mode

The chat is always visible and fills its container.

```tsx
<div style={{ width: '400px', height: '600px' }}>
  <ChatWidget
    mode="embedded"
    apiEndpoint="https://api.example.com/chat"
  />
</div>
```

## Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `'floating' \| 'embedded'` | `'floating'` | Display mode |
| `position` | `FloatingPosition` | `'bottom-right'` | Position for floating mode |
| `apiEndpoint` | `string` | - | Your chat API endpoint |
| `apiKey` | `string` | - | API authentication key |
| `theme` | `ChatWidgetTheme` | - | Custom theme colors |
| `welcomeMessage` | `string` | - | Initial bot message |
| `placeholder` | `string` | `'Message...'` | Input placeholder text |
| `suggestedActions` | `string[]` | `[]` | Quick action buttons |
| `botName` | `string` | `'Miia AI Agent'` | Bot display name |
| `avatar` | `string` | - | Bot avatar URL |
| `plugins` | `ChatPlugin[]` | `[]` | Custom plugins |
| `customHeaders` | `Record<string, string>` | - | Additional API headers |
| `enableMarkdown` | `boolean` | `true` | Enable markdown rendering |
| `enableHistory` | `boolean` | `true` | Persist chat history |
| `historyKey` | `string` | `auto-generated` | localStorage key for history. If not provided, a unique key is automatically generated per widget instance |
| `demoMode` | `boolean` | `false` | Use simulated responses |
| `onMessageSent` | `(message: string) => void` | - | Callback when user sends message |
| `onMessageReceived` | `(response: ChatMessage) => void` | - | Callback when bot responds |
| `onError` | `(error: Error) => void` | - | Error callback |
| `onOpen` | `() => void` | - | Callback when chat opens (floating mode) |
| `onClose` | `() => void` | - | Callback when chat closes (floating mode) |
| `locale` | `string` | `'en'` | Language code |
| `translations` | `LocaleData` | - | Custom translations |
| `maxHeight` | `string` | `'600px'` | Maximum height |
| `maxWidth` | `string` | `'384px'` | Maximum width |

## Theming

Customize the appearance to match your brand:

```tsx
<ChatWidget
  theme={{
    primaryColor: '#7c3aed',      // Purple
    backgroundColor: '#ffffff',    // White
    accentColor: '#f59e0b',       // Amber
    borderRadius: '12px',          // Rounded corners
    fontFamily: 'Inter, sans-serif'
  }}
/>
```

## Plugin System

Extend functionality with plugins:

```tsx
import { ChatPlugin } from 'miia-chat-widget';

// Profanity filter plugin
const profanityFilter: ChatPlugin = {
  name: 'profanity-filter',
  onBeforeMessageSent: async (message) => {
    return message.replace(/badword/gi, '***');
  },
};

// Analytics plugin
const analytics: ChatPlugin = {
  name: 'analytics',
  onInit: async () => {
    console.log('Analytics initialized');
  },
  onAfterMessageReceived: async (response) => {
    // Track bot response
    trackEvent('bot_response', { messageId: response.id });
    return response;
  },
  onError: (error) => {
    // Track errors
    trackError(error);
  },
};

// Use plugins
<ChatWidget
  plugins={[profanityFilter, analytics]}
  apiEndpoint="https://api.example.com/chat"
/>
```

### Plugin Interface

```typescript
interface ChatPlugin {
  name: string;
  onInit?: () => void | Promise<void>;
  onBeforeMessageSent?: (message: string) => string | Promise<string>;
  onAfterMessageReceived?: (response: ChatMessage) => ChatMessage | Promise<ChatMessage>;
  onError?: (error: Error) => void;
}
```

## Internationalization (i18n)

Built-in support for multiple languages:

```tsx
// Use a built-in language
<ChatWidget locale="es" />  // Spanish
<ChatWidget locale="fr" />  // French
<ChatWidget locale="de" />  // German
<ChatWidget locale="pt" />  // Portuguese

// Add custom translations
<ChatWidget
  locale="es"
  translations={{
    es: {
      placeholder: 'Escribe un mensaje...',
      send: 'Enviar',
      poweredBy: 'Desarrollado por',
    },
  }}
/>
```

### Supported Languages

- English (`en`) - Default
- Spanish (`es`)
- French (`fr`)
- German (`de`)
- Portuguese (`pt`)

## API Integration

Your API endpoint should accept POST requests with this format:

**Request:**
```json
{
  "message": "User's message text"
}
```

**Response:**
```json
{
  "message": "Bot's response text",
  // Alternative keys: "response", "content", "text"
}
```

### Example Backend (Node.js/Express)

```javascript
app.post('/chat', async (req, res) => {
  const { message } = req.body;
  
  // Process with your AI/backend
  const response = await processMessage(message);
  
  res.json({
    message: response,
  });
});
```

## Demo Mode

Test the widget without a backend:

```tsx
<ChatWidget
  demoMode={true}
  welcomeMessage="👋 Hi! I'm in demo mode."
  suggestedActions={['Tell me a joke', 'What can you do?']}
/>
```

Demo mode automatically activates if no `apiEndpoint` is provided.

## Chat History

History is automatically saved to `localStorage` and restored on page reload. Each widget instance automatically gets a unique storage key to prevent conflicts:

```tsx
<ChatWidget
  enableHistory={true}
  // historyKey is auto-generated if not provided
  // Format: "miia-chat-history-{endpoint-hash}-{instance-id}"
/>
```

### Custom History Key

If you want to share history between instances or use a custom key:

```tsx
<ChatWidget
  enableHistory={true}
  historyKey="my-custom-key"  // Custom storage key
/>
```

### Disable History

```tsx
<ChatWidget
  enableHistory={false}  // Disable history persistence
/>
```

**Note**: When `historyKey` is not provided, each widget instance automatically generates a unique key based on the `apiEndpoint` (if available) and a unique instance ID. This ensures that multiple widgets on the same page or different sites don't share chat history.

## Markdown Support

Messages support full markdown syntax:

- **Bold**, *italic*, ~~strikethrough~~
- Links: [text](url)
- Lists (ordered and unordered)
- Code blocks
- Blockquotes
- Headings

```tsx
<ChatWidget
  enableMarkdown={true}
  demoMode={true}
/>

// Bot can respond with:
// "Here's some **bold text** and a [link](https://example.com)"
```

## Advanced Examples

### Custom Event Handling

```tsx
<ChatWidget
  apiEndpoint="https://api.example.com/chat"
  onMessageSent={(message) => {
    console.log('User sent:', message);
    // Send to analytics, etc.
  }}
  onMessageReceived={(response) => {
    console.log('Bot responded:', response);
    // Process response
  }}
  onError={(error) => {
    console.error('Chat error:', error);
    // Show notification
  }}
  onOpen={() => console.log('Chat opened')}
  onClose={() => console.log('Chat closed')}
/>
```

### Multiple Languages with Dynamic Switching

```tsx
function MultiLingualChat() {
  const [locale, setLocale] = useState('en');

  return (
    <>
      <select onChange={(e) => setLocale(e.target.value)}>
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="fr">Français</option>
      </select>

      <ChatWidget
        locale={locale}
        apiEndpoint="https://api.example.com/chat"
      />
    </>
  );
}
```

### Integration with Authentication

```tsx
<ChatWidget
  apiEndpoint="https://api.example.com/chat"
  customHeaders={{
    'Authorization': `Bearer ${userToken}`,
    'X-User-ID': userId,
  }}
/>
```

### Custom Welcome Message with User Data

```tsx
<ChatWidget
  welcomeMessage={`👋 Welcome back, ${userName}! How can I help you today?`}
  apiEndpoint="https://api.example.com/chat"
/>
```

## TypeScript

Full TypeScript support with comprehensive type definitions:

```typescript
import { 
  ChatWidget, 
  ChatWidgetProps, 
  ChatMessage, 
  ChatPlugin,
  ChatWidgetTheme,
  DisplayMode,
  FloatingPosition 
} from 'miia-chat-widget';

const config: ChatWidgetProps = {
  mode: 'floating',
  apiEndpoint: 'https://api.example.com/chat',
  theme: {
    primaryColor: '#000000',
  },
};

<ChatWidget {...config} />
```

## Development

To run the development environment:

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Type check
npm run type-check

# Lint
npm run lint
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## CSS Isolation & Style Safety

The widget uses **scoped CSS** to ensure it doesn't conflict with your application's styles:

- ✅ Tailwind CSS reset/base styles are scoped to `.miia-chat-widget` container
- ✅ Safe to use even if your app uses Tailwind CSS
- ✅ No style conflicts with host application
- ✅ All widget styles are self-contained

The widget automatically wraps itself in a `.miia-chat-widget` container, ensuring complete style isolation.

## Troubleshooting

### Widget not appearing

Make sure to import the CSS:
```tsx
import 'miia-chat-widget/dist/style.css';
```

### TypeScript errors

Ensure you have `@types/react` and `@types/react-dom` installed:
```bash
npm install -D @types/react @types/react-dom
```

### Styles not applying

The widget includes all necessary styles in its CSS bundle. Styles are automatically scoped to the `.miia-chat-widget` container to prevent conflicts with your application's styles.

**CSS Isolation**: The widget uses scoped Tailwind CSS preflight, meaning its reset/base styles only apply within the widget container and won't affect your host application. This ensures safe integration even if your app uses Tailwind CSS.

### API not connecting

1. Check CORS settings on your API
2. Verify `apiEndpoint` URL is correct
3. Check browser console for error messages
4. Use `demoMode={true}` to test without API

### History not persisting

- Check if localStorage is available in your browser
- Each widget instance automatically gets a unique `historyKey` if not explicitly provided
- If you have multiple widgets and want them to share history, provide the same `historyKey` explicitly
- Check browser privacy settings (some browsers block localStorage in private mode)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [Your Name]

## Support

- 📧 Email: support@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourname/miia-chat-widget/issues)
- 📚 Documentation: [Full Docs](https://miia-chat-widget.com)

## Acknowledgments

Built with:
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Radix UI
- React Markdown

---

Made with ❤️ by [Your Name]
