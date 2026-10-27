/// <reference types="@cloudflare/workers-types" />

/**
 * Cloudflare Worker for ytalharabaci.dev
 * Handles:
 * 1. Sveltia CMS GitHub OAuth authentication (/auth & /callback)
 * 2. Dynamic config URL resolution for /admin/config.yml across environments
 * 3. Static asset serving via env.ASSETS
 */

export interface Env {
  ASSETS: Fetcher;
  AI?: any;
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
  GITHUB_HOSTNAME?: string;
  ALLOWED_DOMAINS?: string;
}

const supportedProviders = ['github'];

const escapeRegExp = (str: string): string => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getDomainPatterns = (allowedDomains?: string): string[] =>
  (allowedDomains ?? '')
    .split(',')
    .map((str) => str.trim())
    .filter(Boolean)
    .map((str) => `^${escapeRegExp(str).replaceAll('\\*', '[a-zA-Z0-9-]+')}$`);

const isAllowedHost = (hostname: string, allowedDomains?: string): boolean => {
  const patterns = getDomainPatterns(allowedDomains);
  return patterns.some((pattern) => new RegExp(pattern).test(hostname));
};

const isPrivateHost = (hostname: string): boolean => {
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') return true;
  if (/^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.|169\.254\.|0\.)/.test(hostname)) return true;
  return false;
};

const timingSafeEqual = (a: string, b: string): boolean => {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
};

const serialize = (value: unknown): string => JSON.stringify(value ?? null).replaceAll('<', '\\u003c');

interface OutputHTMLOptions {
  provider?: string;
  token?: string;
  error?: string;
  errorCode?: string;
  env?: Env;
}

const outputHTML = ({
  provider = 'github',
  token,
  error,
  errorCode,
  env = {} as Env,
}: OutputHTMLOptions): Response => {
  const state = error ? 'error' : 'success';
  const content = error ? { provider, error, errorCode } : { provider, token };

  const html = `<!doctype html>
<html>
<head><meta charset="utf-8"><title>Sveltia CMS Auth</title></head>
<body>
<script>
(() => {
  const trustedPatterns = ${serialize(getDomainPatterns(env.ALLOWED_DOMAINS))};
  const hasToken = ${serialize(!!token)};

  const isTrusted = (origin) => {
    try {
      const { hostname } = new URL(origin);
      return trustedPatterns.some((pattern) => new RegExp(pattern).test(hostname));
    } catch {
      return false;
    }
  };

  window.addEventListener('message', ({ data, origin }) => {
    if (data !== 'authorizing:${provider}') {
      return;
    }

    if (hasToken && trustedPatterns.length && !isTrusted(origin)) {
      return;
    }

    window.opener?.postMessage(
      'authorization:${provider}:${state}:' + ${serialize(JSON.stringify(content))},
      origin
    );
  });

  window.opener?.postMessage('authorizing:${provider}', '*');
})();
</script>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      'Set-Cookie': 'csrf-token=deleted; HttpOnly; Max-Age=0; Path=/; SameSite=Lax; Secure',
    },
  });
};

const handleAuth = async (request: Request, env: Env): Promise<Response> => {
  const { url } = request;
  const { searchParams } = new URL(url);
  const provider = searchParams.get('provider') || 'github';
  const domain = searchParams.get('site_id');
  const requestedScope = searchParams.get('scope') || 'repo,user';

  if (!supportedProviders.includes(provider)) {
    return outputHTML({
      env,
      error: 'Your Git backend is not supported by the authenticator.',
      errorCode: 'UNSUPPORTED_BACKEND',
    });
  }

  const domainPatterns = getDomainPatterns(env.ALLOWED_DOMAINS);
  if (
    domainPatterns.length &&
    domain &&
    !domainPatterns.some((pattern) => new RegExp(pattern).test(domain))
  ) {
    return outputHTML({
      env,
      provider,
      error: 'Your domain is not allowed to use the authenticator.',
      errorCode: 'UNSUPPORTED_DOMAIN',
    });
  }

  const {
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    GITHUB_HOSTNAME = 'github.com',
  } = env;

  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    return outputHTML({
      env,
      provider,
      error: 'GitHub OAuth Client ID or Secret is not configured in Worker environment variables.',
      errorCode: 'MISCONFIGURED_CLIENT',
    });
  }

  const csrfToken = globalThis.crypto.randomUUID().replaceAll('-', '');

  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    scope: requestedScope,
    state: csrfToken,
  });

  const authURL = `https://${GITHUB_HOSTNAME}/login/oauth/authorize?${params.toString()}`;

  return new Response(null, {
    status: 302,
    headers: {
      Location: authURL,
      'Set-Cookie': `csrf-token=github_${csrfToken}; HttpOnly; Path=/; Max-Age=600; SameSite=Lax; Secure`,
    },
  });
};

