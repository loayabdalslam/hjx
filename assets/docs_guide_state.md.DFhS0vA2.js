import{_ as s,o as n,c as e,ag as t}from"./chunks/framework.CvgP6Fyv.js";const r=JSON.parse('{"title":"State Management","description":"","frontmatter":{},"headers":[],"relativePath":"docs/guide/state.md","filePath":"docs/guide/state.md","lastUpdated":1774477216000}'),p={name:"docs/guide/state.md"};function i(l,a,o,c,d,u){return n(),e("div",null,[...a[0]||(a[0]=[t(`<h1 id="state-management" tabindex="-1">State Management <a class="header-anchor" href="#state-management" aria-label="Permalink to &quot;State Management&quot;">​</a></h1><p>HJX has built-in reactive state management. State changes automatically trigger UI updates.</p><h2 id="defining-state" tabindex="-1">Defining State <a class="header-anchor" href="#defining-state" aria-label="Permalink to &quot;Defining State&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>state:</span></span>
<span class="line"><span>  count = 0</span></span>
<span class="line"><span>  name = &quot;World&quot;</span></span>
<span class="line"><span>  isActive = true</span></span>
<span class="line"><span>  items = [&quot;a&quot;, &quot;b&quot;, &quot;c&quot;]</span></span></code></pre></div><h2 id="using-state-in-layout" tabindex="-1">Using State in Layout <a class="header-anchor" href="#using-state-in-layout" aria-label="Permalink to &quot;Using State in Layout&quot;">​</a></h2><p>Reference state variables in text:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>layout:</span></span>
<span class="line"><span>  text: &quot;Hello {{name}}&quot;</span></span>
<span class="line"><span>  text: &quot;Count: {{count}}&quot;</span></span></code></pre></div><h2 id="updating-state" tabindex="-1">Updating State <a class="header-anchor" href="#updating-state" aria-label="Permalink to &quot;Updating State&quot;">​</a></h2><p>Use handlers to update state:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>handlers:</span></span>
<span class="line"><span>  increment:</span></span>
<span class="line"><span>    set count = count + 1</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  decrement:</span></span>
<span class="line"><span>    set count = count - 1</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  reset:</span></span>
<span class="line"><span>    set count = 0</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  setName:</span></span>
<span class="line"><span>    set name = &quot;New Name&quot;</span></span></code></pre></div><h2 id="state-reactivity" tabindex="-1">State Reactivity <a class="header-anchor" href="#state-reactivity" aria-label="Permalink to &quot;State Reactivity&quot;">​</a></h2><p>When state changes, the UI updates automatically:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component Counter</span></span>
<span class="line"><span></span></span>
<span class="line"><span>state:</span></span>
<span class="line"><span>  count = 0</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  view:</span></span>
<span class="line"><span>    text: &quot;Count: {{count}}&quot;</span></span>
<span class="line"><span>    button (on click -&gt; increment): &quot;+&quot;</span></span>
<span class="line"><span>    button (on click -&gt; decrement): &quot;-&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>handlers:</span></span>
<span class="line"><span>  increment:</span></span>
<span class="line"><span>    set count = count + 1</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  decrement:</span></span>
<span class="line"><span>    set count = count - 1</span></span></code></pre></div><h2 id="computed-values" tabindex="-1">Computed Values <a class="header-anchor" href="#computed-values" aria-label="Permalink to &quot;Computed Values&quot;">​</a></h2><p>Computed values are derived state that automatically update when dependencies change. See <a href="./computed-values">Computed Values</a> for the complete guide.</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>state:</span></span>
<span class="line"><span>  price = 25</span></span>
<span class="line"><span>  quantity = 3</span></span>
<span class="line"><span></span></span>
<span class="line"><span>computed:</span></span>
<span class="line"><span>  total = &quot;price * quantity&quot;</span></span>
<span class="line"><span>  formattedTotal = &quot;&#39;$&#39; + total&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  text: &quot;Total: {{formattedTotal}}&quot;</span></span></code></pre></div><p>Computed values support:</p><ul><li><strong>Automatic updates</strong> when dependencies change</li><li><strong>Chaining</strong> (computed values can depend on other computed values)</li><li><strong>Expressions</strong> (math, string operations, array methods)</li><li><strong>Memoization</strong> (only recalculates when needed)</li></ul><h2 id="state-with-arrays" tabindex="-1">State with Arrays <a class="header-anchor" href="#state-with-arrays" aria-label="Permalink to &quot;State with Arrays&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>state:</span></span>
<span class="line"><span>  todos = [&quot;Buy milk&quot;, &quot;Walk dog&quot;]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>handlers:</span></span>
<span class="line"><span>  addTodo:</span></span>
<span class="line"><span>    set todos = todos + [&quot;New task&quot;]</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  clearTodos:</span></span>
<span class="line"><span>    set todos = []</span></span></code></pre></div><h2 id="state-with-objects" tabindex="-1">State with Objects <a class="header-anchor" href="#state-with-objects" aria-label="Permalink to &quot;State with Objects&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>state:</span></span>
<span class="line"><span>  user = { name: &quot;Alice&quot;, age: 30 }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>handlers:</span></span>
<span class="line"><span>  birthday:</span></span>
<span class="line"><span>    set user = { name: user.name, age: user.age + 1 }</span></span></code></pre></div><h2 id="two-way-binding" tabindex="-1">Two-Way Binding <a class="header-anchor" href="#two-way-binding" aria-label="Permalink to &quot;Two-Way Binding&quot;">​</a></h2><p>For input elements, use two-way binding:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>layout:</span></span>
<span class="line"><span>  input (bind value -&gt; username)</span></span>
<span class="line"><span>  text: &quot;Hello {{username}}&quot;</span></span></code></pre></div><p>This automatically:</p><ul><li>Displays the state value in the input</li><li>Updates state when the input changes</li></ul><h2 id="conditional-rendering" tabindex="-1">Conditional Rendering <a class="header-anchor" href="#conditional-rendering" aria-label="Permalink to &quot;Conditional Rendering&quot;">​</a></h2><p>Use state to conditionally show/hide elements:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>state:</span></span>
<span class="line"><span>  isLoggedIn = false</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  if (isLoggedIn):</span></span>
<span class="line"><span>    view.dashboard: &quot;Welcome!&quot;</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  if (!isLoggedIn):</span></span>
<span class="line"><span>    view.login: &quot;Please log in&quot;</span></span></code></pre></div><h2 id="list-rendering" tabindex="-1">List Rendering <a class="header-anchor" href="#list-rendering" aria-label="Permalink to &quot;List Rendering&quot;">​</a></h2><p>Use state arrays with <code>for</code>:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>state:</span></span>
<span class="line"><span>  items = [&quot;Apple&quot;, &quot;Banana&quot;, &quot;Cherry&quot;]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  for (item in items):</span></span>
<span class="line"><span>    view.item: &quot;{{item}}&quot;</span></span></code></pre></div>`,33)])])}const g=s(p,[["render",i]]);export{r as __pageData,g as default};
