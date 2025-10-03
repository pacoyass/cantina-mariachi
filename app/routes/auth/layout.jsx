import { Outlet} from "react-router";

export const meta = () => [{ title: "Auth - Cantina" }];

export default function AuthLayout() {

  return (
    <main className="min-h-screen w-full ">
      <Outlet />;
    </main>
  )
   
      
 
}