import { useOrganizations } from '@/hooks/useOrganizations';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Users, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OrganizationsPage = () => {
  const { user } = useAuth();
  const { organizations, loading } = useOrganizations();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Organizations</h1>
          <p className="text-muted-foreground mt-2">
            Join or manage organizations to connect with your community
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => navigate('/organizations/new')} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Organization
          </Button>
        )}
      </div>

      {organizations.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Organizations Found</h3>
            <p className="text-muted-foreground mb-4">
              {user 
                ? "You're not a member of any organizations yet."
                : "Sign in to view and join organizations in your community."
              }
            </p>
            {!user && (
              <Button onClick={() => navigate('/auth')}>
                Sign In to Join Organizations
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {organizations.map((org) => (
            <Card key={org.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{org.name}</CardTitle>
                  <Badge variant="secondary">
                    <Users className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
                <CardDescription>{org.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Slug: {org.slug}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/organizations/${org.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizationsPage;