export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          center_id: string | null
          created_at: string | null
          event_id: string | null
          id: string
          qr_code: string | null
          status: string | null
          time_slot: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          appointment_date: string
          center_id?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          qr_code?: string | null
          status?: string | null
          time_slot: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          appointment_date?: string
          center_id?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          qr_code?: string | null
          status?: string | null
          time_slot?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_center_id_fkey"
            columns: ["center_id"]
            isOneToOne: false
            referencedRelation: "donation_centers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      donation_centers: {
        Row: {
          address: string
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          operating_hours: Json | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          operating_hours?: Json | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          operating_hours?: Json | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      donation_records: {
        Row: {
          appointment_id: string | null
          blood_type: string | null
          blood_volume: number | null
          center_id: string | null
          created_at: string | null
          deferral_reason: string | null
          deferral_until: string | null
          donation_date: string
          hemoglobin_level: number | null
          id: string
          medical_notes: string | null
          screening_result: string | null
          user_id: string | null
        }
        Insert: {
          appointment_id?: string | null
          blood_type?: string | null
          blood_volume?: number | null
          center_id?: string | null
          created_at?: string | null
          deferral_reason?: string | null
          deferral_until?: string | null
          donation_date: string
          hemoglobin_level?: number | null
          id?: string
          medical_notes?: string | null
          screening_result?: string | null
          user_id?: string | null
        }
        Update: {
          appointment_id?: string | null
          blood_type?: string | null
          blood_volume?: number | null
          center_id?: string | null
          created_at?: string | null
          deferral_reason?: string | null
          deferral_until?: string | null
          donation_date?: string
          hemoglobin_level?: number | null
          id?: string
          medical_notes?: string | null
          screening_result?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donation_records_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donation_records_center_id_fkey"
            columns: ["center_id"]
            isOneToOne: false
            referencedRelation: "donation_centers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donation_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          blood_types_needed: string[] | null
          center_id: string | null
          created_at: string | null
          current_registrations: number | null
          description: string | null
          end_date: string
          id: string
          max_capacity: number | null
          start_date: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          blood_types_needed?: string[] | null
          center_id?: string | null
          created_at?: string | null
          current_registrations?: number | null
          description?: string | null
          end_date: string
          id?: string
          max_capacity?: number | null
          start_date: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          blood_types_needed?: string[] | null
          center_id?: string | null
          created_at?: string | null
          current_registrations?: number | null
          description?: string | null
          end_date?: string
          id?: string
          max_capacity?: number | null
          start_date?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_center_id_fkey"
            columns: ["center_id"]
            isOneToOne: false
            referencedRelation: "donation_centers"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          answer: string
          category: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          order_index: number | null
          question: string
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          question: string
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          question?: string
        }
        Relationships: []
      }
      galleries: {
        Row: {
          cover_image: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          title: string
        }
        Insert: {
          cover_image?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id: string
          title: string
        }
        Update: {
          cover_image?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "galleries_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_images: {
        Row: {
          caption: string | null
          gallery_id: string | null
          id: string
          uploaded_at: string | null
          uploaded_by: string | null
          url: string
        }
        Insert: {
          caption?: string | null
          gallery_id?: string | null
          id?: string
          uploaded_at?: string | null
          uploaded_by?: string | null
          url: string
        }
        Update: {
          caption?: string | null
          gallery_id?: string | null
          id?: string
          uploaded_at?: string | null
          uploaded_by?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_images_gallery_id_fkey"
            columns: ["gallery_id"]
            isOneToOne: false
            referencedRelation: "galleries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_images_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      health_declarations: {
        Row: {
          answers: Json
          appointment_id: string | null
          created_at: string | null
          id: string
          is_eligible: boolean | null
          medical_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          user_id: string | null
        }
        Insert: {
          answers: Json
          appointment_id?: string | null
          created_at?: string | null
          id?: string
          is_eligible?: boolean | null
          medical_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          user_id?: string | null
        }
        Update: {
          answers?: Json
          appointment_id?: string | null
          created_at?: string | null
          id?: string
          is_eligible?: boolean | null
          medical_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "health_declarations_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_declarations_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_declarations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      news_articles: {
        Row: {
          author_id: string | null
          category: string | null
          content: string
          created_at: string | null
          excerpt: string | null
          id: string
          image_url: string | null
          published_at: string | null
          status: string | null
          title: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          published_at?: string | null
          status?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          published_at?: string | null
          status?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "news_articles_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          id: string
          is_read: boolean | null
          message: string
          sent_at: string | null
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          is_read?: boolean | null
          message: string
          sent_at?: string | null
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          is_read?: boolean | null
          message?: string
          sent_at?: string | null
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          blood_type: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          emergency_contact: string | null
          full_name: string | null
          gender: string | null
          id: string
          is_active: boolean | null
          last_donation_date: string | null
          phone_number: string | null
          preferences: Json | null
          primary_role: string | null
          total_donations: number | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          blood_type?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact?: string | null
          full_name?: string | null
          gender?: string | null
          id: string
          is_active?: boolean | null
          last_donation_date?: string | null
          phone_number?: string | null
          preferences?: Json | null
          primary_role?: string | null
          total_donations?: number | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          blood_type?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          is_active?: boolean | null
          last_donation_date?: string | null
          phone_number?: string | null
          preferences?: Json | null
          primary_role?: string | null
          total_donations?: number | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_admin_access: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_center_staff: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_medical_professional: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_system_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
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
