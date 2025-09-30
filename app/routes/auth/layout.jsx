import { Outlet, useFetcher, useLoaderData } from "react-router";
import { useTranslation } from 'react-i18next';

export const meta = () => [{ title: "Auth - Cantina" }];

export default function AuthLayout() {
  const { t } = useTranslation('auth');
  let fetcher = useLoaderData();
console.log("fetcher from login",fetcher);
  return (
    <main className="min-h-screen w-full ">
      <Outlet />;
    </main>
  )
   
      
 
}