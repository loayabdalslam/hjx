import{_ as s,o as a,c as p,ag as e}from"./chunks/framework.ePeAWSvT.js";const d=JSON.parse('{"title":"Composition Example","description":"","frontmatter":{},"headers":[],"relativePath":"examples/composition.md","filePath":"examples/composition.md"}'),l={name:"examples/composition.md"};function i(t,n,o,r,c,u){return a(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="composition-example" tabindex="-1">Composition Example <a class="header-anchor" href="#composition-example" aria-label="Permalink to &quot;Composition Example&quot;">​</a></h1><p>Demonstrates component composition - using multiple components together.</p><h2 id="source-code" tabindex="-1">Source Code <a class="header-anchor" href="#source-code" aria-label="Permalink to &quot;Source Code&quot;">​</a></h2><h3 id="main-app" tabindex="-1">Main App <a class="header-anchor" href="#main-app" aria-label="Permalink to &quot;Main App&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component App</span></span>
<span class="line"><span></span></span>
<span class="line"><span>imports:</span></span>
<span class="line"><span>  Card from &quot;./components/Card.hjx&quot;</span></span>
<span class="line"><span>  Button from &quot;./components/Button.hjx&quot;</span></span>
<span class="line"><span>  Input from &quot;./components/Input.hjx&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>state:</span></span>
<span class="line"><span>  cards = [</span></span>
<span class="line"><span>    { title: &quot;Card 1&quot;, content: &quot;This is the first card&quot; },</span></span>
<span class="line"><span>    { title: &quot;Card 2&quot;, content: &quot;This is the second card&quot; },</span></span>
<span class="line"><span>    { title: &quot;Card 3&quot;, content: &quot;This is the third card&quot; }</span></span>
<span class="line"><span>  ]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  view.app:</span></span>
<span class="line"><span>    text.header: &quot;Component Composition Demo&quot;</span></span>
<span class="line"><span>    view.controls:</span></span>
<span class="line"><span>      Button label=&quot;Add Card&quot; variant=&quot;primary&quot;</span></span>
<span class="line"><span>      Button label=&quot;Clear All&quot; variant=&quot;secondary&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    view.card-grid:</span></span>
<span class="line"><span>      for (card in cards):</span></span>
<span class="line"><span>        Card title=&quot;{{card.title}}&quot; content=&quot;{{card.content}}&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>style:</span></span>
<span class="line"><span>  .app { max-width: 900px; margin: 0 auto; padding: 20px; font-family: system-ui; }</span></span>
<span class="line"><span>  .header { font-size: 28px; font-weight: bold; margin-bottom: 20px; }</span></span>
<span class="line"><span>  .controls { display: flex; gap: 10px; margin-bottom: 30px; }</span></span>
<span class="line"><span>  .card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>handlers:</span></span>
<span class="line"><span>  addCard:</span></span>
<span class="line"><span>    set cards = cards + [{ title: &quot;New Card&quot;, content: &quot;New content&quot; }]</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  clearAll:</span></span>
<span class="line"><span>    set cards = []</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br></div></div><h3 id="card-component" tabindex="-1">Card Component <a class="header-anchor" href="#card-component" aria-label="Permalink to &quot;Card Component&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component Card</span></span>
<span class="line"><span></span></span>
<span class="line"><span>state:</span></span>
<span class="line"><span>  title = &quot;Card Title&quot;</span></span>
<span class="line"><span>  content = &quot;Card content&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  div.card:</span></span>
<span class="line"><span>    div.header: &quot;{{title}}&quot;</span></span>
<span class="line"><span>    div.body: &quot;{{content}}&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>style:</span></span>
<span class="line"><span>  .card { border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }</span></span>
<span class="line"><span>  .header { padding: 12px 16px; background: #f5f5f5; font-weight: bold; }</span></span>
<span class="line"><span>  .body { padding: 16px; }</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><h3 id="button-component" tabindex="-1">Button Component <a class="header-anchor" href="#button-component" aria-label="Permalink to &quot;Button Component&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component Button</span></span>
<span class="line"><span></span></span>
<span class="line"><span>state:</span></span>
<span class="line"><span>  label = &quot;Button&quot;</span></span>
<span class="line"><span>  variant = &quot;primary&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  button.btn (class variant):</span></span>
<span class="line"><span>    text: &quot;{{label}}&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>style:</span></span>
<span class="line"><span>  .btn { padding: 10px 20px; border-radius: 6px; cursor: pointer; border: none; }</span></span>
<span class="line"><span>  .primary { background: #007bff; color: white; }</span></span>
<span class="line"><span>  .secondary { background: #6c757d; color: white; }</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div><h2 id="key-concepts" tabindex="-1">Key Concepts <a class="header-anchor" href="#key-concepts" aria-label="Permalink to &quot;Key Concepts&quot;">​</a></h2><ul><li><strong>Imports</strong>: Import other <code>.hjx</code> files as components</li><li><strong>Props</strong>: Pass data using attributes</li><li><strong>Composition</strong>: Build complex UIs from simple components</li></ul><h2 id="how-it-works" tabindex="-1">How It Works <a class="header-anchor" href="#how-it-works" aria-label="Permalink to &quot;How It Works&quot;">​</a></h2><ol><li>Import components at the top</li><li>Use imported components as tags in layout</li><li>Pass data as attributes</li><li>Components are self-contained and reusable</li></ol><h2 id="running" tabindex="-1">Running <a class="header-anchor" href="#running" aria-label="Permalink to &quot;Running&quot;">​</a></h2><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">node</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dist/cli.js</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dev</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> examples/composition_demo.hjx</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --out</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dist-app</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --port</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 5172</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><h2 id="benefits-of-composition" tabindex="-1">Benefits of Composition <a class="header-anchor" href="#benefits-of-composition" aria-label="Permalink to &quot;Benefits of Composition&quot;">​</a></h2><ul><li><strong>Reusability</strong>: Write once, use many times</li><li><strong>Separation of concerns</strong>: Each component does one thing</li><li><strong>Maintainability</strong>: Small, focused files are easier to maintain</li><li><strong>Teamwork</strong>: Different people can work on different components</li></ul>`,17)])])}const m=s(l,[["render",i]]);export{d as __pageData,m as default};
