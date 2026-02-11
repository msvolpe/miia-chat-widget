import { useState } from 'react';
import { ChatWidget } from '../components/ChatWidget';
import { ChatPlugin } from '../types';

// Example plugin: Profanity filter
const profanityFilterPlugin: ChatPlugin = {
  name: 'profanity-filter',
  onBeforeMessageSent: async (message) => {
    // Simple example - replace bad words
    return message.replace(/badword/gi, '***');
  },
};

// Example plugin: Analytics
const analyticsPlugin: ChatPlugin = {
  name: 'analytics',
  onInit: async () => {
    console.log('Analytics plugin initialized');
  },
  onAfterMessageReceived: async (response) => {
    console.log('Message received:', response);
    return response;
  },
};

function App() {
  const [mode, setMode] = useState<'floating' | 'embedded'>('floating');
  const [locale, setLocale] = useState<string>('en');
  const [customSessionId, setCustomSessionId] = useState<string>('');
  const [showSessionId, setShowSessionId] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Miia Chat Widget</h1>
          <p className="text-sm text-gray-600 mt-1">Development & Testing Environment</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Configuration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Mode
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as 'floating' | 'embedded')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="floating">Floating</option>
                <option value="embedded">Embedded</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="pt">Português</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showSessionId}
                onChange={(e) => setShowSessionId(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">
                Use Custom Session ID (for testing)
              </span>
            </label>
            
            {showSessionId && (
              <div className="mt-2">
                <input
                  type="text"
                  value={customSessionId}
                  onChange={(e) => setCustomSessionId(e.target.value)}
                  placeholder="Enter custom session ID (e.g., user-123)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  💡 Leave empty to use auto-generated session ID from localStorage
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Session Info */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-green-900 mb-2">
            🔐 Session Management
          </h3>
          <p className="text-sm text-green-800 mb-2">
            Each conversation has a unique <code className="bg-green-100 px-1 rounded">sessionId</code> that persists across page reloads.
            This allows the server to maintain conversation history.
          </p>
          <p className="text-xs text-green-700">
            {showSessionId && customSessionId 
              ? `Using custom session ID: ${customSessionId}` 
              : 'Using auto-generated session ID (check localStorage: miia-chat-session-*)'}
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Demo Mode</h3>
            <p className="text-sm text-gray-600">
              The widget is running in demo mode with simulated responses. 
              Connect a real API endpoint to test with live data.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Features</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ Markdown support</li>
              <li>✓ Chat history (localStorage)</li>
              <li>✓ i18n (5 languages)</li>
              <li>✓ Plugin system</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Customization</h3>
            <p className="text-sm text-gray-600">
              Theme colors, bot name, avatar, and suggested actions can all be 
              customized via props.
            </p>
          </div>
        </div>

        {/* Embedded Mode Preview */}
        {mode === 'embedded' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Embedded Mode Preview</h2>
            <div className="max-w-md mx-auto">
              <ChatWidget
                mode="embedded"
                welcomeMessage="👋 Hi! I am Miia AI, ask me anything about Miia!

By the way, you can create an agent like me for your website! 😉"
                suggestedActions={[
                  'What is Miia?',
                  'How do I add data to my agent?',
                  'Is there a free plan?',
                  'What are AI actions?',
                ]}
                botName="Miia AI Agent"
                demoMode={true}
                enableMarkdown={true}
                enableHistory={true}
                locale={locale}
                theme={{
                  primaryColor: '#000000',
                  accentColor: '#3b82f6',
                }}
                plugins={[profanityFilterPlugin, analyticsPlugin]}
                sessionId={showSessionId && customSessionId ? customSessionId : undefined}
                onMessageSent={(msg) => console.log('Sent:', msg)}
                onMessageReceived={(msg) => console.log('Received:', msg)}
              />
            </div>
          </div>
        )}

        {/* Instructions */}
        {mode === 'floating' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">
              💡 Floating Mode Active
            </h3>
            <p className="text-sm text-blue-800">
              Look for the black circular button in the bottom-right corner of your screen. 
              Click it to open the chat widget!
            </p>
          </div>
        )}
      </main>

      {/* Floating Chat Widget */}
      {mode === 'floating' && (
        <ChatWidget
          mode="floating"
          position="bottom-right"
          welcomeMessage="👋 Hi! I am Miia AI, ask me anything about Miia!

By the way, you can create an agent like me for your website! 😉"
          suggestedActions={[
            'What is Miia?',
            'How do I add data to my agent?',
            'Is there a free plan?',
            'What are AI actions?',
          ]}
          botName="Miia AI Agent"
          demoMode={false}
          apiEndpoint="https://n8n.srv1256421.hstgr.cloud/webhook/messages"
          enableMarkdown={true}
          enableHistory={true}
          locale={locale}
          theme={{
            primaryColor: '#000000',
            accentColor: '#3b82f6',
          }}
          plugins={[profanityFilterPlugin, analyticsPlugin]}
          sessionId={showSessionId && customSessionId ? customSessionId : undefined}
          onMessageSent={(msg) => console.log('Sent:', msg)}
          onMessageReceived={(msg) => console.log('Received:', msg)}
          onOpen={() => console.log('Chat opened')}
          onClose={() => console.log('Chat closed')}
        />
      )}
    </div>
  );
}

export default App;
