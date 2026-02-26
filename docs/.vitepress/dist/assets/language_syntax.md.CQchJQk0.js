import{_ as a,o as s,c as e,ag as p}from"./chunks/framework.ePeAWSvT.js";const h=JSON.parse('{"title":"Syntax Overview","description":"","frontmatter":{},"headers":[],"relativePath":"language/syntax.md","filePath":"language/syntax.md","lastUpdated":null}'),t={name:"language/syntax.md"};function l(i,n,o,c,d,r){return s(),e("div",null,[...n[0]||(n[0]=[p(`<h1 id="syntax-overview" tabindex="-1">Syntax Overview <a class="header-anchor" href="#syntax-overview" aria-label="Permalink to &quot;Syntax Overview&quot;">​</a></h1><p>This document provides a complete reference for the HJX syntax.</p><h2 id="file-structure" tabindex="-1">File Structure <a class="header-anchor" href="#file-structure" aria-label="Permalink to &quot;File Structure&quot;">​</a></h2><p>Every <code>.hjx</code> file has this structure:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component &lt;Name&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>imports:           # Optional</span></span>
<span class="line"><span>  Component from &quot;./Component.hjx&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>state:             # Optional</span></span>
<span class="line"><span>  variable = value</span></span>
<span class="line"><span></span></span>
<span class="line"><span>script:            # Optional</span></span>
<span class="line"><span>  export function init(store) {}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:            # Required</span></span>
<span class="line"><span>  view: &quot;content&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>style:             # Optional</span></span>
<span class="line"><span>  .class { }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>handlers:          # Optional</span></span>
<span class="line"><span>  handlerName:</span></span>
<span class="line"><span>    # statements</span></span></code></pre></div><h2 id="block-syntax" tabindex="-1">Block Syntax <a class="header-anchor" href="#block-syntax" aria-label="Permalink to &quot;Block Syntax&quot;">​</a></h2><p>Each block starts with a keyword followed by a colon:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component: Name    # ❌ Invalid</span></span>
<span class="line"><span>component Name    # ✅ Invalid  </span></span>
<span class="line"><span>component:        # ✅ Declares component (name on next line)</span></span></code></pre></div><p>The correct format:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component Name    # ✅ Component declaration</span></span>
<span class="line"><span>  imports:        # ✅ Block starts with colon</span></span>
<span class="line"><span>  state:          # ✅ Another block</span></span></code></pre></div><h2 id="indentation" tabindex="-1">Indentation <a class="header-anchor" href="#indentation" aria-label="Permalink to &quot;Indentation&quot;">​</a></h2><p>HJX uses <strong>indentation</strong> to define hierarchy:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>layout:</span></span>
<span class="line"><span>  view:           # Indented 2 spaces</span></span>
<span class="line"><span>    text:         # Indented 4 spaces</span></span>
<span class="line"><span>    button:       # Indented 4 spaces</span></span></code></pre></div><p>Use <strong>2 or 4 spaces</strong> consistently. Tabs are not recommended.</p><h2 id="comments" tabindex="-1">Comments <a class="header-anchor" href="#comments" aria-label="Permalink to &quot;Comments&quot;">​</a></h2><p>Comments start with <code>#</code>:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># This is a comment</span></span>
<span class="line"><span>component Counter</span></span>
<span class="line"><span>  state:</span></span>
<span class="line"><span>    count = 0  # Inline comment</span></span></code></pre></div><h2 id="case-sensitivity" tabindex="-1">Case Sensitivity <a class="header-anchor" href="#case-sensitivity" aria-label="Permalink to &quot;Case Sensitivity&quot;">​</a></h2><ul><li><strong>Keywords</strong> are lowercase: <code>component</code>, <code>state</code>, <code>layout</code>, <code>style</code></li><li><strong>Component names</strong> are PascalCase: <code>MyComponent</code></li><li><strong>Variables</strong> are camelCase: <code>myVariable</code></li></ul><h2 id="reserved-words" tabindex="-1">Reserved Words <a class="header-anchor" href="#reserved-words" aria-label="Permalink to &quot;Reserved Words&quot;">​</a></h2><p>These words cannot be used as variable names:</p><ul><li><code>component</code>, <code>imports</code>, <code>state</code>, <code>script</code>, <code>layout</code>, <code>style</code>, <code>handlers</code></li><li><code>if</code>, <code>for</code>, <code>true</code>, <code>false</code>, <code>null</code>, <code>undefined</code></li></ul><h2 id="encoding" tabindex="-1">Encoding <a class="header-anchor" href="#encoding" aria-label="Permalink to &quot;Encoding&quot;">​</a></h2><p>Files should be UTF-8 encoded.</p><h2 id="line-endings" tabindex="-1">Line Endings <a class="header-anchor" href="#line-endings" aria-label="Permalink to &quot;Line Endings&quot;">​</a></h2><p>Use Unix-style line endings (<code>\\n</code>) for best compatibility.</p><h2 id="complete-example" tabindex="-1">Complete Example <a class="header-anchor" href="#complete-example" aria-label="Permalink to &quot;Complete Example&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component Demo</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Import other components</span></span>
<span class="line"><span>imports:</span></span>
<span class="line"><span>  Button from &quot;./Button.hjx&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Reactive state variables</span></span>
<span class="line"><span>state:</span></span>
<span class="line"><span>  count = 0</span></span>
<span class="line"><span>  name = &quot;World&quot;</span></span>
<span class="line"><span>  items = [&quot;a&quot;, &quot;b&quot;, &quot;c&quot;]</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Server-side initialization (server-driven mode)</span></span>
<span class="line"><span>script:</span></span>
<span class="line"><span>  export function init(store) {</span></span>
<span class="line"><span>    setInterval(() =&gt; {</span></span>
<span class="line"><span>      store.set({ count: store.get(&#39;count&#39;) + 1 });</span></span>
<span class="line"><span>    }, 1000);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span># UI layout with indentation</span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  view#app.container:</span></span>
<span class="line"><span>    text.title: &quot;Hello {{name}}!&quot;</span></span>
<span class="line"><span>    text: &quot;Count: {{count}}&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    # Conditional</span></span>
<span class="line"><span>    if (count &gt; 10):</span></span>
<span class="line"><span>      text.warning: &quot;High count!&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    # Loop</span></span>
<span class="line"><span>    for (item in items):</span></span>
<span class="line"><span>      text.item: &quot;• {{item}}&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    # Event binding</span></span>
<span class="line"><span>    button (on click -&gt; increment): &quot;+&quot;</span></span>
<span class="line"><span>    button (on click -&gt; decrement): &quot;-&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Scoped CSS</span></span>
<span class="line"><span>style:</span></span>
<span class="line"><span>  .container { padding: 20px; font-family: system-ui; }</span></span>
<span class="line"><span>  .title { font-size: 24px; font-weight: bold; }</span></span>
<span class="line"><span>  .warning { color: red; }</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Event handlers</span></span>
<span class="line"><span>handlers:</span></span>
<span class="line"><span>  increment:</span></span>
<span class="line"><span>    set count = count + 1</span></span>
<span class="line"><span>  decrement:</span></span>
<span class="line"><span>    set count = count - 1</span></span></code></pre></div><h2 id="next-steps" tabindex="-1">Next Steps <a class="header-anchor" href="#next-steps" aria-label="Permalink to &quot;Next Steps&quot;">​</a></h2><ul><li><a href="/language/component">Component Declaration</a></li><li><a href="/language/state">State Block</a></li><li><a href="/language/layout">Layout Block</a></li><li><a href="/language/style">Style Block</a></li><li><a href="/language/handlers">Handlers Block</a></li></ul>`,30)])])}const m=a(t,[["render",l]]);export{h as __pageData,m as default};
