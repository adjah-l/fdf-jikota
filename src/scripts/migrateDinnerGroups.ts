// Migration script to copy dinner_groups to activity_groups
// Run this once to migrate existing data

import { supabase } from "@/integrations/supabase/client";

export async function migrateDinnerGroupsToActivityGroups() {
  try {
    console.log("Starting migration from dinner_groups to activity_groups...");
    
    // Get all existing dinner groups
    const { data: dinnerGroups, error: fetchError } = await supabase
      .from('dinner_groups')
      .select('*')
      .is('migrated_to', null);
    
    if (fetchError) {
      throw fetchError;
    }
    
    if (!dinnerGroups || dinnerGroups.length === 0) {
      console.log("No dinner groups to migrate.");
      return;
    }
    
    console.log(`Found ${dinnerGroups.length} dinner groups to migrate.`);
    
    // Migrate each dinner group to activity_groups
    for (const dinnerGroup of dinnerGroups) {
      const activityGroup = {
        org_id: dinnerGroup.org_id,
        name: dinnerGroup.name,
        activity_type: 'dinner' as const,
        description: dinnerGroup.description,
        five_c_focus: dinnerGroup.five_c_focus,
        status: dinnerGroup.status,
        scheduled_date: dinnerGroup.scheduled_date,
        host_user_id: dinnerGroup.host_user_id,
        approved_by: dinnerGroup.approved_by,
        created_by: dinnerGroup.created_by,
        max_members: dinnerGroup.max_members,
        location_type: dinnerGroup.location_type,
        created_at: dinnerGroup.created_at,
        updated_at: dinnerGroup.updated_at,
      };
      
      // Insert into activity_groups
      const { data: newActivityGroup, error: insertError } = await supabase
        .from('activity_groups')
        .insert(activityGroup)
        .select()
        .single();
      
      if (insertError) {
        console.error(`Failed to migrate dinner group ${dinnerGroup.id}:`, insertError);
        continue;
      }
      
      // Update dinner_groups to mark as migrated
      const { error: updateError } = await supabase
        .from('dinner_groups')
        .update({ migrated_to: newActivityGroup.id })
        .eq('id', dinnerGroup.id);
      
      if (updateError) {
        console.error(`Failed to update dinner group ${dinnerGroup.id} migration status:`, updateError);
      }
      
      // Migrate group members
      const { data: groupMembers, error: membersError } = await supabase
        .from('group_members')
        .select('*')
        .eq('group_id', dinnerGroup.id);
      
      if (membersError) {
        console.error(`Failed to fetch members for dinner group ${dinnerGroup.id}:`, membersError);
        continue;
      }
      
      if (groupMembers && groupMembers.length > 0) {
        const activityGroupMembers = groupMembers.map(member => ({
          group_id: newActivityGroup.id,
          user_id: member.user_id,
          status: member.status,
          added_at: member.added_at,
        }));
        
        const { error: memberInsertError } = await supabase
          .from('activity_group_members')
          .insert(activityGroupMembers);
        
        if (memberInsertError) {
          console.error(`Failed to migrate members for dinner group ${dinnerGroup.id}:`, memberInsertError);
        }
      }
      
      console.log(`Migrated dinner group "${dinnerGroup.name}" to activity group ${newActivityGroup.id}`);
    }
    
    console.log("Migration completed successfully!");
    
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}