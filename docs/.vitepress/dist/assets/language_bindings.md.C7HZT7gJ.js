import{_ as t,o as l,c as i,ag as e,j as n,a as s,t as o}from"./chunks/framework.ePeAWSvT.js";const m=JSON.parse('{"title":"Bindings","description":"","frontmatter":{},"headers":[],"relativePath":"language/bindings.md","filePath":"language/bindings.md","lastUpdated":null}'),d={name:"language/bindings.md"};function c(p,a,u,r,b,h){return l(),i("div",null,[a[3]||(a[3]=e(`<h1 id="bindings" tabindex="-1">Bindings <a class="header-anchor" href="#bindings" aria-label="Permalink to &quot;Bindings&quot;">​</a></h1><p>Bindings keep HTML elements in sync with state variables.</p><h2 id="value-binding" tabindex="-1">Value Binding <a class="header-anchor" href="#value-binding" aria-label="Permalink to &quot;Value Binding&quot;">​</a></h2><p>Two-way binding between input and state:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>layout:</span></span>
<span class="line"><span>  input (bind value &lt;-&gt; name)</span></span></code></pre></div><p>When the user types:</p>`,6)),n("ol",null,[a[2]||(a[2]=n("li",null,[s("State "),n("code",null,"name"),s(" updates")],-1)),n("li",null,[a[0]||(a[0]=s("Text showing ",-1)),n("code",null,o(p.name),1),a[1]||(a[1]=s(" updates",-1))])]),a[4]||(a[4]=e(`<p>When state changes:</p><ol><li>Input value updates</li><li>User sees the new value</li></ol><h2 id="supported-elements" tabindex="-1">Supported Elements <a class="header-anchor" href="#supported-elements" aria-label="Permalink to &quot;Supported Elements&quot;">​</a></h2><h3 id="input" tabindex="-1">Input <a class="header-anchor" href="#input" aria-label="Permalink to &quot;Input&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>input (bind value &lt;-&gt; name)</span></span>
<span class="line"><span>input (bind value &lt;-&gt; email) placeholder=&quot;Email&quot;</span></span>
<span class="line"><span>input (bind value &lt;-&gt; password) type=&quot;password&quot;</span></span>
<span class="line"><span>input (bind value &lt;-&gt; search) placeholder=&quot;Search...&quot;</span></span></code></pre></div><h3 id="textarea" tabindex="-1">Textarea <a class="header-anchor" href="#textarea" aria-label="Permalink to &quot;Textarea&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>textarea (bind value &lt;-&gt; message):</span></span></code></pre></div><h3 id="select" tabindex="-1">Select <a class="header-anchor" href="#select" aria-label="Permalink to &quot;Select&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>select (bind value &lt;-&gt; country):</span></span>
<span class="line"><span>  option: &quot;USA&quot;</span></span>
<span class="line"><span>  option: &quot;UK&quot;</span></span>
<span class="line"><span>  option: &quot;Germany&quot;</span></span></code></pre></div><h2 id="binding-syntax" tabindex="-1">Binding Syntax <a class="header-anchor" href="#binding-syntax" aria-label="Permalink to &quot;Binding Syntax&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>bind value &lt;-&gt; stateVariable</span></span></code></pre></div><ul><li><code>stateVariable</code> - The state variable to bind to</li><li><code>value</code> - The element&#39;s value property</li><li><code>&lt;-&gt;</code> - Bidirectional sync</li></ul><h2 id="complete-example" tabindex="-1">Complete Example <a class="header-anchor" href="#complete-example" aria-label="Permalink to &quot;Complete Example&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component FormDemo</span></span>
<span class="line"><span></span></span>
<span class="line"><span>state:</span></span>
<span class="line"><span>  firstName = &quot;&quot;</span></span>
<span class="line"><span>  lastName = &quot;&quot;</span></span>
<span class="line"><span>  email = &quot;&quot;</span></span>
<span class="line"><span>  country = &quot;USA&quot;</span></span>
<span class="line"><span>  bio = &quot;&quot;</span></span>
<span class="line"><span>  subscribed = false</span></span>
<span class="line"><span>  message = &quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  view.container:</span></span>
<span class="line"><span>    view.form:</span></span>
<span class="line"><span>      view.field:</span></span>
<span class="line"><span>        text.label: &quot;First Name&quot;</span></span>
<span class="line"><span>        input (bind value &lt;-&gt; firstName) placeholder=&quot;Enter first name&quot;</span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>      view.field:</span></span>
<span class="line"><span>        text.label: &quot;Last Name&quot;</span></span>
<span class="line"><span>        input (bind value &lt;-&gt; lastName) placeholder=&quot;Enter last name&quot;</span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>      view.field:</span></span>
<span class="line"><span>        text.label: &quot;Email&quot;</span></span>
<span class="line"><span>        input (bind value &lt;-&gt; email) type=&quot;email&quot; placeholder=&quot;Enter email&quot;</span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>      view.field:</span></span>
<span class="line"><span>        text.label: &quot;Country&quot;</span></span>
<span class="line"><span>        select (bind value &lt;-&gt; country):</span></span>
<span class="line"><span>          option: &quot;USA&quot;</span></span>
<span class="line"><span>          option: &quot;UK&quot;</span></span>
<span class="line"><span>          option: &quot;Canada&quot;</span></span>
<span class="line"><span>          option: &quot;Germany&quot;</span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>      view.field:</span></span>
<span class="line"><span>        text.label: &quot;Bio&quot;</span></span>
<span class="line"><span>        textarea (bind value &lt;-&gt; bio) placeholder=&quot;Tell us about yourself&quot;:</span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>      view.field:</span></span>
<span class="line"><span>        checkbox (bind value &lt;-&gt; subscribed):</span></span>
<span class="line"><span>        text: &quot;Subscribe to newsletter&quot;</span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>      view.actions:</span></span>
<span class="line"><span>        button.submit (on click -&gt; submit): &quot;Submit&quot;</span></span>
<span class="line"><span>        button.clear (on click -&gt; clear): &quot;Clear&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    view.preview:</span></span>
<span class="line"><span>      text.title: &quot;Preview&quot;</span></span>
<span class="line"><span>      text: &quot;Name: {{firstName}} {{lastName}}&quot;</span></span>
<span class="line"><span>      text: &quot;Email: {{email}}&quot;</span></span>
<span class="line"><span>      text: &quot;Country: {{country}}&quot;</span></span>
<span class="line"><span>      text: &quot;Bio: {{bio}}&quot;</span></span>
<span class="line"><span>      text: &quot;Subscribed: {{subscribed ? &#39;Yes&#39; : &#39;No&#39;}}&quot;</span></span>
<span class="line"><span>      </span></span>
<span class="line"><span>      if (message !== &quot;&quot;):</span></span>
<span class="line"><span>        text.message: &quot;{{message}}&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>style:</span></span>
<span class="line"><span>  .container { max-width: 800px; margin: 0 auto; padding: 20px; font-family: system-ui; }</span></span>
<span class="line"><span>  .form, .preview { flex: 1; padding: 20px; }</span></span>
<span class="line"><span>  .field { margin-bottom: 16px; }</span></span>
<span class="line"><span>  .label { display: block; margin-bottom: 4px; font-weight: 500; }</span></span>
<span class="line"><span>  input, select, textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }</span></span>
<span class="line"><span>  textarea { min-height: 80px; }</span></span>
<span class="line"><span>  .actions { display: flex; gap: 8px; margin-top: 16px; }</span></span>
<span class="line"><span>  button { padding: 10px 20px; cursor: pointer; border: none; border-radius: 4px; }</span></span>
<span class="line"><span>  .submit { background: #007bff; color: white; }</span></span>
<span class="line"><span>  .clear { background: #6c757d; color: white; }</span></span>
<span class="line"><span>  .preview { background: #f8f9fa; border-radius: 8px; }</span></span>
<span class="line"><span>  .title { font-size: 18px; font-weight: bold; margin-bottom: 12px; }</span></span>
<span class="line"><span>  .message { margin-top: 16px; padding: 12px; background: #d4edda; border-radius: 4px; color: #155724; }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>handlers:</span></span>
<span class="line"><span>  submit:</span></span>
<span class="line"><span>    if (firstName === &quot;&quot;):</span></span>
<span class="line"><span>      set message = &quot;Please enter first name&quot;</span></span>
<span class="line"><span>    else if (email === &quot;&quot;):</span></span>
<span class="line"><span>      set message = &quot;Please enter email&quot;</span></span>
<span class="line"><span>    else:</span></span>
<span class="line"><span>      set message = &quot;Form submitted! Hello, &quot; + firstName + &quot;!&quot;</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  clear:</span></span>
<span class="line"><span>    set firstName = &quot;&quot;</span></span>
<span class="line"><span>    set lastName = &quot;&quot;</span></span>
<span class="line"><span>    set email = &quot;&quot;</span></span>
<span class="line"><span>    set country = &quot;USA&quot;</span></span>
<span class="line"><span>    set bio = &quot;&quot;</span></span>
<span class="line"><span>    set subscribed = false</span></span>
<span class="line"><span>    set message = &quot;&quot;</span></span></code></pre></div><h2 id="binding-vs-event-handlers" tabindex="-1">Binding vs Event Handlers <a class="header-anchor" href="#binding-vs-event-handlers" aria-label="Permalink to &quot;Binding vs Event Handlers&quot;">​</a></h2><table tabindex="0"><thead><tr><th>Feature</th><th>Binding</th><th>Handler</th></tr></thead><tbody><tr><td>Auto sync</td><td>Yes</td><td>No</td></tr><tr><td>Use case</td><td>Forms</td><td>Actions</td></tr><tr><td>Syntax</td><td><code>(bind value &lt;-&gt; var)</code></td><td><code>(on click -&gt; handler)</code></td></tr></tbody></table><h2 id="combining-bindings-and-handlers" tabindex="-1">Combining Bindings and Handlers <a class="header-anchor" href="#combining-bindings-and-handlers" aria-label="Permalink to &quot;Combining Bindings and Handlers&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>layout:</span></span>
<span class="line"><span>  input (bind value &lt;-&gt; search) (on input -&gt; search):</span></span>
<span class="line"><span>  button (on click -&gt; clearSearch): &quot;Clear&quot;</span></span></code></pre></div><h2 id="best-practices" tabindex="-1">Best Practices <a class="header-anchor" href="#best-practices" aria-label="Permalink to &quot;Best Practices&quot;">​</a></h2><ol><li><strong>Use bindings for forms</strong> - Keeps data in sync</li><li><strong>Use handlers for actions</strong> - Click, submit, etc.</li><li><strong>Validate on submit</strong> - Don&#39;t over-validate on input</li><li><strong>Reset properly</strong> - Clear form after submission</li></ol>`,20))])}const q=t(d,[["render",c]]);export{m as __pageData,q as default};
