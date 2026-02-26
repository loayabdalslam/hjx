import{_ as n,o as a,c as e,ag as p}from"./chunks/framework.ePeAWSvT.js";const u=JSON.parse('{"title":"Script Block","description":"","frontmatter":{},"headers":[],"relativePath":"language/script.md","filePath":"language/script.md","lastUpdated":null}'),t={name:"language/script.md"};function i(l,s,o,c,r,d){return a(),e("div",null,[...s[0]||(s[0]=[p(`<h1 id="script-block" tabindex="-1">Script Block <a class="header-anchor" href="#script-block" aria-label="Permalink to &quot;Script Block&quot;">​</a></h1><p>The <code>script:</code> block allows server-side initialization and logic in server-driven mode.</p><h2 id="overview" tabindex="-1">Overview <a class="header-anchor" href="#overview" aria-label="Permalink to &quot;Overview&quot;">​</a></h2><p>In server-driven mode, the <code>script:</code> block runs on the server and has access to the reactive store.</p><h2 id="basic-syntax" tabindex="-1">Basic Syntax <a class="header-anchor" href="#basic-syntax" aria-label="Permalink to &quot;Basic Syntax&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>script:</span></span>
<span class="line"><span>  export function init(store) {</span></span>
<span class="line"><span>    // Server-side code</span></span>
<span class="line"><span>  }</span></span></code></pre></div><h2 id="the-store-api" tabindex="-1">The Store API <a class="header-anchor" href="#the-store-api" aria-label="Permalink to &quot;The Store API&quot;">​</a></h2><h3 id="store-get-key" tabindex="-1">store.get(key) <a class="header-anchor" href="#store-get-key" aria-label="Permalink to &quot;store.get(key)&quot;">​</a></h3><p>Get a state value:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>script:</span></span>
<span class="line"><span>  export function init(store) {</span></span>
<span class="line"><span>    const count = store.get(&#39;count&#39;);</span></span>
<span class="line"><span>    const name = store.get(&#39;name&#39;);</span></span>
<span class="line"><span>  }</span></span></code></pre></div><h3 id="store-set-values" tabindex="-1">store.set(values) <a class="header-anchor" href="#store-set-values" aria-label="Permalink to &quot;store.set(values)&quot;">​</a></h3><p>Set state values:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>script:</span></span>
<span class="line"><span>  export function init(store) {</span></span>
<span class="line"><span>    store.set({ count: 0, name: &#39;Initial&#39; });</span></span>
<span class="line"><span>  }</span></span></code></pre></div><h3 id="store-set-key-value" tabindex="-1">store.set(key, value) <a class="header-anchor" href="#store-set-key-value" aria-label="Permalink to &quot;store.set(key, value)&quot;">​</a></h3><p>Set a single value:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>script:</span></span>
<span class="line"><span>  export function init(store) {</span></span>
<span class="line"><span>    store.set(&#39;count&#39;, 42);</span></span>
<span class="line"><span>  }</span></span></code></pre></div><h3 id="store-compute-key-fn" tabindex="-1">store.compute(key, fn) <a class="header-anchor" href="#store-compute-key-fn" aria-label="Permalink to &quot;store.compute(key, fn)&quot;">​</a></h3><p>Create a computed value:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>script:</span></span>
<span class="line"><span>  export function init(store) {</span></span>
<span class="line"><span>    store.compute(&#39;fullName&#39;, () =&gt; {</span></span>
<span class="line"><span>      const first = store.get(&#39;firstName&#39;);</span></span>
<span class="line"><span>      const last = store.get(&#39;lastName&#39;);</span></span>
<span class="line"><span>      return first + &#39; &#39; + last;</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>  }</span></span></code></pre></div><h3 id="store-on-event-handler" tabindex="-1">store.on(event, handler) <a class="header-anchor" href="#store-on-event-handler" aria-label="Permalink to &quot;store.on(event, handler)&quot;">​</a></h3><p>Listen for client events:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>script:</span></span>
<span class="line"><span>  export function init(store) {</span></span>
<span class="line"><span>    store.on(&#39;increment&#39;, () =&gt; {</span></span>
<span class="line"><span>      const count = store.get(&#39;count&#39;);</span></span>
<span class="line"><span>      store.set(&#39;count&#39;, count + 1);</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>  }</span></span></code></pre></div><h3 id="store-broadcast-event-data" tabindex="-1">store.broadcast(event, data) <a class="header-anchor" href="#store-broadcast-event-data" aria-label="Permalink to &quot;store.broadcast(event, data)&quot;">​</a></h3><p>Broadcast to all clients:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>script:</span></span>
<span class="line"><span>  export function init(store) {</span></span>
<span class="line"><span>    store.broadcast(&#39;user-joined&#39;, { name: &#39;John&#39; });</span></span>
<span class="line"><span>  }</span></span></code></pre></div><h2 id="common-patterns" tabindex="-1">Common Patterns <a class="header-anchor" href="#common-patterns" aria-label="Permalink to &quot;Common Patterns&quot;">​</a></h2><h3 id="periodic-updates" tabindex="-1">Periodic Updates <a class="header-anchor" href="#periodic-updates" aria-label="Permalink to &quot;Periodic Updates&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>script:</span></span>
<span class="line"><span>  export function init(store) {</span></span>
<span class="line"><span>    setInterval(() =&gt; {</span></span>
<span class="line"><span>      store.set({</span></span>
<span class="line"><span>        time: new Date().toISOString(),</span></span>
<span class="line"><span>        users: getOnlineUsers()</span></span>
<span class="line"><span>      });</span></span>
<span class="line"><span>    }, 1000);</span></span>
<span class="line"><span>  }</span></span></code></pre></div><h3 id="event-handling" tabindex="-1">Event Handling <a class="header-anchor" href="#event-handling" aria-label="Permalink to &quot;Event Handling&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>script:</span></span>
<span class="line"><span>  export function init(store) {</span></span>
<span class="line"><span>    store.on(&#39;add-item&#39;, (data) =&gt; {</span></span>
<span class="line"><span>      const items = store.get(&#39;items&#39;);</span></span>
<span class="line"><span>      store.set(&#39;items&#39;, [...items, data.item]);</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    store.on(&#39;remove-item&#39;, (data) =&gt; {</span></span>
<span class="line"><span>      const items = store.get(&#39;items&#39;);</span></span>
<span class="line"><span>      store.set(&#39;items&#39;, items.filter(i =&gt; i !== data.item));</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>  }</span></span></code></pre></div><h3 id="initial-setup" tabindex="-1">Initial Setup <a class="header-anchor" href="#initial-setup" aria-label="Permalink to &quot;Initial Setup&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>script:</span></span>
<span class="line"><span>  export function init(store) {</span></span>
<span class="line"><span>    // Set initial state</span></span>
<span class="line"><span>    store.set({</span></span>
<span class="line"><span>      users: fetchUsers(),</span></span>
<span class="line"><span>      settings: loadSettings(),</span></span>
<span class="line"><span>      connected: true</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // Start background tasks</span></span>
<span class="line"><span>    startSync(store);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  function startSync(store) {</span></span>
<span class="line"><span>    setInterval(() =&gt; {</span></span>
<span class="line"><span>      store.set({ lastSync: Date.now() });</span></span>
<span class="line"><span>    }, 30000);</span></span>
<span class="line"><span>  }</span></span></code></pre></div><h2 id="complete-example" tabindex="-1">Complete Example <a class="header-anchor" href="#complete-example" aria-label="Permalink to &quot;Complete Example&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component RealTimeDashboard</span></span>
<span class="line"><span></span></span>
<span class="line"><span>state:</span></span>
<span class="line"><span>  time = &quot;&quot;</span></span>
<span class="line"><span>  cpu = 0</span></span>
<span class="line"><span>  memory = 0</span></span>
<span class="line"><span>  users = []</span></span>
<span class="line"><span>  notifications = []</span></span>
<span class="line"><span></span></span>
<span class="line"><span>script:</span></span>
<span class="line"><span>  export function init(store) {</span></span>
<span class="line"><span>    // Initialize</span></span>
<span class="line"><span>    updateMetrics(store);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // Update metrics every second</span></span>
<span class="line"><span>    setInterval(() =&gt; {</span></span>
<span class="line"><span>      updateMetrics(store);</span></span>
<span class="line"><span>    }, 1000);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // Listen for client events</span></span>
<span class="line"><span>    store.on(&#39;clear-notifications&#39;, () =&gt; {</span></span>
<span class="line"><span>      store.set(&#39;notifications&#39;, []);</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // Simulate notifications</span></span>
<span class="line"><span>    setInterval(() =&gt; {</span></span>
<span class="line"><span>      const notifications = store.get(&#39;notifications&#39;);</span></span>
<span class="line"><span>      if (notifications.length &lt; 5) {</span></span>
<span class="line"><span>        const newNotif = {</span></span>
<span class="line"><span>          id: Date.now(),</span></span>
<span class="line"><span>          message: &#39;New event at &#39; + new Date().toLocaleTimeString()</span></span>
<span class="line"><span>        };</span></span>
<span class="line"><span>        store.set(&#39;notifications&#39;, [...notifications, newNotif]);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }, 5000);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  function updateMetrics(store) {</span></span>
<span class="line"><span>    store.set({</span></span>
<span class="line"><span>      time: new Date().toLocaleTimeString(),</span></span>
<span class="line"><span>      cpu: Math.random() * 100,</span></span>
<span class="line"><span>      memory: Math.random() * 100,</span></span>
<span class="line"><span>      users: [</span></span>
<span class="line"><span>        { id: 1, name: &#39;Alice&#39;, status: &#39;online&#39; },</span></span>
<span class="line"><span>        { id: 2, name: &#39;Bob&#39;, status: &#39;away&#39; },</span></span>
<span class="line"><span>        { id: 3, name: &#39;Charlie&#39;, status: &#39;online&#39; }</span></span>
<span class="line"><span>      ]</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  view.dashboard:</span></span>
<span class="line"><span>    view.header:</span></span>
<span class="line"><span>      text.title: &quot;Real-Time Dashboard&quot;</span></span>
<span class="line"><span>      text.time: &quot;{{time}}&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    view.metrics:</span></span>
<span class="line"><span>      view.metric:</span></span>
<span class="line"><span>        text.label: &quot;CPU&quot;</span></span>
<span class="line"><span>        text.value: &quot;{{cpu.toFixed(1)}}%&quot;</span></span>
<span class="line"><span>      view.metric:</span></span>
<span class="line"><span>        text.label: &quot;Memory&quot;</span></span>
<span class="line"><span>        text.value: &quot;{{memory.toFixed(1)}}%&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    view.users:</span></span>
<span class="line"><span>      text.section-title: &quot;Online Users&quot;</span></span>
<span class="line"><span>      for (user in users):</span></span>
<span class="line"><span>        view.user:</span></span>
<span class="line"><span>          text.name: &quot;{{user.name}}&quot;</span></span>
<span class="line"><span>          text.status: &quot;{{user.status}}&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    view.notifications:</span></span>
<span class="line"><span>      text.section-title: &quot;Notifications ({{notifications.length}})&quot;</span></span>
<span class="line"><span>      for (notif in notifications):</span></span>
<span class="line"><span>        view.notif: &quot;{{notif.message}}&quot;</span></span>
<span class="line"><span>      if (notifications.length &gt; 0):</span></span>
<span class="line"><span>        button (on click -&gt; clear): &quot;Clear All&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>style:</span></span>
<span class="line"><span>  .dashboard { padding: 20px; font-family: system-ui; }</span></span>
<span class="line"><span>  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }</span></span>
<span class="line"><span>  .title { font-size: 24px; font-weight: bold; }</span></span>
<span class="line"><span>  .metrics { display: flex; gap: 20px; margin-bottom: 24px; }</span></span>
<span class="line"><span>  .metric { padding: 16px; border: 1px solid #ddd; border-radius: 8px; min-width: 120px; }</span></span>
<span class="line"><span>  .label { font-size: 14px; color: #666; }</span></span>
<span class="line"><span>  .value { font-size: 28px; font-weight: bold; color: #007bff; }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>handlers:</span></span>
<span class="line"><span>  clear:</span></span>
<span class="line"><span>    set notifications = []</span></span></code></pre></div><h2 id="best-practices" tabindex="-1">Best Practices <a class="header-anchor" href="#best-practices" aria-label="Permalink to &quot;Best Practices&quot;">​</a></h2><ol><li><strong>Clean up timers</strong> - Return cleanup function if needed</li><li><strong>Debounce updates</strong> - Don&#39;t flood clients</li><li><strong>Handle errors</strong> - Wrap async operations in try/catch</li><li><strong>Keep state minimal</strong> - Only store what&#39;s needed for rendering</li></ol>`,36)])])}const m=n(t,[["render",i]]);export{u as __pageData,m as default};
