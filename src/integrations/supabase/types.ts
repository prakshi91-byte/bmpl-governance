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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bpml_roles: {
        Row: {
          description: string | null
          id: string
          name: string
        }
        Insert: {
          description?: string | null
          id: string
          name: string
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      bpml_users: {
        Row: {
          active: boolean
          email: string
          id: string
          name: string
          role_id: string | null
        }
        Insert: {
          active?: boolean
          email: string
          id: string
          name: string
          role_id?: string | null
        }
        Update: {
          active?: boolean
          email?: string
          id?: string
          name?: string
          role_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bpml_users_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "bpml_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      business_template_levels: {
        Row: {
          name: string
        }
        Insert: {
          name: string
        }
        Update: {
          name?: string
        }
        Relationships: []
      }
      business_template_scope: {
        Row: {
          business_template_id: string
          template_id: number
        }
        Insert: {
          business_template_id: string
          template_id: number
        }
        Update: {
          business_template_id?: string
          template_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "business_template_scope_business_template_id_fkey"
            columns: ["business_template_id"]
            isOneToOne: false
            referencedRelation: "business_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_template_scope_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      business_templates: {
        Row: {
          description: string | null
          geo_scope: string | null
          id: string
          level: string | null
          name: string
          product_group: string | null
        }
        Insert: {
          description?: string | null
          geo_scope?: string | null
          id: string
          level?: string | null
          name: string
          product_group?: string | null
        }
        Update: {
          description?: string | null
          geo_scope?: string | null
          id?: string
          level?: string | null
          name?: string
          product_group?: string | null
        }
        Relationships: []
      }
      capabilities: {
        Row: {
          id: string
          name: string
          process_area_id: string
          process_domain_id: string
          process_id: string
          status: string | null
          template_count: number
        }
        Insert: {
          id: string
          name: string
          process_area_id: string
          process_domain_id: string
          process_id: string
          status?: string | null
          template_count?: number
        }
        Update: {
          id?: string
          name?: string
          process_area_id?: string
          process_domain_id?: string
          process_id?: string
          status?: string | null
          template_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "capabilities_process_area_id_fkey"
            columns: ["process_area_id"]
            isOneToOne: false
            referencedRelation: "process_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "capabilities_process_domain_id_fkey"
            columns: ["process_domain_id"]
            isOneToOne: false
            referencedRelation: "process_domains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "capabilities_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "processes"
            referencedColumns: ["id"]
          },
        ]
      }
      capability_template_links: {
        Row: {
          capability_id: string
          template_id: number
        }
        Insert: {
          capability_id: string
          template_id: number
        }
        Update: {
          capability_id?: string
          template_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "capability_template_links_capability_id_fkey"
            columns: ["capability_id"]
            isOneToOne: false
            referencedRelation: "capabilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "capability_template_links_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      coverage_cells: {
        Row: {
          entity_id: string
          process_area_id: string
          state: Database["public"]["Enums"]["coverage_state"]
        }
        Insert: {
          entity_id: string
          process_area_id: string
          state?: Database["public"]["Enums"]["coverage_state"]
        }
        Update: {
          entity_id?: string
          process_area_id?: string
          state?: Database["public"]["Enums"]["coverage_state"]
        }
        Relationships: [
          {
            foreignKeyName: "coverage_cells_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coverage_cells_process_area_id_fkey"
            columns: ["process_area_id"]
            isOneToOne: false
            referencedRelation: "process_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      entities: {
        Row: {
          id: string
          name: string
          region: string | null
        }
        Insert: {
          id: string
          name: string
          region?: string | null
        }
        Update: {
          id?: string
          name?: string
          region?: string | null
        }
        Relationships: []
      }
      geographical_scope: {
        Row: {
          name: string
        }
        Insert: {
          name: string
        }
        Update: {
          name?: string
        }
        Relationships: []
      }
      process_areas: {
        Row: {
          id: string
          name: string
          process_domain_id: string
        }
        Insert: {
          id: string
          name: string
          process_domain_id: string
        }
        Update: {
          id?: string
          name?: string
          process_domain_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "process_areas_process_domain_id_fkey"
            columns: ["process_domain_id"]
            isOneToOne: false
            referencedRelation: "process_domains"
            referencedColumns: ["id"]
          },
        ]
      }
      process_domains: {
        Row: {
          id: string
          it_domain: string | null
          it_service: string | null
          name: string
        }
        Insert: {
          id: string
          it_domain?: string | null
          it_service?: string | null
          name: string
        }
        Update: {
          id?: string
          it_domain?: string | null
          it_service?: string | null
          name?: string
        }
        Relationships: []
      }
      processes: {
        Row: {
          capability_count: number
          id: string
          name: string
          owner: string | null
          process_area_id: string
          process_domain_id: string
          status: string | null
          template_count: number
        }
        Insert: {
          capability_count?: number
          id: string
          name: string
          owner?: string | null
          process_area_id: string
          process_domain_id: string
          status?: string | null
          template_count?: number
        }
        Update: {
          capability_count?: number
          id?: string
          name?: string
          owner?: string | null
          process_area_id?: string
          process_domain_id?: string
          status?: string | null
          template_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "processes_process_area_id_fkey"
            columns: ["process_area_id"]
            isOneToOne: false
            referencedRelation: "process_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "processes_process_domain_id_fkey"
            columns: ["process_domain_id"]
            isOneToOne: false
            referencedRelation: "process_domains"
            referencedColumns: ["id"]
          },
        ]
      }
      product_groups: {
        Row: {
          name: string
        }
        Insert: {
          name: string
        }
        Update: {
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_scope: {
        Row: {
          business_template_id: string | null
          id: string
          project_id: string
          template_id: number | null
        }
        Insert: {
          business_template_id?: string | null
          id?: string
          project_id: string
          template_id?: number | null
        }
        Update: {
          business_template_id?: string | null
          id?: string
          project_id?: string
          template_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_scope_business_template_id_fkey"
            columns: ["business_template_id"]
            isOneToOne: false
            referencedRelation: "business_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_scope_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_scope_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          code: string
          end_date: string | null
          id: string
          manager: string | null
          name: string
          start_date: string | null
          status: string | null
        }
        Insert: {
          code: string
          end_date?: string | null
          id: string
          manager?: string | null
          name: string
          start_date?: string | null
          status?: string | null
        }
        Update: {
          code?: string
          end_date?: string | null
          id?: string
          manager?: string | null
          name?: string
          start_date?: string | null
          status?: string | null
        }
        Relationships: []
      }
      template_steps: {
        Row: {
          name: string
          seq: number
          standard: string | null
          status: string | null
          template_id: number
          transaction: string | null
        }
        Insert: {
          name: string
          seq: number
          standard?: string | null
          status?: string | null
          template_id: number
          transaction?: string | null
        }
        Update: {
          name?: string
          seq?: number
          standard?: string | null
          status?: string | null
          template_id?: number
          transaction?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "template_steps_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          id: number
          name: string
          standard: string | null
          step_count: number
        }
        Insert: {
          id: number
          name: string
          standard?: string | null
          step_count?: number
        }
        Update: {
          id?: number
          name?: string
          standard?: string | null
          step_count?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "viewer"
      coverage_state: "covered" | "partial" | "not_covered" | "na"
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
      app_role: ["admin", "viewer"],
      coverage_state: ["covered", "partial", "not_covered", "na"],
    },
  },
} as const
