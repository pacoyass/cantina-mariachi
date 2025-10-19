import React from 'react';
import { useState } from "react";
import { Form, Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, AlertCircle, Check } from "../../lib/lucide-shim.js";
import { useTranslation } from 'react-i18next';

export default function Register({ error, errors, fields, isSubmitting = false }) {
  const { t } = useTranslation(['auth', 'common']);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Helper function to safely get translations as strings
  const getText = (key, fallback = '') => {
    try {
      const result = t(key);
      return typeof result === 'string' ? result : fallback;
    } catch {
      return fallback;
    }
  };

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
                {getText('auth:register.tagline', 'Join us for exclusive rewards and faster ordering')}
              </p>
            </div>

            {/* Register Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-2xl font-semibold text-center">
                  {getText('auth:register.title', 'Create Account')}
                </CardTitle>
                <p className="text-sm text-muted-foreground text-center">
                  {getText('auth:register.subtitle', 'Join Cantina Mariachi today')}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Error Alert */}
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Register Form */}
                <Form method="post" className="space-y-4">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      {getText('auth:fields.name', 'Full Name')} *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder={getText('auth:placeholders.fullName', 'Enter your full name')}
                        defaultValue={fields?.name || ""}
                        className="pl-10"
                        required
                        autoComplete="given-name"
                        autoFocus
                      />
                    </div>
                    {errors?.name && (
                      <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      {getText('auth:fields.email', 'Email')} *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder={getText('auth:placeholders.email', 'Enter your email')}
                        defaultValue={fields?.email || ""}
                        className="pl-10"
                        required
                        autoComplete="email"
                      />
                    </div>
                    {errors?.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      {getText('auth:fields.phone', 'Phone Number')} *
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder={getText('auth:placeholders.phone', 'Enter your phone number')}
                        defaultValue={fields?.phone || ""}
                        className="pl-10"
                        required
                        autoComplete="tel"
                      />
                    </div>
                    {errors?.phone && (
                      <p className="text-sm text-destructive">{errors.phone}</p>
                    )}
                  </div>

                  {/* Password Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Password Field */}
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">
                        {getText('auth:fields.password', 'Password')} *
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder={getText('auth:placeholders.createPassword', 'Create password')}
                          defaultValue={fields?.password || ""}
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
                      {errors?.password && (
                        <p className="text-sm text-destructive">{errors.password}</p>
                      )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium">
                        {getText('auth:fields.confirmPassword', 'Confirm Password')} *
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder={getText('auth:placeholders.confirmPassword', 'Confirm password')}
                          defaultValue={fields?.confirmPassword || ""}
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
                      {errors?.confirmPassword && (
                        <p className="text-sm text-destructive">{errors.confirmPassword}</p>
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
                        defaultChecked={fields?.terms}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mt-0.5"
                        required
                      />
                      <Label htmlFor="terms" className="text-sm leading-5">
                        {getText('auth:register.accept', 'I accept the')}{" "}
                        <Link to="/terms" className="text-primary hover:underline">
                          {getText('auth:register.terms', 'Terms & Conditions')}
                        </Link>{" "}
                        {getText('auth:register.and', 'and')}{" "}
                        <Link to="/privacy" className="text-primary hover:underline">
                          {getText('auth:register.privacy', 'Privacy Policy')}
                        </Link>
                      </Label>
                    </div>
                    {errors?.terms && (
                      <p className="text-sm text-destructive ml-7">{errors.terms}</p>
                    )}

                    <div className="flex items-start space-x-3">
                      <input
                        id="marketing"
                        name="marketing"
                        type="checkbox"
                        defaultChecked={fields?.marketing}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mt-0.5"
                      />
                      <Label htmlFor="marketing" className="text-sm leading-5">
                        {getText('auth:register.marketingOptIn', 'Send me special offers and promotions')}
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
                        <span>{getText('auth:register.creatingAccount', 'Creating Account...')}</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>{getText('auth:register.createAccount', 'Create Account')}</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </Form>

                {/* Sign In Link */}
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {getText('auth:register.haveAccount', 'Already have an account?')}{" "}
                    <Link
                      to="/login"
                      className="font-medium text-primary hover:underline"
                    >
                      {getText('auth:login.signIn', 'Sign In')}
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <div className="text-center space-y-4">
              <h3 className="text-sm font-medium">{getText('auth:register.benefitsHeading', 'Member Benefits')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="space-y-2">
                  <div className="w-10 h-10 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium">{getText('auth:register.benefits.fastOrder.title', 'Fast Ordering')}</p>
                    <p className="text-muted-foreground">{getText('auth:register.benefits.fastOrder.desc', 'Save your preferences')}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="w-10 h-10 mx-auto bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                    🏆
                  </div>
                  <div>
                    <p className="font-medium">{getText('auth:register.benefits.rewards.title', 'Rewards')}</p>
                    <p className="text-muted-foreground">{getText('auth:register.benefits.rewards.desc', 'Earn points on orders')}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="w-10 h-10 mx-auto bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    📱
                  </div>
                  <div>
                    <p className="font-medium">{getText('auth:register.benefits.tracking.title', 'Order Tracking')}</p>
                    <p className="text-muted-foreground">{getText('auth:register.benefits.tracking.desc', 'Real-time updates')}</p>
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