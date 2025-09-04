import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Profile from '@/components/Profile';

const ProfilePage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <Profile />
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;