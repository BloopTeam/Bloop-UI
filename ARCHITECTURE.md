# Bloop UI Architecture

## Overview

**Bloop UI** is a **pure frontend component library** built with a modern, scalable architecture designed for extensibility and performance. This repository contains **only UI components**—no backend code, no API implementations, just React components.

The application follows a component-based architecture with clear separation of concerns.

> **Note:** This is the **UI-only repository**. For backend services and full-stack implementation, see the [Bloop-Site](https://github.com/BloopTeam/Bloop-Site) repository.

## Core Architecture Principles

### 1. Component-Driven Design
- Each UI element is an independent, reusable component
- Components manage their own state and styling
- Props flow down, events flow up

### 2. Custom Hook System
The application leverages a comprehensive set of custom React hooks:
- `useKeyboardShortcut`: Manages keyboard shortcuts across the application
- `useLocalStorage`: Persistent state management with cross-tab synchronization
- `useThrottle/useDebounce`: Performance optimization for expensive operations
- `useListNavigation`: Keyboard navigation in lists and menus

### 3. Virtual File System (Frontend Only)
The `VirtualFileSystem` class provides:
- In-memory file structure simulation (UI layer)
- Undo/redo support for file operations
- File metadata tracking
- Search capabilities across files and content

> **Note:** This is a frontend simulation. Real file operations connect to backend APIs.

### 4. Code Analysis Engine (Frontend Preview)
Frontend code analysis capabilities:
- Syntax tokenization (for display)
- Complexity metrics calculation (UI preview)
- Code quality suggestions (UI layer)

> **Note:** Heavy code analysis is handled by the backend. This is for UI preview only.

### 5. Configuration Management
Centralized configuration system:
- Theme management with syntax highlighting
- Editor settings persistence
- Customizable keybindings
- User preference synchronization

## Project Structure

```
src/
├── components/          # React components
│   ├── AppLayout.tsx   # Main application layout
│   ├── EditorArea.tsx  # Code editor with syntax highlighting
│   ├── LeftSidebar.tsx # File explorer and navigation
│   ├── AssistantPanel.tsx # AI assistant interface
│   ├── MenuBar.tsx     # Top menu with dropdowns
│   ├── StatusBar.tsx   # Bottom status information
│   ├── TerminalPanel.tsx # Integrated terminal
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useKeyboardShortcut.ts
│   ├── useLocalStorage.ts
│   └── useThrottle.ts
├── utils/              # Utility functions
│   ├── security.ts     # Security measures
│   ├── codeAnalyzer.ts # Code analysis engine
│   └── fileSystem.ts   # Virtual file system
├── config/             # Configuration management
│   └── editorConfig.ts # Theme and settings
└── types/              # TypeScript type definitions
    └── index.ts

## Data Flow

1. **User Interaction** → Component Event Handler
2. **Event Handler** → State Update (useState/useReducer)
3. **State Update** → Re-render
4. **Side Effects** → useEffect hooks
5. **Persistence** → localStorage/sessionStorage

## State Management

### Local Component State
- UI state (collapsed panels, active tabs)
- Form inputs and temporary data
- Component-specific flags

### Persistent State
- User preferences (theme, settings)
- Panel dimensions
- Recently opened files
- Command history

### Global State (Context)
- Toast notifications
- Terminal state
- Error boundaries

## Performance Optimizations

### 1. Code Splitting
- Dynamic imports for heavy components
- Lazy loading for infrequently used features

### 2. Memoization
- useMemo for expensive calculations
- useCallback for event handlers
- React.memo for pure components

### 3. Throttling & Debouncing
- Resize events throttled
- Search input debounced
- Scroll handlers optimized

### 4. Virtual Scrolling
- Large file lists rendered efficiently
- Only visible items in DOM

## Security Architecture

### 1. Input Sanitization
- HTML/XSS prevention
- Path traversal protection
- Command injection prevention

### 2. Content Security Policy
- Strict CSP headers
- Inline script restrictions
- Resource loading controls

### 3. Secure Storage
- Encrypted local storage
- Session management
- Token handling

### 4. Rate Limiting
- API call throttling
- Action cooldowns
- Brute force prevention

## Extension Points

### 1. Custom Themes
Themes can be added by extending `EditorTheme` interface:
```typescript
const customTheme: EditorTheme = {
  name: 'My Theme',
  colors: { /* ... */ },
  syntax: { /* ... */ },
  ui: { /* ... */ }
}
```

### 2. Custom Commands
Register new commands in the command palette:
```typescript
commands.register('myCommand', {
  title: 'My Command',
  callback: () => { /* ... */ }
})
```

### 3. Language Support
Add new language support by extending the code analyzer:
```typescript
analyzeCode(code, 'rust') // Add rust analyzer
```

## Testing Strategy

### Unit Tests
- Component rendering
- Hook behavior
- Utility functions
- State management

### Integration Tests
- Component interaction
- Data flow
- API communication (mocked - no real backend)

### E2E Tests
- User workflows
- Critical paths
- Performance benchmarks

## Build & Deployment

### Development
```bash
npm run dev  # Vite dev server with HMR
```

### Production
```bash
npm run build  # Optimized production build
npm run preview  # Preview production build
```

### Deployment Targets
- Vercel (primary)
- Netlify
- GitHub Pages
- Self-hosted

## Backend Integration

**This repository is UI-only.** All backend features are implemented in [Bloop-Site](https://github.com/BloopTeam/Bloop-Site):

- **Backend APIs** - RESTful endpoints (Rust + Node.js)
- **AI Services** - Model integrations and routing
- **Agent System** - Multi-agent orchestration
- **Code Analysis** - AST parsing, dependency graphs
- **Real-time Features** - WebSocket infrastructure

The UI components in this repository connect to backend APIs but contain **zero backend code**.

## Future UI Plans

### 1. Enhanced Components
- More reusable component variants
- Better accessibility features
- Improved animations and transitions

### 2. UI Plugin System
- Component extensions
- Theme customization
- Layout presets

### 3. Advanced Editor Features
- Better syntax highlighting
- Improved code folding
- Enhanced search UI

> **Backend Features:** All backend development happens in [Bloop-Site](https://github.com/BloopTeam/Bloop-Site)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on extending the architecture.
