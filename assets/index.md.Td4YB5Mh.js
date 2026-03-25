import{_ as e,o as n,c as s,ag as t}from"./chunks/framework.CvgP6Fyv.js";const m=JSON.parse('{"title":"","description":"","frontmatter":{"layout":"home","hero":{"name":"HJX","text":"A Compiled UI Language","tagline":"Unify structure, style, and logic into a single .hjx file","actions":[{"theme":"brand","text":"Get Started","link":"/guide/getting-started"},{"theme":"alt","text":"View Examples","link":"/examples/counter"}]},"features":[{"title":"Single File Components","details":"Write HTML, CSS, and JavaScript in one .hjx file. No more jumping between multiple files."},{"title":"Zero Dependencies","details":"Compiles to clean, dependency-free HTML, CSS, and JavaScript. Runs anywhere."},{"title":"Reactive State","details":"Built-in state management with automatic UI updates when state changes."},{"title":"Server-Driven Mode","details":"Optional server-driven state management via WebSocket for complex applications."},{"title":"Hot Reload","details":"Fast development cycle with instant updates as you type."},{"title":"TypeScript Support","details":"Full TypeScript support with type-safe runtime APIs."}]},"headers":[],"relativePath":"index.md","filePath":"index.md","lastUpdated":1774399458000}'),p={name:"index.md"};function i(l,a,o,c,r,d){return n(),s("div",null,[...a[0]||(a[0]=[t(`<h2 id="quick-example" tabindex="-1">Quick Example <a class="header-anchor" href="#quick-example" aria-label="Permalink to &quot;Quick Example&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component Counter</span></span>
<span class="line"><span></span></span>
<span class="line"><span>state:</span></span>
<span class="line"><span>  count = 0</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  view.card:</span></span>
<span class="line"><span>    text: &quot;Count: {{count}}&quot;</span></span>
<span class="line"><span>    button (on click -&gt; inc): &quot;Increase&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>style:</span></span>
<span class="line"><span>  .card { padding: 20px; }</span></span>
<span class="line"><span>  button { cursor: pointer; }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>handlers:</span></span>
<span class="line"><span>  inc:</span></span>
<span class="line"><span>    set count = count + 1</span></span></code></pre></div><p>Compiles to clean, readable HTML, CSS, and JavaScript with zero dependencies.</p>`,3)])])}const h=e(p,[["render",i]]);export{m as __pageData,h as default};
