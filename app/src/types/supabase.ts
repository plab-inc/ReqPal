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
        Relationships: []
      }
      lessons: {
        Row: {
          created_at: string
          description: string
          example: boolean
          points: number | null
          published: boolean
          title: string
          user_id: string
          uuid: string
        }
        Insert: {
          created_at?: string
          description: string
          example?: boolean
          points?: number | null
          published?: boolean
          title: string
          user_id: string
          uuid?: string
        }
        Update: {
          created_at?: string
          description?: string
          example?: boolean
          points?: number | null
          published?: boolean
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
      permissions: {
        Row: {
          description: string | null
          id: number
          name: string
        }
        Insert: {
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          description?: string | null
          id?: number
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
          qualification: string | null
          requirement_id: string
        }
        Insert: {
          comment?: string | null
          product_id: string
          product_requirement_id?: string
          qualification?: string | null
          requirement_id: string
        }
        Update: {
          comment?: string | null
          product_id?: string
          product_requirement_id?: string
          qualification?: string | null
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
          product_id: string
          product_name: string
          product_url: string
        }
        Insert: {
          product_id?: string
          product_name: string
          product_url: string
        }
        Update: {
          product_id?: string
          product_name?: string
          product_url?: string
        }
        Relationships: []
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
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
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
      requirements: {
        Row: {
          catalog_id: string
          description: string | null
          reqid: string | null
          requirement_id: string
          title: string | null
        }
        Insert: {
          catalog_id: string
          description?: string | null
          reqid?: string | null
          requirement_id?: string
          title?: string | null
        }
        Update: {
          catalog_id?: string
          description?: string | null
          reqid?: string | null
          requirement_id?: string
          title?: string | null
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
          permission_id: number
          role_id: number
        }
        Insert: {
          permission_id: number
          role_id: number
        }
        Update: {
          permission_id?: number
          role_id?: number
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
          id: number
          name: string
        }
        Insert: {
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      user_answers: {
        Row: {
          answer: Json | null
          lesson_id: string
          max_points: number | null
          question_id: string
          result: Json | null
          user_id: string
          uuid: string
        }
        Insert: {
          answer?: Json | null
          lesson_id: string
          max_points?: number | null
          question_id: string
          result?: Json | null
          user_id: string
          uuid?: string
        }
        Update: {
          answer?: Json | null
          lesson_id?: string
          max_points?: number | null
          question_id?: string
          result?: Json | null
          user_id?: string
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_answers_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "user_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "user_answers_user_id_fkey"
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
          id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          feedback: string
          id?: number
          user_id?: string
        }
        Update: {
          created_at?: string
          feedback?: string
          id?: number
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
      user_finished_lessons: {
        Row: {
          finished: boolean | null
          finished_for_first_time: boolean | null
          id: string
          is_started: boolean | null
          lesson_id: string
          used_hints: number | null
          user_id: string
          user_points: number | null
        }
        Insert: {
          finished?: boolean | null
          finished_for_first_time?: boolean | null
          id?: string
          is_started?: boolean | null
          lesson_id: string
          used_hints?: number | null
          user_id: string
          user_points?: number | null
        }
        Update: {
          finished?: boolean | null
          finished_for_first_time?: boolean | null
          id?: string
          is_started?: boolean | null
          lesson_id?: string
          used_hints?: number | null
          user_id?: string
          user_points?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_finished_lessons_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "user_finished_lessons_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_hints: {
        Row: {
          id: string
          lesson_id: string
          question_id: string
          user_id: string
        }
        Insert: {
          id?: string
          lesson_id: string
          question_id: string
          user_id: string
        }
        Update: {
          id?: string
          lesson_id?: string
          question_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_hints_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "user_hints_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "user_hints_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_lesson_progress: {
        Row: {
          answers: Json | null
          id: string
          lesson_id: string
          user_id: string
        }
        Insert: {
          answers?: Json | null
          id?: string
          lesson_id: string
          user_id: string
        }
        Update: {
          answers?: Json | null
          id?: string
          lesson_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["uuid"]
          },
          {
            foreignKeyName: "user_lesson_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_points: {
        Row: {
          id: number
          points: number
          user_id: string
        }
        Insert: {
          id?: number
          points?: number
          user_id: string
        }
        Update: {
          id?: number
          points?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_points_user_id_fkey"
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
      create_user_answers_from_json: {
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
      evaluate_multiple_choice: {
        Args: {
          question_id: string
          answer: Json
        }
        Returns: Json
      }
      evaluate_product_qualification: {
        Args: {
          question_id: string
          answer: Json
        }
        Returns: Json
      }
      evaluate_slider: {
        Args: {
          question_id: string
          answer: Json
        }
        Returns: Json
      }
      evaluate_true_or_false: {
        Args: {
          question_id: string
          answer: Json
        }
        Returns: Json
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
      reverse_boolean_value: {
        Args: {
          row_uuid: string
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
