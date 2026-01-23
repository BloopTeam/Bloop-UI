# Bloop UI

A clean, highly functional coding interface inspired by Cursor and Claude Code, optimized for developer productivity and clarity.

## Features

- **Clean Layout**: Five-panel design with clear separation
  - Top Bar: Workspace info, connection status, actions
  - Left Sidebar: Navigation (Files, Projects, Prompts, History, MCP)
  - Center Panel: Code editor with tabs and syntax highlighting
  - Right Panel: Assistant interface with execution results
  - Bottom Bar: Status, errors, logs, and keyboard shortcuts

- **Resizable Panels**: Drag to resize sidebar and right panel
- **Persistent Layout**: Panel sizes and collapsed states saved to localStorage
- **Dark Mode**: Optimized dark theme with neutral palette
- **Keyboard Friendly**: Full keyboard navigation support
- **Modern Stack**: React + TypeScript + Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

## Project Structure

```
src/
  components/
    TopBar.tsx       # Top navigation bar
    LeftSidebar.tsx  # Left navigation sidebar
    CenterPanel.tsx  # Main code editor area
    RightPanel.tsx   # Assistant/execution panel
    BottomBar.tsx    # Bottom status bar
  App.tsx            # Main app component
  main.tsx           # Entry point
  index.css          # Global styles
```

## Design Principles

- **Reduce cognitive load**: Clear hierarchy, obvious actions
- **Prioritize readability**: Spacious layout, soft contrast
- **Keep it fast**: Minimal animations, smooth transitions
- **Avoid visual noise**: Clean, purposeful design
- **Developer-first**: Built for coding workflows

## Technology Stack

- React 18
- TypeScript
- Tailwind CSS
- Vite
- Lucide React (icons)

## License

MIT
