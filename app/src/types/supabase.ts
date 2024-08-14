export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image: string | null
          title: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          title?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          title?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      catalogs: {
        Row: {
          catalog_id: string
          catalog_name: string
          example: boolean
          user_id: string
        }
        Insert: {
          catalog_id?: string
          catalog_name: string
          example?: boolean
          user_id: string
        }
        Update: {
          catalog_id?: string
          catalog_name?: string
          example?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "catalogs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_objectives: {
        Row: {
          id: string
          lesson_id: string | null
          objective_id: string | null
        }
        Insert: {
          id?: string
          lesson_id?: string | null
          objective_id?: string | null
        }
        Update: {
          id?: string
          lesson_id?: string | null
          objective_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_objectives_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "lesson_objectives_objective_id_fkey"
            columns: ["objective_id"]
            isOneToOne: false
            referencedRelation: "objectives"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          created_at: string
          description: string
          example: boolean
          points: number | null
          title: string
          user_id: string
          uuid: string
        }
        Insert: {
          created_at?: string
          description: string
          example?: boolean
          points?: number | null
          title: string
          user_id: string
          uuid?: string
        }
        Update: {
          created_at?: string
          description?: string
          example?: boolean
          points?: number | null
          title?: string
          user_id?: string
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      objectives: {
        Row: {
          description: string | null
          id: string
          max_level: number | null
          name: string | null
          user_id: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          max_level?: number | null
          name?: string | null
          user_id?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          max_level?: number | null
          name?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objectives_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          description: string | null
          id: string
          name: string
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      product_catalogs: {
        Row: {
          catalog_id: string | null
          id: string
          product_id: string | null
        }
        Insert: {
          catalog_id?: string | null
          id?: string
          product_id?: string | null
        }
        Update: {
          catalog_id?: string | null
          id?: string
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_catalogs_catalog_id_fkey"
            columns: ["catalog_id"]
            isOneToOne: false
            referencedRelation: "catalogs"
            referencedColumns: ["catalog_id"]
          },
          {
            foreignKeyName: "product_catalogs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
        ]
      }
      product_requirements: {
        Row: {
          comment: string | null
          product_id: string
          product_requirement_id: string
          qualification: number
          requirement_id: string
        }
        Insert: {
          comment?: string | null
          product_id: string
          product_requirement_id?: string
          qualification?: number
          requirement_id: string
        }
        Update: {
          comment?: string | null
          product_id?: string
          product_requirement_id?: string
          qualification?: number
          requirement_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_requirements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_requirements_requirement_id_fkey"
            columns: ["requirement_id"]
            isOneToOne: false
            referencedRelation: "requirements"
            referencedColumns: ["requirement_id"]
          },
        ]
      }
      products: {
        Row: {
          normalized_product_name: string | null
          product_id: string
          product_name: string
          product_url: string
          user_id: string
        }
        Insert: {
          normalized_product_name?: string | null
          product_id?: string
          product_name: string
          product_url: string
          user_id: string
        }
        Update: {
          normalized_product_name?: string | null
          product_id?: string
          product_name?: string
          product_url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string
          id: string
          role: string
          teacher: string | null
          username: string
        }
        Insert: {
          avatar?: string
          id: string
          role?: string
          teacher?: string | null
          username: string
        }
        Update: {
          avatar?: string
          id?: string
          role?: string
          teacher?: string | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_teacher_fkey"
            columns: ["teacher"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          hint: string | null
          lesson_uuid: string | null
          options: Json | null
          points: number | null
          position: number
          question: string | null
          question_type: string
          solution: Json | null
          uuid: string
        }
        Insert: {
          hint?: string | null
          lesson_uuid?: string | null
          options?: Json | null
          points?: number | null
          position: number
          question?: string | null
          question_type: string
          solution?: Json | null
          uuid?: string
        }
        Update: {
          hint?: string | null
          lesson_uuid?: string | null
          options?: Json | null
          points?: number | null
          position?: number
          question?: string | null
          question_type?: string
          solution?: Json | null
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_lesson_uuid_fkey"
            columns: ["lesson_uuid"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["uuid"]
          },
        ]
      }
      reqpal_achievement_levels: {
        Row: {
          description: string | null
          id: string
          image: string | null
          level: number
          reqpal_achievement_id: string | null
          threshold: number | null
          title: string | null
          xp: number
        }
        Insert: {
          description?: string | null
          id?: string
          image?: string | null
          level: number
          reqpal_achievement_id?: string | null
          threshold?: number | null
          title?: string | null
          xp?: number
        }
        Update: {
          description?: string | null
          id?: string
          image?: string | null
          level?: number
          reqpal_achievement_id?: string | null
          threshold?: number | null
          title?: string | null
          xp?: number
        }
        Relationships: [
          {
            foreignKeyName: "reqpal_achievement_levels_reqpal_achievement_id_fkey"
            columns: ["reqpal_achievement_id"]
            isOneToOne: false
            referencedRelation: "reqpal_achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      reqpal_achievements: {
        Row: {
          created_at: string
          description: string | null
          id: string
          target_field: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          target_field?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          target_field?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reqpal_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      requirements: {
        Row: {
          catalog_id: string
          description: string | null
          label: string
          requirement_id: string
          title: string
        }
        Insert: {
          catalog_id: string
          description?: string | null
          label: string
          requirement_id?: string
          title: string
        }
        Update: {
          catalog_id?: string
          description?: string | null
          label?: string
          requirement_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "requirements_catalog_id_fkey"
            columns: ["catalog_id"]
            isOneToOne: false
            referencedRelation: "catalogs"
            referencedColumns: ["catalog_id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          permission_id: string
          role_id: string
        }
        Insert: {
          permission_id: string
          role_id: string
        }
        Update: {
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          description: string | null
          id: string
          name: string
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      scenario_user_progress: {
        Row: {
          created_at: string
          ended: boolean
          id: string
          lesson_answers: Json | null
          lesson_id: string | null
          scenario_id: string
          started: boolean
          started_version: number
          step: number
          user_id: string
        }
        Insert: {
          created_at?: string
          ended?: boolean
          id?: string
          lesson_answers?: Json | null
          lesson_id?: string | null
          scenario_id?: string
          started?: boolean
          started_version?: number
          step?: number
          user_id?: string
        }
        Update: {
          created_at?: string
          ended?: boolean
          id?: string
          lesson_answers?: Json | null
          lesson_id?: string | null
          scenario_id?: string
          started?: boolean
          started_version?: number
          step?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_scenario_currentLesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "user_scenario_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "scenarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_scenario_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      scenario_user_statistics: {
        Row: {
          achievements: Json | null
          created_at: string
          id: string
          lesson_results: Json | null
          objectives: Json | null
          scenario_user_progress_id: string
          score: number | null
        }
        Insert: {
          achievements?: Json | null
          created_at?: string
          id?: string
          lesson_results?: Json | null
          objectives?: Json | null
          scenario_user_progress_id: string
          score?: number | null
        }
        Update: {
          achievements?: Json | null
          created_at?: string
          id?: string
          lesson_results?: Json | null
          objectives?: Json | null
          scenario_user_progress_id?: string
          score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_scenario_progress_scenario_user_progress_id_fkey"
            columns: ["scenario_user_progress_id"]
            isOneToOne: false
            referencedRelation: "scenario_user_progress"
            referencedColumns: ["id"]
          },
        ]
      }
      scenarios: {
        Row: {
          achievements: string[]
          created_at: string
          deployed: boolean
          description: string | null
          edited: boolean
          id: string
          lessons: number
          locked: boolean
          minLessons: number
          title: string
          user_id: string
          version: number
        }
        Insert: {
          achievements?: string[]
          created_at?: string
          deployed?: boolean
          description?: string | null
          edited?: boolean
          id?: string
          lessons?: number
          locked?: boolean
          minLessons?: number
          title: string
          user_id: string
          version?: number
        }
        Update: {
          achievements?: string[]
          created_at?: string
          deployed?: boolean
          description?: string | null
          edited?: boolean
          id?: string
          lessons?: number
          locked?: boolean
          minLessons?: number
          title?: string
          user_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "scenarios_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_requests: {
        Row: {
          approved: boolean | null
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          approved?: boolean | null
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          approved?: boolean | null
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teacher_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string | null
          amount: number | null
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          achievement_id?: string | null
          amount?: number | null
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          achievement_id?: string | null
          amount?: number | null
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_feedback: {
        Row: {
          created_at: string
          feedback: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          feedback: string
          id?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          feedback?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_levels: {
        Row: {
          created_at: string | null
          id: string
          level: number | null
          max: boolean | null
          objective_id: string | null
          user_id: string | null
          xp: number | null
          xp_threshold: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          level?: number | null
          max?: boolean | null
          objective_id?: string | null
          user_id?: string | null
          xp?: number | null
          xp_threshold?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          level?: number | null
          max?: boolean | null
          objective_id?: string | null
          user_id?: string | null
          xp?: number | null
          xp_threshold?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_levels_objective_id_fkey"
            columns: ["objective_id"]
            isOneToOne: false
            referencedRelation: "objectives"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_levels_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_reqpal_achievements: {
        Row: {
          created_at: string
          id: string
          max: boolean | null
          reqpal_achievement_id: string | null
          reqpal_achievement_level_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          max?: boolean | null
          reqpal_achievement_id?: string | null
          reqpal_achievement_level_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          max?: boolean | null
          reqpal_achievement_id?: string | null
          reqpal_achievement_level_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_reqpal_achievements_reqpal_achievement_id_fkey"
            columns: ["reqpal_achievement_id"]
            isOneToOne: false
            referencedRelation: "reqpal_achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_reqpal_achievements_reqpal_achievement_level_id_fkey"
            columns: ["reqpal_achievement_level_id"]
            isOneToOne: false
            referencedRelation: "reqpal_achievement_levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_reqpal_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_reqpal_levels: {
        Row: {
          created_at: string
          id: string
          level: number | null
          user_id: string | null
          xp: number | null
          xp_threshold: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          level?: number | null
          user_id?: string | null
          xp?: number | null
          xp_threshold?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          level?: number | null
          user_id?: string | null
          xp?: number | null
          xp_threshold?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_reqpal_levels_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_statistics: {
        Row: {
          created_at: string
          id: string
          total_objective_xp: number | null
          total_points: number | null
          total_reqpal_xp: number | null
          total_scenarios: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          total_objective_xp?: number | null
          total_points?: number | null
          total_reqpal_xp?: number | null
          total_scenarios?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          total_objective_xp?: number | null
          total_points?: number | null
          total_reqpal_xp?: number | null
          total_scenarios?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_statistics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      xp_activity_logs: {
        Row: {
          action: string | null
          created_at: string
          id: string
          received_xp: number | null
          user_id: string | null
        }
        Insert: {
          action?: string | null
          created_at?: string
          id?: string
          received_xp?: number | null
          user_id?: string | null
        }
        Update: {
          action?: string | null
          created_at?: string
          id?: string
          received_xp?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "xp_activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_threshold: {
        Args: {
          level: number
        }
        Returns: number
      }
      check_user_role: {
        Args: {
          uid: string
          role: string
        }
        Returns: boolean
      }
      create_lesson_from_json: {
        Args: {
          data: Json
        }
        Returns: undefined
      }
      delete_claim: {
        Args: {
          uid: string
          claim: string
        }
        Returns: string
      }
      get_claim: {
        Args: {
          uid: string
          claim: string
        }
        Returns: Json
      }
      get_claims: {
        Args: {
          uid: string
        }
        Returns: Json
      }
      get_lesson_json: {
        Args: {
          p_lesson_uuid: string
        }
        Returns: Json
      }
      get_my_claim: {
        Args: {
          claim: string
        }
        Returns: Json
      }
      get_my_claims: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_szenario_statistics: {
        Args: {
          szenario_ids: string[]
        }
        Returns: Json
      }
      get_teacher_uuid: {
        Args: {
          user_uuid: string
        }
        Returns: string
      }
      is_claims_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      remove_product_from_catalog: {
        Args: {
          productid: string
          catalogid: string
        }
        Returns: undefined
      }
      reverse_boolean_value: {
        Args: {
          table_name: string
          boolean_column_name: string
          id_column_name: string
          row_id: string
        }
        Returns: undefined
      }
      role_has_permission: {
        Args: {
          role: string
          permission: number
        }
        Returns: boolean
      }
      set_claim: {
        Args: {
          uid: string
          claim: string
          value: Json
        }
        Returns: string
      }
      update_user_permissions: {
        Args: {
          uid: string
        }
        Returns: undefined
      }
      upload_catalog_to_database: {
        Args: {
          p_catalog_name: string
          p_products: Json
          p_requirements: Json
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
