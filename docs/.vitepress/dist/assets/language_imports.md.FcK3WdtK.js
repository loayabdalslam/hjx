import{_ as a,o as n,c as e,ag as p}from"./chunks/framework.ePeAWSvT.js";const h=JSON.parse('{"title":"Imports","description":"","frontmatter":{},"headers":[],"relativePath":"language/imports.md","filePath":"language/imports.md","lastUpdated":null}'),t={name:"language/imports.md"};function o(l,s,i,c,r,d){return n(),e("div",null,[...s[0]||(s[0]=[p(`<h1 id="imports" tabindex="-1">Imports <a class="header-anchor" href="#imports" aria-label="Permalink to &quot;Imports&quot;">​</a></h1><p>The <code>imports:</code> block allows you to use other HJX components within your component.</p><h2 id="syntax" tabindex="-1">Syntax <a class="header-anchor" href="#syntax" aria-label="Permalink to &quot;Syntax&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>imports:</span></span>
<span class="line"><span>  ComponentName from &quot;./path/to/Component.hjx&quot;</span></span>
<span class="line"><span>  AnotherComponent from &quot;./path/to/Another.hjx&quot;</span></span></code></pre></div><h2 id="using-imported-components" tabindex="-1">Using Imported Components <a class="header-anchor" href="#using-imported-components" aria-label="Permalink to &quot;Using Imported Components&quot;">​</a></h2><p>After importing, use components like built-in elements:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>imports:</span></span>
<span class="line"><span>  Button from &quot;./Button.hjx&quot;</span></span>
<span class="line"><span>  Card from &quot;./Card.hjx&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  Card (title=&quot;My Card&quot;):</span></span>
<span class="line"><span>    text: &quot;Hello from the card!&quot;</span></span>
<span class="line"><span>    Button (on click -&gt; handleClick): &quot;Click Me&quot;</span></span></code></pre></div><h2 id="props" tabindex="-1">Props <a class="header-anchor" href="#props" aria-label="Permalink to &quot;Props&quot;">​</a></h2><p>Pass data to components using props:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Card (title=&quot;Welcome&quot; class=&quot;w-[400px]&quot;)</span></span>
<span class="line"><span>Button (variant=&quot;primary&quot; disabled=false)</span></span>
<span class="line"><span>Input (placeholder=&quot;Enter text&quot; type=&quot;email&quot;)</span></span></code></pre></div><h3 id="common-props" tabindex="-1">Common Props <a class="header-anchor" href="#common-props" aria-label="Permalink to &quot;Common Props&quot;">​</a></h3><table tabindex="0"><thead><tr><th>Prop</th><th>Description</th></tr></thead><tbody><tr><td><code>title</code></td><td>Title text (for cards, etc.)</td></tr><tr><td><code>class</code></td><td>Additional CSS classes</td></tr><tr><td><code>disabled</code></td><td>Disable the element</td></tr><tr><td><code>placeholder</code></td><td>Placeholder text</td></tr><tr><td><code>type</code></td><td>Input type (text, email, password)</td></tr><tr><td><code>value</code></td><td>Input value</td></tr></tbody></table><h2 id="slots" tabindex="-1">Slots <a class="header-anchor" href="#slots" aria-label="Permalink to &quot;Slots&quot;">​</a></h2><p>Components can have slot content:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Card (title=&quot;Form&quot;):</span></span>
<span class="line"><span>  Input (bind value &lt;-&gt; email)</span></span>
<span class="line"><span>  Input (bind value &lt;-&gt; password)</span></span>
<span class="line"><span>  Button (on click -&gt; submit): &quot;Login&quot;</span></span></code></pre></div><p>The content between component tags becomes the slot content.</p><h2 id="creating-reusable-components" tabindex="-1">Creating Reusable Components <a class="header-anchor" href="#creating-reusable-components" aria-label="Permalink to &quot;Creating Reusable Components&quot;">​</a></h2><h3 id="button-hjx" tabindex="-1">Button.hjx <a class="header-anchor" href="#button-hjx" aria-label="Permalink to &quot;Button.hjx&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component Button</span></span>
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
<span class="line"><span>  }</span></span>
<span class="line"><span>  .primary { background: #007bff; color: white; }</span></span>
<span class="line"><span>  .secondary { background: #6c757d; color: white; }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>handlers:</span></span>
<span class="line"><span>  handleClick:</span></span>
<span class="line"><span>    log &quot;Button clicked!&quot;</span></span></code></pre></div><h3 id="card-hjx" tabindex="-1">Card.hjx <a class="header-anchor" href="#card-hjx" aria-label="Permalink to &quot;Card.hjx&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component Card</span></span>
<span class="line"><span></span></span>
<span class="line"><span>state:</span></span>
<span class="line"><span>  title = &quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  view.card:</span></span>
<span class="line"><span>    if (title !== &quot;&quot;):</span></span>
<span class="line"><span>      view.header: &quot;{{title}}&quot;</span></span>
<span class="line"><span>    view.content:</span></span>
<span class="line"><span>      # Slot content here</span></span>
<span class="line"><span></span></span>
<span class="line"><span>style:</span></span>
<span class="line"><span>  .card { border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; }</span></span>
<span class="line"><span>  .header { padding: 16px; border-bottom: 1px solid #e0e0e0; font-weight: 600; }</span></span>
<span class="line"><span>  .content { padding: 16px; }</span></span></code></pre></div><h2 id="relative-paths" tabindex="-1">Relative Paths <a class="header-anchor" href="#relative-paths" aria-label="Permalink to &quot;Relative Paths&quot;">​</a></h2><p>Use relative paths from the current file:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>imports:</span></span>
<span class="line"><span>  Button from &quot;./components/Button.hjx&quot;</span></span>
<span class="line"><span>  Card from &quot;./components/Card.hjx&quot;</span></span>
<span class="line"><span>  Header from &quot;../Header.hjx&quot;</span></span>
<span class="line"><span>  Base from &quot;../../BaseComponent.hjx&quot;</span></span></code></pre></div><h2 id="complete-example" tabindex="-1">Complete Example <a class="header-anchor" href="#complete-example" aria-label="Permalink to &quot;Complete Example&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component LoginForm</span></span>
<span class="line"><span></span></span>
<span class="line"><span>imports:</span></span>
<span class="line"><span>  Button from &quot;./Button.hjx&quot;</span></span>
<span class="line"><span>  Input from &quot;./Input.hjx&quot;</span></span>
<span class="line"><span>  Card from &quot;./Card.hjx&quot;</span></span>
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
<span class="line"><span>        text.error: &quot;{{message}}&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>style:</span></span>
<span class="line"><span>  .container { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f5f5f5; }</span></span>
<span class="line"><span>  .form { display: flex; flex-direction: column; gap: 12px; min-width: 300px; }</span></span>
<span class="line"><span>  .error { color: red; font-size: 14px; text-align: center; }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>handlers:</span></span>
<span class="line"><span>  login:</span></span>
<span class="line"><span>    if (email === &quot;&quot;):</span></span>
<span class="line"><span>      set message = &quot;Please enter email&quot;</span></span>
<span class="line"><span>    else if (password === &quot;&quot;):</span></span>
<span class="line"><span>      set message = &quot;Please enter password&quot;</span></span>
<span class="line"><span>    else:</span></span>
<span class="line"><span>      set message = &quot;Welcome, &quot; + email + &quot;!&quot;</span></span></code></pre></div><h2 id="best-practices" tabindex="-1">Best Practices <a class="header-anchor" href="#best-practices" aria-label="Permalink to &quot;Best Practices&quot;">​</a></h2><ol><li><strong>Organize components</strong> - Keep related components in folders</li><li><strong>Use index files</strong> - Export multiple components from one file (future)</li><li><strong>Document props</strong> - Comment expected props</li><li><strong>Keep components focused</strong> - Single responsibility</li></ol>`,28)])])}const m=a(t,[["render",o]]);export{h as __pageData,m as default};
