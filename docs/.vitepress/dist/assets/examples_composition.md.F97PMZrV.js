import{_ as n,o as a,c as p,ag as e}from"./chunks/framework.ePeAWSvT.js";const h=JSON.parse('{"title":"Composition Example","description":"","frontmatter":{},"headers":[],"relativePath":"examples/composition.md","filePath":"examples/composition.md","lastUpdated":1772084468000}'),l={name:"examples/composition.md"};function t(i,s,o,c,r,d){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="composition-example" tabindex="-1">Composition Example <a class="header-anchor" href="#composition-example" aria-label="Permalink to &quot;Composition Example&quot;">​</a></h1><p>A complete example showing component composition, imports, props, and slots.</p><h2 id="the-code" tabindex="-1">The Code <a class="header-anchor" href="#the-code" aria-label="Permalink to &quot;The Code&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component CompositionDemo</span></span>
<span class="line"><span></span></span>
<span class="line"><span>imports:</span></span>
<span class="line"><span>  Button from &quot;./Button.hjx&quot;</span></span>
<span class="line"><span>  Input from &quot;./Input.hjx&quot;</span></span>
<span class="line"><span>  Card from &quot;./Card.hjx&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>state:</span></span>
<span class="line"><span>  name = &quot;&quot;</span></span>
<span class="line"><span>  count = 0</span></span>
<span class="line"><span>  message = &quot;Welcome to HJX Composition!&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  view.container:</span></span>
<span class="line"><span>    Card (title=&quot;Login&quot; description=&quot;Enter your details below&quot;):</span></span>
<span class="line"><span>      view.form:</span></span>
<span class="line"><span>        view.field:</span></span>
<span class="line"><span>          text.label: &quot;Username&quot;</span></span>
<span class="line"><span>          Input (placeholder=&quot;johndoe&quot; bind value &lt;-&gt; name)</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        view.field:</span></span>
<span class="line"><span>          text.label: &quot;Counter: {{count}}&quot;</span></span>
<span class="line"><span>          view.counter:</span></span>
<span class="line"><span>            Button (variant=&quot;outline&quot; on click -&gt; dec): &quot;-&quot;</span></span>
<span class="line"><span>            Button (on click -&gt; inc): &quot;+&quot;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        Button (class=&quot;w-full&quot; on click -&gt; submit): &quot;Submit&quot;</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        text.message: &quot;{{message}}&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>style:</span></span>
<span class="line"><span>  .container { </span></span>
<span class="line"><span>    min-height: 100vh; </span></span>
<span class="line"><span>    display: flex; </span></span>
<span class="line"><span>    align-items: center; </span></span>
<span class="line"><span>    justify-content: center; </span></span>
<span class="line"><span>    padding: 16px; </span></span>
<span class="line"><span>    background: #f5f5f5; </span></span>
<span class="line"><span>    font-family: system-ui, sans-serif;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  .form { display: flex; flex-direction: column; gap: 16px; }</span></span>
<span class="line"><span>  .field { display: flex; flex-direction: column; gap: 4px; }</span></span>
<span class="line"><span>  .label { font-size: 14px; font-weight: 500; color: #374151; }</span></span>
<span class="line"><span>  .counter { display: flex; gap: 8px; }</span></span>
<span class="line"><span>  .message { text-align: center; font-size: 14px; color: #6b7280; margin-top: 8px; }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>handlers:</span></span>
<span class="line"><span>  inc:</span></span>
<span class="line"><span>    set count = count + 1</span></span>
<span class="line"><span>  dec:</span></span>
<span class="line"><span>    set count = count - 1</span></span>
<span class="line"><span>  submit:</span></span>
<span class="line"><span>    set message = &quot;Hello &quot; + name + &quot;! You clicked &quot; + count + &quot; times.&quot;</span></span></code></pre></div><h2 id="features-demonstrated" tabindex="-1">Features Demonstrated <a class="header-anchor" href="#features-demonstrated" aria-label="Permalink to &quot;Features Demonstrated&quot;">​</a></h2><h3 id="_1-imports" tabindex="-1">1. Imports <a class="header-anchor" href="#_1-imports" aria-label="Permalink to &quot;1. Imports&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>imports:</span></span>
<span class="line"><span>  Button from &quot;./Button.hjx&quot;</span></span>
<span class="line"><span>  Input from &quot;./Input.hjx&quot;</span></span>
<span class="line"><span>  Card from &quot;./Card.hjx&quot;</span></span></code></pre></div><p>Import reusable components from other files.</p><h3 id="_2-props" tabindex="-1">2. Props <a class="header-anchor" href="#_2-props" aria-label="Permalink to &quot;2. Props&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Card (title=&quot;Login&quot; description=&quot;Enter your details below&quot;):</span></span></code></pre></div><p>Pass data to components using props.</p><h3 id="_3-slots" tabindex="-1">3. Slots <a class="header-anchor" href="#_3-slots" aria-label="Permalink to &quot;3. Slots&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Card (title=&quot;Login&quot;):</span></span>
<span class="line"><span>  view.form:</span></span>
<span class="line"><span>    # Slot content</span></span></code></pre></div><p>Content inside component tags becomes the slot.</p><h3 id="_4-multiple-components" tabindex="-1">4. Multiple Components <a class="header-anchor" href="#_4-multiple-components" aria-label="Permalink to &quot;4. Multiple Components&quot;">​</a></h3><p>Use imported components like built-in elements:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Input (bind value &lt;-&gt; name)</span></span>
<span class="line"><span>Button (on click -&gt; submit): &quot;Submit&quot;</span></span></code></pre></div><h2 id="component-files" tabindex="-1">Component Files <a class="header-anchor" href="#component-files" aria-label="Permalink to &quot;Component Files&quot;">​</a></h2><h3 id="button-hjx" tabindex="-1">Button.hjx <a class="header-anchor" href="#button-hjx" aria-label="Permalink to &quot;Button.hjx&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component Button</span></span>
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
<span class="line"><span>  .primary:hover { background: #0056b3; }</span></span>
<span class="line"><span>  .outline { background: transparent; border: 1px solid #007bff; color: #007bff; }</span></span>
<span class="line"><span>  .w-full { width: 100%; }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>handlers:</span></span>
<span class="line"><span>  handleClick:</span></span>
<span class="line"><span>    log &quot;Button clicked!&quot;</span></span></code></pre></div><h3 id="input-hjx" tabindex="-1">Input.hjx <a class="header-anchor" href="#input-hjx" aria-label="Permalink to &quot;Input.hjx&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component Input</span></span>
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
<span class="line"><span>    border: 1px solid #d1d5db;</span></span>
<span class="line"><span>    border-radius: 6px;</span></span>
<span class="line"><span>    font-size: 14px;</span></span>
<span class="line"><span>    width: 100%;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  .input:focus {</span></span>
<span class="line"><span>    outline: none;</span></span>
<span class="line"><span>    border-color: #007bff;</span></span>
<span class="line"><span>  }</span></span></code></pre></div><h3 id="card-hjx" tabindex="-1">Card.hjx <a class="header-anchor" href="#card-hjx" aria-label="Permalink to &quot;Card.hjx&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component Card</span></span>
<span class="line"><span></span></span>
<span class="line"><span>state:</span></span>
<span class="line"><span>  title = &quot;&quot;</span></span>
<span class="line"><span>  description = &quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  view.card:</span></span>
<span class="line"><span>    if (title !== &quot;&quot;):</span></span>
<span class="line"><span>      view.header:</span></span>
<span class="line"><span>        text.title: &quot;{{title}}&quot;</span></span>
<span class="line"><span>        if (description !== &quot;&quot;):</span></span>
<span class="line"><span>          text.description: &quot;{{description}}&quot;</span></span>
<span class="line"><span>    view.content:</span></span>
<span class="line"><span>      # Slot content</span></span>
<span class="line"><span></span></span>
<span class="line"><span>style:</span></span>
<span class="line"><span>  .card {</span></span>
<span class="line"><span>    border: 1px solid #e5e7eb;</span></span>
<span class="line"><span>    border-radius: 12px;</span></span>
<span class="line"><span>    overflow: hidden;</span></span>
<span class="line"><span>    background: white;</span></span>
<span class="line"><span>    box-shadow: 0 1px 3px rgba(0,0,0,0.1);</span></span>
<span class="line"><span>    width: 100%;</span></span>
<span class="line"><span>    max-width: 400px;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  .header {</span></span>
<span class="line"><span>    padding: 20px;</span></span>
<span class="line"><span>    border-bottom: 1px solid #e5e7eb;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  .title {</span></span>
<span class="line"><span>    font-size: 18px;</span></span>
<span class="line"><span>    font-weight: 600;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  .description {</span></span>
<span class="line"><span>    font-size: 14px;</span></span>
<span class="line"><span>    color: #6b7280;</span></span>
<span class="line"><span>    margin-top: 4px;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  .content {</span></span>
<span class="line"><span>    padding: 20px;</span></span>
<span class="line"><span>  }</span></span></code></pre></div><h2 id="try-it" tabindex="-1">Try It <a class="header-anchor" href="#try-it" aria-label="Permalink to &quot;Try It&quot;">​</a></h2><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">node</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dist/cli.js</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dev</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> examples/composition_demo.hjx</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --out</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dist-app</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --port</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 5173</span></span></code></pre></div><p>Make sure to have the component files in <code>examples/components/</code>.</p><h2 id="composition-patterns" tabindex="-1">Composition Patterns <a class="header-anchor" href="#composition-patterns" aria-label="Permalink to &quot;Composition Patterns&quot;">​</a></h2><h3 id="reusable-ui-library" tabindex="-1">Reusable UI Library <a class="header-anchor" href="#reusable-ui-library" aria-label="Permalink to &quot;Reusable UI Library&quot;">​</a></h3><p>Create a set of base components:</p><ul><li>Button, Input, Card</li><li>Modal, Dropdown, Tabs</li><li>Form, Select, Checkbox</li></ul><h3 id="feature-components" tabindex="-1">Feature Components <a class="header-anchor" href="#feature-components" aria-label="Permalink to &quot;Feature Components&quot;">​</a></h3><p>Build larger features:</p><ul><li>LoginForm, RegisterForm</li><li>UserProfile, SettingsPanel</li><li>TodoList, KanbanBoard</li></ul><h3 id="page-components" tabindex="-1">Page Components <a class="header-anchor" href="#page-components" aria-label="Permalink to &quot;Page Components&quot;">​</a></h3><p>Compose pages from features:</p><ul><li>Dashboard = Card + Metric + Chart</li><li>Admin = Table + Modal + Form</li></ul><h2 id="best-practices" tabindex="-1">Best Practices <a class="header-anchor" href="#best-practices" aria-label="Permalink to &quot;Best Practices&quot;">​</a></h2><ol><li><strong>One component per file</strong> - Keep them focused</li><li><strong>Document props</strong> - Comment expected props</li><li><strong>Consistent styling</strong> - Follow a design system</li><li><strong>Test components</strong> - Verify in isolation</li></ol>`,39)])])}const m=n(l,[["render",t]]);export{h as __pageData,m as default};
