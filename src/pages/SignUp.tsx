import { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import Header from "@/components/Header";
import { HeaderNew } from "@/components/layout/HeaderNew";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SignupForm from "@/components/auth/SignupForm";
import { useAuth } from "@/hooks/useAuth";
import { flags } from "@/config/flags";

const SignUp = () => {
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
              <SignupForm 
                onSuccess={() => {}} 
                onSwitchToLogin={() => window.location.href = '/signin'} 
              />
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignUp;