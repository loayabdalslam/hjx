import{_ as t,o as i,c as l,ag as e,j as s,a as n,t as o}from"./chunks/framework.ePeAWSvT.js";const g=JSON.parse('{"title":"Form Example","description":"","frontmatter":{},"headers":[],"relativePath":"examples/form.md","filePath":"examples/form.md","lastUpdated":1772084468000}'),r={name:"examples/form.md"};function d(p,a,c,u,h,m){return i(),l("div",null,[a[4]||(a[4]=e(`<h1 id="form-example" tabindex="-1">Form Example <a class="header-anchor" href="#form-example" aria-label="Permalink to &quot;Form Example&quot;">​</a></h1><p>A newsletter subscription form demonstrating two-way binding, form handling, and validation.</p><h2 id="the-code" tabindex="-1">The Code <a class="header-anchor" href="#the-code" aria-label="Permalink to &quot;The Code&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component SimpleForm</span></span>
<span class="line"><span></span></span>
<span class="line"><span>state:</span></span>
<span class="line"><span>  email = &quot;&quot;</span></span>
<span class="line"><span>  msg = &quot;Enter your email address&quot;</span></span>
<span class="line"><span>  submitted = false</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  view.card:</span></span>
<span class="line"><span>    text.title: &quot;Newsletter&quot;</span></span>
<span class="line"><span>    input.field (bind value &lt;-&gt; email) placeholder=&quot;your@email.com&quot;</span></span>
<span class="line"><span>    text.hint: &quot;You typed: {{email}}&quot;</span></span>
<span class="line"><span>    if (submitted):</span></span>
<span class="line"><span>      text.success: &quot;✅ {{msg}}&quot;</span></span>
<span class="line"><span>    else:</span></span>
<span class="line"><span>      text.note: &quot;{{msg}}&quot;</span></span>
<span class="line"><span>    button.primary (on click -&gt; submit): &quot;Submit&quot;</span></span>
<span class="line"><span>    if (submitted):</span></span>
<span class="line"><span>      button.secondary (on click -&gt; reset): &quot;Reset&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>style:</span></span>
<span class="line"><span>  .card { </span></span>
<span class="line"><span>    padding: 24px; </span></span>
<span class="line"><span>    border: 1px solid #e0e0e0; </span></span>
<span class="line"><span>    border-radius: 12px; </span></span>
<span class="line"><span>    font-family: system-ui, sans-serif; </span></span>
<span class="line"><span>    max-width: 360px;</span></span>
<span class="line"><span>    background: white;</span></span>
<span class="line"><span>    box-shadow: 0 2px 8px rgba(0,0,0,0.08);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  .title { font-size: 20px; font-weight: 600; margin-bottom: 16px; }</span></span>
<span class="line"><span>  .field { </span></span>
<span class="line"><span>    width: 100%; </span></span>
<span class="line"><span>    padding: 12px; </span></span>
<span class="line"><span>    border: 1px solid #ddd; </span></span>
<span class="line"><span>    border-radius: 8px; </span></span>
<span class="line"><span>    font-size: 14px;</span></span>
<span class="line"><span>    box-sizing: border-box;</span></span>
<span class="line"><span>    margin-bottom: 12px;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  .field:focus { outline: none; border-color: #007bff; }</span></span>
<span class="line"><span>  .hint { font-size: 12px; color: #666; margin-bottom: 12px; }</span></span>
<span class="line"><span>  .note { font-size: 14px; color: #666; margin-bottom: 12px; }</span></span>
<span class="line"><span>  .success { font-size: 14px; color: #28a745; font-weight: 500; margin-bottom: 12px; }</span></span>
<span class="line"><span>  .primary { </span></span>
<span class="line"><span>    width: 100%; </span></span>
<span class="line"><span>    padding: 12px; </span></span>
<span class="line"><span>    background: #007bff; </span></span>
<span class="line"><span>    color: white; </span></span>
<span class="line"><span>    border: none; </span></span>
<span class="line"><span>    border-radius: 8px; </span></span>
<span class="line"><span>    cursor: pointer; </span></span>
<span class="line"><span>    font-weight: 500;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  .primary:hover { background: #0056b3; }</span></span>
<span class="line"><span>  .secondary { </span></span>
<span class="line"><span>    width: 100%; </span></span>
<span class="line"><span>    padding: 12px; </span></span>
<span class="line"><span>    background: #6c757d; </span></span>
<span class="line"><span>    color: white; </span></span>
<span class="line"><span>    border: none; </span></span>
<span class="line"><span>    border-radius: 8px; </span></span>
<span class="line"><span>    cursor: pointer; </span></span>
<span class="line"><span>    font-weight: 500;</span></span>
<span class="line"><span>    margin-top: 8px;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>handlers:</span></span>
<span class="line"><span>  submit:</span></span>
<span class="line"><span>    if (email === &quot;&quot;):</span></span>
<span class="line"><span>      set msg = &quot;Please enter an email address&quot;</span></span>
<span class="line"><span>    else:</span></span>
<span class="line"><span>      set msg = &quot;Thank you for subscribing!&quot;</span></span>
<span class="line"><span>      set submitted = true</span></span>
<span class="line"><span>  reset:</span></span>
<span class="line"><span>    set email = &quot;&quot;</span></span>
<span class="line"><span>    set msg = &quot;Enter your email address&quot;</span></span>
<span class="line"><span>    set submitted = false</span></span></code></pre></div><h2 id="features-demonstrated" tabindex="-1">Features Demonstrated <a class="header-anchor" href="#features-demonstrated" aria-label="Permalink to &quot;Features Demonstrated&quot;">​</a></h2><h3 id="_1-two-way-binding" tabindex="-1">1. Two-Way Binding <a class="header-anchor" href="#_1-two-way-binding" aria-label="Permalink to &quot;1. Two-Way Binding&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>input (bind value &lt;-&gt; email)</span></span></code></pre></div><p>The input and state stay in sync automatically.</p><h3 id="_2-conditional-rendering" tabindex="-1">2. Conditional Rendering <a class="header-anchor" href="#_2-conditional-rendering" aria-label="Permalink to &quot;2. Conditional Rendering&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if (submitted):</span></span>
<span class="line"><span>  text.success: &quot;✅ {{msg}}&quot;</span></span>
<span class="line"><span>else:</span></span>
<span class="line"><span>  text.note: &quot;{{msg}}&quot;</span></span></code></pre></div><p>Different content based on state.</p><h3 id="_3-text-interpolation" tabindex="-1">3. Text Interpolation <a class="header-anchor" href="#_3-text-interpolation" aria-label="Permalink to &quot;3. Text Interpolation&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>text.hint: &quot;You typed: {{email}}&quot;</span></span></code></pre></div><p>Dynamic text based on state.</p><h3 id="_4-state-validation" tabindex="-1">4. State Validation <a class="header-anchor" href="#_4-state-validation" aria-label="Permalink to &quot;4. State Validation&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>handlers:</span></span>
<span class="line"><span>  submit:</span></span>
<span class="line"><span>    if (email === &quot;&quot;):</span></span>
<span class="line"><span>      set msg = &quot;Please enter an email address&quot;</span></span></code></pre></div><p>Validate before submitting.</p><h2 id="how-it-works" tabindex="-1">How It Works <a class="header-anchor" href="#how-it-works" aria-label="Permalink to &quot;How It Works&quot;">​</a></h2>`,18)),s("ol",null,[a[1]||(a[1]=s("li",null,[s("strong",null,"Type in input"),n(": "),s("code",null,"email"),n(" state updates automatically")],-1)),s("li",null,[a[0]||(a[0]=s("strong",null,"Text updates",-1)),n(': "You typed: '+o(p.email)+'" shows your input',1)]),a[2]||(a[2]=s("li",null,[s("strong",null,"Click Submit"),n(": "),s("ul",null,[s("li",null,"Empty check → show error"),s("li",null,"Valid → show success message")])],-1)),a[3]||(a[3]=s("li",null,[s("strong",null,"Click Reset"),n(": Clear form and state")],-1))]),a[5]||(a[5]=e(`<h2 id="try-it" tabindex="-1">Try It <a class="header-anchor" href="#try-it" aria-label="Permalink to &quot;Try It&quot;">​</a></h2><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">node</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dist/cli.js</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dev</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> examples/form.hjx</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --out</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dist-app</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --port</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 5173</span></span></code></pre></div><p>Open <a href="http://localhost:5173" target="_blank" rel="noreferrer">http://localhost:5173</a></p><h2 id="variations" tabindex="-1">Variations <a class="header-anchor" href="#variations" aria-label="Permalink to &quot;Variations&quot;">​</a></h2><h3 id="with-email-validation" tabindex="-1">With Email Validation <a class="header-anchor" href="#with-email-validation" aria-label="Permalink to &quot;With Email Validation&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>handlers:</span></span>
<span class="line"><span>  submit:</span></span>
<span class="line"><span>    if (email === &quot;&quot;):</span></span>
<span class="line"><span>      set msg = &quot;Email is required&quot;</span></span>
<span class="line"><span>    else if (email.indexOf(&quot;@&quot;) === -1):</span></span>
<span class="line"><span>      set msg = &quot;Please enter a valid email&quot;</span></span>
<span class="line"><span>    else:</span></span>
<span class="line"><span>      set msg = &quot;Thank you!&quot;</span></span>
<span class="line"><span>      set submitted = true</span></span></code></pre></div><h3 id="multiple-fields" tabindex="-1">Multiple Fields <a class="header-anchor" href="#multiple-fields" aria-label="Permalink to &quot;Multiple Fields&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>state:</span></span>
<span class="line"><span>  name = &quot;&quot;</span></span>
<span class="line"><span>  email = &quot;&quot;</span></span>
<span class="line"><span>  newsletter = true</span></span></code></pre></div><h3 id="auto-submit" tabindex="-1">Auto-Submit <a class="header-anchor" href="#auto-submit" aria-label="Permalink to &quot;Auto-Submit&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>layout:</span></span>
<span class="line"><span>  input (bind value &lt;-&gt; email) (on keydown -&gt; checkEnter):</span></span></code></pre></div><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>handlers:</span></span>
<span class="line"><span>  checkEnter:</span></span>
<span class="line"><span>    if (key === &quot;Enter&quot;):</span></span>
<span class="line"><span>      submit()</span></span></code></pre></div>`,11))])}const x=t(r,[["render",d]]);export{g as __pageData,x as default};
