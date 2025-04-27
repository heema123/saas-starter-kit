import micromatch from 'micromatch';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import env from './lib/env';

// Constants for security headers
const SECURITY_HEADERS = {
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=()',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-site',
} as const;

// Generate CSP
const generateCSP = (): string => {
  const policies = {
    'default-src': ["'self'"],
    'img-src': [
      "'self'",
      'boxyhq.com',
      '*.boxyhq.com',
      '*.dicebear.com',
      'data:',
    ],
    'script-src': [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      '*.gstatic.com',
      '*.google.com',
    ],
    'style-src': ["'self'", "'unsafe-inline'"],
    'connect-src': [
      "'self'",
      '*.google.com',
      '*.gstatic.com',
      'boxyhq.com',
      '*.ingest.sentry.io',
      '*.mixpanel.com',
    ],
    'frame-src': ["'self'", '*.google.com', '*.gstatic.com'],
    'font-src': ["'self'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
  };

  return Object.entries(policies)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .concat(['upgrade-insecure-requests'])
    .join('; ');
};

// Add routes that don't require authentication
const unAuthenticatedRoutes = [
  '/api/hello',
  '/api/health',
  '/api/auth/**',
  '/api/oauth/**',
  '/api/scim/v2.0/**',
  '/api/invitations/*',
  '/api/webhooks/stripe',
  '/api/webhooks/dsync',
  '/auth/**',
  '/invitations/*',
  '/terms-condition',
  '/unlock-account',
  '/login/saml',
  '/.well-known/*',
  '/',
];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLanguageChangeRequest = req.headers.get('x-language-change') === 'true' || req.cookies.get('languageChange')?.value === 'true';
  
  // Debug logging
  console.log('Middleware - Request URL:', req.url);
  console.log('Middleware - Pathname:', pathname);
  console.log('Middleware - Locale:', req.nextUrl.locale);
  console.log('Middleware - Default locale:', req.nextUrl.defaultLocale);
  console.log('Middleware - Is language change request:', isLanguageChangeRequest);

  // Check if this is a language change request via header or cookie
  if (isLanguageChangeRequest) {
    console.log('Middleware - Language change request detected, bypassing auth check');
    
    // Create a response that allows the request to proceed
    const response = NextResponse.next();
    
    // Clear the language change cookie if it exists
    if (req.cookies.get('languageChange')) {
      response.cookies.delete('languageChange');
    }
    
    return response;
  }

  // Path normalization for i18n - strip out the locale prefix for matching
  let pathWithoutLocale = pathname;
  const locales = ['en', 'ar']; // Should match your i18n config
  
  for (const locale of locales) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      // Remove locale prefix for route matching
      pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
      console.log('Middleware - Normalized path without locale:', pathWithoutLocale);
      break;
    }
  }

  // Bypass routes that don't require authentication
  if (micromatch.isMatch(pathWithoutLocale, unAuthenticatedRoutes)) {
    console.log('Middleware - Route is exempt from authentication:', pathWithoutLocale);
    return NextResponse.next();
  }

  const redirectUrl = new URL('/auth/login', req.url);
  redirectUrl.searchParams.set('callbackUrl', encodeURI(req.url));
  console.log('Middleware - Redirect URL (if needed):', redirectUrl.toString());

  // JWT strategy
  if (env.nextAuth.sessionStrategy === 'jwt') {
    const token = await getToken({
      req,
    });

    if (!token) {
      console.log('Middleware - No JWT token, redirecting to login');
      return NextResponse.redirect(redirectUrl);
    }
    console.log('Middleware - JWT token found, allowing request');
  }

  // Database strategy
  else if (env.nextAuth.sessionStrategy === 'database') {
    const url = new URL('/api/auth/session', req.url);

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        cookie: req.headers.get('cookie') || '',
      },
    });

    const session = await response.json();

    if (!session.user) {
      console.log('Middleware - No session user, redirecting to login');
      return NextResponse.redirect(redirectUrl);
    }
    console.log('Middleware - Session user found, allowing request');
  }

  const requestHeaders = new Headers(req.headers);
  const csp = generateCSP();

  requestHeaders.set('Content-Security-Policy', csp);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  if (env.securityHeadersEnabled) {
    // Set security headers
    response.headers.set('Content-Security-Policy', csp);
    Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }

  // All good, let the request through
  console.log('Middleware - Request passed all checks, proceeding');
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth/session).*)'],
};
