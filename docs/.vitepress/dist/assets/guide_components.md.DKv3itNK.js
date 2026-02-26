import{_ as s,o as a,c as p,ag as e}from"./chunks/framework.ePeAWSvT.js";const m=JSON.parse('{"title":"Components","description":"","frontmatter":{},"headers":[],"relativePath":"guide/components.md","filePath":"guide/components.md"}'),l={name:"guide/components.md"};function i(t,n,o,r,c,b){return a(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="components" tabindex="-1">Components <a class="header-anchor" href="#components" aria-label="Permalink to &quot;Components&quot;">​</a></h1><p>HJX supports component composition - building complex UIs from smaller, reusable components.</p><h2 id="creating-components" tabindex="-1">Creating Components <a class="header-anchor" href="#creating-components" aria-label="Permalink to &quot;Creating Components&quot;">​</a></h2><p>A component is simply a <code>.hjx</code> file. Create <code>Button.hjx</code>:</p><div class="language-hjx vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component Button</span></span>
<span class="line"><span></span></span>
<span class="line"><span>state:</span></span>
<span class="line"><span>  label = &quot;Click me&quot;</span></span>
<span class="line"><span>  variant = &quot;primary&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  button.btn (on click -&gt; handleClick):</span></span>
<span class="line"><span>    text: &quot;{{label}}&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>style:</span></span>
<span class="line"><span>  .btn { padding: 10px 20px; border-radius: 6px; cursor: pointer; }</span></span>
<span class="line"><span>  .primary { background: #007bff; color: white; border: none; }</span></span>
<span class="line"><span>  .secondary { background: #6c757d; color: white; border: none; }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>handlers:</span></span>
<span class="line"><span>  handleClick:</span></span>
<span class="line"><span>    log &quot;Button clicked&quot;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br></div></div><h2 id="using-components" tabindex="-1">Using Components <a class="header-anchor" href="#using-components" aria-label="Permalink to &quot;Using Components&quot;">​</a></h2><p>Import and use components in other files:</p><div class="language-hjx vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component App</span></span>
<span class="line"><span></span></span>
<span class="line"><span>imports:</span></span>
<span class="line"><span>  Button from &quot;./components/Button.hjx&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  view.app:</span></span>
<span class="line"><span>    Button variant=&quot;primary&quot;</span></span>
<span class="line"><span>    Button variant=&quot;secondary&quot;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><h2 id="component-props" tabindex="-1">Component Props <a class="header-anchor" href="#component-props" aria-label="Permalink to &quot;Component Props&quot;">​</a></h2><p>Pass data to components using attributes:</p><div class="language-hjx vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component Card</span></span>
<span class="line"><span></span></span>
<span class="line"><span>state:</span></span>
<span class="line"><span>  title = &quot;Default Title&quot;</span></span>
<span class="line"><span>  content = &quot;&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  div.card:</span></span>
<span class="line"><span>    div.header:</span></span>
<span class="line"><span>      text: &quot;{{title}}&quot;</span></span>
<span class="line"><span>    div.body:</span></span>
<span class="line"><span>      text: &quot;{{content}}&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>style:</span></span>
<span class="line"><span>  .card { border: 1px solid #ddd; border-radius: 8px; }</span></span>
<span class="line"><span>  .header { font-weight: bold; padding: 12px; border-bottom: 1px solid #eee; }</span></span>
<span class="line"><span>  .body { padding: 12px; }</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br></div></div><p>Usage:</p><div class="language-hjx vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component App</span></span>
<span class="line"><span></span></span>
<span class="line"><span>imports:</span></span>
<span class="line"><span>  Card from &quot;./Card.hjx&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  view.app:</span></span>
<span class="line"><span>    Card title=&quot;Hello&quot; content=&quot;This is a card&quot;</span></span>
<span class="line"><span>    Card title=&quot;Another&quot; content=&quot;More content&quot;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><h2 id="nested-components" tabindex="-1">Nested Components <a class="header-anchor" href="#nested-components" aria-label="Permalink to &quot;Nested Components&quot;">​</a></h2><p>Components can contain other components:</p><div class="language-hjx vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component Dashboard</span></span>
<span class="line"><span></span></span>
<span class="line"><span>imports:</span></span>
<span class="line"><span>  Card from &quot;./Card.hjx&quot;</span></span>
<span class="line"><span>  Button from &quot;./Button.hjx&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  view.dashboard:</span></span>
<span class="line"><span>    Card title=&quot;Stats&quot; content=&quot;Some stats here&quot;</span></span>
<span class="line"><span>    Button label=&quot;Refresh&quot;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><h2 id="composition-patterns" tabindex="-1">Composition Patterns <a class="header-anchor" href="#composition-patterns" aria-label="Permalink to &quot;Composition Patterns&quot;">​</a></h2><h3 id="list-of-components" tabindex="-1">List of Components <a class="header-anchor" href="#list-of-components" aria-label="Permalink to &quot;List of Components&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component ItemList</span></span>
<span class="line"><span></span></span>
<span class="line"><span>state:</span></span>
<span class="line"><span>  items = [&quot;Item 1&quot;, &quot;Item 2&quot;, &quot;Item 3&quot;]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>imports:</span></span>
<span class="line"><span>  Card from &quot;./Card.hjx&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  view.list:</span></span>
<span class="line"><span>    for (item in items):</span></span>
<span class="line"><span>      Card title=&quot;{{item}}&quot;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><h3 id="conditional-components" tabindex="-1">Conditional Components <a class="header-anchor" href="#conditional-components" aria-label="Permalink to &quot;Conditional Components&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component App</span></span>
<span class="line"><span></span></span>
<span class="line"><span>state:</span></span>
<span class="line"><span>  isLoggedIn = false</span></span>
<span class="line"><span></span></span>
<span class="line"><span>imports:</span></span>
<span class="line"><span>  LoginForm from &quot;./LoginForm.hjx&quot;</span></span>
<span class="line"><span>  Dashboard from &quot;./Dashboard.hjx&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  view.app:</span></span>
<span class="line"><span>    if (isLoggedIn):</span></span>
<span class="line"><span>      Dashboard</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    if (!isLoggedIn):</span></span>
<span class="line"><span>      LoginForm</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br></div></div><h2 id="best-practices" tabindex="-1">Best Practices <a class="header-anchor" href="#best-practices" aria-label="Permalink to &quot;Best Practices&quot;">​</a></h2><ol><li><strong>Keep components focused</strong> - Each component should do one thing well</li><li><strong>Use descriptive names</strong> - <code>SubmitButton</code> is better than <code>Button1</code></li><li><strong>Extract common styles</strong> - Share CSS using the style block</li><li><strong>Compose from the top down</strong> - Start with a layout, then extract components</li></ol>`,23)])])}const d=s(l,[["render",i]]);export{m as __pageData,d as default};
