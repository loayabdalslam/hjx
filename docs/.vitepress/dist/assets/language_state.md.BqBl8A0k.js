import{_ as s,o as n,c as e,ag as t}from"./chunks/framework.ePeAWSvT.js";const u=JSON.parse('{"title":"State Block","description":"","frontmatter":{},"headers":[],"relativePath":"language/state.md","filePath":"language/state.md","lastUpdated":null}'),p={name:"language/state.md"};function l(i,a,o,c,r,d){return n(),e("div",null,[...a[0]||(a[0]=[t(`<h1 id="state-block" tabindex="-1">State Block <a class="header-anchor" href="#state-block" aria-label="Permalink to &quot;State Block&quot;">​</a></h1><p>The <code>state:</code> block defines reactive variables that power HJX&#39;s reactivity system.</p><h2 id="syntax" tabindex="-1">Syntax <a class="header-anchor" href="#syntax" aria-label="Permalink to &quot;Syntax&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>state:</span></span>
<span class="line"><span>  variable1 = value1</span></span>
<span class="line"><span>  variable2 = value2</span></span></code></pre></div><h2 id="supported-types" tabindex="-1">Supported Types <a class="header-anchor" href="#supported-types" aria-label="Permalink to &quot;Supported Types&quot;">​</a></h2><h3 id="numbers" tabindex="-1">Numbers <a class="header-anchor" href="#numbers" aria-label="Permalink to &quot;Numbers&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>state:</span></span>
<span class="line"><span>  count = 0</span></span>
<span class="line"><span>  price = 19.99</span></span>
<span class="line"><span>  negative = -42</span></span></code></pre></div><h3 id="strings" tabindex="-1">Strings <a class="header-anchor" href="#strings" aria-label="Permalink to &quot;Strings&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>state:</span></span>
<span class="line"><span>  name = &quot;John&quot;</span></span>
<span class="line"><span>  empty = &quot;&quot;</span></span>
<span class="line"><span>  template = &#39;Hello {{name}}&#39;</span></span></code></pre></div><h3 id="booleans" tabindex="-1">Booleans <a class="header-anchor" href="#booleans" aria-label="Permalink to &quot;Booleans&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>state:</span></span>
<span class="line"><span>  isActive = true</span></span>
<span class="line"><span>  isComplete = false</span></span></code></pre></div><h3 id="arrays" tabindex="-1">Arrays <a class="header-anchor" href="#arrays" aria-label="Permalink to &quot;Arrays&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>state:</span></span>
<span class="line"><span>  items = []</span></span>
<span class="line"><span>  fruits = [&quot;apple&quot;, &quot;banana&quot;]</span></span>
<span class="line"><span>  mixed = [1, &quot;two&quot;, true]</span></span></code></pre></div><h3 id="objects" tabindex="-1">Objects <a class="header-anchor" href="#objects" aria-label="Permalink to &quot;Objects&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>state:</span></span>
<span class="line"><span>  user = { name: &quot;John&quot;, age: 30 }</span></span>
<span class="line"><span>  config = { theme: &quot;dark&quot;, lang: &quot;en&quot; }</span></span></code></pre></div><h2 id="nested-values" tabindex="-1">Nested Values <a class="header-anchor" href="#nested-values" aria-label="Permalink to &quot;Nested Values&quot;">​</a></h2><p>Access nested values with dot notation:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>state:</span></span>
<span class="line"><span>  user = { profile: { name: &quot;John&quot; } }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  text: &quot;{{user.profile.name}}&quot;</span></span></code></pre></div><h2 id="computed-state" tabindex="-1">Computed State <a class="header-anchor" href="#computed-state" aria-label="Permalink to &quot;Computed State&quot;">​</a></h2><p>In server-driven mode, computed values can be derived:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>script:</span></span>
<span class="line"><span>  export function init(store) {</span></span>
<span class="line"><span>    store.compute(&#39;fullName&#39;, () =&gt; {</span></span>
<span class="line"><span>      const first = store.get(&#39;firstName&#39;);</span></span>
<span class="line"><span>      const last = store.get(&#39;lastName&#39;);</span></span>
<span class="line"><span>      return first + &#39; &#39; + last;</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>  }</span></span></code></pre></div><h2 id="state-updates" tabindex="-1">State Updates <a class="header-anchor" href="#state-updates" aria-label="Permalink to &quot;State Updates&quot;">​</a></h2><p>Update state in handlers:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>handlers:</span></span>
<span class="line"><span>  increment:</span></span>
<span class="line"><span>    set count = count + 1</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  addItem:</span></span>
<span class="line"><span>    set items = [...items, newItem]</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  updateUser:</span></span>
<span class="line"><span>    set user = { ...user, name: newName }</span></span></code></pre></div><h2 id="complete-example" tabindex="-1">Complete Example <a class="header-anchor" href="#complete-example" aria-label="Permalink to &quot;Complete Example&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component UserProfile</span></span>
<span class="line"><span></span></span>
<span class="line"><span>state:</span></span>
<span class="line"><span>  name = &quot;John Doe&quot;</span></span>
<span class="line"><span>  age = 30</span></span>
<span class="line"><span>  isEditing = false</span></span>
<span class="line"><span>  hobbies = [&quot;coding&quot;, &quot;reading&quot;]</span></span>
<span class="line"><span>  settings = { theme: &quot;dark&quot;, notifications: true }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  view.card:</span></span>
<span class="line"><span>    text: &quot;Name: {{name}}&quot;</span></span>
<span class="line"><span>    text: &quot;Age: {{age}}&quot;</span></span>
<span class="line"><span>    text: &quot;Hobbies: {{hobbies.length}}&quot;</span></span>
<span class="line"><span>    for (hobby in hobbies):</span></span>
<span class="line"><span>      text: &quot;• {{hobby}}&quot;</span></span>
<span class="line"><span>    if (isEditing):</span></span>
<span class="line"><span>      text: &quot;(Editing mode)&quot;</span></span>
<span class="line"><span>    button (on click -&gt; toggleEdit): &quot;Edit&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>style:</span></span>
<span class="line"><span>  .card { padding: 16px; border: 1px solid #ddd; border-radius: 8px; }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>handlers:</span></span>
<span class="line"><span>  toggleEdit:</span></span>
<span class="line"><span>    set isEditing = !isEditing</span></span></code></pre></div><h2 id="best-practices" tabindex="-1">Best Practices <a class="header-anchor" href="#best-practices" aria-label="Permalink to &quot;Best Practices&quot;">​</a></h2><ol><li><strong>Initialize all used state</strong> - No undefined variables</li><li><strong>Use appropriate types</strong> - Don&#39;t store everything as strings</li><li><strong>Keep state flat when possible</strong> - Easier to update</li><li><strong>Group related data</strong> - Use objects for related values</li></ol>`,28)])])}const b=s(p,[["render",l]]);export{u as __pageData,b as default};
