import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Camera, Save, User, MapPin, Heart, Home } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const ProfileForm = () => {
  const { user } = useAuth();
  const { profile, loading, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    avatar_url: '',
    bio: '',
    phone_number: '',
    date_of_birth: '',
    family_profile: '',
    age_group: '',
    city: '',
    state_region: '',
    country: '',
    neighborhood_name: '',
    development_subdivision: '',
    closest_fd_city: '',
    new_to_city: '',
    spouse_first_name: '',
    spouse_last_name: '',
    spouse_email: '',
    spouse_phone: '',
    children_ages: '',
    season_interest: '',
    group_interest: '',
    favorite_dinner_meal: '',
    favorite_dessert: '',
    activities: [] as string[],
    work_from_home: '',
    hometown: '',
    ways_to_serve: [] as string[],
    willing_to_welcome: false,
    instagram_handle: '',
  });

  const familyProfileOptions = [
    { value: 'married_no_children', label: 'Married (No Children)' },
    { value: 'single_no_children', label: 'Single (No Children)' },
    { value: 'married_with_children', label: 'Married (with Children)' },
    { value: 'single_with_children', label: 'Single (with Children)' },
  ];

  const ageGroupOptions = [
    { value: '22-24', label: '22-24' },
    { value: '25-34', label: '25-34' },
    { value: '35-44', label: '35-44' },
    { value: '45-54', label: '45-54' },
    { value: '55+', label: '55+' },
  ];

  const workFromHomeOptions = [
    { value: 'yes_100_percent', label: 'Yes - 100%' },
    { value: 'yes_3_days', label: 'Yes - 3 Days' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'no', label: 'No' },
  ];

  const newToCityOptions = [
    { value: 'yes_less_3_months', label: 'Yes - Less than 3 Months' },
    { value: 'yes_less_year', label: 'Yes - Less than a Year' },
    { value: 'no', label: 'No' },
  ];

  const activitiesOptions = [
    'Lifting', 'Running', 'Walking', 'Watching Live Sporting Events',
    'Attending Live Sporting Events', 'Going to the Movie Theater',
    'Attending Live Concerts', 'Cigar Bar', 'Cooking', 'Going Out to Eat (Foodie)'
  ];

  const waysToServeOptions = [
    'Willing to Lead My Family (5C) Group',
    'Willing to Host a Dinner or Game Night at My Home/Community Center',
    'Willing to Host a Movie Night Out at a Local Theater',
    'Willing to Pick-Up or Drop-Off from/to Airport',
    'Willing to Organize A Gathering/Social Event for Kids',
    'Willing to Host a Family Member for the Holidays',
    'Willing to Host Family Members to Watch a Sporting Event (NBA, NFL, College etc)',
    'Willing to Make/Exchange Home-Cooked Meals for Family'
  ];

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        avatar_url: profile.avatar_url || '',
        bio: profile.bio || '',
        phone_number: profile.phone_number || '',
        date_of_birth: profile.date_of_birth || '',
        family_profile: profile.family_profile || '',
        age_group: profile.age_group || '',
        city: profile.city || '',
        state_region: profile.state_region || '',
        country: profile.country || '',
        neighborhood_name: profile.neighborhood_name || '',
        development_subdivision: profile.development_subdivision || '',
        closest_fd_city: profile.closest_fd_city || '',
        new_to_city: profile.new_to_city || '',
        spouse_first_name: profile.spouse_first_name || '',
        spouse_last_name: profile.spouse_last_name || '',
        spouse_email: profile.spouse_email || '',
        spouse_phone: profile.spouse_phone || '',
        children_ages: profile.children_ages || '',
        season_interest: profile.season_interest || '',
        group_interest: profile.group_interest || '',
        favorite_dinner_meal: profile.favorite_dinner_meal || '',
        favorite_dessert: profile.favorite_dessert || '',
        activities: profile.activities || [],
        work_from_home: profile.work_from_home || '',
        hometown: profile.hometown || '',
        ways_to_serve: profile.ways_to_serve || [],
        willing_to_welcome: profile.willing_to_welcome || false,
        instagram_handle: profile.instagram_handle || '',
      });
    }
  }, [profile]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update full_name from first and last name
      const fullName = `${formData.first_name} ${formData.last_name}`.trim();
      await updateProfile({
        ...formData,
        full_name: fullName || null,
      });
      setIsEditing(false);
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        avatar_url: profile.avatar_url || '',
        bio: profile.bio || '',
        phone_number: profile.phone_number || '',
        date_of_birth: profile.date_of_birth || '',
        family_profile: profile.family_profile || '',
        age_group: profile.age_group || '',
        city: profile.city || '',
        state_region: profile.state_region || '',
        country: profile.country || '',
        neighborhood_name: profile.neighborhood_name || '',
        development_subdivision: profile.development_subdivision || '',
        closest_fd_city: profile.closest_fd_city || '',
        new_to_city: profile.new_to_city || '',
        spouse_first_name: profile.spouse_first_name || '',
        spouse_last_name: profile.spouse_last_name || '',
        spouse_email: profile.spouse_email || '',
        spouse_phone: profile.spouse_phone || '',
        children_ages: profile.children_ages || '',
        season_interest: profile.season_interest || '',
        group_interest: profile.group_interest || '',
        favorite_dinner_meal: profile.favorite_dinner_meal || '',
        favorite_dessert: profile.favorite_dessert || '',
        activities: profile.activities || [],
        work_from_home: profile.work_from_home || '',
        hometown: profile.hometown || '',
        ways_to_serve: profile.ways_to_serve || [],
        willing_to_welcome: profile.willing_to_welcome || false,
        instagram_handle: profile.instagram_handle || '',
      });
    }
  };

  const getUserInitials = (firstName: string | null, lastName: string | null) => {
    if (!firstName && !lastName) return 'U';
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const handleActivityChange = (activity: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        activities: [...prev.activities, activity]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        activities: prev.activities.filter(a => a !== activity)
      }));
    }
  };

  const handleWayToServeChange = (way: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        ways_to_serve: [...prev.ways_to_serve, way]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        ways_to_serve: prev.ways_to_serve.filter(w => w !== way)
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Basic Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={isEditing ? formData.avatar_url : profile?.avatar_url} />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {getUserInitials(
                  isEditing ? formData.first_name : profile?.first_name,
                  isEditing ? formData.last_name : profile?.last_name
                )}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <Button variant="outline" size="sm">
                <Camera className="w-4 h-4 mr-2" />
                Change Photo
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label htmlFor="phone_number">Phone Number</Label>
              {isEditing ? (
                <Input
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  placeholder="Enter your phone number"
                />
              ) : (
                <Input
                  value={profile?.phone_number || 'Not set'}
                  disabled
                  className="bg-muted"
                />
              )}
            </div>
            <div>
              <Label htmlFor="first_name">First Name</Label>
              {isEditing ? (
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  placeholder="Enter your first name"
                />
              ) : (
                <Input
                  value={profile?.first_name || 'Not set'}
                  disabled
                  className="bg-muted"
                />
              )}
            </div>
            <div>
              <Label htmlFor="last_name">Last Name</Label>
              {isEditing ? (
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  placeholder="Enter your last name"
                />
              ) : (
                <Input
                  value={profile?.last_name || 'Not set'}
                  disabled
                  className="bg-muted"
                />
              )}
            </div>
            <div>
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              {isEditing ? (
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                />
              ) : (
                <Input
                  value={profile?.date_of_birth || 'Not set'}
                  disabled
                  className="bg-muted"
                />
              )}
            </div>
            <div>
              <Label htmlFor="age_group">Age Group</Label>
              {isEditing ? (
                <Select value={formData.age_group} onValueChange={(value) => setFormData({ ...formData, age_group: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select age group" />
                  </SelectTrigger>
                  <SelectContent>
                    {ageGroupOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={ageGroupOptions.find(opt => opt.value === profile?.age_group)?.label || 'Not set'}
                  disabled
                  className="bg-muted"
                />
              )}
            </div>
          </div>

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
        </CardContent>
      </Card>

      {/* Location Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Location Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              {isEditing ? (
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Enter your city"
                />
              ) : (
                <Input
                  value={profile?.city || 'Not set'}
                  disabled
                  className="bg-muted"
                />
              )}
            </div>
            <div>
              <Label htmlFor="state_region">State/Region</Label>
              {isEditing ? (
                <Input
                  id="state_region"
                  value={formData.state_region}
                  onChange={(e) => setFormData({ ...formData, state_region: e.target.value })}
                  placeholder="Enter your state/region"
                />
              ) : (
                <Input
                  value={profile?.state_region || 'Not set'}
                  disabled
                  className="bg-muted"
                />
              )}
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              {isEditing ? (
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="Enter your country"
                />
              ) : (
                <Input
                  value={profile?.country || 'Not set'}
                  disabled
                  className="bg-muted"
                />
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="neighborhood_name">Neighborhood Name</Label>
              {isEditing ? (
                <Input
                  id="neighborhood_name"
                  value={formData.neighborhood_name}
                  onChange={(e) => setFormData({ ...formData, neighborhood_name: e.target.value })}
                  placeholder="Enter your neighborhood"
                />
              ) : (
                <Input
                  value={profile?.neighborhood_name || 'Not set'}
                  disabled
                  className="bg-muted"
                />
              )}
            </div>
            <div>
              <Label htmlFor="development_subdivision">Development/Subdivision</Label>
              {isEditing ? (
                <Input
                  id="development_subdivision"
                  value={formData.development_subdivision}
                  onChange={(e) => setFormData({ ...formData, development_subdivision: e.target.value })}
                  placeholder="Enter your development/subdivision"
                />
              ) : (
                <Input
                  value={profile?.development_subdivision || 'Not set'}
                  disabled
                  className="bg-muted"
                />
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hometown">Hometown</Label>
              {isEditing ? (
                <Input
                  id="hometown"
                  value={formData.hometown}
                  onChange={(e) => setFormData({ ...formData, hometown: e.target.value })}
                  placeholder="Enter your hometown"
                />
              ) : (
                <Input
                  value={profile?.hometown || 'Not set'}
                  disabled
                  className="bg-muted"
                />
              )}
            </div>
            <div>
              <Label htmlFor="new_to_city">New to City?</Label>
              {isEditing ? (
                <Select value={formData.new_to_city} onValueChange={(value) => setFormData({ ...formData, new_to_city: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    {newToCityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={newToCityOptions.find(opt => opt.value === profile?.new_to_city)?.label || 'Not set'}
                  disabled
                  className="bg-muted"
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Family Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Family Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="family_profile">Family Profile</Label>
              {isEditing ? (
                <Select value={formData.family_profile} onValueChange={(value) => setFormData({ ...formData, family_profile: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select family profile" />
                  </SelectTrigger>
                  <SelectContent>
                    {familyProfileOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={familyProfileOptions.find(opt => opt.value === profile?.family_profile)?.label || 'Not set'}
                  disabled
                  className="bg-muted"
                />
              )}
            </div>
            <div>
              <Label htmlFor="children_ages">Children Ages (comma separated)</Label>
              {isEditing ? (
                <Input
                  id="children_ages"
                  value={formData.children_ages}
                  onChange={(e) => setFormData({ ...formData, children_ages: e.target.value })}
                  placeholder="e.g., 5, 8, 12"
                />
              ) : (
                <Input
                  value={profile?.children_ages || 'Not set'}
                  disabled
                  className="bg-muted"
                />
              )}
            </div>
          </div>

          {/* Spouse Information */}
          {(formData.family_profile?.includes('married') || profile?.family_profile?.includes('married')) && (
            <>
              <Separator />
              <h4 className="font-medium">Spouse Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="spouse_first_name">Spouse First Name</Label>
                  {isEditing ? (
                    <Input
                      id="spouse_first_name"
                      value={formData.spouse_first_name}
                      onChange={(e) => setFormData({ ...formData, spouse_first_name: e.target.value })}
                      placeholder="Enter spouse's first name"
                    />
                  ) : (
                    <Input
                      value={profile?.spouse_first_name || 'Not set'}
                      disabled
                      className="bg-muted"
                    />
                  )}
                </div>
                <div>
                  <Label htmlFor="spouse_last_name">Spouse Last Name</Label>
                  {isEditing ? (
                    <Input
                      id="spouse_last_name"
                      value={formData.spouse_last_name}
                      onChange={(e) => setFormData({ ...formData, spouse_last_name: e.target.value })}
                      placeholder="Enter spouse's last name"
                    />
                  ) : (
                    <Input
                      value={profile?.spouse_last_name || 'Not set'}
                      disabled
                      className="bg-muted"
                    />
                  )}
                </div>
                <div>
                  <Label htmlFor="spouse_email">Spouse Email</Label>
                  {isEditing ? (
                    <Input
                      id="spouse_email"
                      type="email"
                      value={formData.spouse_email}
                      onChange={(e) => setFormData({ ...formData, spouse_email: e.target.value })}
                      placeholder="Enter spouse's email"
                    />
                  ) : (
                    <Input
                      value={profile?.spouse_email || 'Not set'}
                      disabled
                      className="bg-muted"
                    />
                  )}
                </div>
                <div>
                  <Label htmlFor="spouse_phone">Spouse Phone</Label>
                  {isEditing ? (
                    <Input
                      id="spouse_phone"
                      value={formData.spouse_phone}
                      onChange={(e) => setFormData({ ...formData, spouse_phone: e.target.value })}
                      placeholder="Enter spouse's phone"
                    />
                  ) : (
                    <Input
                      value={profile?.spouse_phone || 'Not set'}
                      disabled
                      className="bg-muted"
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            Personal Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="favorite_dinner_meal">Favorite Dinner Meal</Label>
              {isEditing ? (
                <Input
                  id="favorite_dinner_meal"
                  value={formData.favorite_dinner_meal}
                  onChange={(e) => setFormData({ ...formData, favorite_dinner_meal: e.target.value })}
                  placeholder="Enter your favorite dinner"
                />
              ) : (
                <Input
                  value={profile?.favorite_dinner_meal || 'Not set'}
                  disabled
                  className="bg-muted"
                />
              )}
            </div>
            <div>
              <Label htmlFor="favorite_dessert">Favorite Dessert</Label>
              {isEditing ? (
                <Input
                  id="favorite_dessert"
                  value={formData.favorite_dessert}
                  onChange={(e) => setFormData({ ...formData, favorite_dessert: e.target.value })}
                  placeholder="Enter your favorite dessert"
                />
              ) : (
                <Input
                  value={profile?.favorite_dessert || 'Not set'}
                  disabled
                  className="bg-muted"
                />
              )}
            </div>
            <div>
              <Label htmlFor="work_from_home">Work From Home?</Label>
              {isEditing ? (
                <Select value={formData.work_from_home} onValueChange={(value) => setFormData({ ...formData, work_from_home: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select work arrangement" />
                  </SelectTrigger>
                  <SelectContent>
                    {workFromHomeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={workFromHomeOptions.find(opt => opt.value === profile?.work_from_home)?.label || 'Not set'}
                  disabled
                  className="bg-muted"
                />
              )}
            </div>
            <div>
              <Label htmlFor="instagram_handle">Instagram Handle</Label>
              {isEditing ? (
                <Input
                  id="instagram_handle"
                  value={formData.instagram_handle}
                  onChange={(e) => setFormData({ ...formData, instagram_handle: e.target.value })}
                  placeholder="@username"
                />
              ) : (
                <Input
                  value={profile?.instagram_handle || 'Not set'}
                  disabled
                  className="bg-muted"
                />
              )}
            </div>
          </div>

          {/* Activities */}
          <div>
            <Label>Activities You'd Be Open To</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {activitiesOptions.map((activity) => (
                <div key={activity} className="flex items-center space-x-2">
                  <Checkbox
                    id={`activity-${activity}`}
                    checked={formData.activities.includes(activity)}
                    onCheckedChange={(checked) => handleActivityChange(activity, checked as boolean)}
                    disabled={!isEditing}
                  />
                  <Label htmlFor={`activity-${activity}`} className="text-sm">
                    {activity}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Ways to Serve */}
          <div>
            <Label>Ways You Can Serve Our Family</Label>
            <div className="grid grid-cols-1 gap-2 mt-2">
              {waysToServeOptions.map((way) => (
                <div key={way} className="flex items-center space-x-2">
                  <Checkbox
                    id={`serve-${way}`}
                    checked={formData.ways_to_serve.includes(way)}
                    onCheckedChange={(checked) => handleWayToServeChange(way, checked as boolean)}
                    disabled={!isEditing}
                  />
                  <Label htmlFor={`serve-${way}`} className="text-sm">
                    {way}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="willing_to_welcome"
              checked={formData.willing_to_welcome}
              onCheckedChange={(checked) => setFormData({ ...formData, willing_to_welcome: checked as boolean })}
              disabled={!isEditing}
            />
            <Label htmlFor="willing_to_welcome">
              Willing to Welcome New Family Members in the Area (with Call)
            </Label>
          </div>
        </CardContent>
      </Card>

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
    </div>
  );
};

export default ProfileForm;