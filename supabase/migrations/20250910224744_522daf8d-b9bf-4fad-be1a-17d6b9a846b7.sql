-- Migrate group members from dinner_groups to activity_groups
DO $$
BEGIN
  -- Only migrate if both tables exist and have data
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'dinner_groups' AND table_schema = 'public') 
     AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'group_members' AND table_schema = 'public') THEN
    
    -- Migrate group members to activity_group_members
    INSERT INTO public.activity_group_members (group_id, user_id, status, added_at)
    SELECT 
      ag.id as group_id,
      gm.user_id,
      gm.status,
      gm.added_at
    FROM public.group_members gm
    JOIN public.dinner_groups dg ON gm.group_id = dg.id
    JOIN public.activity_groups ag ON ag.source_dg_id = dg.id
    WHERE NOT EXISTS (
      SELECT 1 FROM public.activity_group_members agm 
      WHERE agm.group_id = ag.id AND agm.user_id = gm.user_id
    );
    
  END IF;
END$$;