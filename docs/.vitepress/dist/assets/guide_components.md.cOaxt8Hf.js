import{_ as s,o as a,c as p,ag as e}from"./chunks/framework.ePeAWSvT.js";const h=JSON.parse('{"title":"Component Composition","description":"","frontmatter":{},"headers":[],"relativePath":"guide/components.md","filePath":"guide/components.md","lastUpdated":null}'),l={name:"guide/components.md"};function t(o,n,i,c,r,d){return a(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="component-composition" tabindex="-1">Component Composition <a class="header-anchor" href="#component-composition" aria-label="Permalink to &quot;Component Composition&quot;">​</a></h1><p>Learn how to build reusable components and compose them together.</p><h2 id="importing-components" tabindex="-1">Importing Components <a class="header-anchor" href="#importing-components" aria-label="Permalink to &quot;Importing Components&quot;">​</a></h2><p>First, import components using the <code>imports:</code> block:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>imports:</span></span>
<span class="line"><span>  Button from &quot;./Button.hjx&quot;</span></span>
<span class="line"><span>  Card from &quot;./Card.hjx&quot;</span></span>
<span class="line"><span>  Input from &quot;./Input.hjx&quot;</span></span></code></pre></div><h2 id="using-imported-components" tabindex="-1">Using Imported Components <a class="header-anchor" href="#using-imported-components" aria-label="Permalink to &quot;Using Imported Components&quot;">​</a></h2><p>Use imported components like built-in elements:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>layout:</span></span>
<span class="line"><span>  Card (title=&quot;Welcome&quot;):</span></span>
<span class="line"><span>    text: &quot;Hello, World!&quot;</span></span>
<span class="line"><span>    Button (on click -&gt; sayHello): &quot;Click Me&quot;</span></span></code></pre></div><h2 id="props" tabindex="-1">Props <a class="header-anchor" href="#props" aria-label="Permalink to &quot;Props&quot;">​</a></h2><p>Pass data to components using props in parentheses:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Card (title=&quot;My Card&quot; class=&quot;w-[400px]&quot;)</span></span></code></pre></div><p>Common props:</p><ul><li><code>title</code> - Card title</li><li><code>class</code> - Additional CSS classes</li><li><code>disabled</code> - Disable element</li><li><code>placeholder</code> - Input placeholder</li></ul><h2 id="slots" tabindex="-1">Slots <a class="header-anchor" href="#slots" aria-label="Permalink to &quot;Slots&quot;">​</a></h2><p>Slot content goes inside the component tags:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Card (title=&quot;Form&quot;):</span></span>
<span class="line"><span>  Input (bind value &lt;-&gt; name)</span></span>
<span class="line"><span>  Button (on click -&gt; submit): &quot;Submit&quot;</span></span></code></pre></div><p>The content between the component tags becomes the slot.</p><h2 id="building-reusable-components" tabindex="-1">Building Reusable Components <a class="header-anchor" href="#building-reusable-components" aria-label="Permalink to &quot;Building Reusable Components&quot;">​</a></h2><h3 id="button-component" tabindex="-1">Button Component <a class="header-anchor" href="#button-component" aria-label="Permalink to &quot;Button Component&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component Button</span></span>
<span class="line"><span></span></span>
<span class="line"><span>state:</span></span>
<span class="line"><span>  label = &quot;Button&quot;</span></span>
<span class="line"><span>  variant = &quot;primary&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  view.button (on click -&gt; handleClick):</span></span>
<span class="line"><span>    text: &quot;{{label}}&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>style:</span></span>
<span class="line"><span>  .button {</span></span>
<span class="line"><span>    padding: 10px 20px;</span></span>
<span class="line"><span>    border-radius: 6px;</span></span>
<span class="line"><span>    cursor: pointer;</span></span>
<span class="line"><span>    border: none;</span></span>
<span class="line"><span>    font-weight: 500;</span></span>
<span class="line"><span>    transition: all 0.2s;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  .primary { background: #007bff; color: white; }</span></span>
<span class="line"><span>  .secondary { background: #6c757d; color: white; }</span></span>
<span class="line"><span>  .outline { background: transparent; border: 1px solid #007bff; color: #007bff; }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>handlers:</span></span>
<span class="line"><span>  handleClick:</span></span>
<span class="line"><span>    log &quot;Button clicked!&quot;</span></span></code></pre></div><h3 id="card-component" tabindex="-1">Card Component <a class="header-anchor" href="#card-component" aria-label="Permalink to &quot;Card Component&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component Card</span></span>
<span class="line"><span></span></span>
<span class="line"><span>state:</span></span>
<span class="line"><span>  title = &quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  view.card:</span></span>
<span class="line"><span>    if (title !== &quot;&quot;):</span></span>
<span class="line"><span>      view.header: &quot;{{title}}&quot;</span></span>
<span class="line"><span>    view.content:</span></span>
<span class="line"><span>      # Slot content goes here</span></span>
<span class="line"><span></span></span>
<span class="line"><span>style:</span></span>
<span class="line"><span>  .card {</span></span>
<span class="line"><span>    border: 1px solid #e0e0e0;</span></span>
<span class="line"><span>    border-radius: 12px;</span></span>
<span class="line"><span>    overflow: hidden;</span></span>
<span class="line"><span>    background: white;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  .header {</span></span>
<span class="line"><span>    padding: 16px;</span></span>
<span class="line"><span>    border-bottom: 1px solid #e0e0e0;</span></span>
<span class="line"><span>    font-weight: 600;</span></span>
<span class="line"><span>    font-size: 18px;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  .content {</span></span>
<span class="line"><span>    padding: 16px;</span></span>
<span class="line"><span>  }</span></span></code></pre></div><h3 id="input-component" tabindex="-1">Input Component <a class="header-anchor" href="#input-component" aria-label="Permalink to &quot;Input Component&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component Input</span></span>
<span class="line"><span></span></span>
<span class="line"><span>state:</span></span>
<span class="line"><span>  value = &quot;&quot;</span></span>
<span class="line"><span>  placeholder = &quot;Enter text...&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  input.input (bind value &lt;-&gt; value) placeholder=&quot;{{placeholder}}&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>style:</span></span>
<span class="line"><span>  .input {</span></span>
<span class="line"><span>    padding: 10px 14px;</span></span>
<span class="line"><span>    border: 1px solid #ddd;</span></span>
<span class="line"><span>    border-radius: 6px;</span></span>
<span class="line"><span>    font-size: 14px;</span></span>
<span class="line"><span>    width: 100%;</span></span>
<span class="line"><span>    box-sizing: border-box;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  .input:focus {</span></span>
<span class="line"><span>    outline: none;</span></span>
<span class="line"><span>    border-color: #007bff;</span></span>
<span class="line"><span>  }</span></span></code></pre></div><h2 id="complete-example" tabindex="-1">Complete Example <a class="header-anchor" href="#complete-example" aria-label="Permalink to &quot;Complete Example&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component LoginForm</span></span>
<span class="line"><span></span></span>
<span class="line"><span>imports:</span></span>
<span class="line"><span>  Button from &quot;./Button.hjx&quot;</span></span>
<span class="line"><span>  Card from &quot;./Card.hjx&quot;</span></span>
<span class="line"><span>  Input from &quot;./Input.hjx&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>state:</span></span>
<span class="line"><span>  email = &quot;&quot;</span></span>
<span class="line"><span>  password = &quot;&quot;</span></span>
<span class="line"><span>  message = &quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  view.container:</span></span>
<span class="line"><span>    Card (title=&quot;Login&quot;):</span></span>
<span class="line"><span>      view.form:</span></span>
<span class="line"><span>        Input (placeholder=&quot;Email&quot; bind value &lt;-&gt; email)</span></span>
<span class="line"><span>        Input (placeholder=&quot;Password&quot; type=&quot;password&quot; bind value &lt;-&gt; password)</span></span>
<span class="line"><span>        Button (on click -&gt; login): &quot;Sign In&quot;</span></span>
<span class="line"><span>        text.message: &quot;{{message}}&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>style:</span></span>
<span class="line"><span>  .container {</span></span>
<span class="line"><span>    min-height: 100vh;</span></span>
<span class="line"><span>    display: flex;</span></span>
<span class="line"><span>    align-items: center;</span></span>
<span class="line"><span>    justify-content: center;</span></span>
<span class="line"><span>    background: #f5f5f5;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  .form {</span></span>
<span class="line"><span>    display: flex;</span></span>
<span class="line"><span>    flex-direction: column;</span></span>
<span class="line"><span>    gap: 12px;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  .message {</span></span>
<span class="line"><span>    text-align: center;</span></span>
<span class="line"><span>    color: #666;</span></span>
<span class="line"><span>    font-size: 14px;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>handlers:</span></span>
<span class="line"><span>  login:</span></span>
<span class="line"><span>    if (email === &quot;&quot;):</span></span>
<span class="line"><span>      set message = &quot;Please enter email&quot;</span></span>
<span class="line"><span>    else if (password === &quot;&quot;):</span></span>
<span class="line"><span>      set message = &quot;Please enter password&quot;</span></span>
<span class="line"><span>    else:</span></span>
<span class="line"><span>      set message = &quot;Welcome, &quot; + email + &quot;!&quot;</span></span></code></pre></div><h2 id="best-practices" tabindex="-1">Best Practices <a class="header-anchor" href="#best-practices" aria-label="Permalink to &quot;Best Practices&quot;">​</a></h2><ol><li><strong>One component per file</strong> - Keep components focused</li><li><strong>Use descriptive names</strong> - <code>PrimaryButton</code> &gt; <code>Btn1</code></li><li><strong>Document props</strong> - Comment what props do</li><li><strong>Style consistently</strong> - Follow your design system</li></ol><h2 id="next-steps" tabindex="-1">Next Steps <a class="header-anchor" href="#next-steps" aria-label="Permalink to &quot;Next Steps&quot;">​</a></h2><ul><li><a href="/guide/hot-reload">Hot Reload</a> - Fast development cycle</li><li><a href="/guide/production">Production Build</a> - Deploy your app</li><li><a href="/language/syntax">Language Reference</a> - Full syntax guide</li></ul>`,30)])])}const m=s(l,[["render",t]]);export{h as __pageData,m as default};
