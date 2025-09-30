import Login from "../../pages/login";
import { useEffect } from "react";
import { useRouteError, isRouteErrorResponse, data, useNavigate, redirect } from "react-router";


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
    console.log('🚀 ACTION CALLED! Server action is working');
    
    // Debug the request
    console.log('🔍 Request debug:');
    console.log('- request.method:', request.method);
    console.log('- request.url:', request.url);
    console.log('- content-type:', request.headers.get('content-type'));
    
    // Try reading the request body directly first
    let rawBody;
    let formData;
    try {
        // Clone the request to read body multiple times
        const clonedRequest = request.clone();
        rawBody = await clonedRequest.text();
        console.log('📄 Raw request body:', rawBody);
        
        // Now get the formData from the original request
        formData = await request.formData();
    } catch (error) {
        console.log('❌ Error reading request:', error.message);
        // Fallback: try to get formData directly
        try {
            formData = await request.formData();
        } catch (formError) {
            console.log('❌ Error getting formData:', formError.message);
            formData = new FormData(); // Empty formData as fallback
        }
    }
    
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
    
    // Try parsing as URLSearchParams if formData is empty
    let urlParams = {};
    if (rawBody && rawBody.trim()) {
        try {
            const params = new URLSearchParams(rawBody);
            urlParams = Object.fromEntries(params.entries());
            console.log('🔗 URLSearchParams object:', urlParams);
        } catch (error) {
            console.log('❌ Error parsing URLSearchParams:', error.message);
        }
    }
    const { csrfToken } = context || {};
    const url = new URL(request.url);
    const rawCookie = request.headers.get('cookie') || '';
    const cookieLngMatch = rawCookie.match(/(?:^|; )i18next=([^;]+)/);
    const cookieLng = cookieLngMatch ? decodeURIComponent(cookieLngMatch[1]) : null;
    const currentLng = cookieLng || url.searchParams.get('lng') || (context && context.lng) || 'en';
    
    console.log('📧 Extracted values:');
    console.log('- email:', email);
    console.log('- password:', password ? '[REDACTED]' : 'null/empty');
    console.log('- remember:', remember);
    console.log('- context:', context);
    console.log('- csrfToken:', csrfToken ? '[EXISTS]' : 'null/empty');
    
    // Fallback: try to get values from alternative methods if primary method fails
    const finalEmail = email || formDataObject.email || urlParams.email;
    const finalPassword = password || formDataObject.password || urlParams.password;
    const finalRemember = remember || formDataObject.remember || urlParams.remember;
    
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
        
        const existingCookie = rawCookie;
        const ensureLngCookie = existingCookie && existingCookie.includes('i18next=')
          ? existingCookie
          : (existingCookie ? `${existingCookie}; i18next=${currentLng}` : `i18next=${currentLng}`);

        const requestHeaders = {
            'Content-Type': 'application/json',
            'Accept-Language': currentLng,
            'cookie': ensureLngCookie,
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
        // Build redirect target from query (?redirect=...) and preserve lng if present
        const setCookie = response.headers.get('set-cookie') || '';
        const targetFromParam = url.searchParams.get('redirect') || '/';
        const preserveLng = url.searchParams.get('lng');
        const targetUrl = new URL(targetFromParam, url.origin);
        if (preserveLng && !targetUrl.searchParams.get('lng')) {
          targetUrl.searchParams.set('lng', preserveLng);
        }
        const headers = new Headers();
        if (setCookie) headers.append('Set-Cookie', setCookie);
        return redirect(targetUrl.pathname + targetUrl.search + targetUrl.hash, { headers });
    } catch (error) {
        console.log('💥 Network error:', error.message);
        return { error: true, message: 'Network error. Please try again.' };
    }
}
