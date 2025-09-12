import { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import Header from "@/components/Header";
import { HeaderNew } from "@/components/layout/HeaderNew";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/hooks/useAuth";
import { flags } from "@/config/flags";

const SignIn = () => {
  const { user, loading } = useAuth();

  // Redirect if already authenticated
  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {flags.enableNewMarketing ? <HeaderNew /> : <Header />}
      <main className="py-12">
        <div className="container mx-auto px-4 max-w-md">
          <Card>
            <CardContent className="pt-6">
              <LoginForm 
                onSuccess={() => {}} 
                onSwitchToSignup={() => window.location.href = '/signup'} 
              />
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignIn;