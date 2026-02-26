import{_ as n,o as a,c as e,ag as p}from"./chunks/framework.ePeAWSvT.js";const u=JSON.parse('{"title":"Lists Example","description":"","frontmatter":{},"headers":[],"relativePath":"examples/list.md","filePath":"examples/list.md"}'),l={name:"examples/list.md"};function i(t,s,o,r,d,c){return a(),e("div",null,[...s[0]||(s[0]=[p(`<h1 id="lists-example" tabindex="-1">Lists Example <a class="header-anchor" href="#lists-example" aria-label="Permalink to &quot;Lists Example&quot;">​</a></h1><p>Demonstrates using <code>for</code> blocks to render lists of items.</p><h2 id="source-code" tabindex="-1">Source Code <a class="header-anchor" href="#source-code" aria-label="Permalink to &quot;Source Code&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component TodoList</span></span>
<span class="line"><span></span></span>
<span class="line"><span>state:</span></span>
<span class="line"><span>  todos = [</span></span>
<span class="line"><span>    { id: 1, text: &quot;Buy groceries&quot;, done: false },</span></span>
<span class="line"><span>    { id: 2, text: &quot;Walk the dog&quot;, done: true },</span></span>
<span class="line"><span>    { id: 3, text: &quot;Finish project&quot;, done: false }</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span>  newTodo = &quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  view.container:</span></span>
<span class="line"><span>    text.title: &quot;My Todos&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    view.add-form:</span></span>
<span class="line"><span>      input (bind value -&gt; newTodo)</span></span>
<span class="line"><span>      button (on click -&gt; addTodo): &quot;Add&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    view.list:</span></span>
<span class="line"><span>      for (todo in todos):</span></span>
<span class="line"><span>        view.item (class done: todo.done):</span></span>
<span class="line"><span>          checkbox (on change -&gt; toggleTodo, data-id: todo.id)</span></span>
<span class="line"><span>          text.todo-text: &quot;{{todo.text}}&quot;</span></span>
<span class="line"><span>          button.delete (on click -&gt; deleteTodo, data-id: todo.id): &quot;×&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>style:</span></span>
<span class="line"><span>  .container { max-width: 500px; margin: 40px auto; font-family: system-ui; }</span></span>
<span class="line"><span>  .title { font-size: 24px; font-weight: bold; margin-bottom: 20px; }</span></span>
<span class="line"><span>  .add-form { display: flex; gap: 10px; margin-bottom: 20px; }</span></span>
<span class="line"><span>  .add-form input { flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 6px; }</span></span>
<span class="line"><span>  .add-form button { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 6px; cursor: pointer; }</span></span>
<span class="line"><span>  .item { display: flex; align-items: center; gap: 10px; padding: 12px; border-bottom: 1px solid #eee; }</span></span>
<span class="line"><span>  .item.done { opacity: 0.5; }</span></span>
<span class="line"><span>  .item.done .todo-text { text-decoration: line-through; }</span></span>
<span class="line"><span>  .todo-text { flex: 1; }</span></span>
<span class="line"><span>  .delete { background: #ff6b6b; color: white; border: none; border-radius: 4px; cursor: pointer; padding: 5px 10px; }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>handlers:</span></span>
<span class="line"><span>  addTodo:</span></span>
<span class="line"><span>    if (newTodo != &quot;&quot;):</span></span>
<span class="line"><span>      set todos = todos + [{ id: Date.now(), text: newTodo, done: false }]</span></span>
<span class="line"><span>      set newTodo = &quot;&quot;</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  toggleTodo:</span></span>
<span class="line"><span>    log &quot;Toggle todo&quot;</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  deleteTodo:</span></span>
<span class="line"><span>    set todos = todos.filter(t =&gt; t.id != todo.id)</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br></div></div><h2 id="key-concepts" tabindex="-1">Key Concepts <a class="header-anchor" href="#key-concepts" aria-label="Permalink to &quot;Key Concepts&quot;">​</a></h2><ul><li><strong>for blocks</strong>: Iterate over arrays</li><li><strong>Array methods</strong>: Use <code>.filter()</code> in handlers</li><li><strong>Conditional classes</strong>: Apply classes based on state</li></ul><h2 id="how-it-works" tabindex="-1">How It Works <a class="header-anchor" href="#how-it-works" aria-label="Permalink to &quot;How It Works&quot;">​</a></h2><ol><li><code>for (todo in todos)</code> iterates over the array</li><li>Each item is rendered with its properties</li><li>Clicking &quot;Add&quot; appends to the array</li><li>The list updates automatically</li></ol><h2 id="running" tabindex="-1">Running <a class="header-anchor" href="#running" aria-label="Permalink to &quot;Running&quot;">​</a></h2><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">node</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dist/cli.js</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dev</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> examples/list.hjx</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --out</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dist-app</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --port</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 5172</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div>`,10)])])}const m=n(l,[["render",i]]);export{u as __pageData,m as default};
