import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ActivityGroupForm } from "@/components/admin/ActivityGroupForm";
import { useActivityGroups } from "@/hooks/useActivityGroups";
import { useToast } from "@/hooks/use-toast";

export default function AdminGroupForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const { toast } = useToast();
  
  const { 
    getActivityGroup, 
    createActivityGroup, 
    updateActivityGroup 
  } = useActivityGroups();
  
  const { data: existingGroup, isLoading } = isEditing 
    ? getActivityGroup(id!)
    : { data: null, isLoading: false };

  // Handle form submission
  const handleSubmit = async (data: any) => {
    try {
      if (isEditing) {
        await updateActivityGroup.mutateAsync({
          id: id!,
          input: data,
        });
        toast({
          title: "Group updated",
          description: "The group has been successfully updated.",
        });
      } else {
        await createActivityGroup.mutateAsync(data);
        toast({
          title: "Group created",
          description: "The new group has been successfully created.",
        });
      }
      navigate("/admin2/groups");
    } catch (error) {
      toast({
        title: "Error",
        description: isEditing 
          ? "Failed to update the group. Please try again."
          : "Failed to create the group. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle back navigation
  const handleBack = () => {
    navigate("/admin2/groups");
  };

  if (isEditing && isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Groups
          </Button>
        </div>
        <div className="text-center py-8">Loading group...</div>
      </div>
    );
  }

  if (isEditing && !existingGroup) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Groups
          </Button>
        </div>
        <div className="text-center py-8 text-destructive">
          Group not found
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Groups
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEditing ? "Edit Group" : "Create New Group"}
          </h1>
          <p className="text-muted-foreground">
            {isEditing 
              ? "Update group details and settings"
              : "Set up a new activity group for your community"
            }
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <ActivityGroupForm
          onSubmit={handleSubmit}
          initialData={existingGroup ? {
            name: existingGroup.name || "",
            activity_type: existingGroup.activity_type || "dinner",
            description: existingGroup.description || "",
            five_c_focus: existingGroup.five_c_focus || "balance",
            max_members: existingGroup.max_members || 8,
            location_type: existingGroup.location_type || "",
          } : undefined}
          isEditing={isEditing}
        />
      </div>
    </div>
  );
}