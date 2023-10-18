export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      catalogs: {
        Row: {
          catalog_id: number
          catalog_name: string | null
          owner_id: string | null
        }
        Insert: {
          catalog_id?: number
          catalog_name?: string | null
          owner_id?: string | null
        }
        Update: {
          catalog_id?: number
          catalog_name?: string | null
          owner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "catalogs_owner_id_fkey"
            columns: ["owner_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      lesson_requirements: {
        Row: {
          lesson_id: number
          lesson_requirement_id: number
          requirement_id: number | null
        }
        Insert: {
          lesson_id: number
          lesson_requirement_id?: number
          requirement_id?: number | null
        }
        Update: {
          lesson_id?: number
          lesson_requirement_id?: number
          requirement_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_requirements_lesson_id_fkey"
            columns: ["lesson_id"]
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_requirements_requirement_id_fkey"
            columns: ["requirement_id"]
            referencedRelation: "requirements"
            referencedColumns: ["requirement_id"]
          }
        ]
      }
      lessons: {
        Row: {
          description: string
          id: number
          points: number
          published: boolean
          teacher_id: string
          title: string
        }
        Insert: {
          description: string
          id?: number
          points: number
          published?: boolean
          teacher_id: string
          title: string
        }
        Update: {
          description?: string
          id?: number
          points?: number
          published?: boolean
          teacher_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_teacher_id_fkey"
            columns: ["teacher_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
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
      product_requirements: {
        Row: {
          comment: string | null
          product_id: number | null
          product_requirement_id: number
          qualification: string | null
          requirement_id: number | null
        }
        Insert: {
          comment?: string | null
          product_id?: number | null
          product_requirement_id?: number
          qualification?: string | null
          requirement_id?: number | null
        }
        Update: {
          comment?: string | null
          product_id?: number | null
          product_requirement_id?: number
          qualification?: string | null
          requirement_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "productrequirements_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "productrequirements_requirement_id_fkey"
            columns: ["requirement_id"]
            referencedRelation: "requirements"
            referencedColumns: ["requirement_id"]
          }
        ]
      }
      products: {
        Row: {
          product_id: number
          product_name: string | null
        }
        Insert: {
          product_id?: number
          product_name?: string | null
        }
        Update: {
          product_id?: number
          product_name?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          username: string | null
        }
        Insert: {
          id: string
          username?: string | null
        }
        Update: {
          id?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      questions: {
        Row: {
          hint: string | null
          id: number
          lesson_id: number
          options: Json | null
          position: number
          question: string | null
          question_type: string
          solution: Json | null
        }
        Insert: {
          hint?: string | null
          id?: number
          lesson_id: number
          options?: Json | null
          position: number
          question?: string | null
          question_type: string
          solution?: Json | null
        }
        Update: {
          hint?: string | null
          id?: number
          lesson_id?: number
          options?: Json | null
          position?: number
          question?: string | null
          question_type?: string
          solution?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_lesson_id_fkey"
            columns: ["lesson_id"]
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          }
        ]
      }
      requirements: {
        Row: {
          catalog_id: number | null
          description: string | null
          reqid: string | null
          requirement_id: number
          title: string | null
        }
        Insert: {
          catalog_id?: number | null
          description?: string | null
          reqid?: string | null
          requirement_id?: number
          title?: string | null
        }
        Update: {
          catalog_id?: number | null
          description?: string | null
          reqid?: string | null
          requirement_id?: number
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "requirements_catalog_id_fkey"
            columns: ["catalog_id"]
            referencedRelation: "catalogs"
            referencedColumns: ["catalog_id"]
          }
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
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            referencedRelation: "roles"
            referencedColumns: ["id"]
          }
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
      user_points: {
        Row: {
          id: number
          points: number | null
          user_id: string | null
        }
        Insert: {
          id?: number
          points?: number | null
          user_id?: string | null
        }
        Update: {
          id?: number
          points?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_points_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_user_score_mc: {
        Args: {
          question_id: number
          user_results: Json
          id_user: string
        }
        Returns: number
      }
      calculate_user_score_true_false: {
        Args: {
          question_id: number
          user_result: boolean
          id_user: string
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
      is_claims_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      json_cmp: {
        Args: {
          left: Json
          right: Json
        }
        Returns: number
      }
      mc_compare_solution: {
        Args: {
          question_id: number
          answer_json: Json
        }
        Returns: Json
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
      sortable_compare_solution: {
        Args: {
          question_id: number
          answer_json: Json
        }
        Returns: Json
      }
      true_false_compare_solution: {
        Args: {
          question_id: number
          user_result: boolean
        }
        Returns: Json
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
