import{_ as a,o as n,c as e,ag as i}from"./chunks/framework.ePeAWSvT.js";const k=JSON.parse('{"title":"Styling","description":"","frontmatter":{},"headers":[],"relativePath":"guide/styling.md","filePath":"guide/styling.md","lastUpdated":null}'),p={name:"guide/styling.md"};function l(t,s,o,c,d,h){return n(),e("div",null,[...s[0]||(s[0]=[i(`<h1 id="styling" tabindex="-1">Styling <a class="header-anchor" href="#styling" aria-label="Permalink to &quot;Styling&quot;">​</a></h1><p>HJX provides powerful CSS scoping and several convenience features for styling your components.</p><h2 id="basic-syntax" tabindex="-1">Basic Syntax <a class="header-anchor" href="#basic-syntax" aria-label="Permalink to &quot;Basic Syntax&quot;">​</a></h2><p>Define styles in the <code>style:</code> block:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>style:</span></span>
<span class="line"><span>  .card { padding: 16px; border: 1px solid #ddd; }</span></span>
<span class="line"><span>  .title { font-size: 24px; font-weight: bold; }</span></span></code></pre></div><h2 id="css-scoping" tabindex="-1">CSS Scoping <a class="header-anchor" href="#css-scoping" aria-label="Permalink to &quot;CSS Scoping&quot;">​</a></h2><p>Styles are automatically scoped to your component using data attributes:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component MyComponent</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  view.card: &quot;Hello&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>style:</span></span>
<span class="line"><span>  .card { color: red; }</span></span></code></pre></div><p>Compiles to:</p><div class="language-html vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> class</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;card&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> data-hjx-scope</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;mycomponent-abc123&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  Hello</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div><div class="language-css vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">.card</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">data-hjx-scope</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;mycomponent-abc123&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">] {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">red</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>This prevents style conflicts between components.</p><h2 id="class-syntax" tabindex="-1">Class Syntax <a class="header-anchor" href="#class-syntax" aria-label="Permalink to &quot;Class Syntax&quot;">​</a></h2><p>HJX supports Tailwind-like class syntax with colons:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>layout:</span></span>
<span class="line"><span>  view.flex.flex-col.gap-4.p-4:</span></span>
<span class="line"><span>    text: &quot;Hello&quot;</span></span></code></pre></div><p>This adds classes <code>flex</code>, <code>flex-col</code>, <code>gap-4</code>, and <code>p-4</code>.</p><h3 id="supported-special-characters" tabindex="-1">Supported Special Characters <a class="header-anchor" href="#supported-special-characters" aria-label="Permalink to &quot;Supported Special Characters&quot;">​</a></h3><ul><li><code>.</code> - Class separator</li><li><code>:</code> - CSS-like notation (converted to <code>-</code>)</li><li><code>#</code> - ID (e.g., <code>view#main</code>)</li><li><code>[</code> <code>]</code> - Attribute selectors (future)</li></ul><h2 id="id-and-classes-in-layout" tabindex="-1">ID and Classes in Layout <a class="header-anchor" href="#id-and-classes-in-layout" aria-label="Permalink to &quot;ID and Classes in Layout&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>layout:</span></span>
<span class="line"><span>  view#main.container.centered:</span></span>
<span class="line"><span>    text#title: &quot;Hello&quot;</span></span>
<span class="line"><span>    button.primary.large:</span></span>
<span class="line"><span>      &quot;Click me&quot;</span></span></code></pre></div><p>Renders:</p><div class="language-html vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> id</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;main&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> class</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;container centered&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">span</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> id</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;title&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;Hello&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">span</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">button</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> class</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;primary large&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;Click me&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">button</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div><h2 id="style-block-features" tabindex="-1">Style Block Features <a class="header-anchor" href="#style-block-features" aria-label="Permalink to &quot;Style Block Features&quot;">​</a></h2><h3 id="multiple-properties" tabindex="-1">Multiple Properties <a class="header-anchor" href="#multiple-properties" aria-label="Permalink to &quot;Multiple Properties&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>style:</span></span>
<span class="line"><span>  .card {</span></span>
<span class="line"><span>    padding: 16px;</span></span>
<span class="line"><span>    margin: 8px;</span></span>
<span class="line"><span>    border: 1px solid #ddd;</span></span>
<span class="line"><span>    border-radius: 8px;</span></span>
<span class="line"><span>    background: white;</span></span>
<span class="line"><span>  }</span></span></code></pre></div><h3 id="pseudo-classes" tabindex="-1">Pseudo-classes <a class="header-anchor" href="#pseudo-classes" aria-label="Permalink to &quot;Pseudo-classes&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>style:</span></span>
<span class="line"><span>  .button:hover { background: #0056b3; }</span></span>
<span class="line"><span>  .button:active { transform: scale(0.98); }</span></span>
<span class="line"><span>  input:focus { border-color: #007bff; outline: none; }</span></span></code></pre></div><h3 id="media-queries" tabindex="-1">Media Queries <a class="header-anchor" href="#media-queries" aria-label="Permalink to &quot;Media Queries&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>style:</span></span>
<span class="line"><span>  .container { width: 100%; }</span></span>
<span class="line"><span>  @media (min-width: 768px) {</span></span>
<span class="line"><span>    .container { width: 750px; margin: 0 auto; }</span></span>
<span class="line"><span>  }</span></span></code></pre></div><h3 id="keyframes" tabindex="-1">Keyframes <a class="header-anchor" href="#keyframes" aria-label="Permalink to &quot;Keyframes&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>style:</span></span>
<span class="line"><span>  @keyframes fadeIn {</span></span>
<span class="line"><span>    from { opacity: 0; }</span></span>
<span class="line"><span>    to { opacity: 1; }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  .fade-in { animation: fadeIn 0.3s ease; }</span></span></code></pre></div><h2 id="complete-example" tabindex="-1">Complete Example <a class="header-anchor" href="#complete-example" aria-label="Permalink to &quot;Complete Example&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component StyledCard</span></span>
<span class="line"><span></span></span>
<span class="line"><span>state:</span></span>
<span class="line"><span>  isExpanded = false</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  view.card (on click -&gt; toggle):</span></span>
<span class="line"><span>    view.header:</span></span>
<span class="line"><span>      text.title: &quot;Card Title&quot;</span></span>
<span class="line"><span>      text.icon: &quot;{{isExpanded ? &#39;▼&#39; : &#39;▶&#39;}}&quot;</span></span>
<span class="line"><span>    if (isExpanded):</span></span>
<span class="line"><span>      view.content:</span></span>
<span class="line"><span>        text: &quot;This is the expanded content.&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>style:</span></span>
<span class="line"><span>  .card {</span></span>
<span class="line"><span>    border: 1px solid #e0e0e0;</span></span>
<span class="line"><span>    border-radius: 12px;</span></span>
<span class="line"><span>    overflow: hidden;</span></span>
<span class="line"><span>    background: white;</span></span>
<span class="line"><span>    box-shadow: 0 2px 8px rgba(0,0,0,0.1);</span></span>
<span class="line"><span>    transition: box-shadow 0.2s;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  .card:hover {</span></span>
<span class="line"><span>    box-shadow: 0 4px 16px rgba(0,0,0,0.15);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  .header {</span></span>
<span class="line"><span>    display: flex;</span></span>
<span class="line"><span>    justify-content: space-between;</span></span>
<span class="line"><span>    align-items: center;</span></span>
<span class="line"><span>    padding: 16px;</span></span>
<span class="line"><span>    background: #f8f9fa;</span></span>
<span class="line"><span>    cursor: pointer;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  .title {</span></span>
<span class="line"><span>    font-size: 18px;</span></span>
<span class="line"><span>    font-weight: 600;</span></span>
<span class="line"><span>    color: #333;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  .icon {</span></span>
<span class="line"><span>    font-size: 12px;</span></span>
<span class="line"><span>    color: #666;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  .content {</span></span>
<span class="line"><span>    padding: 16px;</span></span>
<span class="line"><span>    border-top: 1px solid #e0e0e0;</span></span>
<span class="line"><span>    color: #555;</span></span>
<span class="line"><span>    line-height: 1.6;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>handlers:</span></span>
<span class="line"><span>  toggle:</span></span>
<span class="line"><span>    set isExpanded = !isExpanded</span></span></code></pre></div><h2 id="best-practices" tabindex="-1">Best Practices <a class="header-anchor" href="#best-practices" aria-label="Permalink to &quot;Best Practices&quot;">​</a></h2><ol><li><strong>Use semantic class names</strong> - <code>.card</code> &gt; <code>.c1</code></li><li><strong>Scope styles to component</strong> - Don&#39;t rely on global styles</li><li><strong>Use CSS variables</strong> - For theming</li><li><strong>Keep it simple</strong> - Avoid deep nesting</li></ol><h2 id="next-steps" tabindex="-1">Next Steps <a class="header-anchor" href="#next-steps" aria-label="Permalink to &quot;Next Steps&quot;">​</a></h2><ul><li><a href="/guide/components">Component Composition</a> - Reusable components</li><li><a href="/guide/server-driven">Server-Driven Mode</a> - Real-time updates</li><li><a href="/guide/production">Production Build</a> - Deploy your app</li></ul>`,37)])])}const g=a(p,[["render",l]]);export{k as __pageData,g as default};
