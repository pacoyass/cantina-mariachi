import { data, Outlet, redirect, useLoaderData, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { checkAuthToken } from "../utils/auth/authUtils";
import { useTokenTimer } from "../utils/auth/timerCheck";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Toast } from "../components/ui/alert";
import { Alert } from "../components/ui/alert";

export async function loader({ request, context }) {
  try {
    const csrfToken = context?.csrfToken || '';
    const result = await checkAuthToken(request, csrfToken);
    const urlPathname = new URL(request.url).pathname;

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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar initialStatus={{ isOpen: true, etaMins: 25 }} />
      <main className="flex-1">
        <Outlet context={{ user: loaderData?.user }} />
        {toastMessage && (
          <div className="fixed bottom-4 right-4 max-w-sm">
            <Alert>
              {toastMessage.message}
            </Alert>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}