const handleCallback = async (request: Request, env: Env): Promise<Response> => {
  const { url, headers } = request;
  const { searchParams } = new URL(url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  const cookieHeader = headers.get('Cookie') || '';
  const match = cookieHeader.match(/\bcsrf-token=github_([0-9a-f]{32})\b/);
  const csrfToken = match ? match[1] : null;

  if (!code || !state) {
    return outputHTML({
      env,
      provider: 'github',
      error: 'Failed to receive an authorization code from GitHub.',
      errorCode: 'AUTH_CODE_REQUEST_FAILED',
    });
  }

  if (!csrfToken || !timingSafeEqual(state, csrfToken)) {
    return outputHTML({
      env,
      provider: 'github',
      error: 'Potential CSRF attack detected. Authentication flow aborted.',
      errorCode: 'CSRF_DETECTED',
    });
  }

  const {
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    GITHUB_HOSTNAME = 'github.com',
  } = env;

  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    return outputHTML({
      env,
      provider: 'github',
      error: 'GitHub OAuth Client ID or Secret is not configured.',
      errorCode: 'MISCONFIGURED_CLIENT',
    });
  }

  let token = '';
  let error = '';

  try {
    const response = await fetch(`https://${GITHUB_HOSTNAME}/login/oauth/access_token`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
      }),
    });

    const data = (await response.json()) as { access_token?: string; error?: string };
    token = data.access_token || '';
    error = data.error || '';
  } catch (err) {
    return outputHTML({
      env,
      provider: 'github',
      error: 'Failed to exchange authorization code for access token.',
      errorCode: 'TOKEN_REQUEST_FAILED',
    });
  }

  return outputHTML({ env, provider: 'github', token, error });
};

