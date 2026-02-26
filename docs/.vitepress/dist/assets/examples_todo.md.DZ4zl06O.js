import{_ as a,o as n,c as e,ag as t}from"./chunks/framework.ePeAWSvT.js";const u=JSON.parse('{"title":"Todo List Example","description":"","frontmatter":{},"headers":[],"relativePath":"examples/todo.md","filePath":"examples/todo.md","lastUpdated":null}'),p={name:"examples/todo.md"};function i(l,s,o,d,c,r){return n(),e("div",null,[...s[0]||(s[0]=[t(`<h1 id="todo-list-example" tabindex="-1">Todo List Example <a class="header-anchor" href="#todo-list-example" aria-label="Permalink to &quot;Todo List Example&quot;">​</a></h1><p>A complete todo list with add, remove, filter, and toggle functionality.</p><h2 id="the-code" tabindex="-1">The Code <a class="header-anchor" href="#the-code" aria-label="Permalink to &quot;The Code&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component TodoList</span></span>
<span class="line"><span></span></span>
<span class="line"><span>state:</span></span>
<span class="line"><span>  items = [&quot;Learn HJX&quot;, &quot;Build a UI&quot;, &quot;Deploy to production&quot;]</span></span>
<span class="line"><span>  newItem = &quot;&quot;</span></span>
<span class="line"><span>  showCompleted = false</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  view.container:</span></span>
<span class="line"><span>    view.header:</span></span>
<span class="line"><span>      text.title: &quot;My Todo List&quot;</span></span>
<span class="line"><span>      text.count: &quot;Items: {{items.length}} tasks&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    view.input-section:</span></span>
<span class="line"><span>      input.todo-input (bind value &lt;-&gt; newItem) placeholder=&quot;Add new task...&quot;</span></span>
<span class="line"><span>      button.add-btn (on click -&gt; addItem): &quot;Add&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    view.filters:</span></span>
<span class="line"><span>      button (on click -&gt; showAll): &quot;All&quot;</span></span>
<span class="line"><span>      button (on click -&gt; showActive): &quot;Active&quot;</span></span>
<span class="line"><span>      button (on click -&gt; showCompleted): &quot;Completed&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    view.list:</span></span>
<span class="line"><span>      for (item in filteredItems):</span></span>
<span class="line"><span>        view.todo-item:</span></span>
<span class="line"><span>          checkbox (on click -&gt; toggleItem) item.id:</span></span>
<span class="line"><span>          text: &quot;{{item.text}}&quot;</span></span>
<span class="line"><span>          if (item.done):</span></span>
<span class="line"><span>            text.done: &quot;(done)&quot;</span></span>
<span class="line"><span>          button.delete (on click -&gt; deleteItem): &quot;×&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    if (items.length === 0):</span></span>
<span class="line"><span>      view.empty: &quot;No todos yet! Add one above.&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    view.footer:</span></span>
<span class="line"><span>      text.stats: &quot;{{completedCount}} of {{items.length}} completed&quot;</span></span>
<span class="line"><span>      button (on click -&gt; clearCompleted): &quot;Clear Completed&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>style:</span></span>
<span class="line"><span>  .container { max-width: 500px; margin: 0 auto; padding: 24px; font-family: system-ui, sans-serif; }</span></span>
<span class="line"><span>  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }</span></span>
<span class="line"><span>  .title { font-size: 28px; font-weight: 700; }</span></span>
<span class="line"><span>  .count { font-size: 14px; color: #666; }</span></span>
<span class="line"><span>  .input-section { display: flex; gap: 8px; margin-bottom: 16px; }</span></span>
<span class="line"><span>  .todo-input { flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; }</span></span>
<span class="line"><span>  .add-btn { padding: 12px 20px; background: #007bff; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; }</span></span>
<span class="line"><span>  .filters { display: flex; gap: 8px; margin-bottom: 16px; }</span></span>
<span class="line"><span>  .filters button { padding: 8px 16px; background: #f8f9fa; border: 1px solid #ddd; border-radius: 6px; cursor: pointer; }</span></span>
<span class="line"><span>  .filters button.active { background: #007bff; color: white; border-color: #007bff; }</span></span>
<span class="line"><span>  .todo-item { display: flex; align-items: center; gap: 8px; padding: 12px; border-bottom: 1px solid #eee; }</span></span>
<span class="line"><span>  .todo-item:hover { background: #f8f9fa; }</span></span>
<span class="line"><span>  .done { text-decoration: line-through; color: #999; }</span></span>
<span class="line"><span>  .delete { padding: 4px 8px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; }</span></span>
<span class="line"><span>  .empty { text-align: center; color: #999; padding: 40px; }</span></span>
<span class="line"><span>  .footer { margin-top: 20px; padding-top: 16px; border-top: 1px solid #eee; }</span></span>
<span class="line"><span>  .stats { font-size: 14px; color: #666; }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>handlers:</span></span>
<span class="line"><span>  addItem:</span></span>
<span class="line"><span>    if (newItem !== &quot;&quot;):</span></span>
<span class="line"><span>      set items = [...items, { id: Date.now(), text: newItem, done: false }]</span></span>
<span class="line"><span>      set newItem = &quot;&quot;</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  toggleItem:</span></span>
<span class="line"><span>    set items = items.map(i =&gt; i.id === item.id ? { ...i, done: !i.done } : i)</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  deleteItem:</span></span>
<span class="line"><span>    set items = items.filter(i =&gt; i.id !== item.id)</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  showAll:</span></span>
<span class="line"><span>    set showCompleted = false</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  showActive:</span></span>
<span class="line"><span>    set showCompleted = false</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  showCompleted:</span></span>
<span class="line"><span>    set showCompleted = true</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  clearCompleted:</span></span>
<span class="line"><span>    set items = items.filter(i =&gt; !i.done)</span></span></code></pre></div><h2 id="features-demonstrated" tabindex="-1">Features Demonstrated <a class="header-anchor" href="#features-demonstrated" aria-label="Permalink to &quot;Features Demonstrated&quot;">​</a></h2><h3 id="_1-arrays-and-loops" tabindex="-1">1. Arrays and Loops <a class="header-anchor" href="#_1-arrays-and-loops" aria-label="Permalink to &quot;1. Arrays and Loops&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>for (item in items):</span></span>
<span class="line"><span>  view.todo-item: &quot;{{item.text}}&quot;</span></span></code></pre></div><h3 id="_2-object-state" tabindex="-1">2. Object State <a class="header-anchor" href="#_2-object-state" aria-label="Permalink to &quot;2. Object State&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>state:</span></span>
<span class="line"><span>  items = [{ id: 1, text: &quot;Learn HJX&quot;, done: false }]</span></span></code></pre></div><h3 id="_3-conditional-rendering" tabindex="-1">3. Conditional Rendering <a class="header-anchor" href="#_3-conditional-rendering" aria-label="Permalink to &quot;3. Conditional Rendering&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if (item.done):</span></span>
<span class="line"><span>  text.done: &quot;(done)&quot;</span></span></code></pre></div><h3 id="_4-multiple-handlers" tabindex="-1">4. Multiple Handlers <a class="header-anchor" href="#_4-multiple-handlers" aria-label="Permalink to &quot;4. Multiple Handlers&quot;">​</a></h3><ul><li><code>addItem</code> - Add new todo</li><li><code>toggleItem</code> - Toggle done status</li><li><code>deleteItem</code> - Remove todo</li><li><code>clearCompleted</code> - Clear all done</li></ul><h3 id="_5-array-operations" tabindex="-1">5. Array Operations <a class="header-anchor" href="#_5-array-operations" aria-label="Permalink to &quot;5. Array Operations&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>set items = [...items, newItem]           # Add</span></span>
<span class="line"><span>set items = items.filter(i =&gt; ...)        # Remove</span></span>
<span class="line"><span>set items = items.map(i =&gt; ...)           # Update</span></span></code></pre></div><h2 id="try-it" tabindex="-1">Try It <a class="header-anchor" href="#try-it" aria-label="Permalink to &quot;Try It&quot;">​</a></h2><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">node</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dist/cli.js</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dev</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> examples/list.hjx</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --out</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dist-app</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --port</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 5173</span></span></code></pre></div><p>Open <a href="http://localhost:5173" target="_blank" rel="noreferrer">http://localhost:5173</a></p><h2 id="key-concepts" tabindex="-1">Key Concepts <a class="header-anchor" href="#key-concepts" aria-label="Permalink to &quot;Key Concepts&quot;">​</a></h2><h3 id="adding-items" tabindex="-1">Adding Items <a class="header-anchor" href="#adding-items" aria-label="Permalink to &quot;Adding Items&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>set items = [...items, { id: Date.now(), text: newItem, done: false }]</span></span></code></pre></div><p>Uses spread operator to create new array.</p><h3 id="toggling-items" tabindex="-1">Toggling Items <a class="header-anchor" href="#toggling-items" aria-label="Permalink to &quot;Toggling Items&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>set items = items.map(i =&gt; i.id === item.id ? { ...i, done: !i.done } : i)</span></span></code></pre></div><p>Maps over array, toggles matching item.</p><h3 id="filtering" tabindex="-1">Filtering <a class="header-anchor" href="#filtering" aria-label="Permalink to &quot;Filtering&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>set items = items.filter(i =&gt; i.id !== item.id)</span></span></code></pre></div><p>Removes item by ID.</p>`,28)])])}const m=a(p,[["render",i]]);export{u as __pageData,m as default};
