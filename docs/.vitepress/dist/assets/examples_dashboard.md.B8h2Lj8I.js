import{_ as a,o as n,c as e,ag as p}from"./chunks/framework.ePeAWSvT.js";const h=JSON.parse('{"title":"Dashboard Example","description":"","frontmatter":{},"headers":[],"relativePath":"examples/dashboard.md","filePath":"examples/dashboard.md","lastUpdated":null}'),t={name:"examples/dashboard.md"};function l(i,s,r,o,c,d){return n(),e("div",null,[...s[0]||(s[0]=[p(`<h1 id="dashboard-example" tabindex="-1">Dashboard Example <a class="header-anchor" href="#dashboard-example" aria-label="Permalink to &quot;Dashboard Example&quot;">​</a></h1><p>A real-time server-driven dashboard demonstrating the script block, WebSocket sync, and computed values.</p><h2 id="the-code" tabindex="-1">The Code <a class="header-anchor" href="#the-code" aria-label="Permalink to &quot;The Code&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component Dashboard</span></span>
<span class="line"><span></span></span>
<span class="line"><span>state:</span></span>
<span class="line"><span>  uptime = 0</span></span>
<span class="line"><span>  serverTime = &quot;&quot;</span></span>
<span class="line"><span>  cpuUsage = 45</span></span>
<span class="line"><span>  memoryUsage = 62</span></span>
<span class="line"><span>  status = &quot;Operational&quot;</span></span>
<span class="line"><span>  alerts = [&quot;High CPU Usage&quot;, &quot;New login from unknown device&quot;]</span></span>
<span class="line"><span>  users = []</span></span>
<span class="line"><span></span></span>
<span class="line"><span>script:</span></span>
<span class="line"><span>  export function init(store) {</span></span>
<span class="line"><span>    setInterval(() =&gt; {</span></span>
<span class="line"><span>      store.set({</span></span>
<span class="line"><span>        uptime: store.get(&#39;uptime&#39;) + 1,</span></span>
<span class="line"><span>        serverTime: new Date().toLocaleTimeString(),</span></span>
<span class="line"><span>        cpuUsage: Math.floor(Math.random() * 20) + 30,</span></span>
<span class="line"><span>        memoryUsage: Math.floor(Math.random() * 30) + 40</span></span>
<span class="line"><span>      });</span></span>
<span class="line"><span>    }, 1000);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    store.compute(&#39;status&#39;, () =&gt; {</span></span>
<span class="line"><span>      const cpu = store.get(&#39;cpuUsage&#39;);</span></span>
<span class="line"><span>      if (cpu &gt; 80) return &#39;Critical&#39;;</span></span>
<span class="line"><span>      if (cpu &gt; 60) return &#39;Warning&#39;;</span></span>
<span class="line"><span>      return &#39;Operational&#39;;</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  view.min-h-screen.bg-slate-50.p-8:</span></span>
<span class="line"><span>    view.max-w-6xl.mx-auto.space-y-8:</span></span>
<span class="line"><span>      view.header:</span></span>
<span class="line"><span>        text.text-3xl.font-bold: &quot;System Dashboard&quot;</span></span>
<span class="line"><span>        text.status: &quot;Status: {{status}}&quot;</span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>      view.grid.grid-cols-1.md:grid-cols-2.lg:grid-cols-4.gap-4:</span></span>
<span class="line"><span>        view.metric-card:</span></span>
<span class="line"><span>          text.label: &quot;Uptime&quot;</span></span>
<span class="line"><span>          text.value: &quot;{{uptime}}s&quot;</span></span>
<span class="line"><span>        view.metric-card:</span></span>
<span class="line"><span>          text.label: &quot;Server Time&quot;</span></span>
<span class="line"><span>          text.value: &quot;{{serverTime}}&quot;</span></span>
<span class="line"><span>        view.metric-card:</span></span>
<span class="line"><span>          text.label: &quot;CPU Usage&quot;</span></span>
<span class="line"><span>          text.value: &quot;{{cpuUsage}}%&quot;</span></span>
<span class="line"><span>        view.metric-card:</span></span>
<span class="line"><span>          text.label: &quot;Memory&quot;</span></span>
<span class="line"><span>          text.value: &quot;{{memoryUsage}}%&quot;</span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>      view.alerts:</span></span>
<span class="line"><span>        text.title: &quot;Alerts&quot;</span></span>
<span class="line"><span>        for (alert in alerts):</span></span>
<span class="line"><span>          view.alert: &quot;{{alert}}&quot;</span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>      view.users-section:</span></span>
<span class="line"><span>        text.title: &quot;Active Users ({{users.length}})&quot;</span></span>
<span class="line"><span>        if (users.length === 0):</span></span>
<span class="line"><span>          text.empty: &quot;No active users&quot;</span></span>
<span class="line"><span>        for (user in users):</span></span>
<span class="line"><span>          view.user-card:</span></span>
<span class="line"><span>            text.name: &quot;{{user.name}}&quot;</span></span>
<span class="line"><span>            text.user-status: &quot;{{user.status}}&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>style:</span></span>
<span class="line"><span>  .min-h-screen { min-height: 100vh; }</span></span>
<span class="line"><span>  .bg-slate-50 { background: #f8fafc; }</span></span>
<span class="line"><span>  .p-8 { padding: 32px; }</span></span>
<span class="line"><span>  .max-w-6xl { max-width: 72rem; }</span></span>
<span class="line"><span>  .mx-auto { margin-left: auto; margin-right: auto; }</span></span>
<span class="line"><span>  .space-y-8 &gt; * + * { margin-top: 32px; }</span></span>
<span class="line"><span>  .grid { display: grid; }</span></span>
<span class="line"><span>  .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }</span></span>
<span class="line"><span>  .gap-4 { gap: 16px; }</span></span>
<span class="line"><span>  @media (min-width: 768px) {</span></span>
<span class="line"><span>    .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  @media (min-width: 1024px) {</span></span>
<span class="line"><span>    .lg\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  .metric-card { background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; }</span></span>
<span class="line"><span>  .label { font-size: 14px; color: #64748b; margin-bottom: 4px; }</span></span>
<span class="line"><span>  .value { font-size: 28px; font-weight: 700; color: #0f172a; }</span></span>
<span class="line"><span>  .header { display: flex; justify-content: space-between; align-items: center; }</span></span>
<span class="line"><span>  .text-3xl { font-size: 30px; }</span></span>
<span class="line"><span>  .font-bold { font-weight: 700; }</span></span>
<span class="line"><span>  .alert { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; padding: 12px; border-radius: 8px; margin-bottom: 8px; }</span></span>
<span class="line"><span>  .title { font-size: 18px; font-weight: 600; margin-bottom: 12px; }</span></span>
<span class="line"><span>  .user-card { background: white; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; }</span></span></code></pre></div><h2 id="features-demonstrated" tabindex="-1">Features Demonstrated <a class="header-anchor" href="#features-demonstrated" aria-label="Permalink to &quot;Features Demonstrated&quot;">​</a></h2><h3 id="_1-server-driven-mode" tabindex="-1">1. Server-Driven Mode <a class="header-anchor" href="#_1-server-driven-mode" aria-label="Permalink to &quot;1. Server-Driven Mode&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>script:</span></span>
<span class="line"><span>  export function init(store) {</span></span>
<span class="line"><span>    // Server-side code</span></span>
<span class="line"><span>  }</span></span></code></pre></div><p>The script block runs on the server and manages state.</p><h3 id="_2-periodic-updates" tabindex="-1">2. Periodic Updates <a class="header-anchor" href="#_2-periodic-updates" aria-label="Permalink to &quot;2. Periodic Updates&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>setInterval(() =&gt; {</span></span>
<span class="line"><span>  store.set({ cpuUsage: Math.random() * 100 });</span></span>
<span class="line"><span>}, 1000);</span></span></code></pre></div><p>Updates every second, broadcast to all clients.</p><h3 id="_3-computed-values" tabindex="-1">3. Computed Values <a class="header-anchor" href="#_3-computed-values" aria-label="Permalink to &quot;3. Computed Values&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>store.compute(&#39;status&#39;, () =&gt; {</span></span>
<span class="line"><span>  const cpu = store.get(&#39;cpuUsage&#39;);</span></span>
<span class="line"><span>  if (cpu &gt; 80) return &#39;Critical&#39;;</span></span>
<span class="line"><span>  return &#39;Operational&#39;;</span></span>
<span class="line"><span>});</span></span></code></pre></div><p>Automatically updates when dependencies change.</p><h3 id="_4-real-time-sync" tabindex="-1">4. Real-Time Sync <a class="header-anchor" href="#_4-real-time-sync" aria-label="Permalink to &quot;4. Real-Time Sync&quot;">​</a></h3><p>State changes on server automatically sync to all connected clients via WebSocket.</p><h2 id="how-it-works" tabindex="-1">How It Works <a class="header-anchor" href="#how-it-works" aria-label="Permalink to &quot;How It Works&quot;">​</a></h2><ol><li><strong>Server starts</strong>: Executes <code>init(store)</code> function</li><li><strong>Timer runs</strong>: Every second, updates metrics</li><li><strong>Broadcast</strong>: New state sent to all clients</li><li><strong>Client updates</strong>: UI re-renders with new data</li></ol><h2 id="try-it" tabindex="-1">Try It <a class="header-anchor" href="#try-it" aria-label="Permalink to &quot;Try It&quot;">​</a></h2><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">node</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dist/cli.js</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dev</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> examples/dashboard.hjx</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --out</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dist-app</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --port</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 5173</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --target</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> server</span></span></code></pre></div><p>Open <a href="http://localhost:5173" target="_blank" rel="noreferrer">http://localhost:5173</a> in multiple browsers - they&#39;ll all update together!</p><h2 id="architecture" tabindex="-1">Architecture <a class="header-anchor" href="#architecture" aria-label="Permalink to &quot;Architecture&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>┌─────────────┐     WebSocket      ┌─────────────┐</span></span>
<span class="line"><span>│   Server    │ ◄────────────────► │   Client    │</span></span>
<span class="line"><span>│             │   state updates    │             │</span></span>
<span class="line"><span>│  (script)   │                    │  (render)   │</span></span>
<span class="line"><span>└─────────────┘                    └─────────────┘</span></span></code></pre></div><h2 id="use-cases" tabindex="-1">Use Cases <a class="header-anchor" href="#use-cases" aria-label="Permalink to &quot;Use Cases&quot;">​</a></h2><ul><li><strong>Monitoring dashboards</strong> - Real-time metrics</li><li><strong>Live counters</strong> - Vote counts, auction bids</li><li><strong>Collaborative apps</strong> - Multiple users editing</li><li><strong>IoT dashboards</strong> - Device status updates</li></ul>`,25)])])}const g=a(t,[["render",l]]);export{h as __pageData,g as default};
