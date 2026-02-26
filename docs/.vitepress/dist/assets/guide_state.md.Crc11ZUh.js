import{_ as s,o as n,c as e,ag as t}from"./chunks/framework.ePeAWSvT.js";const u=JSON.parse('{"title":"State Management","description":"","frontmatter":{},"headers":[],"relativePath":"guide/state.md","filePath":"guide/state.md","lastUpdated":null}'),p={name:"guide/state.md"};function i(l,a,o,c,r,d){return n(),e("div",null,[...a[0]||(a[0]=[t(`<h1 id="state-management" tabindex="-1">State Management <a class="header-anchor" href="#state-management" aria-label="Permalink to &quot;State Management&quot;">​</a></h1><p>State is the heart of HJX&#39;s reactivity system. This guide covers everything you need to know about managing state.</p><h2 id="basic-state" tabindex="-1">Basic State <a class="header-anchor" href="#basic-state" aria-label="Permalink to &quot;Basic State&quot;">​</a></h2><p>Define state using the <code>state:</code> block:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>state:</span></span>
<span class="line"><span>  count = 0</span></span>
<span class="line"><span>  name = &quot;World&quot;</span></span>
<span class="line"><span>  isActive = true</span></span></code></pre></div><h2 id="supported-types" tabindex="-1">Supported Types <a class="header-anchor" href="#supported-types" aria-label="Permalink to &quot;Supported Types&quot;">​</a></h2><p>HJX supports several data types:</p><h3 id="numbers" tabindex="-1">Numbers <a class="header-anchor" href="#numbers" aria-label="Permalink to &quot;Numbers&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>state:</span></span>
<span class="line"><span>  count = 42</span></span>
<span class="line"><span>  price = 19.99</span></span>
<span class="line"><span>  negative = -10</span></span></code></pre></div><h3 id="strings" tabindex="-1">Strings <a class="header-anchor" href="#strings" aria-label="Permalink to &quot;Strings&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>state:</span></span>
<span class="line"><span>  name = &quot;John&quot;</span></span>
<span class="line"><span>  message = &#39;Hello world&#39;</span></span>
<span class="line"><span>  empty = &quot;&quot;</span></span></code></pre></div><h3 id="booleans" tabindex="-1">Booleans <a class="header-anchor" href="#booleans" aria-label="Permalink to &quot;Booleans&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>state:</span></span>
<span class="line"><span>  isEnabled = true</span></span>
<span class="line"><span>  isComplete = false</span></span></code></pre></div><h3 id="arrays" tabindex="-1">Arrays <a class="header-anchor" href="#arrays" aria-label="Permalink to &quot;Arrays&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>state:</span></span>
<span class="line"><span>  items = [&quot;apple&quot;, &quot;banana&quot;, &quot;cherry&quot;]</span></span>
<span class="line"><span>  numbers = [1, 2, 3, 4, 5]</span></span>
<span class="line"><span>  mixed = [1, &quot;two&quot;, true]</span></span></code></pre></div><h3 id="objects" tabindex="-1">Objects <a class="header-anchor" href="#objects" aria-label="Permalink to &quot;Objects&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>state:</span></span>
<span class="line"><span>  user = { name: &quot;John&quot;, age: 30 }</span></span>
<span class="line"><span>  config = { theme: &quot;dark&quot;, lang: &quot;en&quot; }</span></span></code></pre></div><h2 id="reactive-updates" tabindex="-1">Reactive Updates <a class="header-anchor" href="#reactive-updates" aria-label="Permalink to &quot;Reactive Updates&quot;">​</a></h2><p>When state changes, the UI updates automatically:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component Demo</span></span>
<span class="line"><span></span></span>
<span class="line"><span>state:</span></span>
<span class="line"><span>  count = 0</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  view:</span></span>
<span class="line"><span>    text: &quot;Count: {{count}}&quot;</span></span>
<span class="line"><span>    button (on click -&gt; increment): &quot;Add One&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>handlers:</span></span>
<span class="line"><span>  increment:</span></span>
<span class="line"><span>    set count = count + 1</span></span></code></pre></div><p>Try clicking the button - the text updates instantly.</p><h2 id="array-operations" tabindex="-1">Array Operations <a class="header-anchor" href="#array-operations" aria-label="Permalink to &quot;Array Operations&quot;">​</a></h2><h3 id="adding-items" tabindex="-1">Adding Items <a class="header-anchor" href="#adding-items" aria-label="Permalink to &quot;Adding Items&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>handlers:</span></span>
<span class="line"><span>  add:</span></span>
<span class="line"><span>    set items = [...items, newItem]</span></span></code></pre></div><h3 id="removing-items" tabindex="-1">Removing Items <a class="header-anchor" href="#removing-items" aria-label="Permalink to &quot;Removing Items&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>handlers:</span></span>
<span class="line"><span>  remove:</span></span>
<span class="line"><span>    set items = items.filter(i =&gt; i !== target)</span></span></code></pre></div><h3 id="updating-items" tabindex="-1">Updating Items <a class="header-anchor" href="#updating-items" aria-label="Permalink to &quot;Updating Items&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>handlers:</span></span>
<span class="line"><span>  update:</span></span>
<span class="line"><span>    set items = items.map(i =&gt; i.id === id ? newValue : i)</span></span></code></pre></div><h2 id="object-updates" tabindex="-1">Object Updates <a class="header-anchor" href="#object-updates" aria-label="Permalink to &quot;Object Updates&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>handlers:</span></span>
<span class="line"><span>  updateUser:</span></span>
<span class="line"><span>    set user = { ...user, name: newName }</span></span></code></pre></div><h2 id="computed-values" tabindex="-1">Computed Values <a class="header-anchor" href="#computed-values" aria-label="Permalink to &quot;Computed Values&quot;">​</a></h2><p>There&#39;s no special computed syntax, but you can use helper functions:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component TodoList</span></span>
<span class="line"><span></span></span>
<span class="line"><span>state:</span></span>
<span class="line"><span>  items = [&quot;Learn HJX&quot;, &quot;Build something&quot;]</span></span>
<span class="line"><span>  filter = &quot;all&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  view:</span></span>
<span class="line"><span>    text: &quot;Total: {{items.length}}&quot;</span></span>
<span class="line"><span>    text: &quot;Filtered: {{filteredCount}}&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>script:</span></span>
<span class="line"><span>  export function init(store) {</span></span>
<span class="line"><span>    store.compute(&#39;filteredCount&#39;, () =&gt; {</span></span>
<span class="line"><span>      const items = store.get(&#39;items&#39;);</span></span>
<span class="line"><span>      const filter = store.get(&#39;filter&#39;);</span></span>
<span class="line"><span>      if (filter === &#39;all&#39;) return items.length;</span></span>
<span class="line"><span>      return items.filter(i =&gt; i.done).length;</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>  }</span></span></code></pre></div><h2 id="state-in-server-driven-mode" tabindex="-1">State in Server-Driven Mode <a class="header-anchor" href="#state-in-server-driven-mode" aria-label="Permalink to &quot;State in Server-Driven Mode&quot;">​</a></h2><p>In server-driven mode, state lives on the server:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component Dashboard</span></span>
<span class="line"><span></span></span>
<span class="line"><span>state:</span></span>
<span class="line"><span>  users = []</span></span>
<span class="line"><span>  cpu = 0</span></span>
<span class="line"><span></span></span>
<span class="line"><span>script:</span></span>
<span class="line"><span>  export function init(store) {</span></span>
<span class="line"><span>    setInterval(() =&gt; {</span></span>
<span class="line"><span>      store.set({</span></span>
<span class="line"><span>        cpu: Math.random() * 100,</span></span>
<span class="line"><span>        users: fetchUsers()</span></span>
<span class="line"><span>      });</span></span>
<span class="line"><span>    }, 1000);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  view:</span></span>
<span class="line"><span>    text: &quot;CPU: {{cpu}}%&quot;</span></span>
<span class="line"><span>    for (user in users):</span></span>
<span class="line"><span>      text: &quot;{{user.name}}&quot;</span></span></code></pre></div><p>The server pushes updates to all connected clients automatically.</p><h2 id="best-practices" tabindex="-1">Best Practices <a class="header-anchor" href="#best-practices" aria-label="Permalink to &quot;Best Practices&quot;">​</a></h2><ol><li><strong>Keep state minimal</strong> - Only store what you need for rendering</li><li><strong>Use meaningful names</strong> - <code>items</code> &gt; <code>arr</code>, <code>isLoading</code> &gt; <code>loading</code></li><li><strong>Group related state</strong> - Use objects for related data</li><li><strong>Avoid deeply nested state</strong> - Keep it flat when possible</li></ol><h2 id="next-steps" tabindex="-1">Next Steps <a class="header-anchor" href="#next-steps" aria-label="Permalink to &quot;Next Steps&quot;">​</a></h2><ul><li><a href="/guide/events">Event Handling</a> - Respond to user actions</li><li><a href="/language/conditionals">Control Flow</a> - Conditionals and loops</li><li><a href="/guide/server-driven">Server-Driven Mode</a> - Real-time updates</li></ul>`,41)])])}const g=s(p,[["render",i]]);export{u as __pageData,g as default};
