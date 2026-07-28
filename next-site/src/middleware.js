import { NextResponse } from 'next/server';

const locales = ['en', 'uk', 'ru', 'de', 'es', 'fr', 'pl', 'pt'];
const defaultLocale = 'en';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Remove .html extension for internal matching
  const cleanPath = pathname.replace(/\.html$/, '');

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => cleanPath.startsWith(`/${locale}/`) || cleanPath === `/${locale}`
  );

  // If the pathname has a locale, do nothing (let it route to /[lang]/...)
  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Exempt internal Next.js paths, API routes, and static files
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/blog-images/') ||
    pathname.startsWith('/css/') ||
    pathname.startsWith('/js/') ||
    pathname.match(/\.(png|jpg|jpeg|svg|ico|webmanifest)$/i) ||
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt'
  ) {
    return NextResponse.next();
  }

  // Redirect or rewrite? We want to KEEP the URL without /en/ for the default locale.
  // So we use rewrite.
  request.nextUrl.pathname = `/${defaultLocale}${cleanPath}`;
  return NextResponse.rewrite(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)',
  ],
};
