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
          scheduled_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
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
      matching_criteria: {
        Row: {
          created_at: string
          created_by: string | null
          criteria_type: string
          id: string
          is_active: boolean
          name: string
          updated_at: string
          weight: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          criteria_type: string
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
          weight?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          criteria_type?: string
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          weight?: number
        }
        Relationships: []
      }
      neighborhoods: {
        Row: {
          active_dinners_count: number | null
          city: string
          community_tags: string[] | null
          created_at: string
          description: string | null
          id: string
          latitude: number | null
          longitude: number | null
          member_count: number | null
          name: string
          state: string
          updated_at: string
          zip_codes: string[] | null
        }
        Insert: {
          active_dinners_count?: number | null
          city: string
          community_tags?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          member_count?: number | null
          name: string
          state: string
          updated_at?: string
          zip_codes?: string[] | null
        }
        Update: {
          active_dinners_count?: number | null
          city?: string
          community_tags?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          member_count?: number | null
          name?: string
          state?: string
          updated_at?: string
          zip_codes?: string[] | null
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
          ways_to_serve?: string[] | null
          willing_to_welcome?: boolean | null
          work_from_home?: string | null
        }
        Relationships: []
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
      is_admin: {
        Args: { user_id_param?: string }
        Returns: boolean
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
      work_from_home_type: ["yes_100_percent", "yes_3_days", "hybrid", "no"],
    },
  },
} as const
