# HJX Studio — Voice-Driven Project Builder

Build HJX applications using only your voice. Speak what you want,
the NLP engine generates it in real-time, and see the live preview instantly.

## How It Works

```
┌─────────────────────────────────────────────────────────────────────┐
│                        HJX Studio                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  🎤 Voice Input                                                     │
│  "I want a top navbar with logo, links, and cart badge"             │
│         ↓                                                           │
│  ┌─────────────────────────────────────────────────────────┐       │
│  │  Speech Recognition (Web Speech API)                     │       │
│  │  → Transcribes voice to text in real-time                │       │
│  └──────────────────────┬──────────────────────────────────┘       │
│                         ↓                                           │
│  ┌─────────────────────────────────────────────────────────┐       │
│  │  NLP Engine (Intent + Entities + Generation)             │       │
│  │  → Understands what user wants                           │       │
│  │  → Extracts component names, properties, actions         │       │
│  │  → Generates HJX code                                    │       │
│  └──────────────────────┬──────────────────────────────────┘       │
│                         ↓                                           │
│  ┌─────────────────────────────────────────────────────────┐       │
│  │  Live Compiler (Real-time HJX → HTML/CSS/JS)             │       │
│  │  → Compiles generated code instantly                     │       │
│  │  → Updates preview in real-time                          │       │
│  └──────────────────────┬──────────────────────────────────┘       │
│                         ↓                                           │
│  ┌─────────────────────────────────────────────────────────┐       │
│  │  Live Preview Panel                                      │       │
│  │  → Shows the running application                         │       │
│  │  → Updates as you speak                                  │       │
│  └─────────────────────────────────────────────────────────┘       │
│                                                                     │
│  Voice Commands:                                                    │
│    "Add a navbar"          → Generates NavBar component             │
│    "Add a hero section"    → Generates Hero component               │
│    "Make it blue"          → Applies theme changes                  │
│    "Connect to API"        → Adds data fetching                     │
│    "Add dark mode"         → Adds theme toggle                      │
│    "Export project"        → Downloads as zip                       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Quick Start

```bash
# Build the compiler
npm run build

# Start the studio server
node examples/hjx-studio/server/index.mjs

# Open http://localhost:3300
# Click the microphone and start speaking!
```

## Voice Commands Reference

### Layout Commands
| Say | Generates |
|-----|-----------|
| "Add a top navbar" | Navigation bar with logo and links |
| "Add a hero section" | Hero with heading and CTA button |
| "Add a card grid" | Responsive card layout |
| "Add a footer" | Footer with links |
| "Add a sidebar" | Side navigation panel |
| "Add a modal" | Dialog overlay |

### Component Commands
| Say | Generates |
|-----|-----------|
| "Add a button" | Styled button component |
| "Add an input field" | Text input with label |
| "Add a search bar" | Search input with icon |
| "Add a toggle switch" | Boolean toggle |
| "Add a dropdown" | Select menu |
| "Add a data table" | Sortable table |

### Style Commands
| Say | Generates |
|-----|-----------|
| "Make it blue" | Changes primary color |
| "Use dark mode" | Applies dark theme |
| "Add rounded corners" | Border radius |
| "Add shadow" | Box shadow |
| "Make it centered" | Center alignment |

### Data Commands
| Say | Generates |
|-----|-----------|
| "Connect to API" | Adds fetch calls |
| "Add a list from data" | Loop rendering |
| "Show loading state" | Loading spinner |
| "Add form validation" | Input validation |

## Architecture

| File | Purpose |
|------|---------|
| `app.hjx` | Main studio application |
| `components/VoicePanel.hjx` | Voice recording UI |
| `components/LivePreview.hjx` | Real-time preview |
| `components/ComponentTree.hjx` | Visual component tree |
| `components/ThemeEditor.hjx` | Theme customization |
| `components/CodeViewer.hjx` | Generated code display |
| `theme/tokens.hjx` | Design tokens |
| `theme/presets.hjx` | Theme presets |
| `server/index.mjs` | WebSocket NLP server |
