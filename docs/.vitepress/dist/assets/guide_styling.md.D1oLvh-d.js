import{_ as n,o as a,c as e,ag as p}from"./chunks/framework.ePeAWSvT.js";const u=JSON.parse('{"title":"Styling","description":"","frontmatter":{},"headers":[],"relativePath":"guide/styling.md","filePath":"guide/styling.md"}'),l={name:"guide/styling.md"};function i(r,s,c,t,b,d){return a(),e("div",null,[...s[0]||(s[0]=[p(`<h1 id="styling" tabindex="-1">Styling <a class="header-anchor" href="#styling" aria-label="Permalink to &quot;Styling&quot;">​</a></h1><p>HJX provides scoped CSS styling for each component.</p><h2 id="the-style-block" tabindex="-1">The Style Block <a class="header-anchor" href="#the-style-block" aria-label="Permalink to &quot;The Style Block&quot;">​</a></h2><p>Define styles in the <code>style:</code> block:</p><div class="language-hjx vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>style:</span></span>
<span class="line"><span>  .container {</span></span>
<span class="line"><span>    padding: 20px;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  .title {</span></span>
<span class="line"><span>    font-size: 24px;</span></span>
<span class="line"><span>    font-weight: bold;</span></span>
<span class="line"><span>  }</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><h2 id="css-scoping" tabindex="-1">CSS Scoping <a class="header-anchor" href="#css-scoping" aria-label="Permalink to &quot;CSS Scoping&quot;">​</a></h2><p>All styles are automatically scoped to prevent conflicts:</p><div class="language-hjx vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component Card</span></span>
<span class="line"><span></span></span>
<span class="line"><span>style:</span></span>
<span class="line"><span>  .card { border: 1px solid #ddd; }</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>Compiles to:</p><div class="language-css vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">.hjx-card</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> .card</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">border</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">px</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> solid</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> #ddd</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">; }</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><h2 id="selectors" tabindex="-1">Selectors <a class="header-anchor" href="#selectors" aria-label="Permalink to &quot;Selectors&quot;">​</a></h2><h3 id="class-selectors" tabindex="-1">Class Selectors <a class="header-anchor" href="#class-selectors" aria-label="Permalink to &quot;Class Selectors&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>style:</span></span>
<span class="line"><span>  .button { padding: 10px; }</span></span>
<span class="line"><span>  .primary { background: blue; }</span></span>
<span class="line"><span>  .large { font-size: 18px; }</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><h3 id="id-selectors" tabindex="-1">ID Selectors <a class="header-anchor" href="#id-selectors" aria-label="Permalink to &quot;ID Selectors&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>style:</span></span>
<span class="line"><span>  #header { background: #333; }</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h3 id="element-selectors" tabindex="-1">Element Selectors <a class="header-anchor" href="#element-selectors" aria-label="Permalink to &quot;Element Selectors&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>style:</span></span>
<span class="line"><span>  button { cursor: pointer; }</span></span>
<span class="line"><span>  input { border: 1px solid #ccc; }</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h3 id="multiple-classes" tabindex="-1">Multiple Classes <a class="header-anchor" href="#multiple-classes" aria-label="Permalink to &quot;Multiple Classes&quot;">​</a></h3><div class="language-hjx vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>style:</span></span>
<span class="line"><span>  .btn.primary { background: blue; }</span></span>
<span class="line"><span>  .btn.secondary { background: gray; }</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h2 id="pseudo-classes" tabindex="-1">Pseudo-classes <a class="header-anchor" href="#pseudo-classes" aria-label="Permalink to &quot;Pseudo-classes&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>style:</span></span>
<span class="line"><span>  .button:hover {</span></span>
<span class="line"><span>    background: darkblue;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  .input:focus {</span></span>
<span class="line"><span>    border-color: blue;</span></span>
<span class="line"><span>  }</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><h2 id="responsive-design" tabindex="-1">Responsive Design <a class="header-anchor" href="#responsive-design" aria-label="Permalink to &quot;Responsive Design&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>style:</span></span>
<span class="line"><span>  .container {</span></span>
<span class="line"><span>    width: 100%;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  @media (min-width: 768px) {</span></span>
<span class="line"><span>    .container {</span></span>
<span class="line"><span>      width: 750px;</span></span>
<span class="line"><span>      margin: 0 auto;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><h2 id="css-variables" tabindex="-1">CSS Variables <a class="header-anchor" href="#css-variables" aria-label="Permalink to &quot;CSS Variables&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>style:</span></span>
<span class="line"><span>  :root {</span></span>
<span class="line"><span>    --primary: #007bff;</span></span>
<span class="line"><span>    --secondary: #6c757d;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  .button {</span></span>
<span class="line"><span>    background: var(--primary);</span></span>
<span class="line"><span>  }</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><h2 id="animations" tabindex="-1">Animations <a class="header-anchor" href="#animations" aria-label="Permalink to &quot;Animations&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>style:</span></span>
<span class="line"><span>  .fade-in {</span></span>
<span class="line"><span>    animation: fadeIn 0.3s ease-in;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  @keyframes fadeIn {</span></span>
<span class="line"><span>    from { opacity: 0; }</span></span>
<span class="line"><span>    to { opacity: 1; }</span></span>
<span class="line"><span>  }</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><h2 id="flexbox-layout" tabindex="-1">Flexbox Layout <a class="header-anchor" href="#flexbox-layout" aria-label="Permalink to &quot;Flexbox Layout&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>style:</span></span>
<span class="line"><span>  .container {</span></span>
<span class="line"><span>    display: flex;</span></span>
<span class="line"><span>    flex-direction: column;</span></span>
<span class="line"><span>    gap: 10px;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  .row {</span></span>
<span class="line"><span>    display: flex;</span></span>
<span class="line"><span>    justify-content: space-between;</span></span>
<span class="line"><span>    align-items: center;</span></span>
<span class="line"><span>  }</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><h2 id="grid-layout" tabindex="-1">Grid Layout <a class="header-anchor" href="#grid-layout" aria-label="Permalink to &quot;Grid Layout&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>style:</span></span>
<span class="line"><span>  .grid {</span></span>
<span class="line"><span>    display: grid;</span></span>
<span class="line"><span>    grid-template-columns: repeat(3, 1fr);</span></span>
<span class="line"><span>    gap: 20px;</span></span>
<span class="line"><span>  }</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><h2 id="example" tabindex="-1">Example <a class="header-anchor" href="#example" aria-label="Permalink to &quot;Example&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component Card</span></span>
<span class="line"><span></span></span>
<span class="line"><span>state:</span></span>
<span class="line"><span>  title = &quot;Welcome&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  view.card:</span></span>
<span class="line"><span>    text.title: &quot;{{title}}&quot;</span></span>
<span class="line"><span>    text.content: &quot;This is card content&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>style:</span></span>
<span class="line"><span>  .card {</span></span>
<span class="line"><span>    padding: 20px;</span></span>
<span class="line"><span>    border: 1px solid #ddd;</span></span>
<span class="line"><span>    border-radius: 8px;</span></span>
<span class="line"><span>    background: white;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  .title {</span></span>
<span class="line"><span>    font-size: 20px;</span></span>
<span class="line"><span>    font-weight: bold;</span></span>
<span class="line"><span>    margin-bottom: 10px;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  .content {</span></span>
<span class="line"><span>    color: #666;</span></span>
<span class="line"><span>    line-height: 1.5;</span></span>
<span class="line"><span>  }</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br></div></div>`,33)])])}const h=n(l,[["render",i]]);export{u as __pageData,h as default};
