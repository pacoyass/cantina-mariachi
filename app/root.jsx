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
import { ThemeProvider } from "./components/ThemeProvider";
import { supportedLngs, rtlLngs } from '../i18n.config.js';
import { useTranslation } from 'react-i18next';
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

export async function loader( { request, context } )
{
  const nonce = context?.nonce || "";
  const csrfToken = context?.csrfToken || "";
  const lng = context?.lng || 'en';
  // SSR fetch of public config to avoid hydration flicker in Navbar status
  let status = { isOpen: true, etaMins: 25 };
  try {
    const url = new URL(request.url);
    const cookie = request.headers.get("cookie") || "";
    const res = await fetch(`${url.origin}/api/config/public`, { headers: { cookie } });
    if (res.ok) {
      const json = await res.json().catch(() => null);
      if (json?.data?.status) status = json.data.status;
    }
  } catch {}
  
  if ( nonce ) {
    return { nonce: nonce, csrfToken: csrfToken, lng, status };
  }
  
  return { nonce: "", lng, status }; 
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
  const initialLang = loaderData.lng || 'en';
  const initialStatus = loaderData.status || { isOpen: true, etaMins: 25 };
  
  // Use server-provided language to prevent hydration mismatch
  // Don't try to detect URL language on client during initial render
  const lang = initialLang;
  const dir = rtlLngs.includes(lang) ? 'rtl' : 'ltr';

  // Client-side language sync (after hydration) - Removed DOM manipulation to fix React removeChild errors
  // Language updates are handled in entry.client.jsx to avoid React DOM conflicts

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
        <ThemeProvider 
          attribute="class" 
          nonce={nonce} 
          defaultTheme="system" 
          enableSystem 
          disableTransitionOnChange
          suppressHydrationWarning
        >
          <div className="bg-mexican-pattern min-h-screen">
            <Navbar initialStatus={initialStatus} />
            {children}
            <Footer />
          </div>
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
  // Ensure translations return strings, not objects
  let message = String(t('errors.title', { ns: 'ui' }) || 'Error');
  let details = String(t('errors.notFound', { ns: 'ui' }) || 'Something went wrong');
  let stack;
  if ( isRouteErrorResponse( error ) ) {
    message = error.status === 404 ? `${error.status}-${error.statusText}` : String(t('errors.title', { ns: 'ui' }) || 'Error');
    details =
      error.status === 404
        ? String(t('errors.notFound', { ns: 'ui' }) || 'Page not found')
        : error.statusText || details;
  } else if ( import.meta.env.DEV && error && error instanceof Error ) {
    details = String(error.message || 'Unknown error');
    stack = error.stack;
  }
  const data = useLoaderData();

  console.log( "🚨 ErrorBoundary data:", data );
  return (

    <main className="flex flex-col items-center justify-center min-h-screen w-full   bg-black blue-lightning-overlay font-josefine leading-normal">
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