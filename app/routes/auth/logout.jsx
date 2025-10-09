import Logout from "../../pages/logout";
import { useEffect } from "react";
import { useRouteError, isRouteErrorResponse, data, useNavigate } from "react-router";

export const meta = () => [
  { title: "Logout - Cantina Mariachi" },
  { name: "description", content: "Logout from your Cantina Mariachi account safely." },
];
const getCookieValue = ( cookieString, key ) =>
    {
        return cookieString
            .split( "; " ) // Split cookies by "; "
            .find( row => row.startsWith( `${key}=` ) ) // Find the cookie with the key
            ?.split( "=" )[1]; // Get the value (after "=")
    };

// Server Action - runs on the server and is removed from client bundles
export async function action({ request, context }) {
    const { csrfToken } = context;
    const cookies = request.headers.get( "cookie" );
    const accessToken = getCookieValue( cookies, "accessToken" ) || "";
    console.log("logoutaction");
    
    try {
        const apiUrl = process.env.VITE_API_URL || 'http://localhost:3333';
        const response = await fetch(`${apiUrl}/api/auth/logout`, {
            method: 'DELETE',
            signal: request.signal,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
                'X-CSRF-Token': csrfToken, // Include the CSRF token in the headers
                cookie: request.headers.get( 'cookie' ),
            },
            credentials: 'include',
        });
        
        const result = await response.json();
        console.log("logout paco",response.ok);
        
        if (!response.ok) {
            return { error: true, message: result || 'Logout failed' };
        }

        // Return success data with cleared cookies
        return data({ success: true,result }, {
            headers: {
              "set-cookie": response.headers.get("Set-Cookie"),
            },
          });
    } catch (error) {
        return { error: true, message: 'Network error. Please try again.' };
    }
}

// 🛠 Error Boundary (Handles logout errors)
export function ErrorBoundary() {
    const error = useRouteError();
    console.log("🚀 ~ file: logout.jsx ~ ErrorBoundary ~ error:", error);

    if (isRouteErrorResponse(error)) {
        return (
            <div className="p-4 text-center">
                <h1 className="text-xl font-semibold text-red-600">Error {error.status}: {error.statusText}</h1>
                <p className="text-sm text-gray-600 mt-2">{error.data}</p>
            </div>
        );
    } else {
        return (
            <div className="p-4 text-center">
                <h1 className="text-xl font-semibold text-red-600">Logout Error</h1>
                <p className="text-sm text-gray-600 mt-2">An unexpected error occurred during logout.</p>
            </div>
        );
    }
}

export function headers({ actionHeaders, loaderHeaders }) {
    return actionHeaders ? actionHeaders : loaderHeaders;
}

export default function LogoutPage({ actionData }) {
    const navigate = useNavigate();
    const success = actionData?.success === true;
    const errorMessage = actionData?.error === true ? actionData.message : "";
    const result=actionData?.result;
    console.log("result from logout ",result,errorMessage);
    
    useEffect(() => {
        if (success) {
            // Auto-redirect to home after successful logout
            const timer = setTimeout(() => {
                navigate('/?logout-success=true');
            }, 300000); // 3 seconds delay to show success message

            return () => clearTimeout(timer);
        }
    }, [success, navigate]);

    return (
        <div className="py-8  flex justify-center items-center">
            <Logout 
                success={success} 
                isLoggingOut={!success && !errorMessage}
                error={errorMessage}
                result={result}
            />
        </div>
    );
}