# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-01-16

### Fixed
- **CSS Isolation**: Fixed style conflicts with host applications by implementing scoped Tailwind CSS preflight using `tailwindcss-scoped-preflight`. The widget's styles are now isolated within `.miia-chat-widget` container, preventing the reset/base styles from affecting the host application.

### Changed
- **History Key Generation**: Changed default behavior for `historyKey` prop. When not explicitly provided, the widget now automatically generates a unique key per instance, ensuring that multiple widget instances on the same page or different sites don't share chat history. The generated key is based on the `apiEndpoint` (if available) and a unique instance ID.

### Technical Details
- Added `tailwindcss-scoped-preflight` as a dev dependency
- Updated `tailwind.config.js` to use scoped preflight styles
- Modified `ChatWidget` component to generate unique history keys automatically
- All Tailwind base/reset styles are now scoped to `.miia-chat-widget` container

## [1.0.0] - 2026-01-16

### Added
- Initial release
- Floating and embedded display modes
- Full TypeScript support
- Markdown rendering with react-markdown
- Chat history persistence via localStorage
- Internationalization (i18n) support for 5 languages
- Plugin system for extensibility
- Demo mode for testing without API
- Customizable themes
- Responsive design
- shadcn/ui components
- Comprehensive documentation

### Features
- Beautiful, modern UI design
- Auto-scroll to latest messages
- Loading indicators
- Error handling
- Suggested action buttons
- Emoji picker
- Custom avatars
- Flexible API integration
- Event callbacks (onMessageSent, onMessageReceived, onError, onOpen, onClose)
- Accessibility support

### Developer Experience
- Full TypeScript definitions
- ESM and CommonJS support
- Source maps for debugging
- Development environment with hot reload
- Comprehensive prop types
- Plugin examples

[1.1.0]: https://github.com/yourname/miia-chat-widget/releases/tag/v1.1.0
[1.0.0]: https://github.com/yourname/miia-chat-widget/releases/tag/v1.0.0
