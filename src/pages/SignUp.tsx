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
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Create your account</CardTitle>
              <CardDescription>
                Join our community and start building stronger connections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SignupForm 
                onSuccess={() => {}} 
                onSwitchToLogin={() => window.location.href = '/signin'} 
              />
              
              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link to="/signin" className="font-medium text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignUp;