import
{
  isRouteErrorResponse,
  Meta,
  Outlet,
  Links,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  NavLink,
} from "react-router";
import stylesheet from "./app.css?url";
import { Sheet, SheetContent, SheetTrigger } from "./components/ui/sheet";
import { Button } from "./components/ui/button";
import {  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./components/ui/dropdown-menu";
import { ModeToggle } from "./components/ThemeToggle";
import { ThemeProvider } from "./components/ThemeProvider";
import { useTranslation } from 'react-i18next';
import { supportedLngs, rtlLngs } from '../i18n.config.js';
import { useEffect, useState } from 'react';

export async function loader( { request, context } )
{
  const nonce = context?.nonce || "";
  const csrfToken = context?.csrfToken || "";
  const lng = context?.lng || 'en';
  
  if ( nonce ) {
    return { nonce: nonce, csrfToken: csrfToken, lng };
  }
  
  return { nonce: "", lng }; 
}

export const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  { rel: "stylesheet", href: stylesheet },
];

export function Layout( { children } )
{
  const loaderData = useLoaderData() || {}; 
  const nonce = loaderData.nonce || ""; 
  const { i18n } = useTranslation();
  const initialLang = loaderData.lng || 'en';
  
  // Get language from URL or fallback to server context
  const urlLang = (() => { 
    try { 
      return new URLSearchParams(window.location.search).get('lng'); 
    } catch { 
      return null; 
    } 
  })();
  
  const lang = urlLang || i18n?.language || initialLang;
  const dir = rtlLngs.includes(lang) ? 'rtl' : 'ltr';

  // Sync client-side language changes with server context
  useEffect(() => {
    try {
      if (urlLang && i18n?.changeLanguage) {
        i18n.changeLanguage(urlLang);
      }
      
      // Update document attributes
      document.documentElement.lang = lang;
      document.documentElement.dir = dir;
      
      // Update meta tags for better SEO
      const metaLang = document.querySelector('meta[name="language"]');
      if (metaLang) {
        metaLang.setAttribute('content', lang);
      } else {
        const newMeta = document.createElement('meta');
        newMeta.name = 'language';
        newMeta.content = lang;
        document.head.appendChild(newMeta);
      }
      
    } catch (error) {
      console.warn('Failed to sync language:', error);
    }
  }, [urlLang, lang, dir, i18n]);

  return (
    <html lang={lang} dir={dir} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="language" content={lang} />
        <Meta nonce={nonce} />
        <Links nonce={nonce}/>
        
        {/* SEO: Language alternatives */}
        {supportedLngs.map(code => (
          <link key={code} rel="alternate" hrefLang={code} href={code === 'en' ? '/' : `/?lng=${code}`} />
        ))}
        <link rel="alternate" hrefLang="x-default" href="/" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={lang === 'en' ? '/' : `/?lng=${lang}`} />
        
        {/* RTL CSS for Arabic */}
        {lang === 'ar' && (
          <style nonce={nonce}>
            {`
              body { direction: rtl; text-align: right; }
              .rtl-support { direction: rtl; }
            `}
          </style>
        )}
      </head>
      <body className="antialiased">
        <ThemeProvider attribute="class" nonce={nonce} defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App()
{
  return <Outlet />;
}


export function ErrorBoundary( { error } )
{
  const { t } = useTranslation();
  let message = t('errors.title', { ns: 'ui' });
  let details = t('errors.notFound', { ns: 'ui' });
  let stack;
  if ( isRouteErrorResponse( error ) ) {
    message = error.status === 404 ? `${error.status}-${error.statusText}` : t('errors.title', { ns: 'ui' });
    details =
      error.status === 404
        ? t('errors.notFound', { ns: 'ui' })
        : error.statusText || details;
  } else if ( import.meta.env.DEV && error && error instanceof Error ) {
    details = error.message;
    stack = error.stack;
  }
  const data = useLoaderData();

  console.log( "🚨 ErrorBoundary data:", data );
  return (

    <main className="flex flex-col items-center justify-center min-h-screen w-full   bg-black blue-lightning-overlay font-josefine leading-normal">
        <nav className="container mx-auto grid grid-cols-3 h-14 items-center px-4">
          <div className="flex items-center gap-3">
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger>
                  <Button variant="ghost" aria-label="Open menu">☰</Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="flex flex-col gap-3">
                    <NavLink to="/">{t('nav.home', { ns: 'ui' })}</NavLink>
                    <NavLink to="/menu">{t('nav.menu', { ns: 'ui' })}</NavLink>
                    <NavLink to="/orders">{t('nav.orders', { ns: 'ui' })}</NavLink>
                    <NavLink to="/reservations">{t('nav.reservations', { ns: 'ui' })}</NavLink>
                    <NavLink to="/account">{t('nav.account', { ns: 'ui' })}</NavLink>
                    <div className="border-t pt-2">
                      <div className="text-sm font-medium text-muted-foreground mb-2">Language</div>
                      {supportedLngs.map(code => (
                        <button
                          key={code}
                          className="block w-full text-left px-2 py-1 text-sm hover:bg-muted rounded"
                          onClick={() => {
                            i18n.changeLanguage(code);
                            localStorage.setItem('lng', code);
                            const url = new URL(window.location.href);
                            url.searchParams.set('lng', code);
                            window.history.replaceState({}, '', url.toString());
                            // Note: Server handles cookie updates via httpOnly cookies
                          }}
                        >
                          {code.toUpperCase()}
                        </button>
                      ))}
                      <button
                        className="block w-full text-left px-2 py-1 text-sm text-red-600 hover:bg-muted rounded"
                        onClick={() => {
                          i18n.changeLanguage('en');
                          localStorage.removeItem('lng');
                          const url = new URL(window.location.href);
                          url.searchParams.delete('lng');
                          window.history.replaceState({}, '', url.toString());
                          // Note: Server handles cookie updates via httpOnly cookies
                        }}
                      >
                        Reset to Default
                      </button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            <div className="hidden md:flex items-center gap-4 text-sm">
              <NavLink to="/menu">{t('nav.menu', { ns: 'ui' })}</NavLink>
              <NavLink to="/orders">{t('nav.orders', { ns: 'ui' })}</NavLink>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <NavLink to="/" className="text-lg font-semibold">{t('brand', { ns: 'ui' })}</NavLink>
          </div>

          <div className="flex items-center justify-end gap-2">
            <div className="hidden md:flex items-center gap-4 text-sm mr-2">
              <NavLink to="/reservations">{t('nav.reservations', { ns: 'ui' })}</NavLink>
              <NavLink to="/account">{t('nav.account', { ns: 'ui' })}</NavLink>
            </div>
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" aria-label="Language menu">🌐</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {supportedLngs.map(code => (
                  <DropdownMenuItem 
                    key={code} 
                    onClick={() => {
                      i18n.changeLanguage(code);
                      localStorage.setItem('lng', code);
                      // Update URL
                      const url = new URL(window.location.href);
                      url.searchParams.set('lng', code);
                      window.history.replaceState({}, '', url.toString());
                      // Note: Server handles cookie updates via httpOnly cookies
                    }}
                  >
                    {code.toUpperCase()}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem 
                  onClick={() => {
                    // Reset to default language
                    i18n.changeLanguage('en');
                    localStorage.removeItem('lng');
                    // Clear URL parameter
                    const url = new URL(window.location.href);
                    url.searchParams.delete('lng');
                    window.history.replaceState({}, '', url.toString());
                    // Note: Server handles cookie updates via httpOnly cookies
                  }}
                >
                  Reset to Default
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" aria-label="Account menu">☰</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild><NavLink to="/account">{t('nav.profile', { ns: 'ui' })}</NavLink></DropdownMenuItem>
                <DropdownMenuItem asChild><NavLink to="/login">{t('nav.login', { ns: 'ui' })}</NavLink></DropdownMenuItem>
                <DropdownMenuItem asChild><NavLink to="/register">{t('nav.register', { ns: 'ui' })}</NavLink></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button className="hidden md:inline-flex">{t('nav.orderNow', { ns: 'ui' })}</Button>
          </div>
        </nav>
      <div className="flex flex-col items-center justify-center w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-4xl rounded-4xl  p-4 sm:p-6 lg:p-8 xl:p-24">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-thin text-center mb-4 sm:mb-6 tracking-wide">
          {message}
        </h1>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-center text-gray-300 mb-4 sm:mb-6 md:mb-8 max-w-xs sm:max-w-md md:max-w-lg">
          {details}
        </p>
        {stack && (
          <pre className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-full p-2 sm:p-4 overflow-x-auto text-sm sm:text-base">
            <code>{stack}</code>
          </pre>
        )}

      </div>
    </main>

  );
}