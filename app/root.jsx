import { useTranslation } from 'react-i18next';
import
  {
    data,
    isRouteErrorResponse,
    Links,
    Meta,
    Outlet,
    redirect,
    Scripts,
    ScrollRestoration,
    useLoaderData
  } from "react-router";
import { rtlLngs, supportedLngs } from '../i18n.config.js';
import stylesheet from "./app.css?url";
import { Footer } from "./components/Footer";
import { ThemeProvider } from "./components/ThemeProvider";
import { Navbar } from "./pages/Navbar";
import { checkAuthToken } from "./utils/auth/authUtils";
import { useTokenTimer } from "./utils/auth/timerCheck";
async function timingMiddleware({ context }, next) {
  const start = performance.now();
  await next();
  const duration = performance.now() - start;
  console.log(`Navigation took ${duration}ms`);
}

export function headers( {
  actionHeaders,
  loaderHeaders,
} )
{
  return actionHeaders ? actionHeaders : loaderHeaders;
}
export async function loader( { request, context } )
{
  const nonce = context?.nonce || "";
  const csrfToken = context?.csrfToken || "";
  const result = await checkAuthToken(request, csrfToken);
  const lng = context?.lng || 'en';
      const urlPathname = new URL(request.url).pathname;

    // use redirect query param if it exists, else fallback to previous page (referer), else home
    const redirectTo =
      new URL(request.url).searchParams.get("redirect") ||
      "/";
  const resources = context?.resources || {};
  // SSR fetch of public config to avoid hydration flicker in Navbar status
  let status = { isOpen: true, etaMins: 25 };
  const user=result?.user ?? null;
  if (user && (urlPathname === "/login" || urlPathname === "/register" )) {
   
    return redirect(`${redirectTo}?lng=${lng}`, { replace: true });
  }
  
    if (!user && (urlPathname === "/dashboard" || urlPathname === "/account" || urlPathname.startsWith("/dashboard"))) {
    
      return redirect(`/login?redirect=${encodeURIComponent( urlPathname )}`,{replace:true});
    }
     // NEW: Dashboard role-based redirect logic
  if (user && urlPathname.startsWith("/dashboard")) {
    const roleDashboard = {
      "OWNER": "/dashboard/admin",
      "ADMIN": "/dashboard/admin",
      "CASHIER": "/dashboard/cashier",
      "DRIVER": "/dashboard/driver", 
      "CUSTOMER": "/account"
    };

    const userDashboard =roleDashboard[user.role] || "/account";
    // r
    // If user is on base /dashboard path, redirect to their dashboard
    if (urlPathname === "/dashboard") {
      return redirect(userDashboard + `?lng=${lng}`, { replace: true });
    }

    // If user is trying to access wrong dashboard, redirect them
    const allowedRoutes = {
      "OWNER": ["/dashboard/admin"],
      "ADMIN": ["/dashboard/admin"],
      "CASHIER": ["/dashboard/cashier"],
      "DRIVER": ["/dashboard/driver"]
    };

    const userAllowedRoutes = allowedRoutes[user.role] || [];
    const isOnCorrectDashboard = userAllowedRoutes.some(route => 
      urlPathname.startsWith(route)
    );

    if (!isOnCorrectDashboard) {
      return redirect(userDashboard + `?lng=${lng}`, { replace: true });
    }
  }
  try {
    const url = new URL(request.url);
    const cookie = request.headers.get("cookie") || "";
    const res = await fetch(`${url.origin}/api/config/public`, { headers: { cookie } });
    if (res.ok) {
      const json = await res.json().catch(() => null);
      if (json?.data?.status) status = json.data.status;
    }
  } catch {}
  const headers = result?.headers instanceof Headers ? result.headers : new Headers();
  // const checkHeaders = result?.checkHeaders instanceof Headers ? result.checkHeaders : new Headers();

  
     return data({ nonce: nonce, csrfToken: csrfToken, lng, resources, status,result },{
      headers: headers ,
    }) ;
  
   

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
  const initialResources = loaderData.resources || {};
  const initialStatus = loaderData.status || { isOpen: true, etaMins: 25 };

  // Use server-provided language to prevent hydration mismatch
  // Don't try to detect URL language on client during initial render
  const lang = initialLang;
  const dir = rtlLngs.includes(lang) ? 'rtl' : 'ltr';
  // Client-side language sync (after hydration) - Removed DOM manipulation to fix React removeChild errors
  // Language updates are handled in entry.client.jsx to avoid React DOM conflicts
console.log("root loader",loaderData?.result);

  useTokenTimer( loaderData?.result?.refreshExpire, loaderData?.result?.user?.exp );
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
            <Navbar initialStatus={initialStatus} user={loaderData?.result?.user} lang={lang} />
            {children}
            <Footer />
          </div>
        </ThemeProvider>
        
        <ScrollRestoration nonce={nonce} />
        {/* Embed server-loaded i18n resources for hydration to avoid flicker/mismatch */}
        {initialResources && Object.keys(initialResources).length > 0 && (
          <script
            nonce={nonce}
            dangerouslySetInnerHTML={{
              __html: `window.__I18N__=${JSON.stringify({ lng: initialLang, resources: { [initialLang]: initialResources } }).replace(/</g, '\\u003c')}`
            }}
          />
        )}
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App()
{
  const {result,lng}=useLoaderData() || {}; 
 
  return <Outlet context={{ user:result?.user,lng }} />;
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