const handleProxyImage = async (request: Request, env: Env): Promise<Response> => {
  const origin = request.headers.get('Origin') || '';
  const referer = request.headers.get('Referer') || '';
  let callerHost = '';
  try {
    if (origin) callerHost = new URL(origin).hostname;
    else if (referer) callerHost = new URL(referer).hostname;
  } catch {}

  const corsOrigin = callerHost && isAllowedHost(callerHost, env.ALLOWED_DOMAINS)
    ? (origin || (referer ? new URL(referer).origin : 'https://ytalharabaci.dev'))
    : 'https://ytalharabaci.dev';

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': corsOrigin,
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': '*',
      },
    });
  }

  // Reject callers from untrusted domains
  if (callerHost && !isAllowedHost(callerHost, env.ALLOWED_DOMAINS)) {
    return new Response('Forbidden: untrusted origin', { status: 403 });
  }

  const secFetchSite = request.headers.get('Sec-Fetch-Site') || '';
  if (secFetchSite === 'cross-site') {
    return new Response('Forbidden: cross-site requests are blocked', { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return new Response('Missing "url" parameter', {
      status: 400,
      headers: { 'Access-Control-Allow-Origin': corsOrigin },
    });
  }

  let parsed: URL;
  try {
    parsed = new URL(targetUrl);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      throw new Error('Invalid protocol');
    }
  } catch {
    return new Response('Invalid URL', {
      status: 400,
      headers: { 'Access-Control-Allow-Origin': corsOrigin },
    });
  }

  if (isPrivateHost(parsed.hostname)) {
    return new Response('Forbidden: internal or private addresses are blocked', {
      status: 403,
      headers: { 'Access-Control-Allow-Origin': corsOrigin },
    });
  }

  try {
    const upstream = await fetch(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        Referer: parsed.origin,
      },
    });

    if (!upstream.ok) {
      return new Response(`Upstream error: ${upstream.status} ${upstream.statusText}`, {
        status: upstream.status,
        headers: { 'Access-Control-Allow-Origin': corsOrigin },
      });
    }

    const contentType = upstream.headers.get('content-type') || 'application/octet-stream';
    if (!contentType.toLowerCase().startsWith('image/')) {
      return new Response('Upstream returned non-image content', {
        status: 400,
        headers: { 'Access-Control-Allow-Origin': corsOrigin },
      });
    }

    const responseHeaders = new Headers();
    responseHeaders.set('Content-Type', contentType);
    responseHeaders.set('Access-Control-Allow-Origin', corsOrigin);
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    responseHeaders.set('Cache-Control', 'public, max-age=86400');

    return new Response(upstream.body, {
      status: 200,
      headers: responseHeaders,
    });
  } catch (err: any) {
    return new Response(`Proxy error: ${err?.message ?? String(err)}`, {
      status: 502,
      headers: { 'Access-Control-Allow-Origin': corsOrigin },
    });
  }
};

interface TranslatePayload {
  text?: string;
  sourceLang?: string;
  targetLang?: string;
}

