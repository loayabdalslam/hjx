// =============================================================================
// HJX Studio v2 — Complete Server
// =============================================================================
// Real-time voice → NLP → HJX → compiled HTML pipeline.
//
// Run: node examples/hjx-studio/server/index.mjs
// Open: http://localhost:3300
// =============================================================================

import http from "node:http";
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from "node:fs";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { WebSocketServer } from "ws";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

import {
  classifyIntent,
  extractEntities,
  detectErrors,
  correctCode,
  formatHJX,
  TemplateGenerator,
  NeuralCodeGenerator,
  extractFeatures,
  Intent,
} from "../../../dist/nlp/index.js";

import { parseHJX } from "../../../dist/parser.js";
import { buildVanilla } from "../../../dist/compiler/vanilla.js";

// ─── Design Tokens ───────────────────────────────────────────────────────────
// Every style, color, font, radius, and spacing value used in the studio.

const DESIGN_SYSTEM = {
  // Color Palette — "Studio Dark" theme
  colors: {
    bg:              "#0a0a0f",    // Main background — deep black-blue
    bgSurface:       "#12121a",    // Surface layer — slightly lighter
    bgCard:          "#1a1a2e",    // Card/panel background — dark navy
    bgHover:         "#22223a",    // Hover state — subtle lift
    bgInput:         "#16162a",    // Input field background
    border:          "#2a2a4a",    // Border color — muted purple
    borderFocus:     "#4a4a8a",    // Focused border — brighter purple
    text:            "#e8e8f0",    // Primary text — soft white
    textDim:         "#8888aa",    // Secondary text — muted lavender
    textMuted:       "#5a5a7a",    // Tertiary text — dim
    accent:          "#6366f1",    // Primary accent — indigo
    accentHover:     "#5558e6",    // Accent hover — deeper indigo
    accentGlow:      "rgba(99,102,241,0.25)", // Glow effect
    green:           "#22c55e",    // Success — emerald
    greenGlow:       "rgba(34,197,94,0.3)",
    red:             "#ef4444",    // Error — rose
    redGlow:         "rgba(239,68,68,0.3)",
    yellow:          "#eab308",    // Warning — amber
    cyan:            "#06b6d4",    // Info — sky
    purple:          "#a855f7",    // Secondary accent — violet
    rose:            "#f43f5e",    // Danger — pink
  },

  // Typography
  fonts: {
    sans:  "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
    mono:  "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace",
    sizes: {
      xs:   "10px",
      sm:   "12px",
      md:   "14px",
      lg:   "16px",
      xl:   "20px",
      "2xl": "24px",
      "3xl": "32px",
    },
  },

  // Spacing
  spacing: {
    xs:  "4px",
    sm:  "8px",
    md:  "16px",
    lg:  "24px",
    xl:  "32px",
    "2xl": "48px",
  },

  // Border Radius
  radius: {
    sm:   "6px",
    md:   "10px",
    lg:   "14px",
    xl:   "20px",
    full: "50%",
  },

  // Shadows
  shadows: {
    sm:   "0 1px 3px rgba(0,0,0,0.3)",
    md:   "0 4px 12px rgba(0,0,0,0.4)",
    lg:   "0 8px 24px rgba(0,0,0,0.5)",
    glow: "0 0 24px var(--accent-glow)",
  },

  // Z-Index layers
  z: {
    base:    1,
    panel:   10,
    overlay: 100,
    modal:   200,
    toast:   300,
  },

  // Animation durations
  animation: {
    fast:    "150ms",
    normal:  "300ms",
    slow:    "500ms",
  },
};

// ─── Command Templates ───────────────────────────────────────────────────────

