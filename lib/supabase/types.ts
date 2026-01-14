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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      tbl_company: {
        Row: {
          created_at: string
          email: string | null
          id: number
          id_plan: string | null
          id_principal_user: string | null
          is_active: boolean | null
          logo_url: string | null
          name: string | null
          nit: string | null
          phone: string | null
          picture_url: string | null
          uuid_company: string | null
          watermark_url: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
          id_plan?: string | null
          id_principal_user?: string | null
          is_active?: boolean | null
          logo_url?: string | null
          name?: string | null
          nit?: string | null
          phone?: string | null
          picture_url?: string | null
          uuid_company?: string | null
          watermark_url?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          id_plan?: string | null
          id_principal_user?: string | null
          is_active?: boolean | null
          logo_url?: string | null
          name?: string | null
          nit?: string | null
          phone?: string | null
          picture_url?: string | null
          uuid_company?: string | null
          watermark_url?: string | null
        }
        Relationships: []
      }
      tbl_configuration: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      tbl_expense_model_history: {
        Row: {
          created_at: string
          id: number
          illustration_id: string | null
          model_id: string | null
          price: string | null
          tokens: string | null
          type: string
        }
        Insert: {
          created_at?: string
          id?: number
          illustration_id?: string | null
          model_id?: string | null
          price?: string | null
          tokens?: string | null
          type: string
        }
        Update: {
          created_at?: string
          id?: number
          illustration_id?: string | null
          model_id?: string | null
          price?: string | null
          tokens?: string | null
          type?: string
        }
        Relationships: []
      }
      tbl_illustrations: {
        Row: {
          avatar_picture_url: string | null
          baby_name: string | null
          company_id: number | null
          created_at: string
          description: string | null
          gestational_week: string | null
          id: number
          images: Json | null
          model_id: number | null
          process_status: string | null
          profile_id: string | null
          team_id: number | null
          user_id: string | null
        }
        Insert: {
          avatar_picture_url?: string | null
          baby_name?: string | null
          company_id?: number | null
          created_at?: string
          description?: string | null
          gestational_week?: string | null
          id?: number
          images?: Json | null
          model_id?: number | null
          process_status?: string | null
          profile_id?: string | null
          team_id?: number | null
          user_id?: string | null
        }
        Update: {
          avatar_picture_url?: string | null
          baby_name?: string | null
          company_id?: number | null
          created_at?: string
          description?: string | null
          gestational_week?: string | null
          id?: number
          images?: Json | null
          model_id?: number | null
          process_status?: string | null
          profile_id?: string | null
          team_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tbl_illustrations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "tbl_company"
            referencedColumns: ["id"]
          },
        ]
      }
      tbl_models: {
        Row: {
          created_at: string
          description: string | null
          id: number
          limit_generations: string | null
          name: string | null
          price_per_token_generation: string | null
          quality: string
          tokens_per_generation: string | null
          tokens_to_generate: string | null
          total_consumption: number
          type: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          limit_generations?: string | null
          name?: string | null
          price_per_token_generation?: string | null
          quality?: string
          tokens_per_generation?: string | null
          tokens_to_generate?: string | null
          total_consumption?: number
          type?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          limit_generations?: string | null
          name?: string | null
          price_per_token_generation?: string | null
          quality?: string
          tokens_per_generation?: string | null
          tokens_to_generate?: string | null
          total_consumption?: number
          type?: string | null
        }
        Relationships: []
      }
      tbl_profiles: {
        Row: {
          age: number | null
          avatar_picture_url: string | null
          created_at: string
          doc: number | null
          email: string
          id: number
          id_company: number | null
          is_active: boolean
          name: string | null
          phone: number | null
          uuid_profile: string | null
          uuid_user: string | null
        }
        Insert: {
          age?: number | null
          avatar_picture_url?: string | null
          created_at?: string
          doc?: number | null
          email: string
          id?: number
          id_company?: number | null
          is_active?: boolean
          name?: string | null
          phone?: number | null
          uuid_profile?: string | null
          uuid_user?: string | null
        }
        Update: {
          age?: number | null
          avatar_picture_url?: string | null
          created_at?: string
          doc?: number | null
          email?: string
          id?: number
          id_company?: number | null
          is_active?: boolean
          name?: string | null
          phone?: number | null
          uuid_profile?: string | null
          uuid_user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tbl_profiles_id_company_fkey"
            columns: ["id_company"]
            isOneToOne: false
            referencedRelation: "tbl_company"
            referencedColumns: ["id"]
          },
        ]
      }
      tbl_roles: {
        Row: {
          created_at: string
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      tbl_teams: {
        Row: {
          created_at: string
          customer_id: string | null
          id: number
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          id?: number
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          id?: number
        }
        Relationships: []
      }
      tbl_users: {
        Row: {
          created_at: string
          email: string | null
          id: number
          id_company: number | null
          id_role: number | null
          is_active: boolean
          is_super_admin: boolean | null
          name: string | null
          name_role: string | null
          nit: string | null
          uuid_user: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
          id_company?: number | null
          id_role?: number | null
          is_active?: boolean
          is_super_admin?: boolean | null
          name?: string | null
          name_role?: string | null
          nit?: string | null
          uuid_user?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          id_company?: number | null
          id_role?: number | null
          is_active?: boolean
          is_super_admin?: boolean | null
          name?: string | null
          name_role?: string | null
          nit?: string | null
          uuid_user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tbl_users_id_company_fkey"
            columns: ["id_company"]
            isOneToOne: false
            referencedRelation: "tbl_company"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tbl_users_id_role_fkey"
            columns: ["id_role"]
            isOneToOne: false
            referencedRelation: "tbl_roles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const