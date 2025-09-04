import { useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Camera, Save } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const { profile, loading, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    avatar_url: '',
    bio: '',
  });

  const handleEdit = () => {
    setFormData({
      full_name: profile?.full_name || '',
      avatar_url: profile?.avatar_url || '',
      bio: profile?.bio || '',
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      full_name: '',
      avatar_url: '',
      bio: '',
    });
  };

  const getUserInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar Section */}
        <div className="flex items-center space-x-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={isEditing ? formData.avatar_url : profile?.avatar_url} />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
              {getUserInitials(isEditing ? formData.full_name : profile?.full_name)}
            </AvatarFallback>
          </Avatar>
          {isEditing && (
            <Button variant="outline" size="sm">
              <Camera className="w-4 h-4 mr-2" />
              Change Photo
            </Button>
          )}
        </div>

        {/* Profile Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user?.email || ''}
                disabled
                className="bg-muted"
              />
            </div>
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              {isEditing ? (
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Enter your full name"
                />
              ) : (
                <Input
                  value={profile?.full_name || 'Not set'}
                  disabled
                  className="bg-muted"
                />
              )}
            </div>
          </div>

          {isEditing && (
            <div>
              <Label htmlFor="avatar_url">Avatar URL</Label>
              <Input
                id="avatar_url"
                value={formData.avatar_url}
                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          )}

          <div>
            <Label htmlFor="bio">Bio</Label>
            {isEditing ? (
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                rows={3}
              />
            ) : (
              <Textarea
                value={profile?.bio || 'No bio added yet'}
                disabled
                className="bg-muted"
                rows={3}
              />
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button onClick={handleEdit}>Edit Profile</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Profile;