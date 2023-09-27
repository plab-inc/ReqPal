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
        }
        Insert: {
          catalog_id?: number
          catalog_name?: string | null
        }
        Update: {
          catalog_id?: number
          catalog_name?: string | null
        }
        Relationships: []
      }
      lessons: {
        Row: {
          description: string | null
          id: number
          title: string | null
        }
        Insert: {
          description?: string | null
          id?: number
          title?: string | null
        }
        Update: {
          description?: string | null
          id?: number
          title?: string | null
        }
        Relationships: []
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
          role: number | null
          username: string | null
        }
        Insert: {
          id: string
          role?: number | null
          username?: string | null
        }
        Update: {
          id?: string
          role?: number | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_role_fkey"
            columns: ["role"]
            referencedRelation: "roles"
            referencedColumns: ["id"]
          }
        ]
      }
      questions: {
        Row: {
          answers: Json | null
          description: string | null
          id: number
          lesson_id: number | null
          points: number | null
          question_type: Database["public"]["Enums"]["question_type"] | null
        }
        Insert: {
          answers?: Json | null
          description?: string | null
          id?: number
          lesson_id?: number | null
          points?: number | null
          question_type?: Database["public"]["Enums"]["question_type"] | null
        }
        Update: {
          answers?: Json | null
          description?: string | null
          id?: number
          lesson_id?: number | null
          points?: number | null
          question_type?: Database["public"]["Enums"]["question_type"] | null
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
    }
    Enums: {
      question_type:
        | "MultipleChoice"
        | "DragAndDrop"
        | "Sortable"
        | "TrueOrFalse"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
