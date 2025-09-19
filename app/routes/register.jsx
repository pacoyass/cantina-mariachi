import { useState } from "react";
import { Form, Link, useActionData, useNavigation, redirect } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, AlertCircle, Check } from "lucide-react";
import { useTranslation } from 'react-i18next';

export const meta = () => [
  { title: "Create Account - Cantina Mariachi" },
  { name: "description", content: "Join Cantina Mariachi for faster ordering and exclusive rewards." },
];

export async function action({ request }) {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const phone = formData.get("phone");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  const terms = formData.get("terms");
  const marketing = formData.get("marketing");

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
    const response = await fetch(`${new URL(request.url).origin}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        name: name.trim(), 
        email: email.toLowerCase().trim(), 
        phone: phone.trim(),
        password,
        marketing: !!marketing
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.error?.message || "Registration failed",
        fields: { name, email, phone, password, confirmPassword, terms, marketing }
      };
    }

    return redirect("/account?welcome=true");
  } catch (error) {
    return {
      error: "Network error. Please try again.",
      fields: { name, email, phone, password, confirmPassword, terms, marketing }
    };
  }
}

export default function RegisterPage() {
  const { t } = useTranslation(['auth', 'common']);
  const actionData = useActionData();
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isSubmitting = navigation.state === "submitting";

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <div className="w-full max-w-lg space-y-6">
            {/* Header */}
            <div className="text-center">
              <Link to="/" className="inline-block">
                <h1 className="text-3xl font-bold text-primary">Cantina Mariachi</h1>
              </Link>
              <p className="mt-2 text-sm text-muted-foreground">
                Join thousands of satisfied customers
              </p>
            </div>

            {/* Register Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-2xl font-semibold text-center">
                  Create Your Account
                </CardTitle>
                <p className="text-sm text-muted-foreground text-center">
                  Get started with faster ordering and exclusive rewards
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Error Alert */}
                {actionData?.error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{actionData.error}</AlertDescription>
                  </Alert>
                )}

                {/* Register Form */}
                <Form method="post" className="space-y-4">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Full Name *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        defaultValue={actionData?.fields?.name || ""}
                        className="pl-10"
                        required
                        autoComplete="given-name"
                        autoFocus
                      />
                    </div>
                    {actionData?.errors?.name && (
                      <p className="text-sm text-destructive">{actionData.errors.name}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        defaultValue={actionData?.fields?.email || ""}
                        className="pl-10"
                        required
                        autoComplete="email"
                      />
                    </div>
                    {actionData?.errors?.email && (
                      <p className="text-sm text-destructive">{actionData.errors.email}</p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Phone Number *
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        defaultValue={actionData?.fields?.phone || ""}
                        className="pl-10"
                        required
                        autoComplete="tel"
                      />
                    </div>
                    {actionData?.errors?.phone && (
                      <p className="text-sm text-destructive">{actionData.errors.phone}</p>
                    )}
                  </div>

                  {/* Password Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Password Field */}
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Password *
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create password"
                          defaultValue={actionData?.fields?.password || ""}
                          className="pl-10 pr-10"
                          required
                          autoComplete="new-password"
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
                      {actionData?.errors?.password && (
                        <p className="text-sm text-destructive">{actionData.errors.password}</p>
                      )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium">
                        Confirm Password *
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm password"
                          defaultValue={actionData?.fields?.confirmPassword || ""}
                          className="pl-10 pr-10"
                          required
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {actionData?.errors?.confirmPassword && (
                        <p className="text-sm text-destructive">{actionData.errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>

                  {/* Terms and Marketing */}
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        defaultChecked={actionData?.fields?.terms}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mt-0.5"
                        required
                      />
                      <Label htmlFor="terms" className="text-sm leading-5">
                        I accept the{" "}
                        <Link to="/terms" className="text-primary hover:underline">
                          Terms & Conditions
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" className="text-primary hover:underline">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>
                    {actionData?.errors?.terms && (
                      <p className="text-sm text-destructive ml-7">{actionData.errors.terms}</p>
                    )}

                    <div className="flex items-start space-x-3">
                      <input
                        id="marketing"
                        name="marketing"
                        type="checkbox"
                        defaultChecked={actionData?.fields?.marketing}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mt-0.5"
                      />
                      <Label htmlFor="marketing" className="text-sm leading-5">
                        Send me exclusive offers and updates
                      </Label>
                    </div>
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
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>Create Account</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </Form>

                {/* Sign In Link */}
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="font-medium text-primary hover:underline"
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <div className="text-center space-y-4">
              <h3 className="text-sm font-medium">Join thousands of satisfied customers</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="space-y-2">
                  <div className="w-10 h-10 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium">Faster Ordering</p>
                    <p className="text-muted-foreground">Save favorites & payment info</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="w-10 h-10 mx-auto bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                    🏆
                  </div>
                  <div>
                    <p className="font-medium">Exclusive Rewards</p>
                    <p className="text-muted-foreground">Earn points on every order</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="w-10 h-10 mx-auto bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    📱
                  </div>
                  <div>
                    <p className="font-medium">Order Tracking</p>
                    <p className="text-muted-foreground">Real-time delivery updates</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}