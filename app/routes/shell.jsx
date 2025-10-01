import { data, Outlet, redirect, useLoaderData, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { checkAuthToken } from "../utils/auth/authUtils";
import { useTokenTimer } from "../utils/auth/timerCheck";


export async function loader({ request, context }) {
  try {
    const csrfToken = context.csrfToken;
    const result = await checkAuthToken( request, csrfToken );
    const url = new URL( request.url ).pathname;
    console.log( "📌 CheckAuth Result:", url );

    if ( result?.user && ( url === "/login" || url === "/register" ) ) {
        return redirect( "/", { replace: true } );
    }
    const headers = result?.headers instanceof Headers ? result.headers : new Headers();
    const checkHeaders = result?.checkHeaders instanceof Headers ? result.checkHeaders : new Headers();
    const cookieHeader = headers.get( "set-cookie" ) || checkHeaders.get( "set-cookie" );
    console.log( "📌 CheckAuth Result:headers", cookieHeader );
    console.log( "📌 CheckAuth Result:checkheaders", checkHeaders );

    return data( result, {
        headers: headers ? headers : checkHeaders,
    } );
  } catch (error) {
    return data({ user: null, error: "Failed to load authentication." }, { status: 200 });
  }
}

export default function ShellLayout() {
  const loaderData = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();

  useTokenTimer(loaderData?.refreshExpire, loaderData?.user?.exp);

  useEffect(() => {
    const loginMessage = searchParams.get("redirect");
    if (loginMessage) {
   setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Outlet context={{ user: loaderData?.user }} />
      </main>
    </div>
  );
}