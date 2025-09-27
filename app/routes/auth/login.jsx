import Login from "../../pages/login";
import { useEffect } from "react";
import { useRouteError, isRouteErrorResponse, data, useNavigate } from "react-router";


export const meta = () => [
  { title: "Sign In - Cantina Mariachi" },
  { name: "description", content: "Sign in to your Cantina Mariachi account to access your orders, reservations, and rewards." },
];


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
        return (
            <div className="p-4 text-center">
                <h1 className="text-xl font-semibold text-red-600">Login Error</h1>
                <p className="text-sm text-gray-600 mt-2">An unexpected error occurred. Please try again.</p>
            </div>
        );
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



// Server Action - runs on the server and is removed from client bundles
export async function action({ request, context }) {
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');
    const remember = formData.get('remember');
    const { csrfToken } = context;
    
    // Basic validation
    if (!email || !password) {
        return { error: true, message: 'Please fill in all fields' };
    }

    if (!email.includes('@')) {
        return { error: true, message: 'Please enter a valid email address' };
    }
    
    try {
        const apiUrl = process.env.VITE_API_URL || 'http://localhost:3334';
        const response = await fetch(`${apiUrl}/api/auth/login`, {
            method: 'POST',
            signal: request.signal,
            headers: {
                'Content-Type': 'application/json',
                'x-csrf-token': csrfToken,
                'cookie': request.headers.get('cookie') || '',
            },
            credentials: 'include',
            body: JSON.stringify({ email, password, remember: !!remember }),
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            return { error: true, message: result.message || 'Login failed' };
        }

        // Return success data with cookies
        return data(result, {
            headers: {
                'Set-Cookie': response.headers.get('set-cookie') || '',
            }
        });
    } catch (error) {
        return { error: true, message: 'Network error. Please try again.' };
    }
}
