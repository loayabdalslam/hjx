import{_ as a,o as n,c as e,ag as p}from"./chunks/framework.ePeAWSvT.js";const h=JSON.parse('{"title":"Loops","description":"","frontmatter":{},"headers":[],"relativePath":"language/loops.md","filePath":"language/loops.md","lastUpdated":null}'),t={name:"language/loops.md"};function o(l,s,i,c,d,r){return n(),e("div",null,[...s[0]||(s[0]=[p(`<h1 id="loops" tabindex="-1">Loops <a class="header-anchor" href="#loops" aria-label="Permalink to &quot;Loops&quot;">​</a></h1><p>Loops allow you to render repeated elements based on arrays.</p><h2 id="basic-syntax" tabindex="-1">Basic Syntax <a class="header-anchor" href="#basic-syntax" aria-label="Permalink to &quot;Basic Syntax&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>layout:</span></span>
<span class="line"><span>  for (item in items):</span></span>
<span class="line"><span>    view: &quot;{{item}}&quot;</span></span></code></pre></div><h2 id="array-loops" tabindex="-1">Array Loops <a class="header-anchor" href="#array-loops" aria-label="Permalink to &quot;Array Loops&quot;">​</a></h2><h3 id="simple-array" tabindex="-1">Simple Array <a class="header-anchor" href="#simple-array" aria-label="Permalink to &quot;Simple Array&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>state:</span></span>
<span class="line"><span>  items = [&quot;apple&quot;, &quot;banana&quot;, &quot;cherry&quot;]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  for (item in items):</span></span>
<span class="line"><span>    text: &quot;• {{item}}&quot;</span></span></code></pre></div><h3 id="with-index" tabindex="-1">With Index <a class="header-anchor" href="#with-index" aria-label="Permalink to &quot;With Index&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>for (item in items):</span></span>
<span class="line"><span>  text: &quot;{{index + 1}}. {{item}}&quot;</span></span></code></pre></div><h2 id="object-loops" tabindex="-1">Object Loops <a class="header-anchor" href="#object-loops" aria-label="Permalink to &quot;Object Loops&quot;">​</a></h2><p>Loop through object keys:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>state:</span></span>
<span class="line"><span>  user = { name: &quot;John&quot;, age: 30, city: &quot;NYC&quot; }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  for (key in Object.keys(user)):</span></span>
<span class="line"><span>    text: &quot;{{key}}: {{user[key]}}&quot;</span></span></code></pre></div><h2 id="nested-loops" tabindex="-1">Nested Loops <a class="header-anchor" href="#nested-loops" aria-label="Permalink to &quot;Nested Loops&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>layout:</span></span>
<span class="line"><span>  for (category in categories):</span></span>
<span class="line"><span>    view.category:</span></span>
<span class="line"><span>      text: &quot;{{category.name}}&quot;</span></span>
<span class="line"><span>      for (item in category.items):</span></span>
<span class="line"><span>        text.item: &quot;• {{item}}&quot;</span></span></code></pre></div><h2 id="complete-example" tabindex="-1">Complete Example <a class="header-anchor" href="#complete-example" aria-label="Permalink to &quot;Complete Example&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component TodoList</span></span>
<span class="line"><span></span></span>
<span class="line"><span>state:</span></span>
<span class="line"><span>  todos = [</span></span>
<span class="line"><span>    { id: 1, text: &quot;Learn HJX&quot;, done: true },</span></span>
<span class="line"><span>    { id: 2, text: &quot;Build an app&quot;, done: false },</span></span>
<span class="line"><span>    { id: 3, text: &quot;Deploy to production&quot;, done: false }</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span>  newTodo = &quot;&quot;</span></span>
<span class="line"><span>  filter = &quot;all&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  view.container:</span></span>
<span class="line"><span>    view.header:</span></span>
<span class="line"><span>      text.title: &quot;My Todo List&quot;</span></span>
<span class="line"><span>      text.count: &quot;{{todoCount}} tasks&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    view.input-section:</span></span>
<span class="line"><span>      input (bind value &lt;-&gt; newTodo) placeholder=&quot;Add new task&quot;</span></span>
<span class="line"><span>      button (on click -&gt; addTodo): &quot;Add&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    view.filters:</span></span>
<span class="line"><span>      button (on click -&gt; setFilter): &quot;All&quot;</span></span>
<span class="line"><span>      button (on click -&gt; setFilterActive): &quot;Active&quot;</span></span>
<span class="line"><span>      button (on click -&gt; setFilterDone): &quot;Done&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    view.list:</span></span>
<span class="line"><span>      for (todo in filteredTodos):</span></span>
<span class="line"><span>        view.todo-item:</span></span>
<span class="line"><span>          checkbox (on click -&gt; toggleTodo): &quot;&quot;</span></span>
<span class="line"><span>          text: &quot;{{todo.text}}&quot;</span></span>
<span class="line"><span>          if (todo.done):</span></span>
<span class="line"><span>            text.done: &quot;(done)&quot;</span></span>
<span class="line"><span>          button (on click -&gt; deleteTodo): &quot;X&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    if (todos.length === 0):</span></span>
<span class="line"><span>      view.empty: &quot;No todos yet!&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>style:</span></span>
<span class="line"><span>  .container { max-width: 500px; margin: 0 auto; padding: 20px; font-family: system-ui; }</span></span>
<span class="line"><span>  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }</span></span>
<span class="line"><span>  .title { font-size: 24px; font-weight: bold; }</span></span>
<span class="line"><span>  .input-section { display: flex; gap: 8px; margin-bottom: 16px; }</span></span>
<span class="line"><span>  .filters { display: flex; gap: 8px; margin-bottom: 16px; }</span></span>
<span class="line"><span>  .todo-item { display: flex; align-items: center; gap: 8px; padding: 8px; border-bottom: 1px solid #eee; }</span></span>
<span class="line"><span>  .done { text-decoration: line-through; color: #999; }</span></span>
<span class="line"><span>  .empty { text-align: center; color: #999; padding: 20px; }</span></span>
<span class="line"><span>  input { flex: 1; padding: 8px; }</span></span>
<span class="line"><span>  button { padding: 8px 12px; cursor: pointer; }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>handlers:</span></span>
<span class="line"><span>  addTodo:</span></span>
<span class="line"><span>    if (newTodo !== &quot;&quot;):</span></span>
<span class="line"><span>      set todos = [...todos, { id: Date.now(), text: newTodo, done: false }]</span></span>
<span class="line"><span>      set newTodo = &quot;&quot;</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  toggleTodo:</span></span>
<span class="line"><span>    set todos = todos.map(t =&gt; t.id === todo.id ? { ...t, done: !t.done } : t)</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  deleteTodo:</span></span>
<span class="line"><span>    set todos = todos.filter(t =&gt; t.id !== todo.id)</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  setFilter:</span></span>
<span class="line"><span>    set filter = &quot;all&quot;</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  setFilterActive:</span></span>
<span class="line"><span>    set filter = &quot;active&quot;</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  setFilterDone:</span></span>
<span class="line"><span>    set filter = &quot;done&quot;</span></span></code></pre></div><p>Note: The <code>filteredTodos</code> would need to be computed in the script block for server-driven mode, or you can use inline filtering:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>layout:</span></span>
<span class="line"><span>  for (todo in todos):</span></span>
<span class="line"><span>    if ((filter === &quot;all&quot;) || (filter === &quot;active&quot; &amp;&amp; !todo.done) || (filter === &quot;done&quot; &amp;&amp; todo.done)):</span></span>
<span class="line"><span>      view.item: &quot;{{todo.text}}&quot;</span></span></code></pre></div><h2 id="keyed-rendering" tabindex="-1">Keyed Rendering <a class="header-anchor" href="#keyed-rendering" aria-label="Permalink to &quot;Keyed Rendering&quot;">​</a></h2><p>HJX uses array index as key by default. For better performance with dynamic lists, consider using unique IDs.</p><h2 id="performance-tips" tabindex="-1">Performance Tips <a class="header-anchor" href="#performance-tips" aria-label="Permalink to &quot;Performance Tips&quot;">​</a></h2><ol><li><strong>Use unique keys</strong> - Prefer <code>id</code> over index</li><li><strong>Filter before rendering</strong> - Use computed values</li><li><strong>Limit list size</strong> - Paginate large lists</li></ol><h2 id="loops-with-conditionals" tabindex="-1">Loops with Conditionals <a class="header-anchor" href="#loops-with-conditionals" aria-label="Permalink to &quot;Loops with Conditionals&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>layout:</span></span>
<span class="line"><span>  for (item in items):</span></span>
<span class="line"><span>    if (item.visible):</span></span>
<span class="line"><span>      view: &quot;{{item.name}}&quot;</span></span></code></pre></div><h2 id="best-practices" tabindex="-1">Best Practices <a class="header-anchor" href="#best-practices" aria-label="Permalink to &quot;Best Practices&quot;">​</a></h2><ol><li><strong>Keep loops simple</strong> - Avoid complex logic in loop body</li><li><strong>Use meaningful variable names</strong> - <code>todo</code> &gt; <code>t</code> &gt; <code>i</code></li><li><strong>Consider pagination</strong> - For large datasets</li></ol>`,26)])])}const g=a(t,[["render",o]]);export{h as __pageData,g as default};
