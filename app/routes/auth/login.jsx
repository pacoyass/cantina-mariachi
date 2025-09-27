





import Login from "../../pages/login";
import { useEffect } from "react";
import { useRouteError, isRouteErrorResponse, useNavigation, data, redirect, useNavigate } from "react-router";


export const meta = () => [
  { title: "Sign In - Cantina Mariachi" },
  { name: "description", content: "Sign in to your Cantina Mariachi account to access your orders, reservations, and rewards." },
];

// export async function action({ request }) {
//   const formData = await request.formData();
//   const email = formData.get("email");
//   const password = formData.get("password");
//   const remember = formData.get("remember");
//   console.log("test",email);

//   // Basic validation
//   if (!email || !password) {
//     return Response.json({
//       error: "Please fill in all fields",
//       fields: { email, password, remember }
//     }, { status: 400 });
//   }

//   if (!email.includes("@")) {
//     return Response.json({
//       error: "Please enter a valid email address",
//       fields: { email, password, remember }
//     }, { status: 400 });
//   }

//   try {
//     const response = await fetch(`${new URL(request.url).origin}/api/auth/login`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Accept": "application/json",
//         // Pass along original request headers for authentication
//         "Cookie": request.headers.get("Cookie") || "",
//       },
//       body: JSON.stringify({ email, password, remember: !!remember }),
//     });
//     const datas= await response.json();
//     console.log("test",response);

//     if (!response.ok) {
//       // Try to parse JSON, fallback to text if it fails
//       let errorData;
//       try {
//         errorData = await response.json();
//       } catch {
//         errorData = { error: { message: "Network error occurred" } };
//       }
     
      
//       return Response.json({
//         error: errorData.error?.message || "Invalid credentials",
//         fields: { email, password, remember }
//       }, { status: response.status });
//     }

//     const data = await response.json();

//     // Set cookies if they were returned
//     const headers = new Headers();
//     const setCookieHeader = response.headers.get("Set-Cookie");
//     if (setCookieHeader) {
//       headers.set("Set-Cookie", setCookieHeader);
//     }

//     // Redirect to account page or intended destination
//     return redirect("/account", { headers });
//   } catch (error) {
//     return Response.json({
//       error: "Network error. Please try again.",
//       fields: { email, password, remember }
//     }, { status: 500 });
//   }
// }

// 🛠 Error Boundary (Handles login errors)
export function ErrorBoundary()
{
    const error = useRouteError();
    console.log( "🚀 ~ file: login.jsx:9 ~ ErrorBoundary ~ error:", error );

    if ( isRouteErrorResponse( error ) ) {
        return (
            <div>
                <h1>Error {error.status}: {error.statusText}</h1>
                <p>{error.data}</p>
            </div>
        );
    } else {
        return <h1>azert</h1>;
    }
}
export function headers( {
  actionHeaders,
  loaderHeaders,
} )
{
  return actionHeaders ? actionHeaders : loaderHeaders;
}

export default function LoginPage( { actionData } ) {

  const navigate = useNavigate();
    const errorMessage = actionData?.error === true ? actionData.message : "";
    useEffect( () =>
    {

        if ( actionData?.error === false && actionData?.code === "LOGIN_SUCCESS" ) {

            navigate( `/?login-message=${encodeURIComponent( actionData.message )}` );
        }
    }, [actionData, navigate] );

    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-md bg-opacity-50 flex justify-center items-center">
          <Login error={errorMessage} />
      </div>
  );
 
}



export async function action( { request, context } )
{
    const formData = await request.formData();
    const email = formData.get( 'email' );
    const password = formData.get( 'password' );
    const { csrfToken } = context;
    console.log("email",email);
    
    try {
        const response = await fetch( 'http://localhost:3334/api/auth/login', {
            method: 'POST',
            signal: request.signal,
            headers: {
                "Content-Type": "application/json",
                // 'x-csrf-token': csrfToken, // Include the CSRF token in the headers
                cookie: request.headers.get( 'cookie' ),
            },
            credentials: 'include',
            body: JSON.stringify( { email, password } ),
        } );
        const result = await response.json();
        if ( !response.ok ) {
            console.log( 'Login error:', result );
            return { error: true, message: result.message || 'Login failed' };
        }
        console.log( 'Login success:', result );

        return data( result, {
            headers: {
                'Set-Cookie': response.headers.get( "set-cookie" ),
            }
        } );
    } catch ( error ) {
        console.error( "Error during login:", error );
        throw error;
    }
}

// export async function action( { request, context } )
// {
//     const formData = await request.formData();
//     const email = formData.get( 'email' );
//     const password = formData.get( 'password' );
//     const { csrfToken } = context;
//     console.log("hello",formData);
//     console.log(email);
    
//     try {
//         const response = await fetch('http://localhost:3333/api/auth/login'
// , {
//             method: 'POST',
//             signal: request.signal,
//             headers: {
//                 "Content-Type": "application/json",
//                 'X-CSRF-Token': csrfToken, // Include the CSRF token in the headers
//                 cookie: request.headers.get( 'cookie' ),
//             },
//             credentials: 'include',
//             body: JSON.stringify( { email, password } ),
//         } );
//         const result = await response.json();
//         if ( !response.ok ) {
//             console.log( 'Login error:', result );
//             return { error: true, message: result.message || 'Login failed' };
//         }
//         console.log( 'Login success:', result );

//         return data( result, {
//             headers: {
//                 'Set-Cookie': response.headers.get( "set-cookie" ),
//             }
//         } );
//     } catch ( error ) {
//         console.error( "Error during login:", error );
//         throw error;
//     }
// }