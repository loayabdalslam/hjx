import{_ as s,o as a,c as e,ag as p}from"./chunks/framework.ePeAWSvT.js";const d=JSON.parse('{"title":"Conditional Rendering","description":"","frontmatter":{},"headers":[],"relativePath":"examples/conditional.md","filePath":"examples/conditional.md"}'),l={name:"examples/conditional.md"};function i(r,n,o,t,c,u){return a(),e("div",null,[...n[0]||(n[0]=[p(`<h1 id="conditional-rendering" tabindex="-1">Conditional Rendering <a class="header-anchor" href="#conditional-rendering" aria-label="Permalink to &quot;Conditional Rendering&quot;">​</a></h1><p>Demonstrates using <code>if</code> blocks to conditionally show/hide elements.</p><h2 id="source-code" tabindex="-1">Source Code <a class="header-anchor" href="#source-code" aria-label="Permalink to &quot;Source Code&quot;">​</a></h2><div class="language-hjx vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">hjx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>component UserProfile</span></span>
<span class="line"><span></span></span>
<span class="line"><span>state:</span></span>
<span class="line"><span>  username = &quot;Alice&quot;</span></span>
<span class="line"><span>  isLoggedIn = true</span></span>
<span class="line"><span>  isPremium = false</span></span>
<span class="line"><span>  followerCount = 150</span></span>
<span class="line"><span></span></span>
<span class="line"><span>layout:</span></span>
<span class="line"><span>  view.profile:</span></span>
<span class="line"><span>    text.greeting: &quot;Welcome {{username}}&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (isLoggedIn):</span></span>
<span class="line"><span>      view.logged-in:</span></span>
<span class="line"><span>        text: &quot;You are logged in&quot;</span></span>
<span class="line"><span>        text.follower-count: &quot;Followers: {{followerCount}}&quot;</span></span>
<span class="line"><span>        button.logout (on click -&gt; logout): &quot;Logout&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (!isLoggedIn):</span></span>
<span class="line"><span>      view.logged-out:</span></span>
<span class="line"><span>        text: &quot;Please log in to continue&quot;</span></span>
<span class="line"><span>        button.login (on click -&gt; login): &quot;Login&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (isPremium):</span></span>
<span class="line"><span>      view.premium-badge:</span></span>
<span class="line"><span>        text.badge: &quot;⭐ Premium Member&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (!isPremium):</span></span>
<span class="line"><span>      view.upgrade-prompt:</span></span>
<span class="line"><span>        text: &quot;Want premium features?&quot;</span></span>
<span class="line"><span>        button.upgrade (on click -&gt; upgradePremium): &quot;Upgrade Now&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>style:</span></span>
<span class="line"><span>  .profile { padding: 24px; max-width: 400px; margin: 0 auto; font-family: system-ui, -apple-system, sans-serif; background: #f5f5f5; border-radius: 12px; }</span></span>
<span class="line"><span>  .greeting { font-size: 28px; font-weight: bold; margin-bottom: 20px; }</span></span>
<span class="line"><span>  .logged-in { padding: 16px; background: white; border-radius: 8px; margin-bottom: 16px; }</span></span>
<span class="line"><span>  .logged-out { padding: 16px; background: #ffe6e6; border-radius: 8px; margin-bottom: 16px; }</span></span>
<span class="line"><span>  .follower-count { font-size: 16px; margin: 12px 0; color: #666; }</span></span>
<span class="line"><span>  .logout, .login, .upgrade { padding: 10px 16px; border-radius: 6px; border: none; cursor: pointer; margin-top: 12px; }</span></span>
<span class="line"><span>  .logout { background: #ff6b6b; color: white; }</span></span>
<span class="line"><span>  .login { background: #007bff; color: white; }</span></span>
<span class="line"><span>  .upgrade { background: #ffc107; color: black; }</span></span>
<span class="line"><span>  .premium-badge { padding: 16px; background: #fff3cd; border-radius: 8px; margin-bottom: 16px; border: 2px solid #ffc107; }</span></span>
<span class="line"><span>  .badge { font-size: 18px; font-weight: bold; color: #cc8800; }</span></span>
<span class="line"><span>  .upgrade-prompt { padding: 16px; background: #e7f3ff; border-radius: 8px; }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>handlers:</span></span>
<span class="line"><span>  logout:</span></span>
<span class="line"><span>    log &quot;Logged out&quot;</span></span>
<span class="line"><span>    set isLoggedIn = false</span></span>
<span class="line"><span>  login:</span></span>
<span class="line"><span>    log &quot;Logged in&quot;</span></span>
<span class="line"><span>    set isLoggedIn = true</span></span>
<span class="line"><span>  upgradePremium:</span></span>
<span class="line"><span>    log &quot;Upgraded to premium&quot;</span></span>
<span class="line"><span>    set isPremium = true</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br></div></div><h2 id="key-concepts" tabindex="-1">Key Concepts <a class="header-anchor" href="#key-concepts" aria-label="Permalink to &quot;Key Concepts&quot;">​</a></h2><ul><li><strong>Conditional blocks</strong>: <code>if (condition):</code> shows content when true</li><li><strong>Negation</strong>: <code>!isLoggedIn</code> checks if NOT logged in</li><li><strong>State changes</strong>: Handlers toggle boolean values</li></ul><h2 id="how-it-works" tabindex="-1">How It Works <a class="header-anchor" href="#how-it-works" aria-label="Permalink to &quot;How It Works&quot;">​</a></h2><ol><li>The <code>if</code> block checks the condition</li><li>If true, the content is rendered</li><li>If false, the content is hidden (display: none)</li><li>When state changes, conditions are re-evaluated</li><li>UI updates to show/hide appropriate content</li></ol><h2 id="running" tabindex="-1">Running <a class="header-anchor" href="#running" aria-label="Permalink to &quot;Running&quot;">​</a></h2><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">node</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dist/cli.js</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dev</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> examples/conditional.hjx</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --out</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dist-app</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --port</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 5172</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>Try clicking:</p><ul><li>&quot;Logout&quot; - shows login prompt</li><li>&quot;Login&quot; - shows dashboard</li><li>&quot;Upgrade Now&quot; - shows premium badge</li></ul>`,12)])])}const g=s(l,[["render",i]]);export{d as __pageData,g as default};
