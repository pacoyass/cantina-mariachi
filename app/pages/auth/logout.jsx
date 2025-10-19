import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Form, Link, useSubmit } from "react-router";
import { LogOut, Home, ShoppingBag } from "../../lib/lucide-shim.js";

export default function Logout({ isLoggingOut = false, success = false }) {
  const { t } = useTranslation(['auth', 'common']);
  const submit = useSubmit();

  // Helper function to safely get translations as strings
  const getText = (key, fallback = '') => {
    try {
      const result = t(key);
      return typeof result === 'string' ? result : fallback;
    } catch {
      return fallback;
    }
  };

  if (success) {
    return (
      <main className="rounded-4xl border-4 bg-gray-100 backdrop-blur-sm dark:supports-[backdrop-filter]:bg-background/70 ">
          <div className="container mx-auto px-4 py-8">
          <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">

            <div className="w-full max-w-md space-y-6">
              {/* Header */}
              <div className="text-center">
                <Link to="/" className="inline-block">
                  <h1 className="text-3xl font-bold text-primary">Cantina Mariachi</h1>
                </Link>
                <p className="mt-2 text-sm text-muted-foreground">
                  {getText('auth:logout.goodbye', 'Thanks for visiting!')}
                </p>
              </div>

              {/* Logout Success Card */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="space-y-1 pb-4 text-center">
                  <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                    <LogOut className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-2xl font-semibold text-center">
                    {getText('auth:logout.success', 'Successfully Logged Out')}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground text-center">
                    {getText('auth:logout.successMessage', 'You have been safely logged out of your account')}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button asChild className="w-full">
                      <Link to="/login">
                        <LogOut className="h-4 w-4 mr-2" />
                        {getText('auth:logout.signInAgain', 'Sign In Again')}
                      </Link>
                    </Button>
                    
                    <Button variant="outline" asChild className="w-full">
                      <Link to="/">
                        <Home className="h-4 w-4 mr-2" />
                        {getText('auth:logout.backHome', 'Back to Home')}
                      </Link>
                    </Button>
                    
                    <Button variant="outline" asChild className="w-full">
                      <Link to="/menu">
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        {getText('auth:logout.browseMenu', 'Browse Menu')}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Footer Message */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {getText('auth:logout.footer', 'Come back soon for more delicious food!')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Loading state
  return (
    <main className="rounded-4xl border-4  bg-gray-100 backdrop-blur-sm dark:supports-[backdrop-filter]:bg-background/70 ">
          <div className="container mx-auto px-8 py-8">
        <div className="flex min-w-md min-h-[calc(60vh-3rem)] items-center justify-center">
          <div className="w-full max-w-md space-y-6">
            {/* Header */}
            <div className="text-center">
              <Link to="/" className="inline-block">
                <h1 className="text-3xl font-bold text-primary">Cantina Mariachi</h1>
              </Link>
            </div>
<Form method="post">
      {/* Logout Loading Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="space-y-1 pb-4 text-center">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
                <CardTitle className="text-2xl font-semibold text-center">
                  {/* {getText('auth:logout.loggingOut', 'Logging Out...')} */}
                  <Button  type='submit'>
                  {getText('auth:logout.loggingOut', 'Logging Out...')}
                  </Button>
                </CardTitle>
                <p className="text-sm text-muted-foreground text-center">
                  {getText('auth:logout.pleaseWait', 'Please wait while we log you out safely')}
                </p>
              </CardHeader>
            </Card>
</Form>
        
          </div>
        </div>
      </div>
    </main>
  );
}