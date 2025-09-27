import { useState } from "react";
import { Form, Link, useActionData, useNavigation, redirect, useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Separator } from "../components/ui/separator";
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from "../lib/lucide-shim.js";
import { useTranslation } from 'react-i18next';

export const meta = () => [
  { title: "Sign In - Cantina Mariachi" },
  { name: "description", content: "Sign in to your Cantina Mariachi account to access your orders, reservations, and rewards." },
];

export async function action({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const remember = formData.get("remember");

  // Basic validation
  if (!email || !password) {
    return Response.json({
      error: "Please fill in all fields",
      fields: { email, password, remember }
    }, { status: 400 });
  }

  if (!email.includes("@")) {
    return Response.json({
      error: "Please enter a valid email address",
      fields: { email, password, remember }
    }, { status: 400 });
  }

  try {
    const response = await fetch(`${new URL(request.url).origin}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        // Pass along original request headers for authentication
        "Cookie": request.headers.get("Cookie") || "",
      },
      body: JSON.stringify({ email, password, remember: !!remember }),
    });

    if (!response.ok) {
      // Try to parse JSON, fallback to text if it fails
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { error: { message: "Network error occurred" } };
      }
      
      return Response.json({
        error: errorData.error?.message || "Invalid credentials",
        fields: { email, password, remember }
      }, { status: response.status });
    }

    const data = await response.json();

    // Set cookies if they were returned
    const headers = new Headers();
    const setCookieHeader = response.headers.get("Set-Cookie");
    if (setCookieHeader) {
      headers.set("Set-Cookie", setCookieHeader);
    }

    // Redirect to account page or intended destination
    return redirect("/account", { headers });
  } catch (error) {
    return Response.json({
      error: "Network error. Please try again.",
      fields: { email, password, remember }
    }, { status: 500 });
  }
}

export default function LoginPage() {
  const { t } = useTranslation(['auth', 'common']);
  const actionData = useActionData();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Helper function to safely get translations as strings
  const getText = (key, fallback = '') => {
    try {
      const result = t(key);
      return typeof result === 'string' ? result : fallback;
    } catch {
      return fallback;
    }
  };

  // Client-side form submission to bypass Single Fetch issues
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");
    const remember = formData.get("remember");

    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields");
      setIsSubmitting(false);
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password, remember: !!remember }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.error?.message || "Invalid credentials");
        setIsSubmitting(false);
        return;
      }

      const data = await response.json();
      // Navigate to account page on success
      navigate("/account");
    } catch (error) {
      setError("Network error. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <div className="w-full max-w-md space-y-6">
            {/* Header */}
            <div className="text-center">
              <Link to="/" className="inline-block">
                <h1 className="text-3xl font-bold text-primary">Cantina Mariachi</h1>
              </Link>
              <p className="mt-2 text-sm text-muted-foreground">
                {getText('auth:login.welcome', 'Welcome back to Cantina Mariachi')}
              </p>
            </div>

            {/* Login Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-2xl font-semibold text-center">
                  {getText('auth:login.title', 'Sign In')}
                </CardTitle>
                <p className="text-sm text-muted-foreground text-center">
                  {getText('auth:login.subtitle', 'Sign in to your account')}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Error Alert */}
                {(actionData?.error || error) && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{actionData?.error || error}</AlertDescription>
                  </Alert>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      {getTexgetText('auth:fields.email', 'Email')}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder={getTexgetText('auth:placeholders.email', 'Enter your email')}
                        defaultValue={actionData?.fields?.email || ""}
                        className="pl-10"
                        required
                        autoComplete="email"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      {getTexgetText('auth:fields.password', 'Password')}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={String(getText('auth:placeholders.password', 'Enter your password') || 'Enter your password')}
                        defaultValue={actionData?.fields?.password || ""}
                        className="pl-10 pr-10"
                        required
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        id="remember"
                        name="remember"
                        type="checkbox"
                        defaultChecked={actionData?.fields?.remember}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <Label htmlFor="remember" className="text-sm">
                        {String(getText('auth:login.rememberMe', 'Remember me') || 'Remember me')}
                      </Label>
                    </div>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-primary hover:underline"
                    >
                      {getText('auth:login.forgotPassword', 'Forgot password?')}
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>{getText('auth:login.signingIn', 'Signing in...')}</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>{getText('auth:login.signIn', 'Sign In')}</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      {getText('auth:login.or', 'or')}
                    </span>
                  </div>
                </div>

                {/* Guest Order Lookup */}
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/orders/track">
                    {getText('auth:login.guestOrder', 'Track Guest Order')}
                  </Link>
                </Button>

                {/* Sign Up Link */}
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {getText('auth:login.noAccount', "Don't have an account?")}{" "}
                    <Link
                      to="/register"
                      className="font-medium text-primary hover:underline"
                    >
                      {getText('auth:login.signUp', 'Sign up')}
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                {getText('auth:login.benefits', 'Sign in to enjoy these benefits')}
              </p>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <div className="w-8 h-8 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    🎯
                  </div>
                  <p className="text-muted-foreground">{getText('auth:benefits.fastOrder', 'Fast Order')}</p>
                </div>
                <div className="space-y-1">
                  <div className="w-8 h-8 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    🏆
                  </div>
                  <p className="text-muted-foreground">{getText('auth:benefits.rewards', 'Rewards')}</p>
                </div>
                <div className="space-y-1">
                  <div className="w-8 h-8 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    📱
                  </div>
                  <p className="text-muted-foreground">{getText('auth:benefits.tracking', 'Order Tracking')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}