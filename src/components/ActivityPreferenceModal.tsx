import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ActivityTypeSelector } from "@/components/ActivityTypeSelector";
import { ACTIVITY_TYPES, type ActivityType } from "@/lib/activityTypes";
import { useToast } from "@/hooks/use-toast";

const onboardingSchema = z.object({
  preferred_activity_type: z.enum(['dinner', 'prayer_study', 'workout', 'sports', 'flexible']),
});

type OnboardingData = z.infer<typeof onboardingSchema>;

interface ActivityPreferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: OnboardingData) => void;
  initialValue?: ActivityType;
}

export function ActivityPreferenceModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialValue = 'dinner' 
}: ActivityPreferenceModalProps) {
  const { toast } = useToast();
  
  const form = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      preferred_activity_type: initialValue,
    },
  });

  const handleSubmit = async (data: OnboardingData) => {
    try {
      await onSave(data);
      toast({
        title: "Preferences saved",
        description: "Your activity preference has been updated.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your preferences. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Activity Preference</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="preferred_activity_type"
              render={({ field }) => (
                <FormItem>
                  <ActivityTypeSelector
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex gap-3">
              <Button type="submit" className="flex-1">
                Save Preference
              </Button>
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Example usage component for onboarding
export function MemberOnboardingExample() {
  const [showPreferenceModal, setShowPreferenceModal] = useState(false);
  const [userPreference, setUserPreference] = useState<ActivityType>('dinner');

  const handleSavePreference = async (data: OnboardingData) => {
    // TODO: Save to profile via API
    console.log('Saving preference:', data);
    setUserPreference(data.preferred_activity_type);
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Your Activity Preference</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Current preference:</span>
          <Badge variant="secondary">
            {ACTIVITY_TYPES.find(a => a.key === userPreference)?.label}
          </Badge>
        </div>
        
        <Button 
          onClick={() => setShowPreferenceModal(true)}
          className="w-full"
        >
          Change Preference
        </Button>
        
        <ActivityPreferenceModal
          isOpen={showPreferenceModal}
          onClose={() => setShowPreferenceModal(false)}
          onSave={handleSavePreference}
          initialValue={userPreference}
        />
      </CardContent>
    </Card>
  );
}