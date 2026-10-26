/**
 * Cloudflare Worker for ytalharabaci.dev
 * Handles:
 * 1. Sveltia CMS GitHub OAuth authentication (/auth & /callback)
 * 2. Dynamic config URL resolution for /admin/config.yml across environments
 * 3. Static asset serving via env.ASSETS
 */

export interface Env {
  ASSETS: Fetcher;
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
    .map((str) => `^${escapeRegExp(str).replaceAll('\\*', '.+')}$`);

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

  if (!csrfToken || state !== csrfToken) {
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

const handleProxyImage = async (request: Request): Promise<Response> => {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': '*',
      },
    });
  }

  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return new Response('Missing "url" parameter', {
      status: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
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
      headers: { 'Access-Control-Allow-Origin': '*' },
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
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    }

    const contentType = upstream.headers.get('content-type') || 'application/octet-stream';
    const responseHeaders = new Headers();
    responseHeaders.set('Content-Type', contentType);
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    responseHeaders.set('Cache-Control', 'public, max-age=86400');

    return new Response(upstream.body, {
      status: 200,
      headers: responseHeaders,
    });
  } catch (err: any) {
    return new Response(`Proxy error: ${err?.message ?? String(err)}`, {
      status: 502,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
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

    // 2. Remote image proxy endpoint for CMS and media tools
    if (pathname === '/api/proxy-image') {
      return handleProxyImage(request);
    }

    // 2. Dynamic config.yml helper: rewrite base_url to current origin if accessing on localhost or staging
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

    // 3. Sitemap rewrite: serve /sitemap-index.xml when /sitemap.xml is requested
    if (pathname === '/sitemap.xml') {
      const sitemapUrl = new URL('/sitemap-index.xml', url.origin);
      return env.ASSETS.fetch(new Request(sitemapUrl.toString(), request));
    }

    // 4. Root redirect: direct humans to the full homepage (/tr/ or /en/), while letting bots read OpenGraph metadata
    if (pathname === '/' || pathname === '') {
      const userAgent = (request.headers.get('user-agent') || '').toLowerCase();
      const isBot = /bot|facebookexternalhit|whatsapp|telegram|twitter|slack|linkedin|discord|preview|crawl|spider/i.test(userAgent);
      if (!isBot) {
        const acceptLang = (request.headers.get('accept-language') || '').toLowerCase();
        const target = acceptLang.includes('tr') ? '/tr/' : '/en/';
        return Response.redirect(new URL(target, url.origin).toString(), 302);
      }
    }

    // 7. All other requests are served from static assets
    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      const newHeaders = new Headers(response.headers);
      newHeaders.set('Clear-Site-Data', '"cache"');
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

