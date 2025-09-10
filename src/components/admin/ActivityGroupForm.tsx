import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ACTIVITY_TYPES, type ActivityType } from "@/lib/activityTypes";

const activityGroupFormSchema = z.object({
  name: z.string().min(1, "Group name is required"),
  activity_type: z.enum(['dinner', 'prayer_study', 'workout', 'sports', 'flexible']),
  description: z.string().optional(),
  five_c_focus: z.string().optional(),
  max_members: z.number().min(2).max(20),
  location_type: z.string().optional(),
});

type ActivityGroupFormData = z.infer<typeof activityGroupFormSchema>;

interface ActivityGroupFormProps {
  onSubmit: (data: ActivityGroupFormData) => void;
  initialData?: Partial<ActivityGroupFormData>;
  isEditing?: boolean;
}

export function ActivityGroupForm({ onSubmit, initialData, isEditing = false }: ActivityGroupFormProps) {
  const form = useForm<ActivityGroupFormData>({
    resolver: zodResolver(activityGroupFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      activity_type: initialData?.activity_type || "dinner",
      description: initialData?.description || "",
      five_c_focus: initialData?.five_c_focus || "balance",
      max_members: initialData?.max_members || 8,
      location_type: initialData?.location_type || "",
    },
  });

  const handleSubmit = (data: ActivityGroupFormData) => {
    onSubmit(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Group" : "Create New Group"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter group name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="activity_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select activity type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ACTIVITY_TYPES.map((type) => (
                        <SelectItem key={type.key} value={type.key}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the group's purpose and what members can expect"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="max_members"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Members</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="2" 
                        max="20"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="five_c_focus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>5C Focus</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select focus" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="commitment">Commitment</SelectItem>
                        <SelectItem value="communication">Communication</SelectItem>
                        <SelectItem value="connection">Connection</SelectItem>
                        <SelectItem value="crisis">Crisis</SelectItem>
                        <SelectItem value="celebration">Celebration</SelectItem>
                        <SelectItem value="balance">Balanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="homes">Members' Homes</SelectItem>
                      <SelectItem value="public">Public Venues</SelectItem>
                      <SelectItem value="church">Church Facilities</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3">
              <Button type="submit" className="flex-1">
                {isEditing ? "Update Group" : "Create Group"}
              </Button>
              <Button type="button" variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}