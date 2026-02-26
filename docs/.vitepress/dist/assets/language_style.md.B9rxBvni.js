import{_ as a,o as n,c as e,ag as p}from"./chunks/framework.ePeAWSvT.js";const u=JSON.parse('{"title":"Style Block","description":"","frontmatter":{},"headers":[],"relativePath":"language/style.md","filePath":"language/style.md","lastUpdated":null}'),l={name:"language/style.md"};function i(t,s,c,o,d,r){return n(),e("div",null,[...s[0]||(s[0]=[p(`<h1 id="style-block" tabindex="-1">Style Block <a class="header-anchor" href="#style-block" aria-label="Permalink to &quot;Style Block&quot;">​</a></h1><p>The <code>style:</code> block defines CSS that is automatically scoped to the component.</p><h2 id="basic-syntax" tabindex="-1">Basic Syntax <a class="header-anchor" href="#basic-syntax" aria-label="Permalink to &quot;Basic Syntax&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>style:</span></span>
<span class="line"><span>  .class-name { property: value; }</span></span></code></pre></div><h2 id="automatic-scoping" tabindex="-1">Automatic Scoping <a class="header-anchor" href="#automatic-scoping" aria-label="Permalink to &quot;Automatic Scoping&quot;">​</a></h2><p>Styles are scoped using data attributes:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component Card</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  view.card: &quot;Content&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>style:</span></span>
<span class="line"><span>  .card { padding: 16px; }</span></span></code></pre></div><p>Compiles to:</p><div class="language-css vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">.card</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">data-hjx-scope</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;card-abc123&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">] {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  padding</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">16</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">px</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h2 id="selectors" tabindex="-1">Selectors <a class="header-anchor" href="#selectors" aria-label="Permalink to &quot;Selectors&quot;">​</a></h2><h3 id="class-selectors" tabindex="-1">Class Selectors <a class="header-anchor" href="#class-selectors" aria-label="Permalink to &quot;Class Selectors&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>style:</span></span>
<span class="line"><span>  .button { padding: 10px; }</span></span>
<span class="line"><span>  .card.container { padding: 20px; }</span></span></code></pre></div><h3 id="id-selectors" tabindex="-1">ID Selectors <a class="header-anchor" href="#id-selectors" aria-label="Permalink to &quot;ID Selectors&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>style:</span></span>
<span class="line"><span>  #main { min-height: 100vh; }</span></span></code></pre></div><h3 id="element-selectors" tabindex="-1">Element Selectors <a class="header-anchor" href="#element-selectors" aria-label="Permalink to &quot;Element Selectors&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>style:</span></span>
<span class="line"><span>  view { display: block; }</span></span>
<span class="line"><span>  text { color: #333; }</span></span></code></pre></div><h3 id="attribute-selectors" tabindex="-1">Attribute Selectors <a class="header-anchor" href="#attribute-selectors" aria-label="Permalink to &quot;Attribute Selectors&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>style:</span></span>
<span class="line"><span>  [disabled] { opacity: 0.5; }</span></span></code></pre></div><h2 id="pseudo-classes" tabindex="-1">Pseudo-classes <a class="header-anchor" href="#pseudo-classes" aria-label="Permalink to &quot;Pseudo-classes&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>style:</span></span>
<span class="line"><span>  .button:hover { background: #0056b3; }</span></span>
<span class="line"><span>  .button:active { transform: scale(0.98); }</span></span>
<span class="line"><span>  input:focus { border-color: #007bff; }</span></span>
<span class="line"><span>  .link:visited { color: purple; }</span></span></code></pre></div><h2 id="pseudo-elements" tabindex="-1">Pseudo-elements <a class="header-anchor" href="#pseudo-elements" aria-label="Permalink to &quot;Pseudo-elements&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>style:</span></span>
<span class="line"><span>  .clearfix::after { content: &quot;&quot;; clear: both; display: table; }</span></span>
<span class="line"><span>  .first-letter::first-letter { font-size: 2em; }</span></span></code></pre></div><h2 id="media-queries" tabindex="-1">Media Queries <a class="header-anchor" href="#media-queries" aria-label="Permalink to &quot;Media Queries&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>style:</span></span>
<span class="line"><span>  .container { width: 100%; }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  @media (min-width: 768px) {</span></span>
<span class="line"><span>    .container { width: 750px; margin: 0 auto; }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  @media (max-width: 480px) {</span></span>
<span class="line"><span>    .container { padding: 10px; }</span></span>
<span class="line"><span>  }</span></span></code></pre></div><h2 id="keyframes" tabindex="-1">Keyframes <a class="header-anchor" href="#keyframes" aria-label="Permalink to &quot;Keyframes&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>style:</span></span>
<span class="line"><span>  @keyframes fadeIn {</span></span>
<span class="line"><span>    from { opacity: 0; }</span></span>
<span class="line"><span>    to { opacity: 1; }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  .fade-in { animation: fadeIn 0.3s ease; }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  @keyframes pulse {</span></span>
<span class="line"><span>    0%, 100% { opacity: 1; }</span></span>
<span class="line"><span>    50% { opacity: 0.5; }</span></span>
<span class="line"><span>  }</span></span></code></pre></div><h2 id="css-variables" tabindex="-1">CSS Variables <a class="header-anchor" href="#css-variables" aria-label="Permalink to &quot;CSS Variables&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>style:</span></span>
<span class="line"><span>  :root {</span></span>
<span class="line"><span>    --primary: #007bff;</span></span>
<span class="line"><span>    --secondary: #6c757d;</span></span>
<span class="line"><span>    --spacing: 8px;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  .button {</span></span>
<span class="line"><span>    background: var(--primary);</span></span>
<span class="line"><span>    padding: var(--spacing);</span></span>
<span class="line"><span>  }</span></span></code></pre></div><h2 id="nesting" tabindex="-1">Nesting <a class="header-anchor" href="#nesting" aria-label="Permalink to &quot;Nesting&quot;">​</a></h2><p>Standard CSS doesn&#39;t support nesting. Use flat selectors:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>style:</span></span>
<span class="line"><span>  .parent { }</span></span>
<span class="line"><span>  .parent .child { }</span></span>
<span class="line"><span>  .parent &gt; .direct-child { }</span></span></code></pre></div><h2 id="complete-example" tabindex="-1">Complete Example <a class="header-anchor" href="#complete-example" aria-label="Permalink to &quot;Complete Example&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component StyledCard</span></span>
<span class="line"><span></span></span>
<span class="line"><span>state:</span></span>
<span class="line"><span>  isActive = false</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  view.card (on click -&gt; toggle):</span></span>
<span class="line"><span>    view.header: &quot;Card Title&quot;</span></span>
<span class="line"><span>    view.content: &quot;Click to {{isActive ? &#39;close&#39; : &#39;open&#39;}}&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>style:</span></span>
<span class="line"><span>  .card {</span></span>
<span class="line"><span>    border: 1px solid #e0e0e0;</span></span>
<span class="line"><span>    border-radius: 12px;</span></span>
<span class="line"><span>    overflow: hidden;</span></span>
<span class="line"><span>    background: white;</span></span>
<span class="line"><span>    box-shadow: 0 2px 8px rgba(0,0,0,0.1);</span></span>
<span class="line"><span>    transition: all 0.2s ease;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  .card:hover {</span></span>
<span class="line"><span>    box-shadow: 0 4px 16px rgba(0,0,0,0.15);</span></span>
<span class="line"><span>    cursor: pointer;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  .card.active {</span></span>
<span class="line"><span>    border-color: #007bff;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  .header {</span></span>
<span class="line"><span>    padding: 16px;</span></span>
<span class="line"><span>    border-bottom: 1px solid #e0e0e0;</span></span>
<span class="line"><span>    font-weight: 600;</span></span>
<span class="line"><span>    font-size: 18px;</span></span>
<span class="line"><span>    background: #f8f9fa;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  .content {</span></span>
<span class="line"><span>    padding: 16px;</span></span>
<span class="line"><span>    color: #555;</span></span>
<span class="line"><span>    line-height: 1.6;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>handlers:</span></span>
<span class="line"><span>  toggle:</span></span>
<span class="line"><span>    set isActive = !isActive</span></span></code></pre></div><h2 id="tailwind-like-classes" tabindex="-1">Tailwind-like Classes <a class="header-anchor" href="#tailwind-like-classes" aria-label="Permalink to &quot;Tailwind-like Classes&quot;">​</a></h2><p>HJX supports using Tailwind-style class names in layout:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>layout:</span></span>
<span class="line"><span>  view.flex.flex-col.gap-4.p-4.bg-white:</span></span>
<span class="line"><span>    text.text-xl.font-bold: &quot;Title&quot;</span></span></code></pre></div><p>These are passed through as-is to the HTML class attribute.</p><h2 id="best-practices" tabindex="-1">Best Practices <a class="header-anchor" href="#best-practices" aria-label="Permalink to &quot;Best Practices&quot;">​</a></h2><ol><li><strong>Use scoped styles</strong> - Avoid global styles</li><li><strong>Use meaningful names</strong> - <code>.card</code> &gt; <code>.c1</code></li><li><strong>Keep specificity low</strong> - Avoid deeply nested selectors</li><li><strong>Use CSS variables</strong> - For theming and reuse</li></ol>`,39)])])}const g=a(l,[["render",i]]);export{u as __pageData,g as default};