const TEMPLATES = {
  navbar: {
    name: "NavBar",
    code: `component NavBar
state:
  isMenuOpen = false
  links = ["Home", "About", "Contact", "Pricing"]
layout:
  view#navbar.navbar:
    view.nav-container:
      view.logo:
        text.logo-text: "MyApp"
      view.nav-links:
        for (link in links):
          button.nav-link: "{{link}}"
      view.nav-actions:
        button.cart-btn: "🛒"
        button.menu-toggle (on click -> toggleMenu): "☰"
    if (isMenuOpen):
      view.mobile-menu:
        for (link in links):
          button.mobile-link: "{{link}}"
style:
  .navbar { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,0.95); backdrop-filter: blur(12px); border-bottom: 1px solid #e5e7eb; }
  .nav-container { max-width: 1200px; margin: 0 auto; padding: 14px 24px; display: flex; align-items: center; justify-content: space-between; }
  .logo-text { font-size: 22px; font-weight: 800; color: #111827; cursor: pointer; }
  .nav-links { display: flex; gap: 28px; }
  .nav-link { background: none; border: none; cursor: pointer; font-size: 14px; font-weight: 500; color: #4b5563; padding: 8px 0; }
  .nav-actions { display: flex; gap: 8px; align-items: center; }
  .cart-btn, .menu-toggle { width: 40px; height: 40px; border: none; background: none; cursor: pointer; font-size: 18px; border-radius: 10px; }
  .mobile-menu { padding: 16px 24px; border-top: 1px solid #e5e7eb; display: flex; flex-direction: column; gap: 4px; }
  .mobile-link { display: block; width: 100%; padding: 12px 0; background: none; border: none; cursor: pointer; font-size: 16px; text-align: left; color: #4b5563; }
handlers:
  toggleMenu:
    set isMenuOpen = !isMenuOpen
`,
  },

  hero: {
    name: "HeroSection",
    code: `component HeroSection
state:
  headline = "Build Something Amazing"
  subtitle = "Create beautiful applications with HJX — one file, zero config."
  ctaText = "Get Started Free"
layout:
  view#hero.hero:
    view.hero-content:
      text.hero-badge: "✨ Now in Beta"
      text.hero-headline: "{{headline}}"
      text.hero-subtitle: "{{subtitle}}"
      view.hero-actions:
        button.cta-primary (on click -> getStarted): "{{ctaText}}"
        button.cta-secondary: "Watch Demo →"
      view.hero-stats:
        view.stat:
          text.stat-number: "10K+"
          text.stat-label: "Developers"
        view.stat:
          text.stat-number: "50K+"
          text.stat-label: "Components"
        view.stat:
          text.stat-number: "99.9%"
          text.stat-label: "Uptime"
style:
  .hero { padding: 80px 24px 60px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; }
  .hero-content { max-width: 700px; margin: 0 auto; }
  .hero-badge { display: inline-block; padding: 6px 16px; background: rgba(255,255,255,0.2); border-radius: 20px; font-size: 13px; font-weight: 500; margin-bottom: 20px; }
  .hero-headline { font-size: 52px; font-weight: 800; line-height: 1.1; margin-bottom: 16px; }
  .hero-subtitle { font-size: 18px; opacity: 0.9; margin-bottom: 32px; line-height: 1.6; }
  .hero-actions { display: flex; gap: 12px; justify-content: center; margin-bottom: 48px; }
  .cta-primary { padding: 14px 32px; background: white; color: #667eea; border: none; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; }
  .cta-secondary { padding: 14px 32px; background: rgba(255,255,255,0.15); color: white; border: 1px solid rgba(255,255,255,0.3); border-radius: 12px; font-size: 16px; font-weight: 500; cursor: pointer; }
  .hero-stats { display: flex; justify-content: center; gap: 48px; }
  .stat { text-align: center; }
  .stat-number { font-size: 28px; font-weight: 700; }
  .stat-label { font-size: 13px; opacity: 0.8; }
handlers:
  getStarted:
    log "CTA clicked"
`,
  },

  cards: {
    name: "FeatureCards",
    code: `component FeatureCards
state:
  features = [
    { icon: "⚡", title: "Lightning Fast", desc: "Instant compilation with zero runtime overhead." },
    { icon: "🎯", title: "One File", desc: "HTML, CSS, and JS unified in a single .hjx file." },
    { icon: "🔌", title: "Zero Config", desc: "No build tools needed. Just write and run." },
    { icon: "🧩", title: "Components", desc: "Compose reusable components with imports." },
    { icon: "📡", title: "Real-time", desc: "Server-driven mode with WebSocket sync." },
    { icon: "🤖", title: "AI-Powered", desc: "NLP engine for natural language coding." }
  ]
layout:
  view#features.features-section:
    text.section-badge: "Features"
    text.section-title: "Everything you need"
    text.section-subtitle: "HJX gives you the tools to build modern web applications without the complexity."
    view.features-grid:
      for (feature in features):
        view.feature-card:
          text.feature-icon: "{{feature.icon}}"
          text.feature-title: "{{feature.title}}"
          text.feature-desc: "{{feature.desc}}"
style:
  .features-section { padding: 80px 24px; max-width: 1200px; margin: 0 auto; text-align: center; }
  .section-badge { display: inline-block; padding: 6px 16px; background: #eff6ff; color: #3b82f6; border-radius: 20px; font-size: 13px; font-weight: 600; margin-bottom: 16px; }
  .section-title { font-size: 40px; font-weight: 800; color: #111827; margin-bottom: 12px; }
  .section-subtitle { font-size: 18px; color: #6b7280; max-width: 600px; margin: 0 auto 48px; line-height: 1.6; }
  .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .feature-card { padding: 32px; background: white; border: 1px solid #e5e7eb; border-radius: 16px; text-align: left; transition: all 0.2s; }
  .feature-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.08); transform: translateY(-2px); }
  .feature-icon { font-size: 36px; margin-bottom: 16px; display: block; }
  .feature-title { font-size: 18px; font-weight: 600; color: #111827; margin-bottom: 8px; }
  .feature-desc { font-size: 14px; color: #6b7280; line-height: 1.6; }
`,
  },

  footer: {
    name: "Footer",
    code: `component Footer
layout:
  view#footer.footer:
    view.footer-content:
      view.footer-brand:
        text.brand-name: "MyApp"
        text.brand-desc: "Building the future of web development, one component at a time."
      view.footer-columns:
        view.footer-col:
          text.col-title: "Product"
          text.footer-link: "Features"
          text.footer-link: "Pricing"
          text.footer-link: "Changelog"
        view.footer-col:
          text.col-title: "Resources"
          text.footer-link: "Documentation"
          text.footer-link: "Tutorials"
          text.footer-link: "Blog"
        view.footer-col:
          text.col-title: "Company"
          text.footer-link: "About"
          text.footer-link: "Careers"
          text.footer-link: "Contact"
    view.footer-bottom:
      text.copyright: "© 2026 MyApp. All rights reserved."
style:
  .footer { background: #111827; color: white; padding: 64px 0 24px; }
  .footer-content { max-width: 1200px; margin: 0 auto; padding: 0 24px; display: grid; grid-template-columns: 1.5fr 2fr; gap: 48px; }
  .brand-name { font-size: 22px; font-weight: 800; margin-bottom: 12px; }
  .brand-desc { color: #9ca3af; font-size: 14px; line-height: 1.6; max-width: 300px; }
  .footer-columns { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
  .col-title { font-weight: 600; font-size: 14px; margin-bottom: 16px; }
  .footer-link { display: block; color: #9ca3af; font-size: 14px; margin-bottom: 10px; cursor: pointer; }
  .footer-bottom { max-width: 1200px; margin: 48px auto 0; padding: 24px 24px 0; border-top: 1px solid #1f2937; }
  .copyright { color: #6b7280; font-size: 13px; }
`,
  },

  modal: {
    name: "Modal",
    code: `component Modal
state:
  isOpen = false
layout:
  button.modal-trigger (on click -> open): "Open Modal"
  if (isOpen):
    view.modal-overlay (on click -> close):
      view.modal-panel (on click -> stopProp):
        view.modal-header:
          text.modal-title: "Welcome"
          button.modal-close (on click -> close): "×"
        view.modal-body:
          text: "This is a modal dialog built with HJX. It supports conditional rendering, event handling, and state management — all in one file."
        view.modal-footer:
          button.modal-cancel (on click -> close): "Cancel"
          button.modal-confirm: "Confirm"
style:
  .modal-trigger { padding: 12px 24px; background: #3b82f6; color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 14px; font-weight: 600; }
  .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 100; }
  .modal-panel { background: white; border-radius: 16px; width: 480px; max-width: 90vw; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
  .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #e5e7eb; }
  .modal-title { font-size: 18px; font-weight: 600; }
  .modal-close { background: none; border: none; font-size: 24px; cursor: pointer; color: #9ca3af; }
  .modal-body { padding: 24px; color: #4b5563; line-height: 1.6; }
  .modal-footer { display: flex; justify-content: flex-end; gap: 12px; padding: 16px 24px; border-top: 1px solid #e5e7eb; }
  .modal-cancel { padding: 10px 20px; background: none; border: 1px solid #e5e7eb; border-radius: 8px; cursor: pointer; }
  .modal-confirm { padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; }
handlers:
  open:
    set isOpen = true
  close:
    set isOpen = false
  stopProp:
    log "stop"
`,
  },

  search: {
    name: "SearchBar",
    code: `component SearchBar
state:
  query = ""
  isFocused = false
layout:
  view.search-container(class="focused-{{isFocused}}"):
    text.search-icon: "🔍"
    input.search-input (placeholder="Search anything..." bind value <-> query on focus -> onFocus on blur -> onBlur)
    if (query):
      button.search-clear (on click -> clear): "×"
style:
  .search-container { display: flex; align-items: center; gap: 10px; background: #f3f4f6; border: 2px solid transparent; border-radius: 14px; padding: 0 18px; max-width: 500px; transition: all 0.2s; }
  .search-container.focused-true { background: white; border-color: #3b82f6; box-shadow: 0 0 0 4px rgba(59,130,246,0.1); }
  .search-icon { font-size: 16px; }
  .search-input { flex: 1; padding: 14px 0; border: none; background: none; font-size: 15px; outline: none; }
  .search-clear { background: none; border: none; cursor: pointer; font-size: 20px; color: #9ca3af; padding: 4px; border-radius: 50%; }
handlers:
  onFocus:
    set isFocused = true
  onBlur:
    set isFocused = false
  clear:
    set query = ""
`,
  },

  form: {
    name: "ContactForm",
    code: `component ContactForm
state:
  name = ""
  email = ""
  message = ""
  submitted = false
layout:
  view.form-wrapper:
    if (!submitted):
      text.form-title: "Get in Touch"
      text.form-subtitle: "We'd love to hear from you."
      view.form:
        view.form-field:
          text.field-label: "Name"
          input.field-input (placeholder="Your name" bind value <-> name)
        view.form-field:
          text.field-label: "Email"
          input.field-input (type="email" placeholder="you@example.com" bind value <-> email)
        view.form-field:
          text.field-label: "Message"
          textarea.field-textarea (placeholder="What's on your mind?" bind value <-> message)
        button.submit-btn (on click -> submit): "Send Message"
    if (submitted):
      view.success-state:
        text.success-icon: "✅"
        text.success-title: "Sent!"
        text.success-msg: "We'll get back to you within 24 hours."
style:
  .form-wrapper { max-width: 500px; margin: 40px auto; padding: 40px; background: white; border-radius: 20px; border: 1px solid #e5e7eb; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
  .form-title { font-size: 28px; font-weight: 700; margin-bottom: 6px; }
  .form-subtitle { color: #6b7280; margin-bottom: 28px; }
  .form { display: flex; flex-direction: column; gap: 20px; }
  .form-field { display: flex; flex-direction: column; gap: 6px; }
  .field-label { font-size: 14px; font-weight: 500; color: #374151; }
  .field-input, .field-textarea { padding: 12px 16px; border: 1px solid #e5e7eb; border-radius: 10px; font-size: 14px; font-family: inherit; }
  .field-textarea { min-height: 120px; resize: vertical; }
  .submit-btn { padding: 14px; background: #111827; color: white; border: none; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; }
  .success-state { text-align: center; padding: 40px; }
  .success-icon { font-size: 48px; display: block; margin-bottom: 16px; }
  .success-title { font-size: 24px; font-weight: 700; margin-bottom: 8px; }
  .success-msg { color: #6b7280; }
handlers:
  submit:
    set submitted = true
`,
  },

  api: {
    name: "DataCard",
    code: `component DataCard
state:
  data = { title: "Loading...", body: "Fetching data from API..." }
  isLoading = true
  error = ""
script:
  export function init(store) {
    fetch("https://jsonplaceholder.typicode.com/posts/1")
      .then(r => r.json())
      .then(data => store.set({ data, isLoading: false }))
      .catch(err => store.set({ error: err.message, isLoading: false }));
  }
layout:
  view.data-card:
    if (isLoading):
      view.loading-state:
        text.loading-spinner: "⏳"
        text: "Loading data..."
    if (!isLoading && !error):
      view.card-content:
        text.card-title: "{{data.title}}"
        text.card-body: "{{data.body}}"
        button.refresh-btn: "Refresh"
    if (error):
      view.error-state:
        text: "Error: {{error}}"
style:
  .data-card { background: white; border: 1px solid #e5e7eb; border-radius: 16px; padding: 28px; max-width: 500px; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
  .loading-state { text-align: center; padding: 40px; color: #9ca3af; }
  .loading-spinner { font-size: 32px; display: block; margin-bottom: 12px; }
  .card-title { font-size: 20px; font-weight: 600; margin-bottom: 12px; color: #111827; }
  .card-body { color: #6b7280; line-height: 1.7; font-size: 15px; margin-bottom: 20px; }
  .refresh-btn { padding: 10px 20px; background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 8px; cursor: pointer; font-size: 13px; }
  .error-state { color: #ef4444; padding: 20px; text-align: center; }
`,
  },

  darktoggle: {
    name: "DarkModeToggle",
    code: `component DarkModeToggle
state:
  isDark = false
layout:
  button.theme-toggle (on click -> toggle class="dark-{{isDark}}"):
    text: "{{isDark ? '☀️ Light' : '🌙 Dark'}}"
style:
  .theme-toggle { padding: 10px 20px; border-radius: 10px; border: 1px solid #e5e7eb; background: white; cursor: pointer; font-size: 14px; font-weight: 500; }
  .theme-toggle.dark-true { background: #1e293b; color: white; border-color: #475569; }
handlers:
  toggle:
    set isDark = !isDark
`,
  },

  sidebar: {
    name: "Sidebar",
    code: `component Sidebar
state:
  activeItem = "dashboard"
  items = [
    { icon: "📊", label: "Dashboard", id: "dashboard" },
    { icon: "👥", label: "Users", id: "users" },
    { icon: "📦", label: "Products", id: "products" },
    { icon: "⚙️", label: "Settings", id: "settings" }
  ]
layout:
  view.sidebar:
    text.sidebar-title: "MyApp"
    view.sidebar-nav:
      for (item in items):
        button.sidebar-item (class="item-{{activeItem === item.id ? 'active' : ''}}" on click -> setActive):
          text.item-icon: "{{item.icon}}"
          text.item-label: "{{item.label}}"
    view.sidebar-footer:
      text.sidebar-user: "👤 John Doe"
style:
  .sidebar { width: 260px; background: #111827; color: white; padding: 24px 16px; display: flex; flex-direction: column; min-height: 100vh; }
  .sidebar-title { font-size: 20px; font-weight: 800; margin-bottom: 32px; padding: 0 12px; }
  .sidebar-nav { flex: 1; display: flex; flex-direction: column; gap: 4px; }
  .sidebar-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; background: none; border: none; color: #9ca3af; cursor: pointer; border-radius: 10px; font-size: 14px; width: 100%; text-align: left; }
  .item-active { background: #1f2937; color: white; }
  .item-icon { font-size: 18px; }
  .sidebar-footer { padding: 16px 12px; border-top: 1px solid #1f2937; margin-top: auto; }
  .sidebar-user { font-size: 13px; color: #9ca3af; }
handlers:
  setActive:
    log "Set active item"
`,
  },
};

