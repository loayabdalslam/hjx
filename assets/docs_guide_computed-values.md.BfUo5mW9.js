import{_ as s,o as n,c as e,ag as p}from"./chunks/framework.CvgP6Fyv.js";const h=JSON.parse('{"title":"Computed Values","description":"","frontmatter":{},"headers":[],"relativePath":"docs/guide/computed-values.md","filePath":"docs/guide/computed-values.md","lastUpdated":1774477216000}'),t={name:"docs/guide/computed-values.md"};function l(i,a,o,c,u,r){return n(),e("div",null,[...a[0]||(a[0]=[p(`<h1 id="computed-values" tabindex="-1">Computed Values <a class="header-anchor" href="#computed-values" aria-label="Permalink to &quot;Computed Values&quot;">​</a></h1><p>Computed values are derived state that automatically update when their dependencies change. They&#39;re perfect for calculations, transformations, and derived data.</p><h2 id="what-are-computed-values" tabindex="-1">What are Computed Values? <a class="header-anchor" href="#what-are-computed-values" aria-label="Permalink to &quot;What are Computed Values?&quot;">​</a></h2><p>Computed values are reactive expressions that:</p><ul><li><strong>Auto-update</strong> when their dependencies change</li><li><strong>Cache results</strong> until dependencies change (memoization)</li><li><strong>Derive new values</strong> from existing state</li><li><strong>Keep logic declarative</strong> instead of imperative</li></ul><h2 id="syntax" tabindex="-1">Syntax <a class="header-anchor" href="#syntax" aria-label="Permalink to &quot;Syntax&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component MyComponent</span></span>
<span class="line"><span></span></span>
<span class="line"><span>state:</span></span>
<span class="line"><span>  price = 25</span></span>
<span class="line"><span>  quantity = 3</span></span>
<span class="line"><span>  taxRate = 0.1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>computed:</span></span>
<span class="line"><span>  subtotal = &quot;price * quantity&quot;</span></span>
<span class="line"><span>  tax = &quot;subtotal * taxRate&quot;</span></span>
<span class="line"><span>  total = &quot;subtotal + tax&quot;</span></span>
<span class="line"><span>  formattedTotal = &quot;&#39;$&#39; + total.toFixed(2)&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  view.card:</span></span>
<span class="line"><span>    text: &quot;Price: \${{price}}&quot;</span></span>
<span class="line"><span>    text: &quot;Quantity: {{quantity}}&quot;</span></span>
<span class="line"><span>    text: &quot;Subtotal: \${{subtotal}}&quot;</span></span>
<span class="line"><span>    text: &quot;Tax: \${{tax}}&quot;</span></span>
<span class="line"><span>    text.bold: &quot;Total: {{formattedTotal}}&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>handlers:</span></span>
<span class="line"><span>  updatePrice:</span></span>
<span class="line"><span>    set price = price + 5</span></span></code></pre></div><p>When <code>price</code> changes, <code>subtotal</code>, <code>tax</code>, <code>total</code>, and <code>formattedTotal</code> all update automatically.</p><h2 id="how-it-works" tabindex="-1">How It Works <a class="header-anchor" href="#how-it-works" aria-label="Permalink to &quot;How It Works&quot;">​</a></h2><h3 id="dependency-tracking" tabindex="-1">Dependency Tracking <a class="header-anchor" href="#dependency-tracking" aria-label="Permalink to &quot;Dependency Tracking&quot;">​</a></h3><p>HJX automatically tracks which state variables each computed value depends on:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>state:</span></span>
<span class="line"><span>  a = 10</span></span>
<span class="line"><span>  b = 5</span></span>
<span class="line"><span>  c = 3</span></span>
<span class="line"><span></span></span>
<span class="line"><span>computed:</span></span>
<span class="line"><span>  sum = &quot;a + b&quot;           // Depends on: a, b</span></span>
<span class="line"><span>  product = &quot;a * c&quot;       // Depends on: a, c</span></span>
<span class="line"><span>  combined = &quot;sum + product&quot; // Depends on: sum (which depends on a, b)</span></span></code></pre></div><p>The dependency graph looks like:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>a ─┬─&gt; sum ─────&gt; combined</span></span>
<span class="line"><span>   │              ↑</span></span>
<span class="line"><span>b ─┘              │</span></span>
<span class="line"><span>                  │</span></span>
<span class="line"><span>c ────────────────┘</span></span>
<span class="line"><span>     (via product)</span></span></code></pre></div><h3 id="automatic-updates" tabindex="-1">Automatic Updates <a class="header-anchor" href="#automatic-updates" aria-label="Permalink to &quot;Automatic Updates&quot;">​</a></h3><p>When you change <code>a</code>:</p><ol><li><code>sum</code> recalculates</li><li><code>product</code> recalculates</li><li><code>combined</code> recalculates (using new <code>sum</code> and <code>product</code>)</li><li>All DOM elements showing these values update</li></ol><h2 id="examples" tabindex="-1">Examples <a class="header-anchor" href="#examples" aria-label="Permalink to &quot;Examples&quot;">​</a></h2><h3 id="shopping-cart" tabindex="-1">Shopping Cart <a class="header-anchor" href="#shopping-cart" aria-label="Permalink to &quot;Shopping Cart&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component ShoppingCart</span></span>
<span class="line"><span></span></span>
<span class="line"><span>state:</span></span>
<span class="line"><span>  items = [</span></span>
<span class="line"><span>    { name: &quot;Laptop&quot;, price: 999, quantity: 1 },</span></span>
<span class="line"><span>    { name: &quot;Mouse&quot;, price: 29, quantity: 2 }</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span>  discountCode = &quot;&quot;</span></span>
<span class="line"><span>  discountPercent = 0</span></span>
<span class="line"><span></span></span>
<span class="line"><span>computed:</span></span>
<span class="line"><span>  itemCount = &quot;items.reduce((sum, item) =&gt; sum + item.quantity, 0)&quot;</span></span>
<span class="line"><span>  subtotal = &quot;items.reduce((sum, item) =&gt; sum + item.price * item.quantity, 0)&quot;</span></span>
<span class="line"><span>  discountAmount = &quot;subtotal * (discountPercent / 100)&quot;</span></span>
<span class="line"><span>  total = &quot;subtotal - discountAmount&quot;</span></span>
<span class="line"><span>  hasDiscount = &quot;discountPercent &gt; 0&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  view.cart:</span></span>
<span class="line"><span>    text.title: &quot;Shopping Cart ({{itemCount}} items)&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    for (item in items):</span></span>
<span class="line"><span>      view.cart-item:</span></span>
<span class="line"><span>        text: &quot;{{item.name}} - \${{item.price}} x {{item.quantity}}&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    view.summary:</span></span>
<span class="line"><span>      text: &quot;Subtotal: \${{subtotal}}&quot;</span></span>
<span class="line"><span>      if (hasDiscount):</span></span>
<span class="line"><span>        text.discount: &quot;Discount: -\${{discountAmount}}&quot;</span></span>
<span class="line"><span>      text.bold: &quot;Total: \${{total}}&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>handlers:</span></span>
<span class="line"><span>  applyDiscount:</span></span>
<span class="line"><span>    if (discountCode === &quot;SAVE10&quot;):</span></span>
<span class="line"><span>      set discountPercent = 10</span></span>
<span class="line"><span>      log &quot;10% discount applied&quot;</span></span></code></pre></div><h3 id="form-validation" tabindex="-1">Form Validation <a class="header-anchor" href="#form-validation" aria-label="Permalink to &quot;Form Validation&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component LoginForm</span></span>
<span class="line"><span></span></span>
<span class="line"><span>state:</span></span>
<span class="line"><span>  email = &quot;&quot;</span></span>
<span class="line"><span>  password = &quot;&quot;</span></span>
<span class="line"><span>  confirmPassword = &quot;&quot;</span></span>
<span class="line"><span>  agreedToTerms = false</span></span>
<span class="line"><span></span></span>
<span class="line"><span>computed:</span></span>
<span class="line"><span>  emailValid = &quot;email.includes(&#39;@&#39;) &amp;&amp; email.includes(&#39;.&#39;)&quot;</span></span>
<span class="line"><span>  passwordValid = &quot;password.length &gt;= 8&quot;</span></span>
<span class="line"><span>  passwordsMatch = &quot;password === confirmPassword &amp;&amp; password !== &#39;&#39;&quot;</span></span>
<span class="line"><span>  formValid = &quot;emailValid &amp;&amp; passwordValid &amp;&amp; passwordsMatch &amp;&amp; agreedToTerms&quot;</span></span>
<span class="line"><span>  errorMessage = &quot;!formValid ? &#39;Please fill all fields correctly&#39; : &#39;&#39;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  view.form:</span></span>
<span class="line"><span>    text.title: &quot;Create Account&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    input (bind value &lt;-&gt; email):</span></span>
<span class="line"><span>    if (!emailValid &amp;&amp; email !== &quot;&quot;):</span></span>
<span class="line"><span>      text.error: &quot;Invalid email format&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    input (bind value &lt;-&gt; password):</span></span>
<span class="line"><span>    if (!passwordValid &amp;&amp; password !== &quot;&quot;):</span></span>
<span class="line"><span>      text.error: &quot;Password must be at least 8 characters&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    input (bind value &lt;-&gt; confirmPassword):</span></span>
<span class="line"><span>    if (!passwordsMatch &amp;&amp; confirmPassword !== &quot;&quot;):</span></span>
<span class="line"><span>      text.error: &quot;Passwords do not match&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    view.checkbox:</span></span>
<span class="line"><span>      input (bind checked &lt;-&gt; agreedToTerms):</span></span>
<span class="line"><span>      text: &quot;I agree to the terms&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    button (disabled=!formValid on click -&gt; submit): &quot;Create Account&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    if (!formValid):</span></span>
<span class="line"><span>      text.note: &quot;{{errorMessage}}&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>handlers:</span></span>
<span class="line"><span>  submit:</span></span>
<span class="line"><span>    log &quot;Form submitted!&quot;</span></span></code></pre></div><h3 id="real-time-dashboard" tabindex="-1">Real-Time Dashboard <a class="header-anchor" href="#real-time-dashboard" aria-label="Permalink to &quot;Real-Time Dashboard&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component Dashboard</span></span>
<span class="line"><span></span></span>
<span class="line"><span>state:</span></span>
<span class="line"><span>  revenue = 15000</span></span>
<span class="line"><span>  expenses = 8000</span></span>
<span class="line"><span>  users = 1250</span></span>
<span class="line"><span>  activeUsers = 890</span></span>
<span class="line"><span>  targetRevenue = 20000</span></span>
<span class="line"><span></span></span>
<span class="line"><span>computed:</span></span>
<span class="line"><span>  profit = &quot;revenue - expenses&quot;</span></span>
<span class="line"><span>  profitMargin = &quot;(profit / revenue) * 100&quot;</span></span>
<span class="line"><span>  userEngagement = &quot;(activeUsers / users) * 100&quot;</span></span>
<span class="line"><span>  revenueProgress = &quot;(revenue / targetRevenue) * 100&quot;</span></span>
<span class="line"><span>  isProfitable = &quot;profit &gt; 0&quot;</span></span>
<span class="line"><span>  reachedTarget = &quot;revenue &gt;= targetRevenue&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  view.dashboard:</span></span>
<span class="line"><span>    view.metric-card:</span></span>
<span class="line"><span>      text.label: &quot;Revenue&quot;</span></span>
<span class="line"><span>      text.value: &quot;\${{revenue}}&quot;</span></span>
<span class="line"><span>      text.progress: &quot;{{revenueProgress.toFixed(1)}}% of target&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    view.metric-card:</span></span>
<span class="line"><span>      text.label: &quot;Expenses&quot;</span></span>
<span class="line"><span>      text.value: &quot;\${{expenses}}&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    view.metric-card:</span></span>
<span class="line"><span>      text.label: &quot;Profit&quot;</span></span>
<span class="line"><span>      text.value: &quot;\${{profit}}&quot;</span></span>
<span class="line"><span>      if (isProfitable):</span></span>
<span class="line"><span>        text.positive: &quot;▲ Profitable&quot;</span></span>
<span class="line"><span>      if (!isProfitable):</span></span>
<span class="line"><span>        text.negative: &quot;▼ Loss&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    view.metric-card:</span></span>
<span class="line"><span>      text.label: &quot;Profit Margin&quot;</span></span>
<span class="line"><span>      text.value: &quot;{{profitMargin.toFixed(1)}}%&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    view.metric-card:</span></span>
<span class="line"><span>      text.label: &quot;User Engagement&quot;</span></span>
<span class="line"><span>      text.value: &quot;{{userEngagement.toFixed(1)}}%&quot;</span></span>
<span class="line"><span>      text.detail: &quot;{{activeUsers}} / {{users}} users&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    if (reachedTarget):</span></span>
<span class="line"><span>      view.celebration:</span></span>
<span class="line"><span>        text: &quot;🎉 Revenue target reached!&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>handlers:</span></span>
<span class="line"><span>  refreshData:</span></span>
<span class="line"><span>    log &quot;Refreshing dashboard data...&quot;</span></span></code></pre></div><h3 id="todo-list-with-filters" tabindex="-1">Todo List with Filters <a class="header-anchor" href="#todo-list-with-filters" aria-label="Permalink to &quot;Todo List with Filters&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component TodoApp</span></span>
<span class="line"><span></span></span>
<span class="line"><span>state:</span></span>
<span class="line"><span>  todos = [</span></span>
<span class="line"><span>    { text: &quot;Learn HJX&quot;, completed: true },</span></span>
<span class="line"><span>    { text: &quot;Build UI&quot;, completed: false },</span></span>
<span class="line"><span>    { text: &quot;Deploy App&quot;, completed: false }</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span>  filter = &quot;all&quot;</span></span>
<span class="line"><span>  searchText = &quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>computed:</span></span>
<span class="line"><span>  totalCount = &quot;todos.length&quot;</span></span>
<span class="line"><span>  completedCount = &quot;todos.filter(t =&gt; t.completed).length&quot;</span></span>
<span class="line"><span>  activeCount = &quot;todos.filter(t =&gt; !t.completed).length&quot;</span></span>
<span class="line"><span>  filteredTodos = &quot;todos.filter(t =&gt; { if (filter === &#39;active&#39;) return !t.completed; if (filter === &#39;completed&#39;) return t.completed; return true; }).filter(t =&gt; t.text.toLowerCase().includes(searchText.toLowerCase()))&quot;</span></span>
<span class="line"><span>  hasActiveTodos = &quot;activeCount &gt; 0&quot;</span></span>
<span class="line"><span>  allCompleted = &quot;completedCount === totalCount&quot;</span></span>
<span class="line"><span>  completionPercentage = &quot;(completedCount / totalCount) * 100&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  view.todo-app:</span></span>
<span class="line"><span>    text.title: &quot;Todo List&quot;</span></span>
<span class="line"><span>    text.progress: &quot;{{completionPercentage.toFixed(0)}}% complete ({{completedCount}}/{{totalCount}})&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    view.filters:</span></span>
<span class="line"><span>      input (bind value &lt;-&gt; searchText placeholder=&quot;Search todos...&quot;):</span></span>
<span class="line"><span>      button (on click -&gt; setFilterAll): &quot;All&quot;</span></span>
<span class="line"><span>      button (on click -&gt; setFilterActive): &quot;Active&quot;</span></span>
<span class="line"><span>      button (on click -&gt; setFilterCompleted): &quot;Completed&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    view.todo-list:</span></span>
<span class="line"><span>      for (todo in filteredTodos):</span></span>
<span class="line"><span>        view.todo-item:</span></span>
<span class="line"><span>          text: &quot;{{todo.text}}&quot;</span></span>
<span class="line"><span>          if (todo.completed):</span></span>
<span class="line"><span>            text.status: &quot;✓&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    if (hasActiveTodos):</span></span>
<span class="line"><span>      text.hint: &quot;{{activeCount}} tasks remaining&quot;</span></span>
<span class="line"><span>    if (allCompleted):</span></span>
<span class="line"><span>      text.celebration: &quot;🎉 All tasks completed!&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>handlers:</span></span>
<span class="line"><span>  setFilterAll:</span></span>
<span class="line"><span>    set filter = &quot;all&quot;</span></span>
<span class="line"><span>  setFilterActive:</span></span>
<span class="line"><span>    set filter = &quot;active&quot;</span></span>
<span class="line"><span>  setFilterCompleted:</span></span>
<span class="line"><span>    set filter = &quot;completed&quot;</span></span></code></pre></div><h2 id="best-practices" tabindex="-1">Best Practices <a class="header-anchor" href="#best-practices" aria-label="Permalink to &quot;Best Practices&quot;">​</a></h2><h3 id="_1-keep-computations-simple" tabindex="-1">1. Keep Computations Simple <a class="header-anchor" href="#_1-keep-computations-simple" aria-label="Permalink to &quot;1. Keep Computations Simple&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># ✅ Good: Simple expressions</span></span>
<span class="line"><span>computed:</span></span>
<span class="line"><span>  total = &quot;price * quantity&quot;</span></span>
<span class="line"><span>  fullName = &quot;firstName + &#39; &#39; + lastName&quot;</span></span>
<span class="line"><span>  isValid = &quot;email.includes(&#39;@&#39;) &amp;&amp; password.length &gt;= 8&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># ❌ Avoid: Complex logic in computed</span></span>
<span class="line"><span>computed:</span></span>
<span class="line"><span>  badExample: |</span></span>
<span class="line"><span>    &quot;items.map(item =&gt; {</span></span>
<span class="line"><span>      const result = complexCalculation(item);</span></span>
<span class="line"><span>      if (result &gt; threshold) {</span></span>
<span class="line"><span>        return transform(result);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>      return default;</span></span>
<span class="line"><span>    }).filter(x =&gt; x !== null).reduce((a, b) =&gt; a + b, 0)&quot;</span></span></code></pre></div><p>For complex logic, use handlers or server-side scripts.</p><h3 id="_2-use-descriptive-names" tabindex="-1">2. Use Descriptive Names <a class="header-anchor" href="#_2-use-descriptive-names" aria-label="Permalink to &quot;2. Use Descriptive Names&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># ✅ Clear names</span></span>
<span class="line"><span>computed:</span></span>
<span class="line"><span>  totalRevenue = &quot;revenue - refunds&quot;</span></span>
<span class="line"><span>  activeUserCount = &quot;users.filter(u =&gt; u.lastLogin &gt; thirtyDaysAgo).length&quot;</span></span>
<span class="line"><span>  hasUnsavedChanges = &quot;formData !== originalData&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># ❌ Unclear names</span></span>
<span class="line"><span>computed:</span></span>
<span class="line"><span>  x = &quot;a - b&quot;</span></span>
<span class="line"><span>  temp = &quot;users.length&quot;</span></span>
<span class="line"><span>  flag = &quot;data !== old&quot;</span></span></code></pre></div><h3 id="_3-chain-computed-values" tabindex="-1">3. Chain Computed Values <a class="header-anchor" href="#_3-chain-computed-values" aria-label="Permalink to &quot;3. Chain Computed Values&quot;">​</a></h3><p>Computed values can depend on other computed values:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>state:</span></span>
<span class="line"><span>  baseSalary = 50000</span></span>
<span class="line"><span>  bonus = 5000</span></span>
<span class="line"><span>  taxRate = 0.25</span></span>
<span class="line"><span></span></span>
<span class="line"><span>computed:</span></span>
<span class="line"><span>  grossIncome = &quot;baseSalary + bonus&quot;</span></span>
<span class="line"><span>  tax = &quot;grossIncome * taxRate&quot;</span></span>
<span class="line"><span>  netIncome = &quot;grossIncome - tax&quot;</span></span>
<span class="line"><span>  monthlyIncome = &quot;netIncome / 12&quot;</span></span>
<span class="line"><span>  weeklyIncome = &quot;monthlyIncome / 4&quot;</span></span></code></pre></div><p>This creates a dependency chain that updates efficiently.</p><h3 id="_4-avoid-circular-dependencies" tabindex="-1">4. Avoid Circular Dependencies <a class="header-anchor" href="#_4-avoid-circular-dependencies" aria-label="Permalink to &quot;4. Avoid Circular Dependencies&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># ❌ This will cause an error:</span></span>
<span class="line"><span>computed:</span></span>
<span class="line"><span>  a = &quot;b + 1&quot;</span></span>
<span class="line"><span>  b = &quot;a + 1&quot;  # Circular!</span></span></code></pre></div><p>HJX detects circular dependencies at compile time.</p><h2 id="performance" tabindex="-1">Performance <a class="header-anchor" href="#performance" aria-label="Permalink to &quot;Performance&quot;">​</a></h2><p>Computed values are <strong>memoized</strong> - they only recalculate when dependencies change:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>state:</span></span>
<span class="line"><span>  count = 0</span></span>
<span class="line"><span>  name = &quot;Alice&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>computed:</span></span>
<span class="line"><span>  doubled = &quot;count * 2&quot;  // Only recalculates when count changes</span></span></code></pre></div><h3 id="dependency-graph-visualization" tabindex="-1">Dependency Graph Visualization <a class="header-anchor" href="#dependency-graph-visualization" aria-label="Permalink to &quot;Dependency Graph Visualization&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>State: count, name</span></span>
<span class="line"><span>       ↓</span></span>
<span class="line"><span>Computed: doubled (depends on: count)</span></span>
<span class="line"><span>       </span></span>
<span class="line"><span>When count changes:</span></span>
<span class="line"><span>  1. doubled recalculates</span></span>
<span class="line"><span>  2. DOM elements using {{doubled}} update</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>When name changes:</span></span>
<span class="line"><span>  1. doubled does NOT recalculate (no dependency)</span></span>
<span class="line"><span>  2. Only DOM elements using {{name}} update</span></span></code></pre></div><h2 id="common-patterns" tabindex="-1">Common Patterns <a class="header-anchor" href="#common-patterns" aria-label="Permalink to &quot;Common Patterns&quot;">​</a></h2><h3 id="percentage-calculations" tabindex="-1">Percentage Calculations <a class="header-anchor" href="#percentage-calculations" aria-label="Permalink to &quot;Percentage Calculations&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>computed:</span></span>
<span class="line"><span>  progress = &quot;(current / total) * 100&quot;</span></span>
<span class="line"><span>  discountPercent = &quot;((original - sale) / original) * 100&quot;</span></span>
<span class="line"><span>  completionRate = &quot;(completed / total) * 100&quot;</span></span></code></pre></div><h3 id="string-formatting" tabindex="-1">String Formatting <a class="header-anchor" href="#string-formatting" aria-label="Permalink to &quot;String Formatting&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>computed:</span></span>
<span class="line"><span>  fullName = &quot;firstName + &#39; &#39; + lastName&quot;</span></span>
<span class="line"><span>  greeting = &quot;&#39;Hello, &#39; + name + &#39;!&#39;&quot;</span></span>
<span class="line"><span>  statusText = &quot;isActive ? &#39;Active&#39; : &#39;Inactive&#39;&quot;</span></span>
<span class="line"><span>  priceFormatted = &quot;&#39;$&#39; + price.toFixed(2)&quot;</span></span></code></pre></div><h3 id="array-operations" tabindex="-1">Array Operations <a class="header-anchor" href="#array-operations" aria-label="Permalink to &quot;Array Operations&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>computed:</span></span>
<span class="line"><span>  itemCount = &quot;items.length&quot;</span></span>
<span class="line"><span>  hasItems = &quot;items.length &gt; 0&quot;</span></span>
<span class="line"><span>  total = &quot;items.reduce((sum, item) =&gt; sum + item.price, 0)&quot;</span></span>
<span class="line"><span>  names = &quot;items.map(item =&gt; item.name).join(&#39;, &#39;)&quot;</span></span>
<span class="line"><span>  filtered = &quot;items.filter(item =&gt; item.active)&quot;</span></span></code></pre></div><h3 id="conditional-values" tabindex="-1">Conditional Values <a class="header-anchor" href="#conditional-values" aria-label="Permalink to &quot;Conditional Values&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>computed:</span></span>
<span class="line"><span>  statusColor = &quot;status === &#39;active&#39; ? &#39;green&#39; : &#39;red&#39;&quot;</span></span>
<span class="line"><span>  buttonText = &quot;isLoading ? &#39;Loading...&#39; : &#39;Submit&#39;&quot;</span></span>
<span class="line"><span>  isVisible = &quot;userRole === &#39;admin&#39; || hasPermission&quot;</span></span>
<span class="line"><span>  errorMessage = &quot;errors.length &gt; 0 ? errors[0] : &#39;&#39;&quot;</span></span></code></pre></div><h2 id="troubleshooting" tabindex="-1">Troubleshooting <a class="header-anchor" href="#troubleshooting" aria-label="Permalink to &quot;Troubleshooting&quot;">​</a></h2><h3 id="computed-value-not-updating" tabindex="-1">Computed Value Not Updating <a class="header-anchor" href="#computed-value-not-updating" aria-label="Permalink to &quot;Computed Value Not Updating&quot;">​</a></h3><p><strong>Problem:</strong> Your computed value isn&#39;t updating when state changes.</p><p><strong>Solution:</strong> Check that you&#39;re referencing state variables correctly:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># ❌ Wrong: String literal, not a reference</span></span>
<span class="line"><span>computed:</span></span>
<span class="line"><span>  bad = &quot;count&quot;  # This is just the string &quot;count&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># ✅ Correct: Expression with variable reference</span></span>
<span class="line"><span>computed:</span></span>
<span class="line"><span>  good = &quot;count&quot;  # This references the count variable</span></span></code></pre></div><h3 id="circular-dependency-error" tabindex="-1">Circular Dependency Error <a class="header-anchor" href="#circular-dependency-error" aria-label="Permalink to &quot;Circular Dependency Error&quot;">​</a></h3><p><strong>Problem:</strong> Compiler reports circular dependency.</p><p><strong>Solution:</strong> Review your computed chain:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># ❌ Circular</span></span>
<span class="line"><span>computed:</span></span>
<span class="line"><span>  a = &quot;b + 1&quot;</span></span>
<span class="line"><span>  b = &quot;c + 1&quot;</span></span>
<span class="line"><span>  c = &quot;a + 1&quot;  # c -&gt; a -&gt; b -&gt; c</span></span>
<span class="line"><span></span></span>
<span class="line"><span># ✅ Fixed</span></span>
<span class="line"><span>computed:</span></span>
<span class="line"><span>  a = &quot;base + 1&quot;</span></span>
<span class="line"><span>  b = &quot;a + 1&quot;</span></span>
<span class="line"><span>  c = &quot;b + 1&quot;  # Linear chain</span></span></code></pre></div><h3 id="performance-issues" tabindex="-1">Performance Issues <a class="header-anchor" href="#performance-issues" aria-label="Permalink to &quot;Performance Issues&quot;">​</a></h3><p><strong>Problem:</strong> Computed values recalculating too often.</p><p><strong>Solution:</strong> Check for unnecessary dependencies:</p><div class="language-hjx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>state:</span></span>
<span class="line"><span>  count = 0</span></span>
<span class="line"><span>  unused = &quot;never changes&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>computed:</span></span>
<span class="line"><span>  # ❌ Depends on unused state</span></span>
<span class="line"><span>  bad = &quot;count + unused.length&quot;</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  # ✅ Only depends on what&#39;s needed</span></span>
<span class="line"><span>  good = &quot;count * 2&quot;</span></span></code></pre></div>`,66)])])}const m=s(t,[["render",l]]);export{h as __pageData,m as default};
