import{_ as n,o as a,c as e,ag as p}from"./chunks/framework.ePeAWSvT.js";const m=JSON.parse('{"title":"Forms Example","description":"","frontmatter":{},"headers":[],"relativePath":"examples/form.md","filePath":"examples/form.md"}'),l={name:"examples/form.md"};function i(r,s,t,o,c,u){return a(),e("div",null,[...s[0]||(s[0]=[p(`<h1 id="forms-example" tabindex="-1">Forms Example <a class="header-anchor" href="#forms-example" aria-label="Permalink to &quot;Forms Example&quot;">​</a></h1><p>Demonstrates input binding, form handling, and validation.</p><h2 id="source-code" tabindex="-1">Source Code <a class="header-anchor" href="#source-code" aria-label="Permalink to &quot;Source Code&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component FormDemo</span></span>
<span class="line"><span></span></span>
<span class="line"><span>state:</span></span>
<span class="line"><span>  name = &quot;&quot;</span></span>
<span class="line"><span>  email = &quot;&quot;</span></span>
<span class="line"><span>  age = 0</span></span>
<span class="line"><span>  errors = {}</span></span>
<span class="line"><span>  submitted = false</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  view.form-container:</span></span>
<span class="line"><span>    if (!submitted):</span></span>
<span class="line"><span>      view.form:</span></span>
<span class="line"><span>        text.label: &quot;Name&quot;</span></span>
<span class="line"><span>        input.name-input (bind value -&gt; name)</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        text.label: &quot;Email&quot;</span></span>
<span class="line"><span>        input.email-input (bind value -&gt; email)</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        text.label: &quot;Age&quot;</span></span>
<span class="line"><span>        input.age-input (bind value -&gt; age)</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        button.submit (on click -&gt; submit): &quot;Submit&quot;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    if (submitted):</span></span>
<span class="line"><span>      view.success:</span></span>
<span class="line"><span>        text: &quot;Thank you, {{name}}!&quot;</span></span>
<span class="line"><span>        text: &quot;Email: {{email}}&quot;</span></span>
<span class="line"><span>        text: &quot;Age: {{age}}&quot;</span></span>
<span class="line"><span>        button.back (on click -&gt; reset): &quot;Submit Another&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>style:</span></span>
<span class="line"><span>  .form-container { max-width: 400px; margin: 40px auto; font-family: system-ui; }</span></span>
<span class="line"><span>  .form { display: flex; flex-direction: column; gap: 16px; }</span></span>
<span class="line"><span>  .label { font-weight: 600; margin-bottom: 4px; }</span></span>
<span class="line"><span>  input { padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 16px; }</span></span>
<span class="line"><span>  .submit, .back { padding: 12px; background: #007bff; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; }</span></span>
<span class="line"><span>  .success { padding: 20px; background: #d4edda; border-radius: 8px; }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>handlers:</span></span>
<span class="line"><span>  submit:</span></span>
<span class="line"><span>    set errors = {}</span></span>
<span class="line"><span>    if (name == &quot;&quot;):</span></span>
<span class="line"><span>      set errors = { nameError: &quot;Name is required&quot; }</span></span>
<span class="line"><span>    if (email == &quot;&quot;):</span></span>
<span class="line"><span>      set errors = { emailError: &quot;Email is required&quot; }</span></span>
<span class="line"><span>    if (name != &quot;&quot; &amp;&amp; email != &quot;&quot;):</span></span>
<span class="line"><span>      set submitted = true</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  reset:</span></span>
<span class="line"><span>    set submitted = false</span></span>
<span class="line"><span>    set name = &quot;&quot;</span></span>
<span class="line"><span>    set email = &quot;&quot;</span></span>
<span class="line"><span>    set age = 0</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br></div></div><h2 id="key-concepts" tabindex="-1">Key Concepts <a class="header-anchor" href="#key-concepts" aria-label="Permalink to &quot;Key Concepts&quot;">​</a></h2><ul><li><strong>Two-way binding</strong>: <code>(bind value -&gt; variable)</code> connects input to state</li><li><strong>Conditional form</strong>: Show form or success message based on state</li><li><strong>Validation</strong>: Check values in handler before updating state</li></ul><h2 id="how-it-works" tabindex="-1">How It Works <a class="header-anchor" href="#how-it-works" aria-label="Permalink to &quot;How It Works&quot;">​</a></h2><ol><li>Input fields are bound to state variables</li><li>Typing in an input updates the bound state</li><li>Clicking submit triggers validation</li><li>If valid, shows success message</li><li>Reset clears form and state</li></ol><h2 id="running" tabindex="-1">Running <a class="header-anchor" href="#running" aria-label="Permalink to &quot;Running&quot;">​</a></h2><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">node</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dist/cli.js</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dev</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> examples/form.hjx</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --out</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dist-app</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --port</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 5172</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div>`,10)])])}const d=n(l,[["render",i]]);export{m as __pageData,d as default};
