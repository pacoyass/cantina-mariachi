import { data, Outlet, redirect, useLoaderData, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { checkAuthToken } from "../utils/auth/authUtils";
import { useTokenTimer } from "../utils/auth/timerCheck";


export async function loader({ request, context }) {
  try {
    const csrfToken = context?.csrfToken || '';
    const result = await checkAuthToken(request, csrfToken);
    const urlPathname = new URL(request.url).pathname;
console.log("test",result);

    if (result?.user && (urlPathname === "/login" || urlPathname === "/register")) {
      throw redirect("/", { replace: true });
    }

    const headers = result?.headers instanceof Headers ? result.headers : new Headers();
    return data(result, { headers });
  } catch (error) {
    return data({ user: null, error: "Failed to load authentication." }, { status: 200 });
  }
}

export default function ShellLayout() {
  const loaderData = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [toastMessage, setToastMessage] = useState(null);

  useTokenTimer(loaderData?.refreshExpire, loaderData?.user?.exp);

  useEffect(() => {
    const loginMessage = searchParams.get("login-message");
    if (loginMessage) {
      setToastMessage({ message: loginMessage, type: "success", code: "SUCCESS", id: Date.now() });
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  return <Outlet context={{ user: loaderData?.user }} />
     
 
}