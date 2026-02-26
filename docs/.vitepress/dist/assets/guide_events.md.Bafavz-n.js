import{_ as a,o as s,c as e,ag as p}from"./chunks/framework.ePeAWSvT.js";const h=JSON.parse('{"title":"Event Handling","description":"","frontmatter":{},"headers":[],"relativePath":"guide/events.md","filePath":"guide/events.md","lastUpdated":null}'),t={name:"guide/events.md"};function l(i,n,o,c,d,u){return s(),e("div",null,[...n[0]||(n[0]=[p(`<h1 id="event-handling" tabindex="-1">Event Handling <a class="header-anchor" href="#event-handling" aria-label="Permalink to &quot;Event Handling&quot;">​</a></h1><p>Learn how to handle user interactions in HJX.</p><h2 id="basic-event-binding" tabindex="-1">Basic Event Binding <a class="header-anchor" href="#basic-event-binding" aria-label="Permalink to &quot;Basic Event Binding&quot;">​</a></h2><p>Attach event handlers using the <code>(on &lt;event&gt; -&gt; &lt;handler&gt;)</code> syntax:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>layout:</span></span>
<span class="line"><span>  button (on click -&gt; handleClick): &quot;Click Me&quot;</span></span></code></pre></div><p>Supported events include:</p><ul><li><code>click</code> - Mouse click</li><li><code>input</code> - Input value change</li><li><code>change</code> - Input blur after change</li><li><code>submit</code> - Form submission</li><li><code>keydown</code> - Keyboard press</li><li><code>keyup</code> - Keyboard release</li><li><code>focus</code> - Element gains focus</li><li><code>blur</code> - Element loses focus</li><li><code>mouseenter</code> - Mouse enters element</li><li><code>mouseleave</code> - Mouse leaves element</li></ul><h2 id="handler-definition" tabindex="-1">Handler Definition <a class="header-anchor" href="#handler-definition" aria-label="Permalink to &quot;Handler Definition&quot;">​</a></h2><p>Define handlers in the <code>handlers:</code> block:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>handlers:</span></span>
<span class="line"><span>  handleClick:</span></span>
<span class="line"><span>    set count = count + 1</span></span>
<span class="line"><span>    log &quot;Button clicked!&quot;</span></span></code></pre></div><h2 id="multiple-handlers" tabindex="-1">Multiple Handlers <a class="header-anchor" href="#multiple-handlers" aria-label="Permalink to &quot;Multiple Handlers&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>layout:</span></span>
<span class="line"><span>  button (on click -&gt; increment): &quot;+&quot;</span></span>
<span class="line"><span>  button (on click -&gt; decrement): &quot;-&quot;</span></span>
<span class="line"><span>  button (on click -&gt; reset): &quot;Reset&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>handlers:</span></span>
<span class="line"><span>  increment:</span></span>
<span class="line"><span>    set count = count + 1</span></span>
<span class="line"><span>  decrement:</span></span>
<span class="line"><span>    set count = count - 1</span></span>
<span class="line"><span>  reset:</span></span>
<span class="line"><span>    set count = 0</span></span></code></pre></div><h2 id="form-events" tabindex="-1">Form Events <a class="header-anchor" href="#form-events" aria-label="Permalink to &quot;Form Events&quot;">​</a></h2><h3 id="input-binding" tabindex="-1">Input Binding <a class="header-anchor" href="#input-binding" aria-label="Permalink to &quot;Input Binding&quot;">​</a></h3><p>Two-way binding keeps state in sync with input:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>layout:</span></span>
<span class="line"><span>  input (bind value &lt;-&gt; name)</span></span>
<span class="line"><span>  text: &quot;Hello {{name}}!&quot;</span></span></code></pre></div><p>The <code>bind value &lt;-&gt; stateVar</code> syntax:</p><ul><li>Updates state when input changes</li><li>Updates input when state changes</li></ul><h3 id="form-submission" tabindex="-1">Form Submission <a class="header-anchor" href="#form-submission" aria-label="Permalink to &quot;Form Submission&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>layout:</span></span>
<span class="line"><span>  form (on submit -&gt; handleSubmit):</span></span>
<span class="line"><span>    input (bind value &lt;-&gt; email)</span></span>
<span class="line"><span>    button type=&quot;submit&quot;: &quot;Submit&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>handlers:</span></span>
<span class="line"><span>  handleSubmit:</span></span>
<span class="line"><span>    log &quot;Submitted: &quot; + email</span></span></code></pre></div><p>Prevent default form submission by returning false in your handler (handled automatically).</p><h2 id="keyboard-events" tabindex="-1">Keyboard Events <a class="header-anchor" href="#keyboard-events" aria-label="Permalink to &quot;Keyboard Events&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>layout:</span></span>
<span class="line"><span>  input (on keydown -&gt; handleKey):</span></span>
<span class="line"><span>    text (on keyup -&gt; handleKeyUp):</span></span>
<span class="line"><span></span></span>
<span class="line"><span>handlers:</span></span>
<span class="line"><span>  handleKey:</span></span>
<span class="line"><span>    log &quot;Key down!&quot;</span></span>
<span class="line"><span>  handleKeyUp:</span></span>
<span class="line"><span>    log &quot;Key up!&quot;</span></span></code></pre></div><h2 id="accessing-event-data" tabindex="-1">Accessing Event Data <a class="header-anchor" href="#accessing-event-data" aria-label="Permalink to &quot;Accessing Event Data&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>handlers:</span></span>
<span class="line"><span>  handleClick:</span></span>
<span class="line"><span>    # Simple counter</span></span>
<span class="line"><span>    set count = count + 1</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>  handleInput:</span></span>
<span class="line"><span>    # Input value is automatically synced via binding</span></span>
<span class="line"><span>    set message = &quot;You typed: &quot; + inputValue</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>  handleKey:</span></span>
<span class="line"><span>    # Access key directly</span></span>
<span class="line"><span>    if (key === &quot;Enter&quot;):</span></span>
<span class="line"><span>      log &quot;Enter pressed!&quot;</span></span></code></pre></div><h2 id="event-modifiers" tabindex="-1">Event Modifiers <a class="header-anchor" href="#event-modifiers" aria-label="Permalink to &quot;Event Modifiers&quot;">​</a></h2><p>Currently supported inline:</p><ul><li><code>(on click -&gt; handler)</code> - Basic click</li><li><code>(on click.stop -&gt; handler)</code> - Stop propagation (future)</li><li><code>(on click.prevent -&gt; handler)</code> - Prevent default (future)</li></ul><h2 id="complete-example" tabindex="-1">Complete Example <a class="header-anchor" href="#complete-example" aria-label="Permalink to &quot;Complete Example&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component InteractiveForm</span></span>
<span class="line"><span></span></span>
<span class="line"><span>state:</span></span>
<span class="line"><span>  name = &quot;&quot;</span></span>
<span class="line"><span>  email = &quot;&quot;</span></span>
<span class="line"><span>  submitted = false</span></span>
<span class="line"><span>  clicks = 0</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  view.container:</span></span>
<span class="line"><span>    text.title: &quot;Event Demo&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    view.section:</span></span>
<span class="line"><span>      text: &quot;Click count: {{clicks}}&quot;</span></span>
<span class="line"><span>      button (on click -&gt; increment): &quot;Click Me&quot;</span></span>
<span class="line"><span>      button (on click -&gt; reset): &quot;Reset&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    view.section:</span></span>
<span class="line"><span>      text: &quot;Two-way binding:&quot;</span></span>
<span class="line"><span>      input.name-input (bind value &lt;-&gt; name) placeholder=&quot;Enter name&quot;</span></span>
<span class="line"><span>      text: &quot;Hello {{name}}!&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    view.section:</span></span>
<span class="line"><span>      text: &quot;Form:&quot;</span></span>
<span class="line"><span>      input.email-input (bind value &lt;-&gt; email) placeholder=&quot;Enter email&quot;</span></span>
<span class="line"><span>      button (on click -&gt; submit): &quot;Submit&quot;</span></span>
<span class="line"><span>      if (submitted):</span></span>
<span class="line"><span>        text.success: &quot;Submitted!&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>style:</span></span>
<span class="line"><span>  .container { padding: 20px; font-family: system-ui; }</span></span>
<span class="line"><span>  .section { margin-bottom: 20px; padding: 16px; border: 1px solid #ddd; border-radius: 8px; }</span></span>
<span class="line"><span>  .title { font-size: 24px; font-weight: bold; margin-bottom: 16px; }</span></span>
<span class="line"><span>  .success { color: green; font-weight: bold; }</span></span>
<span class="line"><span>  input { padding: 8px; margin-right: 8px; border: 1px solid #ccc; border-radius: 4px; }</span></span>
<span class="line"><span>  button { padding: 8px 16px; cursor: pointer; background: #007bff; color: white; border: none; border-radius: 4px; }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>handlers:</span></span>
<span class="line"><span>  increment:</span></span>
<span class="line"><span>    set clicks = clicks + 1</span></span>
<span class="line"><span>  reset:</span></span>
<span class="line"><span>    set clicks = 0</span></span>
<span class="line"><span>  submit:</span></span>
<span class="line"><span>    set submitted = true</span></span>
<span class="line"><span>    log &quot;Form submitted with email: &quot; + email</span></span></code></pre></div><h2 id="best-practices" tabindex="-1">Best Practices <a class="header-anchor" href="#best-practices" aria-label="Permalink to &quot;Best Practices&quot;">​</a></h2><ol><li><strong>Use descriptive handler names</strong> - <code>handleSubmit</code> &gt; <code>hs</code> &gt; <code>f1</code></li><li><strong>Keep handlers focused</strong> - One action per handler</li><li><strong>Leverage two-way binding</strong> - Use <code>bind value</code> for forms</li><li><strong>Log for debugging</strong> - Use <code>log</code> statements during development</li></ol><h2 id="next-steps" tabindex="-1">Next Steps <a class="header-anchor" href="#next-steps" aria-label="Permalink to &quot;Next Steps&quot;">​</a></h2><ul><li><a href="/guide/state">State Management</a> - Reactive state</li><li><a href="/guide/styling">Styling</a> - Make it look good</li><li><a href="/language/conditionals">Control Flow</a> - Conditionals and loops</li></ul>`,34)])])}const g=a(t,[["render",l]]);export{h as __pageData,g as default};
