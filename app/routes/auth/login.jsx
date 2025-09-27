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
    // Debug the request
    console.log('🔍 Request debug:');
    console.log('- request.method:', request.method);
    console.log('- request.url:', request.url);
    console.log('- content-type:', request.headers.get('content-type'));
    
    const formData = await request.formData();
    
    // Debug logging - let's see what we're getting
    console.log('🔍 FormData debug:');
    console.log('- formData entries:', [...formData.entries()]);
    console.log('- formData size:', formData.entries().length);
    
    // Try multiple ways to get form data
    const email = formData.get('email');
    const password = formData.get('password');
    const remember = formData.get('remember');
    
    // Alternative approach if standard method fails
    const formDataObject = Object.fromEntries(formData.entries());
    console.log('🔄 Alternative formData object:', formDataObject);
    const { csrfToken } = context || {};
    
    console.log('📧 Extracted values:');
    console.log('- email:', email);
    console.log('- password:', password ? '[REDACTED]' : 'null/empty');
    console.log('- remember:', remember);
    console.log('- context:', context);
    console.log('- csrfToken:', csrfToken ? '[EXISTS]' : 'null/empty');
    
    // Fallback: try to get values from alternative object if primary method fails
    const finalEmail = email || formDataObject.email;
    const finalPassword = password || formDataObject.password;
    const finalRemember = remember || formDataObject.remember;
    
    console.log('🔄 Final values after fallback:');
    console.log('- finalEmail:', finalEmail);
    console.log('- finalPassword:', finalPassword ? '[REDACTED]' : 'null/empty');
    console.log('- finalRemember:', finalRemember);
    
    // Basic validation
    if (!finalEmail || !finalPassword) {
        console.log('❌ Validation failed: missing email or password');
        return { error: true, message: 'Please fill in all fields' };
    }

    if (!finalEmail.includes('@')) {
        console.log('❌ Validation failed: invalid email format');
        return { error: true, message: 'Please enter a valid email address' };
    }
    
    try {
        const apiUrl = process.env.VITE_API_URL || 'http://localhost:3334';
        console.log('🌐 Making API request to:', `${apiUrl}/api/auth/login`);
        
        const requestHeaders = {
            'Content-Type': 'application/json',
            'cookie': request.headers.get('cookie') || '',
        };
        
        // Only add CSRF token if it exists
        if (csrfToken) {
            requestHeaders['x-csrf-token'] = csrfToken;
        }
        
        console.log('📤 Request headers:', requestHeaders);
        
        const response = await fetch(`${apiUrl}/api/auth/login`, {
            method: 'POST',
            signal: request.signal,
            headers: requestHeaders,
            credentials: 'include',
            body: JSON.stringify({ email: finalEmail, password: finalPassword, remember: !!finalRemember }),
        });
        
        const result = await response.json();
        console.log('📡 API response status:', response.status);
        
        if (!response.ok) {
            console.log('❌ API error:', result);
            return { error: true, message: result.message || 'Login failed' };
        }

        console.log('✅ Login successful');
        // Return success data with cookies
        return data(result, {
            headers: {
                'Set-Cookie': response.headers.get('set-cookie') || '',
            }
        });
    } catch (error) {
        console.log('💥 Network error:', error.message);
        return { error: true, message: 'Network error. Please try again.' };
    }
}
