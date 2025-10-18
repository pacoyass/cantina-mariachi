import { Outlet, useOutletContext } from "react-router";



export default function ShellLayout() {
  const {user}=useOutletContext() || {}; 



  return <Outlet context={{user}} />
     
 
}