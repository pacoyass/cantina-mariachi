import React from 'react'
import { Form, Link, useNavigation, redirect, useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Separator } from "../components/ui/separator";
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from "../lib/lucide-shim.js";
import { useTranslation } from "react-i18next";
import { useState } from "react";


export default function Login( { error } )
{
    const { t } = useTranslation(['auth', 'common']);
    const navigation = useNavigation();
    const pending = navigation.state === "submitting";
    const isNavigating = Boolean( navigation.location );
const [showPassword, setShowPassword] = useState(false)
  
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
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {typeof error === 'object' 
                            ? JSON.stringify(error)
                            : String(error)
                          }
                        </AlertDescription>
                      </Alert>
                    )}
    
                    {/* Login Form */}
                    <Form method="post" className="space-y-4">
                      {/* Email Field */}
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                          {getText('auth:fields.email', 'Email')}
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                             type="email"
                            name="email"
                            placeholder={getText('auth:placeholders.email', 'Enter your email')}
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
                          {getText('auth:fields.password', 'Password')}
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder={String(getText('auth:placeholders.password', 'Enter your password') || 'Enter your password')}
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
                        aria-disabled={pending}
                      >
                        {pending ? (
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
                    </Form>
    
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