const handleTranslate = async (request: Request, env: Env): Promise<Response> => {
  const origin = request.headers.get('Origin') || '';
  const referer = request.headers.get('Referer') || '';
  let callerHost = '';
  try {
    if (origin) callerHost = new URL(origin).hostname;
    else if (referer) callerHost = new URL(referer).hostname;
  } catch {}

  const corsOrigin = callerHost && isAllowedHost(callerHost, env.ALLOWED_DOMAINS)
    ? (origin || (referer ? new URL(referer).origin : 'https://ytalharabaci.dev'))
    : 'https://ytalharabaci.dev';

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': corsOrigin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  if (callerHost && !isAllowedHost(callerHost, env.ALLOWED_DOMAINS)) {
    return new Response('Forbidden: untrusted origin', { status: 403 });
  }

  const secFetchSite = request.headers.get('Sec-Fetch-Site') || '';
  if (secFetchSite === 'cross-site') {
    return new Response('Forbidden: cross-site requests are blocked', { status: 403 });
  }

  if (!env.AI) {
    return new Response(
      JSON.stringify({ error: "Workers AI binding 'AI' is not configured in environment." }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': corsOrigin },
      }
    );
  }

  let body: TranslatePayload;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': corsOrigin },
    });
  }

  const { text, sourceLang = 'tr', targetLang = 'en' } = body;

  if (!text || typeof text !== 'string' || !text.trim()) {
    return new Response(JSON.stringify({ error: 'Missing or empty "text" parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': corsOrigin },
    });
  }

  const srcLangName = sourceLang === 'tr' ? 'Turkish' : 'English';
  const dstLangName = targetLang === 'tr' ? 'Turkish' : 'English';

  try {
    const systemPrompt = `You are an expert technical translator specializing in cybersecurity, system engineering, and DevOps.
Translate the following content from ${srcLangName} to ${dstLangName}.

STRICT RULES:
1. Preserve all Markdown elements exactly: headings (#, ##, ###), bold/italic (**text**, *text*), links ([text](url)), images (![alt](path)), tables (| col |), and callouts (> [!NOTE], > [!TIP], > [!IMPORTANT], > [!WARNING], > [!CAUTION]).
2. Preserve all HTML elements and classes (e.g. <div class="glass-panel reveal-on-scroll">, <span>).
3. Do NOT translate code blocks (fenced with \`\`\`), shell commands, file paths, or Mermaid diagram structures. Only translate human explanations or diagram node labels where appropriate.
4. Keep industry-standard cybersecurity terminology accurate and natural (e.g., Threat Hunting, Sysmon, EDR, SIEM, Outbound mTLS, Lateral Movement).
5. Output ONLY the translated text. Do not add any greeting, preamble, commentary, or markdown wrapping around the entire output.`;

    let translated = '';

    try {
      const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct-fast', {
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text },
        ],
        max_tokens: 4096,
      });

      translated = aiResponse?.response?.trim() || '';
    } catch {
      // Fallback to translation model @cf/meta/m2m100-1.2b if LLM endpoint encounters an issue
      const m2mResponse = await env.AI.run('@cf/meta/m2m100-1.2b', {
        text: text.slice(0, 1000),
        source_lang: sourceLang === 'tr' ? 'turkish' : 'english',
        target_lang: targetLang === 'tr' ? 'turkish' : 'english',
      });
      translated = m2mResponse?.translated_text?.trim() || '';
    }

    return new Response(
      JSON.stringify({
        success: true,
        translation: translated,
        sourceLang,
        targetLang,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Access-Control-Allow-Origin': corsOrigin,
        },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: `Translation failed: ${err?.message || String(err)}` }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': corsOrigin },
      }
    );
  }
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    // 1. OAuth endpoints for Sveltia CMS
    if (pathname === '/auth' || pathname === '/oauth/authorize') {
      return handleAuth(request, env);
    }

    if (pathname === '/callback' || pathname === '/oauth/redirect') {
      return handleCallback(request, env);
    }

    // 2. Remote image proxy endpoint for CMS and media tools (with origin and SSRF security)
    if (pathname === '/api/proxy-image') {
      return handleProxyImage(request, env);
    }

    // 3. AI Translation endpoint powered by Cloudflare Workers AI
    if (pathname === '/api/translate') {
      return handleTranslate(request, env);
    }

    // 4. Dynamic config.yml helper: rewrite base_url to current origin if accessing on localhost or staging
    if (pathname === '/admin/config.yml') {
      const assetResponse = await env.ASSETS.fetch(request);
      if (assetResponse.ok) {
        const text = await assetResponse.text();
        // Dynamically point base_url to current origin
        const rewritten = text.replace(/base_url:\s*https?:\/\/[^\r\n]+/g, `base_url: ${url.origin}`);
        return new Response(rewritten, {
          status: assetResponse.status,
          headers: assetResponse.headers,
        });
      }
      return assetResponse;
    }

    // 5. Sitemap rewrite: serve /sitemap-index.xml when /sitemap.xml is requested
    if (pathname === '/sitemap.xml') {
      const sitemapUrl = new URL('/sitemap-index.xml', url.origin);
      return env.ASSETS.fetch(new Request(sitemapUrl.toString(), request));
    }

    // 6. Root redirect: direct humans to the full homepage (/tr/ or /en/), while letting bots read OpenGraph metadata
    if (pathname === '/' || pathname === '') {
      const userAgent = (request.headers.get('user-agent') || '').toLowerCase();
      const isBot = /bot|facebookexternalhit|whatsapp|telegram|twitter|slack|linkedin|discord|preview|crawl|spider/i.test(userAgent);
      if (!isBot) {
        const acceptLang = (request.headers.get('accept-language') || '').toLowerCase();
        const target = acceptLang.includes('tr') ? '/tr/' : '/en/';
        return Response.redirect(new URL(target, url.origin).toString(), 302);
      }
    }

    // 7. All other requests are served from static assets (HTML cached without Clear-Site-Data wipe)
    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      const newHeaders = new Headers(response.headers);
      newHeaders.set('Cache-Control', 'public, max-age=0, must-revalidate');
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    }
    return response;
  },
};