// ─── NLP + Compiler Pipeline ─────────────────────────────────────────────────

const neuralGen = new NeuralCodeGenerator();
const templateGen = new TemplateGenerator();

function matchCommand(text) {
  const n = text.toLowerCase().trim();
  if (n.includes("navbar") || n.includes("nav bar") || n.includes("navigation") || n.includes("header")) return TEMPLATES.navbar;
  if (n.includes("hero") || n.includes("banner") || n.includes("jumbotron") || n.includes("landing")) return TEMPLATES.hero;
  if (n.includes("card") && (n.includes("grid") || n.includes("feature"))) return TEMPLATES.cards;
  if (n.includes("feature")) return TEMPLATES.cards;
  if (n.includes("footer")) return TEMPLATES.footer;
  if (n.includes("modal") || n.includes("dialog") || n.includes("popup")) return TEMPLATES.modal;
  if (n.includes("search")) return TEMPLATES.search;
  if (n.includes("form") || n.includes("contact")) return TEMPLATES.form;
  if (n.includes("api") || n.includes("fetch") || n.includes("data card") || n.includes("data from")) return TEMPLATES.api;
  if (n.includes("dark mode") || n.includes("theme toggle") || n.includes("dark theme")) return TEMPLATES.darktoggle;
  if (n.includes("sidebar") || n.includes("side nav") || n.includes("side menu")) return TEMPLATES.sidebar;
  return null;
}

