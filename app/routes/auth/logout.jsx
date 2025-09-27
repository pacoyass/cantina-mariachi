import Logout from "../../pages/logout";
import { useEffect } from "react";
import { useRouteError, isRouteErrorResponse, data, useNavigate } from "react-router";

export const meta = () => [
  { title: "Logout - Cantina Mariachi" },
  { name: "description", content: "Logout from your Cantina Mariachi account safely." },
];

// Server Action - runs on the server and is removed from client bundles
export async function action({ request, context }) {
    const { csrfToken } = context;
    
    try {
        const apiUrl = process.env.VITE_API_URL || 'http://localhost:3334';
        const response = await fetch(`${apiUrl}/api/auth/logout`, {
            method: 'POST',
            signal: request.signal,
            headers: {
                'Content-Type': 'application/json',
                'x-csrf-token': csrfToken,
                'cookie': request.headers.get('cookie') || '',
            },
            credentials: 'include',
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            return { error: true, message: result.message || 'Logout failed' };
        }

        // Return success data with cleared cookies
        return data({ success: true, ...result }, {
            headers: {
                'Set-Cookie': [
                    'accessToken=; Path=/; HttpOnly; Max-Age=0',
                    'refreshToken=; Path=/; HttpOnly; Max-Age=0'
                ].join(', '),
            }
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

    useEffect(() => {
        if (success) {
            // Auto-redirect to home after successful logout
            const timer = setTimeout(() => {
                navigate('/?logout-success=true');
            }, 3000); // 3 seconds delay to show success message

            return () => clearTimeout(timer);
        }
    }, [success, navigate]);

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md bg-opacity-50 flex justify-center items-center">
            <Logout 
                success={success} 
                isLoggingOut={!success && !errorMessage}
                error={errorMessage}
            />
        </div>
    );
}