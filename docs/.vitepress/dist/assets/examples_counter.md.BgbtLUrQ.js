import{_ as p,o as i,c as l,ag as s,j as n,a as e,t as o}from"./chunks/framework.ePeAWSvT.js";const b=JSON.parse('{"title":"Counter Example","description":"","frontmatter":{},"headers":[],"relativePath":"examples/counter.md","filePath":"examples/counter.md","lastUpdated":1772084468000}'),c={name:"examples/counter.md"};function r(t,a,d,h,u,g){return i(),l("div",null,[a[2]||(a[2]=s(`<h1 id="counter-example" tabindex="-1">Counter Example <a class="header-anchor" href="#counter-example" aria-label="Permalink to &quot;Counter Example&quot;">​</a></h1><p>A simple counter demonstrating core HJX features: state, event handlers, and text interpolation.</p><h2 id="the-code" tabindex="-1">The Code <a class="header-anchor" href="#the-code" aria-label="Permalink to &quot;The Code&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component Counter</span></span>
<span class="line"><span></span></span>
<span class="line"><span>state:</span></span>
<span class="line"><span>  count = 0</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  view#root.card:</span></span>
<span class="line"><span>    text.title: &quot;Count: {{count}}&quot;</span></span>
<span class="line"><span>    button.primary (on click -&gt; inc): &quot;Increase&quot;</span></span>
<span class="line"><span>    button.ghost (on click -&gt; dec): &quot;Decrease&quot;</span></span>
<span class="line"><span>    button.danger (on click -&gt; reset): &quot;Reset&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>style:</span></span>
<span class="line"><span>  .card { </span></span>
<span class="line"><span>    padding: 16px; </span></span>
<span class="line"><span>    border: 1px solid #ddd; </span></span>
<span class="line"><span>    border-radius: 12px; </span></span>
<span class="line"><span>    display: inline-flex; </span></span>
<span class="line"><span>    flex-direction: column; </span></span>
<span class="line"><span>    gap: 12px; </span></span>
<span class="line"><span>    font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; </span></span>
<span class="line"><span>    min-width: 200px;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  .title { font-size: 24px; font-weight: 600; text-align: center; }</span></span>
<span class="line"><span>  .primary { padding: 10px 14px; border-radius: 10px; cursor: pointer; border: 0; background: #007bff; color: white; }</span></span>
<span class="line"><span>  .primary:hover { background: #0056b3; }</span></span>
<span class="line"><span>  .ghost { padding: 10px 14px; border-radius: 10px; cursor: pointer; border: 1px solid #ddd; background: transparent; }</span></span>
<span class="line"><span>  .ghost:hover { background: #f8f9fa; }</span></span>
<span class="line"><span>  .danger { padding: 10px 14px; border-radius: 10px; cursor: pointer; border: 0; background: #dc3545; color: white; }</span></span>
<span class="line"><span>  .danger:hover { background: #c82333; }</span></span>
<span class="line"><span>  button { font-size: 14px; font-weight: 500; transition: all 0.2s; }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>handlers:</span></span>
<span class="line"><span>  inc:</span></span>
<span class="line"><span>    set count = count + 1</span></span>
<span class="line"><span>  dec:</span></span>
<span class="line"><span>    set count = count - 1</span></span>
<span class="line"><span>  reset:</span></span>
<span class="line"><span>    set count = 0</span></span></code></pre></div><h2 id="features-demonstrated" tabindex="-1">Features Demonstrated <a class="header-anchor" href="#features-demonstrated" aria-label="Permalink to &quot;Features Demonstrated&quot;">​</a></h2><h3 id="_1-state-declaration" tabindex="-1">1. State Declaration <a class="header-anchor" href="#_1-state-declaration" aria-label="Permalink to &quot;1. State Declaration&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>state:</span></span>
<span class="line"><span>  count = 0</span></span></code></pre></div><p>Defines a reactive variable that triggers UI updates when changed.</p><h3 id="_2-text-interpolation" tabindex="-1">2. Text Interpolation <a class="header-anchor" href="#_2-text-interpolation" aria-label="Permalink to &quot;2. Text Interpolation&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>text.title: &quot;Count: {{count}}&quot;</span></span></code></pre></div>`,10)),n("p",null,[a[0]||(a[0]=e("The ",-1)),n("code",null,o(t.count),1),a[1]||(a[1]=e(" syntax inserts the state value into the text.",-1))]),a[3]||(a[3]=s(`<h3 id="_3-event-binding" tabindex="-1">3. Event Binding <a class="header-anchor" href="#_3-event-binding" aria-label="Permalink to &quot;3. Event Binding&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>button (on click -&gt; inc): &quot;Increase&quot;</span></span></code></pre></div><p>Binds the click event to the <code>inc</code> handler.</p><h3 id="_4-handler-logic" tabindex="-1">4. Handler Logic <a class="header-anchor" href="#_4-handler-logic" aria-label="Permalink to &quot;4. Handler Logic&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>handlers:</span></span>
<span class="line"><span>  inc:</span></span>
<span class="line"><span>    set count = count + 1</span></span></code></pre></div><p>Updates the state, which automatically updates the UI.</p><h3 id="_5-scoped-styling" tabindex="-1">5. Scoped Styling <a class="header-anchor" href="#_5-scoped-styling" aria-label="Permalink to &quot;5. Scoped Styling&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>style:</span></span>
<span class="line"><span>  .card { ... }</span></span></code></pre></div><p>CSS is scoped to prevent conflicts with other components.</p><h2 id="how-it-works" tabindex="-1">How It Works <a class="header-anchor" href="#how-it-works" aria-label="Permalink to &quot;How It Works&quot;">​</a></h2><ol><li><strong>Initial render</strong>: <code>count</code> is 0, displays &quot;Count: 0&quot;</li><li><strong>Click &quot;+&quot;</strong>: Handler runs, sets <code>count = 1</code>, UI updates</li><li><strong>Click &quot;-&quot;</strong>: Handler runs, sets <code>count = 0</code>, UI updates</li><li><strong>Click &quot;Reset&quot;</strong>: Handler runs, sets <code>count = 0</code>, UI updates</li></ol><h2 id="try-it" tabindex="-1">Try It <a class="header-anchor" href="#try-it" aria-label="Permalink to &quot;Try It&quot;">​</a></h2><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Build</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">node</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dist/cli.js</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> build</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> examples/counter.hjx</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --out</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dist-app</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Run dev server</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">node</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dist/cli.js</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dev</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> examples/counter.hjx</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --out</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dist-app</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --port</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 5173</span></span></code></pre></div><p>Open <a href="http://localhost:5173" target="_blank" rel="noreferrer">http://localhost:5173</a></p><h2 id="variations" tabindex="-1">Variations <a class="header-anchor" href="#variations" aria-label="Permalink to &quot;Variations&quot;">​</a></h2><h3 id="with-validation" tabindex="-1">With Validation <a class="header-anchor" href="#with-validation" aria-label="Permalink to &quot;With Validation&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>handlers:</span></span>
<span class="line"><span>  dec:</span></span>
<span class="line"><span>    if (count &gt; 0):</span></span>
<span class="line"><span>      set count = count - 1</span></span></code></pre></div><h3 id="with-steps" tabindex="-1">With Steps <a class="header-anchor" href="#with-steps" aria-label="Permalink to &quot;With Steps&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>state:</span></span>
<span class="line"><span>  count = 0</span></span>
<span class="line"><span>  step = 1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>handlers:</span></span>
<span class="line"><span>  inc:</span></span>
<span class="line"><span>    set count = count + step</span></span></code></pre></div><h3 id="with-min-max" tabindex="-1">With Min/Max <a class="header-anchor" href="#with-min-max" aria-label="Permalink to &quot;With Min/Max&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>handlers:</span></span>
<span class="line"><span>  inc:</span></span>
<span class="line"><span>    if (count &lt; 100):</span></span>
<span class="line"><span>      set count = count + 1</span></span>
<span class="line"><span>  dec:</span></span>
<span class="line"><span>    if (count &gt; 0):</span></span>
<span class="line"><span>      set count = count - 1</span></span></code></pre></div>`,21))])}const x=p(c,[["render",r]]);export{b as __pageData,x as default};
