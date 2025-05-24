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
      analysis_sessions: {
        Row: {
          agent_name: string
          code_snippet: string
          created_at: string
          file_name: string
          id: string
          result: string
          session_id: string
        }
        Insert: {
          agent_name: string
          code_snippet: string
          created_at?: string
          file_name: string
          id?: string
          result: string
          session_id: string
        }
        Update: {
          agent_name?: string
          code_snippet?: string
          created_at?: string
          file_name?: string
          id?: string
          result?: string
          session_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          session_id?: string
        }
        Relationships: []
      }
      chat_sessions: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      custom_prompts: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          is_predefined: boolean | null
          name: string
          prompt: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          is_predefined?: boolean | null
          name: string
          prompt: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          is_predefined?: boolean | null
          name?: string
          prompt?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      locations: {
        Row: {
          address: string | null
          city: string | null
          created_at: string | null
          id: string
          name: string
          state: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          id?: string
          name: string
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          id?: string
          name?: string
          state?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      melhorias_ajustes: {
        Row: {
          anexo_url: string | null
          categoria: string
          data_atualizacao: string
          data_solicitacao: string
          descricao: string
          id: string
          imagem_url: string | null
          status: string
          titulo: string
          urgencia: string
          usuario_id: string | null
        }
        Insert: {
          anexo_url?: string | null
          categoria: string
          data_atualizacao?: string
          data_solicitacao?: string
          descricao: string
          id?: string
          imagem_url?: string | null
          status?: string
          titulo: string
          urgencia: string
          usuario_id?: string | null
        }
        Update: {
          anexo_url?: string | null
          categoria?: string
          data_atualizacao?: string
          data_solicitacao?: string
          descricao?: string
          id?: string
          imagem_url?: string | null
          status?: string
          titulo?: string
          urgencia?: string
          usuario_id?: string | null
        }
        Relationships: []
      }
      melhorias_comentarios: {
        Row: {
          conteudo: string
          data_criacao: string
          id: string
          is_admin: boolean
          melhoria_id: string
          usuario_id: string | null
        }
        Insert: {
          conteudo: string
          data_criacao?: string
          id?: string
          is_admin?: boolean
          melhoria_id: string
          usuario_id?: string | null
        }
        Update: {
          conteudo?: string
          data_criacao?: string
          id?: string
          is_admin?: boolean
          melhoria_id?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "melhorias_comentarios_melhoria_id_fkey"
            columns: ["melhoria_id"]
            isOneToOne: false
            referencedRelation: "melhorias_ajustes"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      processed_files: {
        Row: {
          created_at: string
          file_name: string
          id: string
          processed_at: string
          receipt_id: string | null
        }
        Insert: {
          created_at?: string
          file_name: string
          id?: string
          processed_at?: string
          receipt_id?: string | null
        }
        Update: {
          created_at?: string
          file_name?: string
          id?: string
          processed_at?: string
          receipt_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "processed_files_receipt_id_fkey"
            columns: ["receipt_id"]
            isOneToOne: false
            referencedRelation: "receipts"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_permissions: {
        Row: {
          created_at: string
          id: string
          permission_id: string
          profile_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          permission_id: string
          profile_id: string
        }
        Update: {
          created_at?: string
          id?: string
          permission_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_permissions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_active: boolean
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_profile_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_profile_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_profile_id_fkey"
            columns: ["user_profile_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      receipts: {
        Row: {
          additional_value: number | null
          city_state: string | null
          company_address: string | null
          company_document: string | null
          company_name: string | null
          discount_value: number | null
          document_date: string | null
          email: string | null
          id: string
          image_url: string | null
          item_count: number | null
          notes: string | null
          ocr_text: string | null
          payment_method: string | null
          payment_status: string | null
          pix_key: string | null
          processed_at: string
          receipt_number: string | null
          responsible: string | null
          return_amount: number | null
          service_total: number | null
          service_type: string | null
          supplier_address: string | null
          supplier_document: string | null
          supplier_name: string | null
          total_amount: number | null
          total_volume: number | null
          total_weight: number | null
          unit: string | null
          unit_price: number | null
          user_id: string | null
          vehicle_plate: string | null
        }
        Insert: {
          additional_value?: number | null
          city_state?: string | null
          company_address?: string | null
          company_document?: string | null
          company_name?: string | null
          discount_value?: number | null
          document_date?: string | null
          email?: string | null
          id?: string
          image_url?: string | null
          item_count?: number | null
          notes?: string | null
          ocr_text?: string | null
          payment_method?: string | null
          payment_status?: string | null
          pix_key?: string | null
          processed_at?: string
          receipt_number?: string | null
          responsible?: string | null
          return_amount?: number | null
          service_total?: number | null
          service_type?: string | null
          supplier_address?: string | null
          supplier_document?: string | null
          supplier_name?: string | null
          total_amount?: number | null
          total_volume?: number | null
          total_weight?: number | null
          unit?: string | null
          unit_price?: number | null
          user_id?: string | null
          vehicle_plate?: string | null
        }
        Update: {
          additional_value?: number | null
          city_state?: string | null
          company_address?: string | null
          company_document?: string | null
          company_name?: string | null
          discount_value?: number | null
          document_date?: string | null
          email?: string | null
          id?: string
          image_url?: string | null
          item_count?: number | null
          notes?: string | null
          ocr_text?: string | null
          payment_method?: string | null
          payment_status?: string | null
          pix_key?: string | null
          processed_at?: string
          receipt_number?: string | null
          responsible?: string | null
          return_amount?: number | null
          service_total?: number | null
          service_type?: string | null
          supplier_address?: string | null
          supplier_document?: string | null
          supplier_name?: string | null
          total_amount?: number | null
          total_volume?: number | null
          total_weight?: number | null
          unit?: string | null
          unit_price?: number | null
          user_id?: string | null
          vehicle_plate?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          price?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          city: string | null
          contact: string | null
          created_at: string | null
          document: string
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          city?: string | null
          contact?: string | null
          created_at?: string | null
          document: string
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          city?: string | null
          contact?: string | null
          created_at?: string | null
          document?: string
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      system_files: {
        Row: {
          content: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category: string | null
          created_at: string
          description: string
          id: string
          transaction_date: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string
          description: string
          id?: string
          transaction_date?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string
          description?: string
          id?: string
          transaction_date?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_api_keys: {
        Row: {
          created_at: string | null
          google_vision_key: string | null
          id: string
          openai_key: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          google_vision_key?: string | null
          id?: string
          openai_key?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          google_vision_key?: string | null
          id?: string
          openai_key?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          profile_type: Database["public"]["Enums"]["user_profile_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          profile_type?: Database["public"]["Enums"]["user_profile_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          profile_type?: Database["public"]["Enums"]["user_profile_type"]
          updated_at?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          capacity: string | null
          created_at: string | null
          id: string
          plate: string
          supplier: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          capacity?: string | null
          created_at?: string | null
          id?: string
          plate: string
          supplier?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          capacity?: string | null
          created_at?: string | null
          id?: string
          plate?: string
          supplier?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_profile_by_id: {
        Args: { lookup_id: string }
        Returns: {
          id: string
          full_name: string
          email: string
          company: string
        }[]
      }
      has_role: {
        Args: { requested_role: Database["public"]["Enums"]["user_role"] }
        Returns: boolean
      }
      update_user_profile: {
        Args: {
          user_id: string
          full_name_param: string
          email_param: string
          company_param: string
        }
        Returns: undefined
      }
    }
    Enums: {
      user_profile_type: "admin" | "standard" | "operator" | "viewer" | "custom"
      user_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_profile_type: ["admin", "standard", "operator", "viewer", "custom"],
      user_role: ["admin", "user"],
    },
  },
} as const
