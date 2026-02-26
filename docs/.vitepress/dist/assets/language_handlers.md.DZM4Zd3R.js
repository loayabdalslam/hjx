import{_ as s,o as n,c as e,ag as t}from"./chunks/framework.ePeAWSvT.js";const h=JSON.parse('{"title":"Handlers Block","description":"","frontmatter":{},"headers":[],"relativePath":"language/handlers.md","filePath":"language/handlers.md","lastUpdated":null}'),p={name:"language/handlers.md"};function l(i,a,o,c,r,d){return n(),e("div",null,[...a[0]||(a[0]=[t(`<h1 id="handlers-block" tabindex="-1">Handlers Block <a class="header-anchor" href="#handlers-block" aria-label="Permalink to &quot;Handlers Block&quot;">​</a></h1><p>The <code>handlers:</code> block defines event handlers that respond to user interactions.</p><h2 id="basic-syntax" tabindex="-1">Basic Syntax <a class="header-anchor" href="#basic-syntax" aria-label="Permalink to &quot;Basic Syntax&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>handlers:</span></span>
<span class="line"><span>  handlerName:</span></span>
<span class="line"><span>    # statements</span></span></code></pre></div><h2 id="statements" tabindex="-1">Statements <a class="header-anchor" href="#statements" aria-label="Permalink to &quot;Statements&quot;">​</a></h2><h3 id="set-statement" tabindex="-1">Set Statement <a class="header-anchor" href="#set-statement" aria-label="Permalink to &quot;Set Statement&quot;">​</a></h3><p>Update state variables:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>handlers:</span></span>
<span class="line"><span>  increment:</span></span>
<span class="line"><span>    set count = count + 1</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  setName:</span></span>
<span class="line"><span>    set name = &quot;John&quot;</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  setMultiple:</span></span>
<span class="line"><span>    set count = 0</span></span>
<span class="line"><span>    set name = &quot;&quot;</span></span></code></pre></div><h3 id="log-statement" tabindex="-1">Log Statement <a class="header-anchor" href="#log-statement" aria-label="Permalink to &quot;Log Statement&quot;">​</a></h3><p>Output to console:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>handlers:</span></span>
<span class="line"><span>  debug:</span></span>
<span class="line"><span>    log &quot;Button clicked!&quot;</span></span>
<span class="line"><span>    log &quot;Count is: &quot; + count</span></span></code></pre></div><h2 id="supported-operators" tabindex="-1">Supported Operators <a class="header-anchor" href="#supported-operators" aria-label="Permalink to &quot;Supported Operators&quot;">​</a></h2><h3 id="arithmetic" tabindex="-1">Arithmetic <a class="header-anchor" href="#arithmetic" aria-label="Permalink to &quot;Arithmetic&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>set count = count + 1      # Addition</span></span>
<span class="line"><span>set count = count - 1      # Subtraction</span></span>
<span class="line"><span>set count = count * 2      # Multiplication</span></span>
<span class="line"><span>set count = count / 2     # Division</span></span>
<span class="line"><span>set count = count % 10     # Modulo</span></span></code></pre></div><h3 id="comparison" tabindex="-1">Comparison <a class="header-anchor" href="#comparison" aria-label="Permalink to &quot;Comparison&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>set result = count === 0   # Equal</span></span>
<span class="line"><span>set result = count !== 0   # Not equal</span></span>
<span class="line"><span>set result = count &gt; 10    # Greater than</span></span>
<span class="line"><span>set result = count &lt; 10    # Less than</span></span>
<span class="line"><span>set result = count &gt;= 10   # Greater or equal</span></span>
<span class="line"><span>set result = count &lt;= 10   # Less or equal</span></span></code></pre></div><h3 id="logical" tabindex="-1">Logical <a class="header-anchor" href="#logical" aria-label="Permalink to &quot;Logical&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>set result = !isActive           # Not</span></span>
<span class="line"><span>set result = isValid &amp;&amp; isActive # And</span></span>
<span class="line"><span>set result = isValid || isActive # Or</span></span></code></pre></div><h3 id="string" tabindex="-1">String <a class="header-anchor" href="#string" aria-label="Permalink to &quot;String&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>set fullName = firstName + &quot; &quot; + lastName</span></span>
<span class="line"><span>set message = &quot;Hello &quot; + name + &quot;!&quot;</span></span></code></pre></div><h2 id="array-operations" tabindex="-1">Array Operations <a class="header-anchor" href="#array-operations" aria-label="Permalink to &quot;Array Operations&quot;">​</a></h2><h3 id="spread" tabindex="-1">Spread <a class="header-anchor" href="#spread" aria-label="Permalink to &quot;Spread&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>handlers:</span></span>
<span class="line"><span>  add:</span></span>
<span class="line"><span>    set items = [...items, newItem]</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  prepend:</span></span>
<span class="line"><span>    set items = [newItem, ...items]</span></span></code></pre></div><h3 id="filter" tabindex="-1">Filter <a class="header-anchor" href="#filter" aria-label="Permalink to &quot;Filter&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>handlers:</span></span>
<span class="line"><span>  remove:</span></span>
<span class="line"><span>    set items = items.filter(i =&gt; i !== target)</span></span></code></pre></div><h3 id="map" tabindex="-1">Map <a class="header-anchor" href="#map" aria-label="Permalink to &quot;Map&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>handlers:</span></span>
<span class="line"><span>  update:</span></span>
<span class="line"><span>    set items = items.map(i =&gt; i.id === id ? newValue : i)</span></span></code></pre></div><h2 id="object-operations" tabindex="-1">Object Operations <a class="header-anchor" href="#object-operations" aria-label="Permalink to &quot;Object Operations&quot;">​</a></h2><h3 id="spread-1" tabindex="-1">Spread <a class="header-anchor" href="#spread-1" aria-label="Permalink to &quot;Spread&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>handlers:</span></span>
<span class="line"><span>  updateUser:</span></span>
<span class="line"><span>    set user = { ...user, name: newName }</span></span></code></pre></div><h2 id="conditionals-in-handlers" tabindex="-1">Conditionals in Handlers <a class="header-anchor" href="#conditionals-in-handlers" aria-label="Permalink to &quot;Conditionals in Handlers&quot;">​</a></h2><p>Simple conditionals using if:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>handlers:</span></span>
<span class="line"><span>  submit:</span></span>
<span class="line"><span>    if (email === &quot;&quot;):</span></span>
<span class="line"><span>      set error = &quot;Email is required&quot;</span></span>
<span class="line"><span>    else:</span></span>
<span class="line"><span>      set error = &quot;&quot;</span></span>
<span class="line"><span>      log &quot;Submitting: &quot; + email</span></span></code></pre></div><h2 id="event-binding-syntax" tabindex="-1">Event Binding Syntax <a class="header-anchor" href="#event-binding-syntax" aria-label="Permalink to &quot;Event Binding Syntax&quot;">​</a></h2><p>In the layout block, bind handlers with:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>layout:</span></span>
<span class="line"><span>  button (on click -&gt; increment): &quot;+&quot;</span></span>
<span class="line"><span>  button (on click -&gt; decrement): &quot;-&quot;</span></span>
<span class="line"><span>  input (on input -&gt; handleInput):</span></span>
<span class="line"><span>  form (on submit -&gt; handleSubmit):</span></span></code></pre></div><h2 id="complete-example" tabindex="-1">Complete Example <a class="header-anchor" href="#complete-example" aria-label="Permalink to &quot;Complete Example&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component InteractiveDemo</span></span>
<span class="line"><span></span></span>
<span class="line"><span>state:</span></span>
<span class="line"><span>  count = 0</span></span>
<span class="line"><span>  name = &quot;&quot;</span></span>
<span class="line"><span>  items = [&quot;apple&quot;, &quot;banana&quot;]</span></span>
<span class="line"><span>  user = { name: &quot;John&quot;, age: 30 }</span></span>
<span class="line"><span>  message = &quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  view.container:</span></span>
<span class="line"><span>    view.section:</span></span>
<span class="line"><span>      text: &quot;Counter: {{count}}&quot;</span></span>
<span class="line"><span>      button (on click -&gt; increment): &quot;+&quot;</span></span>
<span class="line"><span>      button (on click -&gt; decrement): &quot;-&quot;</span></span>
<span class="line"><span>      button (on click -&gt; reset): &quot;Reset&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    view.section:</span></span>
<span class="line"><span>      input (bind value &lt;-&gt; name) placeholder=&quot;Enter name&quot;</span></span>
<span class="line"><span>      text: &quot;Hello {{name}}!&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    view.section:</span></span>
<span class="line"><span>      text: &quot;Items: {{items.length}}&quot;</span></span>
<span class="line"><span>      for (item in items):</span></span>
<span class="line"><span>        text: &quot;• {{item}}&quot;</span></span>
<span class="line"><span>      button (on click -&gt; addItem): &quot;Add Item&quot;</span></span>
<span class="line"><span>      button (on click -&gt; clearItems): &quot;Clear&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    view.section:</span></span>
<span class="line"><span>      text: &quot;Message: {{message}}&quot;</span></span>
<span class="line"><span>      button (on click -&gt; showMessage): &quot;Show Message&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>style:</span></span>
<span class="line"><span>  .container { padding: 20px; font-family: system-ui; }</span></span>
<span class="line"><span>  .section { margin-bottom: 24px; padding: 16px; border: 1px solid #ddd; border-radius: 8px; }</span></span>
<span class="line"><span>  button { margin: 4px; padding: 8px 16px; cursor: pointer; }</span></span>
<span class="line"><span>  input { padding: 8px; margin-right: 8px; }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>handlers:</span></span>
<span class="line"><span>  increment:</span></span>
<span class="line"><span>    set count = count + 1</span></span>
<span class="line"><span>    log &quot;Count: &quot; + count</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  decrement:</span></span>
<span class="line"><span>    if (count &gt; 0):</span></span>
<span class="line"><span>      set count = count - 1</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  reset:</span></span>
<span class="line"><span>    set count = 0</span></span>
<span class="line"><span>    log &quot;Counter reset&quot;</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  addItem:</span></span>
<span class="line"><span>    set items = [...items, &quot;item&quot; + items.length]</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  clearItems:</span></span>
<span class="line"><span>    set items = []</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  showMessage:</span></span>
<span class="line"><span>    if (name === &quot;&quot;):</span></span>
<span class="line"><span>      set message = &quot;Please enter a name first&quot;</span></span>
<span class="line"><span>    else:</span></span>
<span class="line"><span>      set message = &quot;Hello, &quot; + name + &quot;!&quot;</span></span></code></pre></div><h2 id="best-practices" tabindex="-1">Best Practices <a class="header-anchor" href="#best-practices" aria-label="Permalink to &quot;Best Practices&quot;">​</a></h2><ol><li><strong>Use descriptive names</strong> - <code>handleSubmit</code> &gt; <code>hs</code></li><li><strong>Keep handlers focused</strong> - One responsibility per handler</li><li><strong>Log for debugging</strong> - Use <code>log</code> during development</li><li><strong>Validate input</strong> - Check values before updating state</li></ol>`,40)])])}const g=s(p,[["render",l]]);export{h as __pageData,g as default};