function compileHJX(code) {
  try {
    const ast = parseHJX(code);
    const bundle = buildVanilla(ast);
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${bundle.css}</style>
</head>
<body>
  ${bundle.html}
  <script>${bundle.js}<\/script>
</body>
</html>`;
  } catch (e) {
    return `<!DOCTYPE html><html><body style="font-family:system-ui;padding:40px;color:#ef4444;">
      <h3>Compilation Error</h3><pre>${e.message}</pre></body></html>`;
  }
}

function buildProjectHTML(components) {
  if (components.length === 0) {
    return `<!DOCTYPE html><html><head><style>
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:system-ui;display:flex;align-items:center;justify-content:center;height:100vh;background:#f9fafb;color:#9ca3af;}
    </style></head><body>
      <div style="text-align:center;">
        <div style="font-size:64px;margin-bottom:16px;">🎤</div>
        <div style="font-size:20px;font-weight:600;margin-bottom:8px;">Start Building</div>
        <div style="font-size:14px;">Click the mic or type a command below</div>
      </div>
    </body></html>`;
  }

  // Compile each component and compose them
  let allCSS = "";
  let allJS = "";
  let allHTML = "";

  for (const comp of components) {
    try {
      const ast = parseHJX(comp.code);
      const bundle = buildVanilla(ast);
      allCSS += bundle.css + "\n";
      allJS += bundle.js + "\n";
      allHTML += `<div data-component="${comp.name}">${bundle.html}</div>\n`;
    } catch (e) {
      allHTML += `<div style="padding:20px;background:#fee2e2;color:#dc2626;border-radius:8px;margin:8px;">
        <strong>${comp.name}</strong>: ${e.message}</div>\n`;
    }
  }

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HJX Project</title>
  <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,-apple-system,sans-serif;}${allCSS}</style>
</head>
<body>
  ${allHTML}
  <script>${allJS}<\/script>
</body>
</html>`;
}

// ─── Vite Project Exporter ───────────────────────────────────────────────────

function generateViteProject(project) {
  const files = {};

  // package.json
  files["package.json"] = JSON.stringify({
    name: project.name.toLowerCase().replace(/\s+/g, "-"),
    private: true,
    version: "1.0.0",
    type: "module",
    scripts: {
      dev: "vite",
      build: "vite build",
      preview: "vite preview",
    },
    devDependencies: {
      vite: "^6.0.0",
    },
  }, null, 2);

  // vite.config.js
  files["vite.config.js"] = `import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
`;

  // index.html
  const html = buildProjectHTML(project.components);
  files["index.html"] = html;

  // src/main.js — runtime bootstrap
  files["src/main.js"] = `// HJX Project — Auto-generated by HJX Studio
// This file bootstraps the compiled HJX components.

document.addEventListener('DOMContentLoaded', () => {
  console.log('HJX Project loaded');
});
`;

  // README.md
  files["README.md"] = `# ${project.name}

Built with [HJX](https://github.com/loayabdalslam/hjx) — the unified UI language.

## Quick Start

\`\`\`bash
npm install
npm run dev
\`\`\`

## Components

${project.components.map(c => `- **${c.name}** — Generated from: "${c.source || 'manual'}"`).join("\n")}

## Build

\`\`\`bash
npm run build
npm run preview
\`\`\`
`;

  return files;
}

// ─── HTTP + WebSocket Server ─────────────────────────────────────────────────

const projects = new Map();

function parseBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", c => body += c);
    req.on("end", () => { try { resolve(JSON.parse(body || "{}")); } catch { resolve({}); } });
  });
}

