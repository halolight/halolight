import{_ as a,c as e,o as p,a3 as s,j as l}from"./chunks/framework.BuRUkFgc.js";const d=JSON.parse('{"title":"Netlify Deployment","description":"","frontmatter":{},"headers":[],"relativePath":"en/guide/netlify.md","filePath":"en/guide/netlify.md","lastUpdated":1765973614000}'),t={name:"en/guide/netlify.md"};function i(r,n,o,c,u,b){return p(),e("div",{"data-pagefind-body":!0,"data-pagefind-meta":"date:1765973614000"},[...n[0]||(n[0]=[s('<h1 id="netlify-deployment" tabindex="-1">Netlify Deployment <a class="header-anchor" href="#netlify-deployment" aria-label="Permalink to &quot;Netlify Deployment&quot;">​</a></h1><p>HaloLight Netlify deployment edition, a one-click deployment solution optimized for the Netlify platform.</p><p><strong>Live Preview</strong>: <a href="https://halolight-netlify.h7ml.cn" target="_blank" rel="noreferrer">https://halolight-netlify.h7ml.cn</a></p><p><strong>GitHub</strong>: <a href="https://github.com/halolight/halolight-netlify" target="_blank" rel="noreferrer">https://github.com/halolight/halolight-netlify</a></p><h2 id="features" tabindex="-1">Features <a class="header-anchor" href="#features" aria-label="Permalink to &quot;Features&quot;">​</a></h2><ul><li>🔷 <strong>One-Click Deploy</strong> - Deploy to Netlify button for fast launch</li><li>⚡ <strong>Global CDN</strong> - 300+ edge nodes for lightning-fast delivery</li><li>🔄 <strong>Automatic CI/CD</strong> - Git push triggers auto build and deploy</li><li>📝 <strong>Form Handling</strong> - Backend-free form submissions</li><li>🔐 <strong>Identity</strong> - Built-in user authentication service</li><li>🌐 <strong>Functions</strong> - Serverless functions (AWS Lambda)</li><li>🔗 <strong>Split Testing</strong> - A/B testing and traffic splitting</li><li>📊 <strong>Analytics</strong> - Server-side analytics (paid)</li></ul><h2 id="quick-start" tabindex="-1">Quick Start <a class="header-anchor" href="#quick-start" aria-label="Permalink to &quot;Quick Start&quot;">​</a></h2><h3 id="method-1-one-click-deploy-recommended" tabindex="-1">Method 1: One-Click Deploy (Recommended) <a class="header-anchor" href="#method-1-one-click-deploy-recommended" aria-label="Permalink to &quot;Method 1: One-Click Deploy (Recommended)&quot;">​</a></h3><p><a href="https://app.netlify.com/start/deploy?repository=https://github.com/halolight/halolight-netlify" target="_blank" rel="noreferrer"><img src="https://www.netlify.com/img/deploy/button.svg" alt="Deploy to Netlify"></a></p><p>After clicking the button:</p><ol><li>Sign in to Netlify (supports GitHub/GitLab/Bitbucket)</li><li>Authorize repository access</li><li>Configure environment variables</li><li>Auto-clone and deploy</li></ol><h3 id="method-2-cli-deploy" tabindex="-1">Method 2: CLI Deploy <a class="header-anchor" href="#method-2-cli-deploy" aria-label="Permalink to &quot;Method 2: CLI Deploy&quot;">​</a></h3><p>```bash</p><h1 id="install-netlify-cli" tabindex="-1">Install Netlify CLI <a class="header-anchor" href="#install-netlify-cli" aria-label="Permalink to &quot;Install Netlify CLI&quot;">​</a></h1><p>npm install -g netlify-cli</p><h1 id="sign-in-to-netlify" tabindex="-1">Sign in to Netlify <a class="header-anchor" href="#sign-in-to-netlify" aria-label="Permalink to &quot;Sign in to Netlify&quot;">​</a></h1><p>netlify login</p><h1 id="clone-project" tabindex="-1">Clone project <a class="header-anchor" href="#clone-project" aria-label="Permalink to &quot;Clone project&quot;">​</a></h1><p>git clone <a href="https://github.com/halolight/halolight-netlify.git" target="_blank" rel="noreferrer">https://github.com/halolight/halolight-netlify.git</a> cd halolight-netlify</p><h1 id="install-dependencies" tabindex="-1">Install dependencies <a class="header-anchor" href="#install-dependencies" aria-label="Permalink to &quot;Install dependencies&quot;">​</a></h1><p>pnpm install</p><h1 id="initialize-netlify-site" tabindex="-1">Initialize Netlify site <a class="header-anchor" href="#initialize-netlify-site" aria-label="Permalink to &quot;Initialize Netlify site&quot;">​</a></h1><p>netlify init</p><h1 id="local-development-with-functions" tabindex="-1">Local development (with Functions) <a class="header-anchor" href="#local-development-with-functions" aria-label="Permalink to &quot;Local development (with Functions)&quot;">​</a></h1><p>netlify dev</p><h1 id="deploy-to-production" tabindex="-1">Deploy to production <a class="header-anchor" href="#deploy-to-production" aria-label="Permalink to &quot;Deploy to production&quot;">​</a></h1><p>netlify deploy --prod ```</p><h3 id="method-3-github-integration" tabindex="-1">Method 3: GitHub Integration <a class="header-anchor" href="#method-3-github-integration" aria-label="Permalink to &quot;Method 3: GitHub Integration&quot;">​</a></h3><ol><li>Fork the <a href="https://github.com/halolight/halolight-netlify" target="_blank" rel="noreferrer">halolight-netlify</a> repository</li><li>In the Netlify console click &quot;Add new site&quot; → &quot;Import an existing project&quot;</li><li>Choose GitHub and authorize</li><li>Select your Fork</li><li>Configure build settings and deploy</li></ol><h2 id="configuration-files" tabindex="-1">Configuration Files <a class="header-anchor" href="#configuration-files" aria-label="Permalink to &quot;Configuration Files&quot;">​</a></h2><h3 id="netlify-toml" tabindex="-1">netlify.toml <a class="header-anchor" href="#netlify-toml" aria-label="Permalink to &quot;netlify.toml&quot;">​</a></h3><p>```toml [build] command = &quot;pnpm build&quot; publish = &quot;.next&quot;</p><p>[build.environment] NODE_VERSION = &quot;20&quot; PNPM_VERSION = &quot;9&quot;</p><h1 id="next-js-plugin-auto-handles-ssr-isr" tabindex="-1">Next.js plugin (auto handles SSR/ISR) <a class="header-anchor" href="#next-js-plugin-auto-handles-ssr-isr" aria-label="Permalink to &quot;Next.js plugin (auto handles SSR/ISR)&quot;">​</a></h1><p>[[plugins]] package = &quot;@netlify/plugin-nextjs&quot;</p><h1 id="production" tabindex="-1">Production <a class="header-anchor" href="#production" aria-label="Permalink to &quot;Production&quot;">​</a></h1><p>[context.production] command = &quot;pnpm build&quot;</p><p>[context.production.environment] NEXT_PUBLIC_MOCK = &quot;false&quot;</p><h1 id="preview-branch-deploy" tabindex="-1">Preview (branch deploy) <a class="header-anchor" href="#preview-branch-deploy" aria-label="Permalink to &quot;Preview (branch deploy)&quot;">​</a></h1><p>[context.deploy-preview] command = &quot;pnpm build&quot;</p><p>[context.deploy-preview.environment] NEXT_PUBLIC_MOCK = &quot;true&quot;</p><h1 id="branch-deploys" tabindex="-1">Branch deploys <a class="header-anchor" href="#branch-deploys" aria-label="Permalink to &quot;Branch deploys&quot;">​</a></h1><p>[context.branch-deploy] command = &quot;pnpm build&quot;</p><h1 id="redirect-rules" tabindex="-1">Redirect rules <a class="header-anchor" href="#redirect-rules" aria-label="Permalink to &quot;Redirect rules&quot;">​</a></h1><p>[[redirects]] from = &quot;/api/*&quot; to = &quot;/.netlify/functions/:splat&quot; status = 200</p><h1 id="spa-fallback" tabindex="-1">SPA fallback <a class="header-anchor" href="#spa-fallback" aria-label="Permalink to &quot;SPA fallback&quot;">​</a></h1>',46),l("p",{Role:""},'[[redirects]] from = "/*" to = "/index.html" status = 200 conditions =',-1),s(`<h1 id="custom-headers" tabindex="-1">Custom headers <a class="header-anchor" href="#custom-headers" aria-label="Permalink to &quot;Custom headers&quot;">​</a></h1><p>[[headers]] for = &quot;/*&quot; [headers.values] X-Frame-Options = &quot;DENY&quot; X-Content-Type-Options = &quot;nosniff&quot; X-XSS-Protection = &quot;1; mode=block&quot; Referrer-Policy = &quot;strict-origin-when-cross-origin&quot;</p><p>[[headers]] for = &quot;/_next/static/*&quot; [headers.values] Cache-Control = &quot;public, max-age=31536000, immutable&quot; \`\`\`</p><h3 id="package-json-scripts" tabindex="-1">package.json Scripts <a class="header-anchor" href="#package-json-scripts" aria-label="Permalink to &quot;package.json Scripts&quot;">​</a></h3><p>\`\`\`json { &quot;scripts&quot;: { &quot;dev&quot;: &quot;next dev&quot;, &quot;build&quot;: &quot;next build&quot;, &quot;start&quot;: &quot;next start&quot;, &quot;netlify:dev&quot;: &quot;netlify dev&quot;, &quot;netlify:build&quot;: &quot;netlify build&quot;, &quot;netlify:deploy&quot;: &quot;netlify deploy --prod&quot; } } \`\`\`</p><h2 id="environment-variables" tabindex="-1">Environment Variables <a class="header-anchor" href="#environment-variables" aria-label="Permalink to &quot;Environment Variables&quot;">​</a></h2><p>In Netlify console → Site settings → Environment variables:</p><table tabindex="0"><thead><tr><th>Variable</th><th>Description</th><th>Example</th></tr></thead><tbody><tr><td>\`NODE_ENV\`</td><td>Runtime environment</td><td>\`production\`</td></tr><tr><td>\`NEXT_PUBLIC_API_URL\`</td><td>Base API URL</td><td>\`/api\`</td></tr><tr><td>\`NEXT_PUBLIC_MOCK\`</td><td>Enable mock data</td><td>\`false\`</td></tr><tr><td>\`NEXT_PUBLIC_APP_TITLE\`</td><td>App title</td><td>\`Admin Pro\`</td></tr><tr><td>\`DATABASE_URL\`</td><td>Database connection</td><td>\`postgresql://...\`</td></tr></tbody></table><h3 id="environment-variable-scopes" tabindex="-1">Environment Variable Scopes <a class="header-anchor" href="#environment-variable-scopes" aria-label="Permalink to &quot;Environment Variable Scopes&quot;">​</a></h3><p>Netlify supports per-context variables:</p><p>\`\`\` Production - Production environment variables Deploy Preview - PR preview variables Branch Deploy - Branch deploy variables All - Shared across all environments \`\`\`</p><h2 id="serverless-functions" tabindex="-1">Serverless Functions <a class="header-anchor" href="#serverless-functions" aria-label="Permalink to &quot;Serverless Functions&quot;">​</a></h2><h3 id="basic-function" tabindex="-1">Basic Function <a class="header-anchor" href="#basic-function" aria-label="Permalink to &quot;Basic Function&quot;">​</a></h3><p>\`\`\`typescript // netlify/functions/hello.ts import type { Handler, HandlerEvent, HandlerContext } from &quot;@netlify/functions&quot;;</p><p>export const handler: Handler = async ( event: HandlerEvent, context: HandlerContext ) =&gt; { const { httpMethod, body, queryStringParameters } = event;</p><p>return { statusCode: 200, headers: { &quot;Content-Type&quot;: &quot;application/json&quot;, }, body: JSON.stringify({ message: &quot;Hello from Netlify Functions!&quot;, method: httpMethod, query: queryStringParameters, }), }; }; \`\`\`</p><h3 id="background-function-long-running" tabindex="-1">Background Function (Long Running) <a class="header-anchor" href="#background-function-long-running" aria-label="Permalink to &quot;Background Function (Long Running)&quot;">​</a></h3><p>\`\`\`typescript // netlify/functions/background-task.ts import type { BackgroundHandler } from &quot;@netlify/functions&quot;;</p><p>export const handler: BackgroundHandler = async (event) =&gt; { // Maximum runtime 15 minutes console.log(&quot;Processing background task...&quot;);</p><p>// Perform time-consuming operations await processLongRunningTask(event.body);</p><p>// Background functions don&#39;t return a response };</p><p>// Configure as background function export const config = { type: &quot;background&quot;, }; \`\`\`</p><h3 id="scheduled-functions" tabindex="-1">Scheduled Functions <a class="header-anchor" href="#scheduled-functions" aria-label="Permalink to &quot;Scheduled Functions&quot;">​</a></h3><p>\`\`\`typescript // netlify/functions/daily-report.ts import type { Handler } from &quot;@netlify/functions&quot;;</p><p>export const handler: Handler = async () =&gt; { console.log(&quot;Generating daily report...&quot;);</p><p>await generateReport();</p><p>return { statusCode: 200, body: &quot;Report generated&quot;, }; };</p><p>// Run daily at 9:00 UTC export const config = { schedule: &quot;0 9 * * *&quot;, }; \`\`\`</p><h3 id="edge-functions" tabindex="-1">Edge Functions <a class="header-anchor" href="#edge-functions" aria-label="Permalink to &quot;Edge Functions&quot;">​</a></h3><p>\`\`\`typescript // netlify/edge-functions/geolocation.ts import type { Context } from &quot;@netlify/edge-functions&quot;;</p><p>export default async (request: Request, context: Context) =&gt; { const { country, city } = context.geo;</p><p>// Geo-based response return new Response( JSON.stringify({ country, city, message: \`Hello from \${city}, \${country}!\`, }), { headers: { &quot;Content-Type&quot;: &quot;application/json&quot; }, } ); };</p><p>export const config = { path: &quot;/api/geo&quot;, }; \`\`\`</p><h2 id="netlify-identity" tabindex="-1">Netlify Identity <a class="header-anchor" href="#netlify-identity" aria-label="Permalink to &quot;Netlify Identity&quot;">​</a></h2><h3 id="configure-authentication" tabindex="-1">Configure Authentication <a class="header-anchor" href="#configure-authentication" aria-label="Permalink to &quot;Configure Authentication&quot;">​</a></h3><p>\`\`\`typescript // lib/netlify-identity.ts import netlifyIdentity from &quot;netlify-identity-widget&quot;;</p><p>// Initialize netlifyIdentity.init({ container: &quot;#netlify-modal&quot;, locale: &quot;zh&quot;, });</p><p>// Login export function login() { netlifyIdentity.open(&quot;login&quot;); }</p><p>// Signup export function signup() { netlifyIdentity.open(&quot;signup&quot;); }</p><p>// Logout export function logout() { netlifyIdentity.logout(); }</p><p>// Get current user export function getCurrentUser() { return netlifyIdentity.currentUser(); }</p><p>// Listen for auth state netlifyIdentity.on(&quot;login&quot;, (user) =&gt; { console.log(&quot;User logged in:&quot;, user); netlifyIdentity.close(); });</p><p>netlifyIdentity.on(&quot;logout&quot;, () =&gt; { console.log(&quot;User logged out&quot;); }); \`\`\`</p><h3 id="protected-function" tabindex="-1">Protected Function <a class="header-anchor" href="#protected-function" aria-label="Permalink to &quot;Protected Function&quot;">​</a></h3><p>\`\`\`typescript // netlify/functions/protected.ts import type { Handler } from &quot;@netlify/functions&quot;;</p><p>export const handler: Handler = async (event) =&gt; { const { user } = event.context.clientContext || {};</p><p>if (!user) { return { statusCode: 401, body: JSON.stringify({ error: &quot;Unauthorized&quot; }), }; }</p><p>return { statusCode: 200, body: JSON.stringify({ message: <code>Hello \\\${user.email}!</code>, roles: user.app_metadata?.roles || [], }), }; };</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>## Form Handling</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### HTML Form</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\\\`\\\`\\\`html</span></span>
<span class="line"><span>&lt;form name=&quot;contact&quot; method=&quot;POST&quot; data-netlify=&quot;true&quot; netlify-honeypot=&quot;bot-field&quot;&gt;</span></span>
<span class="line"><span>  &lt;input type=&quot;hidden&quot; name=&quot;form-name&quot; value=&quot;contact&quot; /&gt;</span></span>
<span class="line"><span>  &lt;p class=&quot;hidden&quot;&gt;</span></span>
<span class="line"><span>    &lt;label&gt;Don&#39;t fill this out: &lt;input name=&quot;bot-field&quot; /&gt;&lt;/label&gt;</span></span>
<span class="line"><span>  &lt;/p&gt;</span></span>
<span class="line"><span>  &lt;p&gt;</span></span>
<span class="line"><span>    &lt;label&gt;Email: &lt;input type=&quot;email&quot; name=&quot;email&quot; required /&gt;&lt;/label&gt;</span></span>
<span class="line"><span>  &lt;/p&gt;</span></span>
<span class="line"><span>  &lt;p&gt;</span></span>
<span class="line"><span>    &lt;label&gt;Message: &lt;textarea name=&quot;message&quot; required&gt;&lt;/textarea&gt;&lt;/label&gt;</span></span>
<span class="line"><span>  &lt;/p&gt;</span></span>
<span class="line"><span>  &lt;p&gt;</span></span>
<span class="line"><span>    &lt;button type=&quot;submit&quot;&gt;Send&lt;/button&gt;</span></span>
<span class="line"><span>  &lt;/p&gt;</span></span>
<span class="line"><span>&lt;/form&gt;</span></span>
<span class="line"><span>\\\`\\\`\\\`</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### React Form</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\\\`\\\`\\\`tsx</span></span>
<span class="line"><span>// components/ContactForm.tsx</span></span>
<span class="line"><span>&quot;use client&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import { useState } from &quot;react&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export function ContactForm() {</span></span>
<span class="line"><span>  const [status, setStatus] = useState&lt;&quot;idle&quot; | &quot;loading&quot; | &quot;success&quot; | &quot;error&quot;&gt;(&quot;idle&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  const handleSubmit = async (e: React.FormEvent&lt;HTMLFormElement&gt;) =&gt; {</span></span>
<span class="line"><span>    e.preventDefault();</span></span>
<span class="line"><span>    setStatus(&quot;loading&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    const formData = new FormData(e.currentTarget);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    try {</span></span>
<span class="line"><span>      const response = await fetch(&quot;/&quot;, {</span></span>
<span class="line"><span>        method: &quot;POST&quot;,</span></span>
<span class="line"><span>        headers: { &quot;Content-Type&quot;: &quot;application/x-www-form-urlencoded&quot; },</span></span>
<span class="line"><span>        body: new URLSearchParams(formData as any).toString(),</span></span>
<span class="line"><span>      });</span></span>
<span class="line"><span></span></span>
<span class="line"><span>      if (response.ok) {</span></span>
<span class="line"><span>        setStatus(&quot;success&quot;);</span></span>
<span class="line"><span>      } else {</span></span>
<span class="line"><span>        setStatus(&quot;error&quot;);</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    } catch {</span></span>
<span class="line"><span>      setStatus(&quot;error&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  return (</span></span>
<span class="line"><span>    &lt;form</span></span>
<span class="line"><span>      name=&quot;contact&quot;</span></span>
<span class="line"><span>      method=&quot;POST&quot;</span></span>
<span class="line"><span>      data-netlify=&quot;true&quot;</span></span>
<span class="line"><span>      onSubmit={handleSubmit}</span></span>
<span class="line"><span>    &gt;</span></span>
<span class="line"><span>      &lt;input type=&quot;hidden&quot; name=&quot;form-name&quot; value=&quot;contact&quot; /&gt;</span></span>
<span class="line"><span>      {/* Form fields */}</span></span>
<span class="line"><span>      &lt;button type=&quot;submit&quot; disabled={status === &quot;loading&quot;}&gt;</span></span>
<span class="line"><span>        {status === &quot;loading&quot; ? &quot;Sending...&quot; : &quot;Send&quot;}</span></span>
<span class="line"><span>      &lt;/button&gt;</span></span>
<span class="line"><span>      {status === &quot;success&quot; &amp;&amp; &lt;p&gt;Message sent!&lt;/p&gt;}</span></span>
<span class="line"><span>      {status === &quot;error&quot; &amp;&amp; &lt;p&gt;Error sending message&lt;/p&gt;}</span></span>
<span class="line"><span>    &lt;/form&gt;</span></span>
<span class="line"><span>  );</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>\\\`\\\`\\\`</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## Common Commands</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\\\`\\\`\\\`bash</span></span>
<span class="line"><span># Sign in</span></span>
<span class="line"><span>netlify login</span></span>
<span class="line"><span></span></span>
<span class="line"><span># View site status</span></span>
<span class="line"><span>netlify status</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Local development</span></span>
<span class="line"><span>netlify dev</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Build</span></span>
<span class="line"><span>netlify build</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Deploy preview</span></span>
<span class="line"><span>netlify deploy</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Deploy to production</span></span>
<span class="line"><span>netlify deploy --prod</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Open site</span></span>
<span class="line"><span>netlify open</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Open dashboard</span></span>
<span class="line"><span>netlify open:admin</span></span>
<span class="line"><span></span></span>
<span class="line"><span># View logs</span></span>
<span class="line"><span>netlify logs</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Environment variables</span></span>
<span class="line"><span>netlify env:list</span></span>
<span class="line"><span>netlify env:set KEY value</span></span>
<span class="line"><span>netlify env:unset KEY</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Link to site</span></span>
<span class="line"><span>netlify link</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Unlink</span></span>
<span class="line"><span>netlify unlink</span></span>
<span class="line"><span>\\\`\\\`\\\`</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## Monitoring and Logs</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### View Logs</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\\\`\\\`\\\`bash</span></span>
<span class="line"><span># CLI view logs</span></span>
<span class="line"><span>netlify logs</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Live log stream</span></span>
<span class="line"><span>netlify logs --live</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Function logs</span></span>
<span class="line"><span>netlify logs:function hello</span></span>
<span class="line"><span>\\\`\\\`\\\`</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### Build Plugins</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\\\`\\\`\\\`toml</span></span>
<span class="line"><span># netlify.toml</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Performance analysis</span></span>
<span class="line"><span>[[plugins]]</span></span>
<span class="line"><span>  package = &quot;netlify-plugin-lighthouse&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Cache optimization</span></span>
<span class="line"><span>[[plugins]]</span></span>
<span class="line"><span>  package = &quot;netlify-plugin-cache&quot;</span></span>
<span class="line"><span>  [plugins.inputs]</span></span>
<span class="line"><span>    paths = [&quot;.next/cache&quot;, &quot;node_modules/.cache&quot;]</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Commit status notifications</span></span>
<span class="line"><span>[[plugins]]</span></span>
<span class="line"><span>  package = &quot;netlify-plugin-checklinks&quot;</span></span>
<span class="line"><span>\\\`\\\`\\\`</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## Custom Domains</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### Add Domain</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1. Go to Site settings → Domain management</span></span>
<span class="line"><span>2. Click &quot;Add custom domain&quot;</span></span>
<span class="line"><span>3. Enter your domain</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### DNS Configuration</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\\\`\\\`\\\`</span></span>
<span class="line"><span># A record (root)</span></span>
<span class="line"><span>Type: A</span></span>
<span class="line"><span>Name: @</span></span>
<span class="line"><span>Value: 75.2.60.5</span></span>
<span class="line"><span></span></span>
<span class="line"><span># CNAME record (subdomain)</span></span>
<span class="line"><span>Type: CNAME</span></span>
<span class="line"><span>Name: www</span></span>
<span class="line"><span>Value: your-site.netlify.app</span></span>
<span class="line"><span>\\\`\\\`\\\`</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### HTTPS</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Netlify configures HTTPS automatically:</span></span>
<span class="line"><span>- Automatically requests Let&#39;s Encrypt certificates</span></span>
<span class="line"><span>- Auto renewal</span></span>
<span class="line"><span>- Enforces HTTPS redirects</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## Branch Deploys and Previews</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### Deploy Contexts</span></span>
<span class="line"><span></span></span>
<span class="line"><span>| Context | Trigger | URL format |</span></span>
<span class="line"><span>|--------|----------|----------|</span></span>
<span class="line"><span>| Production | main branch push | \\\`your-site.netlify.app\\\` |</span></span>
<span class="line"><span>| Deploy Preview | PR created/updated | \\\`deploy-preview-123--your-site.netlify.app\\\` |</span></span>
<span class="line"><span>| Branch Deploy | Other branch push | \\\`branch-name--your-site.netlify.app\\\` |</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### Lock Deploys</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\\\`\\\`\\\`bash</span></span>
<span class="line"><span># Lock current deploy (stop auto deploys)</span></span>
<span class="line"><span>netlify deploy:lock</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Unlock</span></span>
<span class="line"><span>netlify deploy:unlock</span></span>
<span class="line"><span>\\\`\\\`\\\`</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## FAQ</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### Q: What if the build fails?</span></span>
<span class="line"><span></span></span>
<span class="line"><span>A: Check the following:</span></span>
<span class="line"><span>1. Review build logs and ensure dependencies install correctly</span></span>
<span class="line"><span>2. Confirm \\\`pnpm-lock.yaml\\\` is committed</span></span>
<span class="line"><span>3. Check Node.js version (build.environment.NODE_VERSION)</span></span>
<span class="line"><span>4. Verify the build command is correct</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### Q: How to roll back a deployment?</span></span>
<span class="line"><span></span></span>
<span class="line"><span>A: On the Deploys page:</span></span>
<span class="line"><span>1. Find a previous successful deploy</span></span>
<span class="line"><span>2. Click &quot;Publish deploy&quot;</span></span>
<span class="line"><span>3. Or use CLI: \\\`netlify rollback\\\`</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### Q: Functions cold starts are slow?</span></span>
<span class="line"><span></span></span>
<span class="line"><span>A: Optimization tips:</span></span>
<span class="line"><span>1. Reduce function bundle size</span></span>
<span class="line"><span>2. Use Edge Functions (no cold start)</span></span>
<span class="line"><span>3. Use Background Functions for heavy tasks</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### Q: How to set redirects?</span></span>
<span class="line"><span></span></span>
<span class="line"><span>A: Configure in \\\`netlify.toml\\\` or \\\`_redirects\\\`:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\\\`\\\`\\\`toml</span></span>
<span class="line"><span># netlify.toml</span></span>
<span class="line"><span>[[redirects]]</span></span>
<span class="line"><span>  from = &quot;/old-path&quot;</span></span>
<span class="line"><span>  to = &quot;/new-path&quot;</span></span>
<span class="line"><span>  status = 301</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Proxy</span></span>
<span class="line"><span>[[redirects]]</span></span>
<span class="line"><span>  from = &quot;/api/*&quot;</span></span>
<span class="line"><span>  to = &quot;https://api.example.com/:splat&quot;</span></span>
<span class="line"><span>  status = 200</span></span>
<span class="line"><span>\\\`\\\`\\\`</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## Pricing</span></span>
<span class="line"><span></span></span>
<span class="line"><span>| Plan | Price | Features |</span></span>
<span class="line"><span>|------|------|------|</span></span>
<span class="line"><span>| Starter | Free | 100GB bandwidth, 300 build minutes |</span></span>
<span class="line"><span>| Pro | $19/member/month | 1TB bandwidth, 25000 build minutes |</span></span>
<span class="line"><span>| Business | $99/member/month | Custom SLA, SSO |</span></span>
<span class="line"><span>| Enterprise | Contact sales | Dedicated support, compliance |</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### Functions Quotas</span></span>
<span class="line"><span></span></span>
<span class="line"><span>| Plan | Invocations | Runtime |</span></span>
<span class="line"><span>|------|----------|----------|</span></span>
<span class="line"><span>| Starter | 125K/month | 100 hours |</span></span>
<span class="line"><span>| Pro | Unlimited | 1000 hours |</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## Comparison With Other Platforms</span></span>
<span class="line"><span></span></span>
<span class="line"><span>| Feature | Netlify | Vercel | Cloudflare |</span></span>
<span class="line"><span>|------|---------|--------|------------|</span></span>
<span class="line"><span>| One-click deploy | ✅ | ✅ | ✅ |</span></span>
<span class="line"><span>| Edge Functions | ✅ | ✅ | ✅ |</span></span>
<span class="line"><span>| Form handling | ✅ Built-in | ❌ External | ❌ External |</span></span>
<span class="line"><span>| Identity | ✅ Built-in | ❌ External | ✅ Access |</span></span>
<span class="line"><span>| Free bandwidth | 100GB | 100GB | Unlimited |</span></span>
<span class="line"><span>| Free builds | 300 minutes | 6000 minutes | 500 runs |</span></span>
<span class="line"><span>| Split Testing | ✅ | ⚠️ Limited | ❌ |</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## Related Links</span></span>
<span class="line"><span></span></span>
<span class="line"><span>- [Live Preview](https://halolight-netlify.h7ml.cn)</span></span>
<span class="line"><span>- [GitHub Repository](https://github.com/halolight/halolight-netlify)</span></span>
<span class="line"><span>- [Netlify Docs](https://docs.netlify.com)</span></span>
<span class="line"><span>- [Netlify CLI Docs](https://cli.netlify.com)</span></span>
<span class="line"><span>- [Netlify Functions Docs](https://docs.netlify.com/functions/overview)</span></span>
<span class="line"><span>- [HaloLight Docs](https://docs.halolight.h7ml.cn)</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br><span class="line-number">86</span><br><span class="line-number">87</span><br><span class="line-number">88</span><br><span class="line-number">89</span><br><span class="line-number">90</span><br><span class="line-number">91</span><br><span class="line-number">92</span><br><span class="line-number">93</span><br><span class="line-number">94</span><br><span class="line-number">95</span><br><span class="line-number">96</span><br><span class="line-number">97</span><br><span class="line-number">98</span><br><span class="line-number">99</span><br><span class="line-number">100</span><br><span class="line-number">101</span><br><span class="line-number">102</span><br><span class="line-number">103</span><br><span class="line-number">104</span><br><span class="line-number">105</span><br><span class="line-number">106</span><br><span class="line-number">107</span><br><span class="line-number">108</span><br><span class="line-number">109</span><br><span class="line-number">110</span><br><span class="line-number">111</span><br><span class="line-number">112</span><br><span class="line-number">113</span><br><span class="line-number">114</span><br><span class="line-number">115</span><br><span class="line-number">116</span><br><span class="line-number">117</span><br><span class="line-number">118</span><br><span class="line-number">119</span><br><span class="line-number">120</span><br><span class="line-number">121</span><br><span class="line-number">122</span><br><span class="line-number">123</span><br><span class="line-number">124</span><br><span class="line-number">125</span><br><span class="line-number">126</span><br><span class="line-number">127</span><br><span class="line-number">128</span><br><span class="line-number">129</span><br><span class="line-number">130</span><br><span class="line-number">131</span><br><span class="line-number">132</span><br><span class="line-number">133</span><br><span class="line-number">134</span><br><span class="line-number">135</span><br><span class="line-number">136</span><br><span class="line-number">137</span><br><span class="line-number">138</span><br><span class="line-number">139</span><br><span class="line-number">140</span><br><span class="line-number">141</span><br><span class="line-number">142</span><br><span class="line-number">143</span><br><span class="line-number">144</span><br><span class="line-number">145</span><br><span class="line-number">146</span><br><span class="line-number">147</span><br><span class="line-number">148</span><br><span class="line-number">149</span><br><span class="line-number">150</span><br><span class="line-number">151</span><br><span class="line-number">152</span><br><span class="line-number">153</span><br><span class="line-number">154</span><br><span class="line-number">155</span><br><span class="line-number">156</span><br><span class="line-number">157</span><br><span class="line-number">158</span><br><span class="line-number">159</span><br><span class="line-number">160</span><br><span class="line-number">161</span><br><span class="line-number">162</span><br><span class="line-number">163</span><br><span class="line-number">164</span><br><span class="line-number">165</span><br><span class="line-number">166</span><br><span class="line-number">167</span><br><span class="line-number">168</span><br><span class="line-number">169</span><br><span class="line-number">170</span><br><span class="line-number">171</span><br><span class="line-number">172</span><br><span class="line-number">173</span><br><span class="line-number">174</span><br><span class="line-number">175</span><br><span class="line-number">176</span><br><span class="line-number">177</span><br><span class="line-number">178</span><br><span class="line-number">179</span><br><span class="line-number">180</span><br><span class="line-number">181</span><br><span class="line-number">182</span><br><span class="line-number">183</span><br><span class="line-number">184</span><br><span class="line-number">185</span><br><span class="line-number">186</span><br><span class="line-number">187</span><br><span class="line-number">188</span><br><span class="line-number">189</span><br><span class="line-number">190</span><br><span class="line-number">191</span><br><span class="line-number">192</span><br><span class="line-number">193</span><br><span class="line-number">194</span><br><span class="line-number">195</span><br><span class="line-number">196</span><br><span class="line-number">197</span><br><span class="line-number">198</span><br><span class="line-number">199</span><br><span class="line-number">200</span><br><span class="line-number">201</span><br><span class="line-number">202</span><br><span class="line-number">203</span><br><span class="line-number">204</span><br><span class="line-number">205</span><br><span class="line-number">206</span><br><span class="line-number">207</span><br><span class="line-number">208</span><br><span class="line-number">209</span><br><span class="line-number">210</span><br><span class="line-number">211</span><br><span class="line-number">212</span><br><span class="line-number">213</span><br><span class="line-number">214</span><br><span class="line-number">215</span><br><span class="line-number">216</span><br><span class="line-number">217</span><br><span class="line-number">218</span><br><span class="line-number">219</span><br><span class="line-number">220</span><br><span class="line-number">221</span><br><span class="line-number">222</span><br><span class="line-number">223</span><br><span class="line-number">224</span><br><span class="line-number">225</span><br><span class="line-number">226</span><br><span class="line-number">227</span><br><span class="line-number">228</span><br><span class="line-number">229</span><br><span class="line-number">230</span><br><span class="line-number">231</span><br><span class="line-number">232</span><br><span class="line-number">233</span><br><span class="line-number">234</span><br><span class="line-number">235</span><br><span class="line-number">236</span><br><span class="line-number">237</span><br><span class="line-number">238</span><br><span class="line-number">239</span><br><span class="line-number">240</span><br><span class="line-number">241</span><br><span class="line-number">242</span><br><span class="line-number">243</span><br><span class="line-number">244</span><br><span class="line-number">245</span><br><span class="line-number">246</span><br><span class="line-number">247</span><br><span class="line-number">248</span><br><span class="line-number">249</span><br><span class="line-number">250</span><br><span class="line-number">251</span><br><span class="line-number">252</span><br><span class="line-number">253</span><br><span class="line-number">254</span><br><span class="line-number">255</span><br><span class="line-number">256</span><br><span class="line-number">257</span><br><span class="line-number">258</span><br><span class="line-number">259</span><br><span class="line-number">260</span><br><span class="line-number">261</span><br><span class="line-number">262</span><br><span class="line-number">263</span><br><span class="line-number">264</span><br><span class="line-number">265</span><br><span class="line-number">266</span><br><span class="line-number">267</span><br><span class="line-number">268</span><br><span class="line-number">269</span><br><span class="line-number">270</span><br><span class="line-number">271</span><br><span class="line-number">272</span><br><span class="line-number">273</span><br><span class="line-number">274</span><br><span class="line-number">275</span><br><span class="line-number">276</span><br><span class="line-number">277</span><br><span class="line-number">278</span><br><span class="line-number">279</span><br><span class="line-number">280</span><br></div></div>`,49)])])}const h=a(t,[["render",i]]);export{d as __pageData,h as default};
