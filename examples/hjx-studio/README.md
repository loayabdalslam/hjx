# HJX Studio — Vibe Coding Without LLM

Voice-driven project builder powered by the HJX NLP engine. Speak what you want,
it generates HJX code instantly, compiles it in real-time, and shows the live preview.

## Quick Start

```bash
# 1. Build the NLP engine
npm run build

# 2. Start HJX Studio
node examples/hjx-studio/server/index.mjs

# 3. Open http://localhost:3300
```

## How It Works

```
🎤 Voice → 📝 Transcript → 🧠 NLP Engine → 💻 HJX Code → ⚡ Compile → 👁 Live Preview
     or
💬 Chat → 📝 Text Input → 🧠 NLP Engine → 💻 HJX Code → ⚡ Compile → 👁 Live Preview
```

No LLM needed. The HJX NLP engine uses pattern matching + template generation + rule-based classification.

## Voice Commands

| Say This | Generates |
|----------|-----------|
| "Add a navbar" | Sticky nav with logo, links, mobile menu |
| "Add a hero section" | Gradient hero with headline, CTA, stats |
| "Add feature cards" | 3-column grid of feature cards |
| "Add a footer" | Dark footer with columns |
| "Add a modal" | Overlay dialog with header/body/footer |
| "Add a search bar" | Search input with focus states |
| "Add a contact form" | Form with name/email/message |
| "Add API data card" | Card that fetches from JSONPlaceholder |
| "Add dark mode toggle" | Theme switcher button |
| "Add a sidebar" | Side navigation panel |
| "Undo" | Remove last component |
| "Clear" | Reset entire project |

## Chat Input

The bottom bar accepts typed commands. Same as voice commands but typed.
Press Enter or click → to send.

## Export to Vite

Click "Export Vite →" to download a ready-to-run project:
- `package.json` with Vite dependency
- `vite.config.js` configured
- `index.html` with compiled HJX
- `src/main.js` bootstrap
- `README.md` with setup instructions

Run `npm install && npm dev` on the exported project.

## Design System — "Studio Dark"

### Color Tokens

| Token | ID | Value | Usage |
|-------|-----|-------|-------|
| `--studio-bg` | `studio-bg` | `#0a0a0f` | Root background — deep black-blue |
| `--studio-surface` | `studio-surface` | `#12121a` | Elevated surfaces — topbar, status |
| `--studio-card` | `studio-card` | `#1a1a2e` | Card/panel backgrounds |
| `--studio-card-hover` | `studio-card-hover` | `#22223a` | Hover state |
| `--studio-input-bg` | `studio-input-bg` | `#16162a` | Input field background |
| `--studio-border` | `studio-border` | `#2a2a4a` | Border color — muted purple |
| `--studio-border-focus` | `studio-border-focus` | `#4a4a8a` | Focused border |
| `--studio-text` | `studio-text` | `#e8e8f0` | Primary text |
| `--studio-text-dim` | `studio-text-dim` | `#8888aa` | Secondary text |
| `--studio-text-muted` | `studio-text-muted` | `#5a5a7a` | Tertiary text |
| `--studio-accent` | `studio-accent` | `#6366f1` | Primary accent — indigo |
| `--studio-accent-hover` | `studio-accent-hover` | `#5558e6` | Accent hover |
| `--studio-accent-glow` | `studio-accent-glow` | `rgba(99,102,241,0.25)` | Glow effect |
| `--studio-green` | `studio-green` | `#22c55e` | Success |
| `--studio-red` | `studio-red` | `#ef4444` | Error |
| `--studio-yellow` | `studio-yellow` | `#eab308` | Warning |
| `--studio-cyan` | `studio-cyan` | `#06b6d4` | Info |
| `--studio-purple` | `studio-purple` | `#a855f7` | Secondary accent |

### Typography

| Token | Value |
|-------|-------|
| `--font-sans` | `'Inter', system-ui, -apple-system, sans-serif` |
| `--font-mono` | `'JetBrains Mono', 'Fira Code', monospace` |

### Spacing

| Token | Value |
|-------|-------|
| `--space-xs` | `4px` |
| `--space-sm` | `8px` |
| `--space-md` | `16px` |
| `--space-lg` | `24px` |
| `--space-xl` | `32px` |
| `--space-2xl` | `48px` |

### Border Radius

| Token | Value |
|-------|-------|
| `--radius-sm` | `6px` |
| `--radius-md` | `10px` |
| `--radius-lg` | `14px` |
| `--radius-xl` | `20px` |
| `--radius-full` | `50%` |

### Key Element IDs

| ID | Element |
|----|---------|
| `studio-app` | Root app container |
| `studio-topbar` | Top navigation bar |
| `studio-logo` | Logo section |
| `studio-logo-mark` | Logo icon box |
| `studio-badge` | "VIBE CODING" badge |
| `studio-nav` | Top navigation tabs |
| `studio-main` | Main 3-column grid |
| `studio-panel-header` | Panel headers |
| `studio-panel-body` | Panel content area |
| `mic-btn` | Microphone button |
| `mic-status` | Voice status text |
| `voice-provider` | STT provider info |
| `transcript-box` | Transcript container |
| `transcript-text` | Live transcript |
| `quick-grid` | Quick command grid |
| `theme-row` | Theme selector |
| `component-list` | Component list |
| `preview-frame` | Preview container |
| `preview-iframe` | Preview iframe |
| `preview-toolbar` | Preview toolbar |
| `device-btns` | Device switcher |
| `code-tabs` | Code/Activity tabs |
| `code-body` | Code display area |
| `chat-bar` | Bottom chat bar |
| `chat-container` | Chat input wrapper |
| `chat-input` | Chat text input |
| `chat-send` | Chat send button |
| `export-overlay` | Export modal overlay |
| `export-modal` | Export modal dialog |
| `export-file-list` | Export file list |
| `studio-status` | Bottom status bar |

## Architecture

```
examples/hjx-studio/
├── server/index.mjs          # WebSocket + HTTP server
│                               - Serves UI at /
│                               - Compiles HJX via /api/compile
│                               - Real-time via WebSocket
│                               - Vite export via /api/export
├── public/index.html         # Complete frontend
│                               - Voice recording (Web Speech API)
│                               - Chat input (bottom bar)
│                               - Live preview (iframe)
│                               - Code viewer
│                               - Component management
├── app.hjx                   # HJX root component
├── components/
│   ├── VoicePanel.hjx        # Voice + manual input
│   ├── LivePreview.hjx       # Preview with device switcher
│   ├── ComponentTree.hjx     # Visual component list
│   └── ThemeEditor.hjx       # Theme customization
└── theme/
    ├── tokens.md             # Design token definitions
    └── presets.hjx           # 8 theme presets
```