function sendJSON(res, data, status = 200) {
  res.writeHead(status, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET,POST,OPTIONS", "Access-Control-Allow-Headers": "Content-Type" });
  res.end(JSON.stringify(data));
}

function sendHTML(res, html) {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(html);
}

const httpServer = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === "OPTIONS") {
    res.writeHead(204, { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET,POST,OPTIONS", "Access-Control-Allow-Headers": "Content-Type" });
    return res.end();
  }

  // Serve main UI
  if (url.pathname === "/" || url.pathname === "/index.html") {
    return sendHTML(res, readFileSync(resolve(__dirname, "../public/index.html"), "utf-8"));
  }

  // Compile HJX and serve as preview
  if (url.pathname === "/api/compile" && req.method === "POST") {
    const body = await parseBody(req);
    const html = compileHJX(body.code || "");
    return sendJSON(res, { html });
  }

  // Export project
  if (url.pathname === "/api/export" && req.method === "POST") {
    const body = await parseBody(req);
    const files = generateViteProject(body.project || { name: "MyProject", components: [] });
    return sendJSON(res, { files, fileCount: Object.keys(files).length });
  }

  sendJSON(res, { error: "Not found" }, 404);
});

// ─── WebSocket for Real-Time ─────────────────────────────────────────────────

