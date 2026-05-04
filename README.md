# Hjx - INTENT CODING: The "Vibe Coding" Killer! 🚀
> **"Stop Vibe Coding and Start Intenting! Welcome to 2008... but with AI from the future! This is EPIC!"**

[![Awesome](https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg)](https://github.com/loayabdalslam/intent-coding)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status: Production Ready](https://img.shields.io/badge/Status-Over_9000-red.svg)]()

---

###  يا هلا والله! Are you tired of "Vibe Coding"?
Do you just type code and *hope* it works? Do you pray to the AI gods every time you refresh? **THAT’S NOOB STUFF!** 

Welcome to **INTENT CODING** — the first library that lets you control the AI's *soul*. We don't just "vibe." We define **Intent Blocks** that translate directly into static, cached, and audited production code. 

**It's fast. It's safe. It's UBER-COOL! **

---

## Why Intent Coding is an EPIC WIN! 

| Feature | Vibe Coding (The Noob Way) | Intent Coding (The Pro Way) |
| :--- | :--- | :--- |
| **Speed** | Waiting for API calls like it's dial-up 🐢 | **Instant!** Cached result is faster than a ninja 🥷 |
| **Cost** | Burning tokens like crazy 💸 | **Zero Cost!** One run, infinite executions 💎 |
| **Reliability** | AI might hallucinate and pwn your DB 🤡 | **Verifiable!** Audit the code before it hits prod ✅ |
| **Production** | "It works on my machine..." 🤷‍♂️ | **Built for the Cloud!** Pre-build & cache everything ☁️ |

---

## 🛠️ Installation (Easy as 1-2-3!)

```bash
# Get the magic started!
npm install -g hjx-intent-coding
```

---

## 🕹️ Practical Demos (Watch this!)

### 1. The "Smart Pricing" Engine 💰
Stop hardcoding complex rules. Just tell Intent what you want!

```javascript
// logic/pricing.hjx
target: javascript
provider: ollama
model: gemma4:31b-cloud

# Intent: Global Pricing Engine
# 1. Base price is 100 USD
# 2. If user is from EU, add 20% VAT
# 3. If they are a VIP, give them 15% off
# 4. Return the final price in JSON
```

**Run it like a boss:**
```bash
intent run logic/pricing.hjx
```

### 2. Next.js Integration (Zero Latency!) ⚡
Integrate directly into your Server Components. No more slow loaders!

```javascript
import { runHjx } from 'intent';

export default async function Page() {
  // This hits the cache in production. ZERO API CALLS!
  const result = await runHjx(myIntentSource, { cache: true });
  return <div>Final Price: {result.output.total}</div>;
}
```

---

## 🏗️ The "Intent-to-Static" Architecture

Intent Coding isn't just a library; it's a **Workflow**. 
1.  **Dev Phase:** You write intents. The AI generates code. 
2.  **Audit Phase:** You check the generated code.
3.  **Build Phase:** `prebuild.js` warms up the cache.
4.  **Prod Phase:** Your server runs **STRICT STATIC CODE**. No AI required!

---

## 📂 Awesome Examples Inside!

Check out our `examples/` folder for some serious inspiration:
- 📊 **Next.js Server:** Dynamic business rules at scale.
- 🎨 **Vite React App:** Using Intent as a frontend plugin.
- 🧠 **AI Knowledge Base:** Automated SEO and content optimization.
- ⚖️ **Dynamic Pricing:** Real-time financial calculations.

---

## 🤝 Contributing
Want to help us kill Vibe Coding? Join the revolution! Send us a PR or just tell your friends that Intent Coding is the only way to live.

**Don't forget to STAR this repo! If we get 30000 stars, I'll record a video of me doing the Shuffle! 💃**

---

## 📜 License
Released under the MIT License because we're cool like that.

**© 2071-2026 Intent Coding Team — Stay Epic!**
