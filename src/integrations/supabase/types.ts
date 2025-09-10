export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["admin_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      dinner_groups: {
        Row: {
          approved_by: string | null
          created_at: string
          created_by: string | null
          description: string | null
          host_user_id: string | null
          id: string
          location_type: string | null
          max_members: number
          name: string
          org_id: string | null
          scheduled_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          approved_by?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          host_user_id?: string | null
          id?: string
          location_type?: string | null
          max_members?: number
          name: string
          org_id?: string | null
          scheduled_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          approved_by?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          host_user_id?: string | null
          id?: string
          location_type?: string | null
          max_members?: number
          name?: string
          org_id?: string | null
          scheduled_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dinner_groups_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      external_batch_email_configs: {
        Row: {
          batch_id: string
          body_template: string
          created_at: string
          created_by: string | null
          from_email: string
          from_name: string
          id: string
          subject: string
          updated_at: string
        }
        Insert: {
          batch_id: string
          body_template?: string
          created_at?: string
          created_by?: string | null
          from_email?: string
          from_name?: string
          id?: string
          subject?: string
          updated_at?: string
        }
        Update: {
          batch_id?: string
          body_template?: string
          created_at?: string
          created_by?: string | null
          from_email?: string
          from_name?: string
          id?: string
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "external_batch_email_configs_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "import_batches"
            referencedColumns: ["id"]
          },
        ]
      }
      external_data_sources: {
        Row: {
          configuration: Json | null
          created_at: string
          created_by: string | null
          field_mapping: Json | null
          id: string
          is_active: boolean
          name: string
          org_id: string | null
          source_identifier: string | null
          source_type: string
          updated_at: string
        }
        Insert: {
          configuration?: Json | null
          created_at?: string
          created_by?: string | null
          field_mapping?: Json | null
          id?: string
          is_active?: boolean
          name: string
          org_id?: string | null
          source_identifier?: string | null
          source_type: string
          updated_at?: string
        }
        Update: {
          configuration?: Json | null
          created_at?: string
          created_by?: string | null
          field_mapping?: Json | null
          id?: string
          is_active?: boolean
          name?: string
          org_id?: string | null
          source_identifier?: string | null
          source_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "external_data_sources_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      external_group_members: {
        Row: {
          added_at: string
          group_id: string
          id: string
          profile_id: string
          status: string
        }
        Insert: {
          added_at?: string
          group_id: string
          id?: string
          profile_id: string
          status?: string
        }
        Update: {
          added_at?: string
          group_id?: string
          id?: string
          profile_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "external_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "external_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "external_group_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "external_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      external_groups: {
        Row: {
          approved_by: string | null
          batch_id: string
          compatibility_score: number | null
          created_at: string
          description: string | null
          email_sent_at: string | null
          email_sent_by: string | null
          group_size: number
          id: string
          is_reverted: boolean
          matching_policy_used: Json | null
          name: string
          neighborhood_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          approved_by?: string | null
          batch_id: string
          compatibility_score?: number | null
          created_at?: string
          description?: string | null
          email_sent_at?: string | null
          email_sent_by?: string | null
          group_size: number
          id?: string
          is_reverted?: boolean
          matching_policy_used?: Json | null
          name: string
          neighborhood_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          approved_by?: string | null
          batch_id?: string
          compatibility_score?: number | null
          created_at?: string
          description?: string | null
          email_sent_at?: string | null
          email_sent_by?: string | null
          group_size?: number
          id?: string
          is_reverted?: boolean
          matching_policy_used?: Json | null
          name?: string
          neighborhood_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "external_groups_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "import_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "external_groups_neighborhood_id_fkey"
            columns: ["neighborhood_id"]
            isOneToOne: false
            referencedRelation: "neighborhoods"
            referencedColumns: ["id"]
          },
        ]
      }
      external_matching_policies: {
        Row: {
          age_weight: number
          batch_id: string
          created_at: string
          created_by: string | null
          default_group_size: number
          family_stage_weight: number
          id: string
          interests_weight: number
          location_weight: number
          max_distance_miles: number | null
          updated_at: string
        }
        Insert: {
          age_weight?: number
          batch_id: string
          created_at?: string
          created_by?: string | null
          default_group_size?: number
          family_stage_weight?: number
          id?: string
          interests_weight?: number
          location_weight?: number
          max_distance_miles?: number | null
          updated_at?: string
        }
        Update: {
          age_weight?: number
          batch_id?: string
          created_at?: string
          created_by?: string | null
          default_group_size?: number
          family_stage_weight?: number
          id?: string
          interests_weight?: number
          location_weight?: number
          max_distance_miles?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "external_matching_policies_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "import_batches"
            referencedColumns: ["id"]
          },
        ]
      }
      external_profiles: {
        Row: {
          batch_id: string
          created_at: string
          id: string
          mapped_data: Json
          neighborhood_id: string | null
          raw_data: Json
          source_id: string
          updated_at: string
          validation_errors: Json | null
          validation_status: string
        }
        Insert: {
          batch_id: string
          created_at?: string
          id?: string
          mapped_data: Json
          neighborhood_id?: string | null
          raw_data: Json
          source_id: string
          updated_at?: string
          validation_errors?: Json | null
          validation_status?: string
        }
        Update: {
          batch_id?: string
          created_at?: string
          id?: string
          mapped_data?: Json
          neighborhood_id?: string | null
          raw_data?: Json
          source_id?: string
          updated_at?: string
          validation_errors?: Json | null
          validation_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "external_profiles_neighborhood_id_fkey"
            columns: ["neighborhood_id"]
            isOneToOne: false
            referencedRelation: "neighborhoods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "external_profiles_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "external_data_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          added_at: string
          group_id: string
          id: string
          status: string
          user_id: string
        }
        Insert: {
          added_at?: string
          group_id: string
          id?: string
          status?: string
          user_id: string
        }
        Update: {
          added_at?: string
          group_id?: string
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "dinner_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      import_batches: {
        Row: {
          created_at: string
          created_by: string | null
          error_summary: Json | null
          filename: string | null
          id: string
          invalid_records: number
          source_id: string
          status: string
          total_records: number
          updated_at: string
          valid_records: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          error_summary?: Json | null
          filename?: string | null
          id?: string
          invalid_records?: number
          source_id: string
          status?: string
          total_records?: number
          updated_at?: string
          valid_records?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          error_summary?: Json | null
          filename?: string | null
          id?: string
          invalid_records?: number
          source_id?: string
          status?: string
          total_records?: number
          updated_at?: string
          valid_records?: number
        }
        Relationships: [
          {
            foreignKeyName: "import_batches_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "external_data_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      matching_criteria: {
        Row: {
          created_at: string
          created_by: string | null
          criteria_type: string
          discrete_options: Json | null
          id: string
          is_active: boolean
          name: string
          option_type: string | null
          updated_at: string
          weight: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          criteria_type: string
          discrete_options?: Json | null
          id?: string
          is_active?: boolean
          name: string
          option_type?: string | null
          updated_at?: string
          weight?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          criteria_type?: string
          discrete_options?: Json | null
          id?: string
          is_active?: boolean
          name?: string
          option_type?: string | null
          updated_at?: string
          weight?: number
        }
        Relationships: []
      }
      matching_policies: {
        Row: {
          age_alignment: string
          age_hard: boolean
          age_weight: number
          created_at: string
          created_by: string | null
          default_group_size: number
          fallback_strategy: string
          family_group_size: number
          family_stage_alignment: string
          family_stage_hard: boolean
          family_stage_weight: number
          gender_allowed: string[] | null
          gender_hard: boolean
          gender_mode: string
          gender_weight: number
          id: string
          location_hard: boolean
          location_scope: string
          max_distance_miles: number | null
          mode: string
          neighborhood_id: string
          org_id: string | null
          same_community_weight: number
          season_use: boolean
          season_value: string | null
          season_weight: number
          stage_alignment: string
          stage_hard: boolean
          stage_weight: number
          updated_at: string
        }
        Insert: {
          age_alignment?: string
          age_hard?: boolean
          age_weight?: number
          created_at?: string
          created_by?: string | null
          default_group_size?: number
          fallback_strategy?: string
          family_group_size?: number
          family_stage_alignment?: string
          family_stage_hard?: boolean
          family_stage_weight?: number
          gender_allowed?: string[] | null
          gender_hard?: boolean
          gender_mode?: string
          gender_weight?: number
          id?: string
          location_hard?: boolean
          location_scope?: string
          max_distance_miles?: number | null
          mode?: string
          neighborhood_id: string
          org_id?: string | null
          same_community_weight?: number
          season_use?: boolean
          season_value?: string | null
          season_weight?: number
          stage_alignment?: string
          stage_hard?: boolean
          stage_weight?: number
          updated_at?: string
        }
        Update: {
          age_alignment?: string
          age_hard?: boolean
          age_weight?: number
          created_at?: string
          created_by?: string | null
          default_group_size?: number
          fallback_strategy?: string
          family_group_size?: number
          family_stage_alignment?: string
          family_stage_hard?: boolean
          family_stage_weight?: number
          gender_allowed?: string[] | null
          gender_hard?: boolean
          gender_mode?: string
          gender_weight?: number
          id?: string
          location_hard?: boolean
          location_scope?: string
          max_distance_miles?: number | null
          mode?: string
          neighborhood_id?: string
          org_id?: string | null
          same_community_weight?: number
          season_use?: boolean
          season_value?: string | null
          season_weight?: number
          stage_alignment?: string
          stage_hard?: boolean
          stage_weight?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "matching_policies_neighborhood_id_fkey"
            columns: ["neighborhood_id"]
            isOneToOne: true
            referencedRelation: "neighborhoods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matching_policies_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      matching_policy_audit: {
        Row: {
          change_reason: string | null
          changed_at: string
          changed_by: string | null
          id: string
          new_policy: Json | null
          old_policy: Json | null
          policy_id: string
        }
        Insert: {
          change_reason?: string | null
          changed_at?: string
          changed_by?: string | null
          id?: string
          new_policy?: Json | null
          old_policy?: Json | null
          policy_id: string
        }
        Update: {
          change_reason?: string | null
          changed_at?: string
          changed_by?: string | null
          id?: string
          new_policy?: Json | null
          old_policy?: Json | null
          policy_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "matching_policy_audit_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "matching_policies"
            referencedColumns: ["id"]
          },
        ]
      }
      matching_runs: {
        Row: {
          completed_at: string | null
          created_at: string
          groups_created: number
          id: string
          input_criteria: Json
          members_matched: number
          neighborhood_id: string | null
          org_id: string
          output_summary: Json
          policy_snapshot: Json
          run_by: string
          status: string
          waitlist_count: number
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          groups_created?: number
          id?: string
          input_criteria: Json
          members_matched?: number
          neighborhood_id?: string | null
          org_id: string
          output_summary: Json
          policy_snapshot: Json
          run_by: string
          status?: string
          waitlist_count?: number
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          groups_created?: number
          id?: string
          input_criteria?: Json
          members_matched?: number
          neighborhood_id?: string | null
          org_id?: string
          output_summary?: Json
          policy_snapshot?: Json
          run_by?: string
          status?: string
          waitlist_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "matching_runs_neighborhood_id_fkey"
            columns: ["neighborhood_id"]
            isOneToOne: false
            referencedRelation: "neighborhoods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matching_runs_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      message_events: {
        Row: {
          channel: string
          created_at: string
          delivered_at: string | null
          error_message: string | null
          event_type: string
          id: string
          message_data: Json
          org_id: string
          recipient_id: string
          sent_at: string | null
          status: string
          template_id: string | null
        }
        Insert: {
          channel: string
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          event_type: string
          id?: string
          message_data: Json
          org_id: string
          recipient_id: string
          sent_at?: string | null
          status?: string
          template_id?: string | null
        }
        Update: {
          channel?: string
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          event_type?: string
          id?: string
          message_data?: Json
          org_id?: string
          recipient_id?: string
          sent_at?: string | null
          status?: string
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_events_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_events_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "message_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      message_templates: {
        Row: {
          channel: string
          created_at: string
          event_type: string
          id: string
          is_active: boolean
          name: string
          org_id: string
          subject: string | null
          template_body: string
          updated_at: string
          variables: Json
        }
        Insert: {
          channel: string
          created_at?: string
          event_type: string
          id?: string
          is_active?: boolean
          name: string
          org_id: string
          subject?: string | null
          template_body: string
          updated_at?: string
          variables?: Json
        }
        Update: {
          channel?: string
          created_at?: string
          event_type?: string
          id?: string
          is_active?: boolean
          name?: string
          org_id?: string
          subject?: string | null
          template_body?: string
          updated_at?: string
          variables?: Json
        }
        Relationships: [
          {
            foreignKeyName: "message_templates_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      neighborhoods: {
        Row: {
          active_dinners_count: number | null
          city: string
          community_tags: string[] | null
          country: string | null
          created_at: string
          current_season: string | null
          description: string | null
          family_count: number | null
          family_groups_count: number | null
          id: string
          latitude: number | null
          longitude: number | null
          member_count: number | null
          name: string
          org_id: string | null
          state: string
          state_region: string | null
          updated_at: string
          zip_codes: string[] | null
        }
        Insert: {
          active_dinners_count?: number | null
          city: string
          community_tags?: string[] | null
          country?: string | null
          created_at?: string
          current_season?: string | null
          description?: string | null
          family_count?: number | null
          family_groups_count?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          member_count?: number | null
          name: string
          org_id?: string | null
          state: string
          state_region?: string | null
          updated_at?: string
          zip_codes?: string[] | null
        }
        Update: {
          active_dinners_count?: number | null
          city?: string
          community_tags?: string[] | null
          country?: string | null
          created_at?: string
          current_season?: string | null
          description?: string | null
          family_count?: number | null
          family_groups_count?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          member_count?: number | null
          name?: string
          org_id?: string | null
          state?: string
          state_region?: string | null
          updated_at?: string
          zip_codes?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "neighborhoods_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          id: string
          is_active: boolean
          joined_at: string
          org_id: string
          role: Database["public"]["Enums"]["org_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          is_active?: boolean
          joined_at?: string
          org_id: string
          role?: Database["public"]["Enums"]["org_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          is_active?: boolean
          joined_at?: string
          org_id?: string
          role?: Database["public"]["Enums"]["org_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          settings: Json
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          settings?: Json
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          settings?: Json
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          activities: string[] | null
          age_group: string | null
          avatar_url: string | null
          bio: string | null
          children_ages: string | null
          city: string | null
          closest_fd_city: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          development_subdivision: string | null
          email: string | null
          family_profile: string | null
          favorite_dessert: string | null
          favorite_dinner_meal: string | null
          first_name: string | null
          full_name: string | null
          group_interest: string | null
          hometown: string | null
          id: string
          instagram_handle: string | null
          last_name: string | null
          neighborhood_name: string | null
          new_to_city: string | null
          phone_number: string | null
          season_interest: string | null
          spouse_email: string | null
          spouse_first_name: string | null
          spouse_last_name: string | null
          spouse_phone: string | null
          state_region: string | null
          updated_at: string
          user_id: string
          verification_document_status: string | null
          verification_document_type: string | null
          verification_document_url: string | null
          ways_to_serve: string[] | null
          willing_to_welcome: boolean | null
          work_from_home: string | null
        }
        Insert: {
          activities?: string[] | null
          age_group?: string | null
          avatar_url?: string | null
          bio?: string | null
          children_ages?: string | null
          city?: string | null
          closest_fd_city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          development_subdivision?: string | null
          email?: string | null
          family_profile?: string | null
          favorite_dessert?: string | null
          favorite_dinner_meal?: string | null
          first_name?: string | null
          full_name?: string | null
          group_interest?: string | null
          hometown?: string | null
          id?: string
          instagram_handle?: string | null
          last_name?: string | null
          neighborhood_name?: string | null
          new_to_city?: string | null
          phone_number?: string | null
          season_interest?: string | null
          spouse_email?: string | null
          spouse_first_name?: string | null
          spouse_last_name?: string | null
          spouse_phone?: string | null
          state_region?: string | null
          updated_at?: string
          user_id: string
          verification_document_status?: string | null
          verification_document_type?: string | null
          verification_document_url?: string | null
          ways_to_serve?: string[] | null
          willing_to_welcome?: boolean | null
          work_from_home?: string | null
        }
        Update: {
          activities?: string[] | null
          age_group?: string | null
          avatar_url?: string | null
          bio?: string | null
          children_ages?: string | null
          city?: string | null
          closest_fd_city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          development_subdivision?: string | null
          email?: string | null
          family_profile?: string | null
          favorite_dessert?: string | null
          favorite_dinner_meal?: string | null
          first_name?: string | null
          full_name?: string | null
          group_interest?: string | null
          hometown?: string | null
          id?: string
          instagram_handle?: string | null
          last_name?: string | null
          neighborhood_name?: string | null
          new_to_city?: string | null
          phone_number?: string | null
          season_interest?: string | null
          spouse_email?: string | null
          spouse_first_name?: string | null
          spouse_last_name?: string | null
          spouse_phone?: string | null
          state_region?: string | null
          updated_at?: string
          user_id?: string
          verification_document_status?: string | null
          verification_document_type?: string | null
          verification_document_url?: string | null
          ways_to_serve?: string[] | null
          willing_to_welcome?: boolean | null
          work_from_home?: string | null
        }
        Relationships: []
      }
      service_offers: {
        Row: {
          category: string
          created_at: string
          credits_per_request: number
          description: string | null
          id: string
          is_active: boolean
          max_requests: number | null
          org_id: string
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          credits_per_request?: number
          description?: string | null
          id?: string
          is_active?: boolean
          max_requests?: number | null
          org_id: string
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          credits_per_request?: number
          description?: string | null
          id?: string
          is_active?: boolean
          max_requests?: number | null
          org_id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_offers_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      service_requests: {
        Row: {
          category: string
          created_at: string
          credits_offered: number
          description: string | null
          fulfilled_at: string | null
          fulfilled_by: string | null
          id: string
          org_id: string
          requester_id: string
          status: string
          tags: string[] | null
          title: string
          updated_at: string
          urgency: string
        }
        Insert: {
          category: string
          created_at?: string
          credits_offered?: number
          description?: string | null
          fulfilled_at?: string | null
          fulfilled_by?: string | null
          id?: string
          org_id: string
          requester_id: string
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          urgency?: string
        }
        Update: {
          category?: string
          created_at?: string
          credits_offered?: number
          description?: string | null
          fulfilled_at?: string | null
          fulfilled_by?: string | null
          id?: string
          org_id?: string
          requester_id?: string
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          urgency?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_requests_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          from_user_id: string | null
          id: string
          org_id: string
          reference_id: string | null
          reference_type: string | null
          to_user_id: string | null
          transaction_type: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          from_user_id?: string | null
          id?: string
          org_id: string
          reference_id?: string | null
          reference_type?: string | null
          to_user_id?: string | null
          transaction_type: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          from_user_id?: string | null
          id?: string
          org_id?: string
          reference_id?: string | null
          reference_type?: string | null
          to_user_id?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_neighborhoods: {
        Row: {
          id: string
          is_active: boolean | null
          joined_at: string
          neighborhood_id: string
          user_id: string
        }
        Insert: {
          id?: string
          is_active?: boolean | null
          joined_at?: string
          neighborhood_id: string
          user_id: string
        }
        Update: {
          id?: string
          is_active?: boolean | null
          joined_at?: string
          neighborhood_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_neighborhoods_neighborhood_id_fkey"
            columns: ["neighborhood_id"]
            isOneToOne: false
            referencedRelation: "neighborhoods"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_admin_role: {
        Args: { user_id_param?: string }
        Returns: Database["public"]["Enums"]["admin_role"]
      }
      get_matching_policy: {
        Args: { neighborhood_id_param: string }
        Returns: {
          age_alignment: string
          age_hard: boolean
          age_weight: number
          created_at: string
          created_by: string | null
          default_group_size: number
          fallback_strategy: string
          family_group_size: number
          family_stage_alignment: string
          family_stage_hard: boolean
          family_stage_weight: number
          gender_allowed: string[] | null
          gender_hard: boolean
          gender_mode: string
          gender_weight: number
          id: string
          location_hard: boolean
          location_scope: string
          max_distance_miles: number | null
          mode: string
          neighborhood_id: string
          org_id: string | null
          same_community_weight: number
          season_use: boolean
          season_value: string | null
          season_weight: number
          stage_alignment: string
          stage_hard: boolean
          stage_weight: number
          updated_at: string
        }
      }
      get_user_orgs: {
        Args: { user_id_param?: string }
        Returns: string[]
      }
      has_org_role: {
        Args: {
          org_id_param: string
          required_role: Database["public"]["Enums"]["org_role"]
          user_id_param?: string
        }
        Returns: boolean
      }
      is_admin: {
        Args: { user_id_param?: string }
        Returns: boolean
      }
      simulate_matching: {
        Args: { neighborhood_id_param: string; policy_overrides?: Json }
        Returns: {
          eligible_members: number
          potential_groups: number
          simulation_details: Json
          waitlist_members: number
        }[]
      }
    }
    Enums: {
      admin_role: "super_admin" | "admin" | "moderator"
      age_group_type: "22-24" | "25-34" | "35-44" | "45-54" | "55+"
      family_profile_type:
        | "married_no_children"
        | "single_no_children"
        | "married_with_children"
        | "single_with_children"
      new_to_city_type: "yes_less_3_months" | "yes_less_year" | "no"
      org_role: "owner" | "admin" | "moderator" | "member"
      work_from_home_type: "yes_100_percent" | "yes_3_days" | "hybrid" | "no"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      admin_role: ["super_admin", "admin", "moderator"],
      age_group_type: ["22-24", "25-34", "35-44", "45-54", "55+"],
      family_profile_type: [
        "married_no_children",
        "single_no_children",
        "married_with_children",
        "single_with_children",
      ],
      new_to_city_type: ["yes_less_3_months", "yes_less_year", "no"],
      org_role: ["owner", "admin", "moderator", "member"],
      work_from_home_type: ["yes_100_percent", "yes_3_days", "hybrid", "no"],
    },
  },
} as const
