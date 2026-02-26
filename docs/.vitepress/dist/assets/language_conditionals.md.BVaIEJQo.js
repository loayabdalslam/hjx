import{_ as n,o as a,c as e,ag as p}from"./chunks/framework.ePeAWSvT.js";const h=JSON.parse('{"title":"Conditionals","description":"","frontmatter":{},"headers":[],"relativePath":"language/conditionals.md","filePath":"language/conditionals.md","lastUpdated":null}'),t={name:"language/conditionals.md"};function i(l,s,o,c,d,r){return a(),e("div",null,[...s[0]||(s[0]=[p(`<h1 id="conditionals" tabindex="-1">Conditionals <a class="header-anchor" href="#conditionals" aria-label="Permalink to &quot;Conditionals&quot;">​</a></h1><p>Conditionals allow you to show or hide elements based on state.</p><h2 id="basic-syntax" tabindex="-1">Basic Syntax <a class="header-anchor" href="#basic-syntax" aria-label="Permalink to &quot;Basic Syntax&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>layout:</span></span>
<span class="line"><span>  if (condition):</span></span>
<span class="line"><span>    view: &quot;This shows when true&quot;</span></span></code></pre></div><h2 id="supported-conditions" tabindex="-1">Supported Conditions <a class="header-anchor" href="#supported-conditions" aria-label="Permalink to &quot;Supported Conditions&quot;">​</a></h2><h3 id="boolean" tabindex="-1">Boolean <a class="header-anchor" href="#boolean" aria-label="Permalink to &quot;Boolean&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if (isVisible):</span></span>
<span class="line"><span>  view: &quot;Visible&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if (!isHidden):</span></span>
<span class="line"><span>  view: &quot;Not hidden&quot;</span></span></code></pre></div><h3 id="comparison" tabindex="-1">Comparison <a class="header-anchor" href="#comparison" aria-label="Permalink to &quot;Comparison&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if (count &gt; 0):</span></span>
<span class="line"><span>  view: &quot;Has items&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if (name === &quot;John&quot;):</span></span>
<span class="line"><span>  view: &quot;Hello John&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if (age &gt;= 18):</span></span>
<span class="line"><span>  view: &quot;Adult&quot;</span></span></code></pre></div><h3 id="multiple-conditions" tabindex="-1">Multiple Conditions <a class="header-anchor" href="#multiple-conditions" aria-label="Permalink to &quot;Multiple Conditions&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if (isActive &amp;&amp; count &gt; 0):</span></span>
<span class="line"><span>  view: &quot;Active with items&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>if (isValid || isAdmin):</span></span>
<span class="line"><span>  view: &quot;Can access&quot;</span></span></code></pre></div><h2 id="if-else" tabindex="-1">If-Else <a class="header-anchor" href="#if-else" aria-label="Permalink to &quot;If-Else&quot;">​</a></h2><p>Use multiple if blocks for else:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if (isLoggedIn):</span></span>
<span class="line"><span>  text: &quot;Welcome!&quot;</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>if (!isLoggedIn):</span></span>
<span class="line"><span>  text: &quot;Please log in&quot;</span></span></code></pre></div><p>Or use ternary in text:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>text: &quot;{{isLoggedIn ? &#39;Welcome!&#39; : &#39;Please log in&#39;}}&quot;</span></span></code></pre></div><h2 id="complete-example" tabindex="-1">Complete Example <a class="header-anchor" href="#complete-example" aria-label="Permalink to &quot;Complete Example&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component ConditionalDemo</span></span>
<span class="line"><span></span></span>
<span class="line"><span>state:</span></span>
<span class="line"><span>  isLoggedIn = false</span></span>
<span class="line"><span>  count = 0</span></span>
<span class="line"><span>  role = &quot;user&quot;</span></span>
<span class="line"><span>  items = []</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  view.container:</span></span>
<span class="line"><span>    # Boolean condition</span></span>
<span class="line"><span>    if (isLoggedIn):</span></span>
<span class="line"><span>      view.welcome: &quot;Welcome back!&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    # Negation</span></span>
<span class="line"><span>    if (!isLoggedIn):</span></span>
<span class="line"><span>      view.please-login: &quot;Please log in&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    # Comparison</span></span>
<span class="line"><span>    if (count &gt; 0):</span></span>
<span class="line"><span>      view: &quot;Count: {{count}}&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    if (count === 0):</span></span>
<span class="line"><span>      view: &quot;No items&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    # Multiple conditions</span></span>
<span class="line"><span>    if (isLoggedIn &amp;&amp; role === &quot;admin&quot;):</span></span>
<span class="line"><span>      view.admin-panel: &quot;Admin Panel&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    if (role === &quot;user&quot; || role === &quot;admin&quot;):</span></span>
<span class="line"><span>      view.user-panel: &quot;User Panel&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    # Toggle button</span></span>
<span class="line"><span>    button (on click -&gt; toggleLogin): &quot;{{isLoggedIn ? &#39;Logout&#39; : &#39;Login&#39;}}&quot;</span></span>
<span class="line"><span>    button (on click -&gt; increment): &quot;Add Item&quot;</span></span>
<span class="line"><span>    button (on click -&gt; decrement): &quot;Remove Item&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>style:</span></span>
<span class="line"><span>  .container { padding: 20px; font-family: system-ui; }</span></span>
<span class="line"><span>  .welcome { color: green; font-weight: bold; }</span></span>
<span class="line"><span>  .please-login { color: #666; }</span></span>
<span class="line"><span>  .admin-panel { background: #fff3cd; padding: 12px; border-radius: 4px; }</span></span>
<span class="line"><span>  .user-panel { background: #d4edda; padding: 12px; border-radius: 4px; }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>handlers:</span></span>
<span class="line"><span>  toggleLogin:</span></span>
<span class="line"><span>    set isLoggedIn = !isLoggedIn</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  increment:</span></span>
<span class="line"><span>    set count = count + 1</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  decrement:</span></span>
<span class="line"><span>    if (count &gt; 0):</span></span>
<span class="line"><span>      set count = count - 1</span></span></code></pre></div><h2 id="nested-conditionals" tabindex="-1">Nested Conditionals <a class="header-anchor" href="#nested-conditionals" aria-label="Permalink to &quot;Nested Conditionals&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>layout:</span></span>
<span class="line"><span>  if (isLoggedIn):</span></span>
<span class="line"><span>    if (role === &quot;admin&quot;):</span></span>
<span class="line"><span>      view: &quot;Admin content&quot;</span></span>
<span class="line"><span>    else:</span></span>
<span class="line"><span>      view: &quot;User content&quot;</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  if (!isLoggedIn):</span></span>
<span class="line"><span>    view: &quot;Please log in&quot;</span></span></code></pre></div><h2 id="complete-with-else-if-pattern" tabindex="-1">Complete with Else-If Pattern <a class="header-anchor" href="#complete-with-else-if-pattern" aria-label="Permalink to &quot;Complete with Else-If Pattern&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>layout:</span></span>
<span class="line"><span>  if (status === &quot;loading&quot;):</span></span>
<span class="line"><span>    text: &quot;Loading...&quot;</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  if (status === &quot;error&quot;):</span></span>
<span class="line"><span>    text: &quot;Error occurred&quot;</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  if (status === &quot;success&quot;):</span></span>
<span class="line"><span>    text: &quot;Success!&quot;</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  if (status === &quot;idle&quot;):</span></span>
<span class="line"><span>    text: &quot;Ready&quot;</span></span></code></pre></div><h2 id="best-practices" tabindex="-1">Best Practices <a class="header-anchor" href="#best-practices" aria-label="Permalink to &quot;Best Practices&quot;">​</a></h2><ol><li><strong>Keep conditions simple</strong> - Complex logic in handlers</li><li><strong>Use early returns</strong> - Check edge cases first</li><li><strong>Consider ternary</strong> - For simple text changes</li></ol><h2 id="supported-operators" tabindex="-1">Supported Operators <a class="header-anchor" href="#supported-operators" aria-label="Permalink to &quot;Supported Operators&quot;">​</a></h2><table tabindex="0"><thead><tr><th>Operator</th><th>Description</th></tr></thead><tbody><tr><td><code>===</code></td><td>Strict equality</td></tr><tr><td><code>!==</code></td><td>Strict inequality</td></tr><tr><td><code>&gt;</code></td><td>Greater than</td></tr><tr><td><code>&lt;</code></td><td>Less than</td></tr><tr><td><code>&gt;=</code></td><td>Greater or equal</td></tr><tr><td><code>&lt;=</code></td><td>Less or equal</td></tr><tr><td><code>!</code></td><td>Not</td></tr><tr><td><code>&amp;&amp;</code></td><td>And</td></tr><tr><td>\`</td><td></td></tr></tbody></table>`,26)])])}const g=n(t,[["render",i]]);export{h as __pageData,g as default};
