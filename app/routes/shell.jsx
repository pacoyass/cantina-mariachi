import { data, Outlet, redirect, useLoaderData, useOutletContext, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { checkAuthToken } from "../utils/auth/authUtils";
import { useTokenTimer } from "../utils/auth/timerCheck";

// const getCookieValue = ( cookieString, key ) =>
//   {
//       return cookieString
//           .split( "; " )
//           .find( row => row.startsWith( `${key}=` ) )
//           ?.split( "=" )[1] || "";
//   };
// export async function loader({ request, context }) {
//   try {
//     const csrfToken = context?.csrfToken || '';
//     const result = await checkAuthToken(request, csrfToken);
//     const urlPathname = new URL(request.url).pathname;
//     const params=new URL(request.url).searchParams.get('redirect')||"/";
//     const cookies =request?.headers?.get('cookie');
//     const i18nextValue = getCookieValue(cookies, "i18next");
//     console.log("🌐 i18next value:", result); // This will output: "fr"
// // console.log("test",request?.headers?.get('cookie'));

//     if (result?.user && (urlPathname === "/login" || urlPathname === "/register")) {
//       return redirect(`${params}?lng=${i18nextValue}`, { replace: true });
//     }
//     if (!result?.user && (urlPathname === "/menu" || urlPathname === "/account")) {
//       return redirect(`/login?redirect=${encodeURIComponent( urlPathname )}`,{replace:true});
//     }
//     const headers = result?.headers instanceof Headers ? result.headers : new Headers();
//     const checkHeaders = result?.checkHeaders instanceof Headers ? result.checkHeaders : new Headers();
//     const cookieHeader = headers.get( "set-cookie" ) || checkHeaders.get( "set-cookie" );
//     console.log( "📌 CheckAuth Result:headers", cookieHeader );
//     console.log( "📌 CheckAuth Result:checkheaders", checkHeaders );
//     return data( result, {
//       headers: headers ? headers : checkHeaders,
//   } );
//   } catch (error) {
//     return data({ user: null, error: "Failed to load authentication." }, { status: 500 });
//   }
// }

export default function ShellLayout() {
  // const [searchParams, setSearchParams] = useSearchParams();
  const {user}=useOutletContext() || {}; 
console.log("from shell",user);

  // useTokenTimer(loaderData?.refreshExpire, loaderData?.user?.exp);

  // useEffect(() => {
  //   const loginMessage = searchParams.get("login-message");
  //   if (loginMessage) {
  //    setSearchParams({});
  //   }
  // }, [searchParams, setSearchParams]);

  return <Outlet context={{user}} />
     
 
}