const wss = new WebSocketServer({ server: httpServer });

wss.on("connection", (ws) => {
  const id = Date.now().toString(36);
  const project = { name: "MyProject", components: [], theme: "light" };
  projects.set(id, project);

  ws.send(JSON.stringify({ type: "connected", id, message: "Welcome to HJX Studio — Vibe Coding Without LLM" }));

  ws.on("message", async (raw) => {
    let msg;
    try { msg = JSON.parse(raw.toString()); } catch { return; }

    if (msg.type === "command") {
      const text = msg.text;
      let result = null;

      // Try template matching
      const template = matchCommand(text);
      if (template) {
        project.components.push({ name: template.name, code: template.code, source: text });
        result = { type: "added", name: template.name, code: template.code, method: "template" };
      } else {
        // NLP fallback
        const intent = classifyIntent(text);
        if (intent.primaryIntent === Intent.CREATE_COMPONENT) {
          const gen = await neuralGen.generate(text);
          const nameMatch = gen.code.match(/component\s+(\w+)/);
          const name = nameMatch ? nameMatch[1] : "Generated";
          project.components.push({ name, code: gen.code, source: text });
          result = { type: "added", name, code: gen.code, method: "nlp" };
        } else {
          result = { type: "info", message: `Understood: ${intent.primaryIntent}. Try "add a navbar" or "create a hero section".` };
        }
      }

      const liveHTML = buildProjectHTML(project.components);

      ws.send(JSON.stringify({
        ...result,
        project: { name: project.name, components: project.components.map(c => c.name), count: project.components.length },
        liveHTML,
      }));
    }

    if (msg.type === "undo") {
      project.components.pop();
      ws.send(JSON.stringify({ type: "undone", project: { components: project.components.map(c => c.name), count: project.components.length }, liveHTML: buildProjectHTML(project.components) }));
    }

    if (msg.type === "clear") {
      project.components = [];
      ws.send(JSON.stringify({ type: "cleared", liveHTML: buildProjectHTML([]) }));
    }

    if (msg.type === "theme") {
      project.theme = msg.theme;
      ws.send(JSON.stringify({ type: "theme_set", theme: msg.theme }));
    }

    if (msg.type === "export") {
      const files = generateViteProject(project);
      ws.send(JSON.stringify({ type: "export_data", files, fileCount: Object.keys(files).length }));
    }
  });

  ws.on("close", () => projects.delete(id));
});

// ─── Start ───────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3300;
httpServer.listen(PORT, () => {
  console.log(`\n  🎤 HJX Studio — Vibe Coding Without LLM`);
  console.log(`  → http://localhost:${PORT}\n`);
});
