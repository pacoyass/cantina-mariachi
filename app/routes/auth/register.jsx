import Register from "../../pages/register";
import { useEffect } from "react";
import { useRouteError, isRouteErrorResponse, data, useNavigate, useNavigation, redirect } from "react-router";

export const meta = () => [
  { title: "Create Account - Cantina Mariachi" },
  { name: "description", content: "Join Cantina Mariachi for faster ordering and exclusive rewards." },
];

// Server Action - runs on the server and is removed from client bundles
export async function action({ request, context }) {
    const formData = await request.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    const terms = formData.get("terms");
    const marketing = formData.get("marketing");
    const { csrfToken } = context;

    // Validation
    const errors = {};
    
    if (!name || name.trim().length < 2) {
        errors.name = "Name must be at least 2 characters";
    }

    if (!email || !email.includes("@")) {
        errors.email = "Please enter a valid email address";
    }

    if (!phone || phone.length < 10) {
        errors.phone = "Please enter a valid phone number";
    }

    if (!password || password.length < 8) {
        errors.password = "Password must be at least 8 characters";
    }

    if (password !== confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
    }

    if (!terms) {
        errors.terms = "Please accept the terms and conditions";
    }

    if (Object.keys(errors).length > 0) {
        return {
            errors,
            fields: { name, email, phone, password, confirmPassword, terms, marketing }
        };
    }

    try {
        const apiUrl = process.env.VITE_API_URL || 'http://localhost:3334';
        const response = await fetch(`${apiUrl}/api/auth/register`, {
            method: 'POST',
            signal: request.signal,
            headers: {
                'Content-Type': 'application/json',
                'x-csrf-token': csrfToken,
                'cookie': request.headers.get('cookie') || '',
            },
            credentials: 'include',
            body: JSON.stringify({ 
                name: name.trim(), 
                email: email.toLowerCase().trim(), 
                phone: phone.trim(),
                password,
                marketing: !!marketing
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                error: result.error?.message || "Registration failed",
                fields: { name, email, phone, password, confirmPassword, terms, marketing }
            };
        }

        // Set cookies if they were returned and redirect
        const headers = new Headers();
        const setCookieHeader = response.headers.get("Set-Cookie");
        if (setCookieHeader) {
            headers.set("Set-Cookie", setCookieHeader);
        }

        return redirect("/account?welcome=true", { headers });
    } catch (error) {
        return {
            error: "Network error. Please try again.",
            fields: { name, email, phone, password, confirmPassword, terms, marketing }
        };
    }
}

// 🛠 Error Boundary (Handles registration errors)
export function ErrorBoundary() {
    const error = useRouteError();
    console.log("🚀 ~ file: register.jsx ~ ErrorBoundary ~ error:", error);

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
                <h1 className="text-xl font-semibold text-red-600">Registration Error</h1>
                <p className="text-sm text-gray-600 mt-2">An unexpected error occurred during registration.</p>
            </div>
        );
    }
}

export function headers({ actionHeaders, loaderHeaders }) {
    return actionHeaders ? actionHeaders : loaderHeaders;
}

export default function RegisterPage({ actionData }) {
    const navigate = useNavigate();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    const errorMessage = actionData?.error;
    const errors = actionData?.errors;
    const fields = actionData?.fields;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md bg-opacity-50 flex justify-center items-center">
            <Register 
                error={errorMessage}
                errors={errors}
                fields={fields}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}