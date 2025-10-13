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
      audit_logs: {
        Row: {
          action_type: Database["public"]["Enums"]["action_type"]
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          new_values: Json | null
          old_values: Json | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action_type: Database["public"]["Enums"]["action_type"]
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: Database["public"]["Enums"]["action_type"]
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_types: {
        Row: {
          code: string
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      deals: {
        Row: {
          buyer_contacts: string | null
          buyer_name: string | null
          commission_amount: number | null
          confirmed_at: string | null
          confirmed_by: string | null
          created_at: string
          deal_date: string
          deal_price: number
          id: string
          initiated_by: string
          notes: string | null
          payment_method: string | null
          property_id: string
          status: Database["public"]["Enums"]["deal_status"] | null
        }
        Insert: {
          buyer_contacts?: string | null
          buyer_name?: string | null
          commission_amount?: number | null
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string
          deal_date: string
          deal_price: number
          id?: string
          initiated_by: string
          notes?: string | null
          payment_method?: string | null
          property_id: string
          status?: Database["public"]["Enums"]["deal_status"] | null
        }
        Update: {
          buyer_contacts?: string | null
          buyer_name?: string | null
          commission_amount?: number | null
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string
          deal_date?: string
          deal_price?: number
          id?: string
          initiated_by?: string
          notes?: string | null
          payment_method?: string | null
          property_id?: string
          status?: Database["public"]["Enums"]["deal_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_confirmed_by_fkey"
            columns: ["confirmed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_initiated_by_fkey"
            columns: ["initiated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties_public"
            referencedColumns: ["id"]
          },
        ]
      }
      document_types: {
        Row: {
          code: string
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          priority: string | null
          property_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          priority?: string | null
          property_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          priority?: string | null
          property_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      furniture_types: {
        Row: {
          code: string
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          related_entity_id: string | null
          related_entity_type: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          related_entity_id?: string | null
          related_entity_type?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          related_entity_id?: string | null
          related_entity_type?: string | null
          title?: string
          type?: string
          user_id?: string
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
      payment_types: {
        Row: {
          code: string
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          is_active: boolean | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
          is_active?: boolean | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          communications: string[] | null
          condition: string | null
          created_at: string
          created_by: string
          currency: string | null
          description: string | null
          documents: string[] | null
          furniture: string[] | null
          id: string
          is_demo: boolean | null
          land_area: number | null
          latitude: number | null
          longitude: number | null
          owner_contacts: string
          owner_name: string
          payment_methods: string[] | null
          price: number
          property_action_category_id: string | null
          property_area_id: string | null
          property_area_old: string | null
          property_category_id: string | null
          property_condition_id: string | null
          property_floor_from_old: number | null
          property_floor_old: number | null
          property_lot_size: number | null
          property_number: number
          property_proposal_id: string | null
          property_rooms: string | null
          property_rooms_old: number | null
          property_size: number | null
          property_status_id: string | null
          property_subcategory_id: string | null
          property_total_area_old: number | null
          status: Database["public"]["Enums"]["property_status"] | null
          updated_at: string
        }
        Insert: {
          address: string
          communications?: string[] | null
          condition?: string | null
          created_at?: string
          created_by: string
          currency?: string | null
          description?: string | null
          documents?: string[] | null
          furniture?: string[] | null
          id?: string
          is_demo?: boolean | null
          land_area?: number | null
          latitude?: number | null
          longitude?: number | null
          owner_contacts: string
          owner_name: string
          payment_methods?: string[] | null
          price: number
          property_action_category_id?: string | null
          property_area_id?: string | null
          property_area_old?: string | null
          property_category_id?: string | null
          property_condition_id?: string | null
          property_floor_from_old?: number | null
          property_floor_old?: number | null
          property_lot_size?: number | null
          property_number?: number
          property_proposal_id?: string | null
          property_rooms?: string | null
          property_rooms_old?: number | null
          property_size?: number | null
          property_status_id?: string | null
          property_subcategory_id?: string | null
          property_total_area_old?: number | null
          status?: Database["public"]["Enums"]["property_status"] | null
          updated_at?: string
        }
        Update: {
          address?: string
          communications?: string[] | null
          condition?: string | null
          created_at?: string
          created_by?: string
          currency?: string | null
          description?: string | null
          documents?: string[] | null
          furniture?: string[] | null
          id?: string
          is_demo?: boolean | null
          land_area?: number | null
          latitude?: number | null
          longitude?: number | null
          owner_contacts?: string
          owner_name?: string
          payment_methods?: string[] | null
          price?: number
          property_action_category_id?: string | null
          property_area_id?: string | null
          property_area_old?: string | null
          property_category_id?: string | null
          property_condition_id?: string | null
          property_floor_from_old?: number | null
          property_floor_old?: number | null
          property_lot_size?: number | null
          property_number?: number
          property_proposal_id?: string | null
          property_rooms?: string | null
          property_rooms_old?: number | null
          property_size?: number | null
          property_status_id?: string | null
          property_subcategory_id?: string | null
          property_total_area_old?: number | null
          status?: Database["public"]["Enums"]["property_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_property_action_category_id_fkey"
            columns: ["property_action_category_id"]
            isOneToOne: false
            referencedRelation: "property_action_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_property_area_id_fkey"
            columns: ["property_area_id"]
            isOneToOne: false
            referencedRelation: "property_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_property_category_id_fkey"
            columns: ["property_category_id"]
            isOneToOne: false
            referencedRelation: "property_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_property_condition_id_fkey"
            columns: ["property_condition_id"]
            isOneToOne: false
            referencedRelation: "property_conditions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_property_proposal_id_fkey"
            columns: ["property_proposal_id"]
            isOneToOne: false
            referencedRelation: "property_proposals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_property_status_id_fkey"
            columns: ["property_status_id"]
            isOneToOne: false
            referencedRelation: "property_statuses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_property_subcategory_id_fkey"
            columns: ["property_subcategory_id"]
            isOneToOne: false
            referencedRelation: "property_subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      property_action_categories: {
        Row: {
          code: string
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      property_areas: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          level: number
          name: string
          parent_id: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          level?: number
          name: string
          parent_id?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          level?: number
          name?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_areas_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "property_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      property_categories: {
        Row: {
          code: string
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      property_collaborators: {
        Row: {
          added_by: string
          created_at: string
          id: string
          property_id: string
          user_id: string
        }
        Insert: {
          added_by: string
          created_at?: string
          id?: string
          property_id: string
          user_id: string
        }
        Update: {
          added_by?: string
          created_at?: string
          id?: string
          property_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_collaborators_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_collaborators_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_collaborators_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      property_communication_types: {
        Row: {
          communication_type_id: string
          created_at: string | null
          id: string
          property_id: string
        }
        Insert: {
          communication_type_id: string
          created_at?: string | null
          id?: string
          property_id: string
        }
        Update: {
          communication_type_id?: string
          created_at?: string | null
          id?: string
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_communication_types_communication_type_id_fkey"
            columns: ["communication_type_id"]
            isOneToOne: false
            referencedRelation: "communication_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_communication_types_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_communication_types_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties_public"
            referencedColumns: ["id"]
          },
        ]
      }
      property_conditions: {
        Row: {
          applicable_to: string[]
          code: string
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          applicable_to?: string[]
          code: string
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          applicable_to?: string[]
          code?: string
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      property_document_types: {
        Row: {
          created_at: string | null
          document_type_id: string
          id: string
          property_id: string
        }
        Insert: {
          created_at?: string | null
          document_type_id: string
          id?: string
          property_id: string
        }
        Update: {
          created_at?: string | null
          document_type_id?: string
          id?: string
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_document_types_document_type_id_fkey"
            columns: ["document_type_id"]
            isOneToOne: false
            referencedRelation: "document_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_document_types_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_document_types_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties_public"
            referencedColumns: ["id"]
          },
        ]
      }
      property_furniture_types: {
        Row: {
          created_at: string | null
          furniture_type_id: string
          id: string
          property_id: string
        }
        Insert: {
          created_at?: string | null
          furniture_type_id: string
          id?: string
          property_id: string
        }
        Update: {
          created_at?: string | null
          furniture_type_id?: string
          id?: string
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_furniture_types_furniture_type_id_fkey"
            columns: ["furniture_type_id"]
            isOneToOne: false
            referencedRelation: "furniture_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_furniture_types_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_furniture_types_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties_public"
            referencedColumns: ["id"]
          },
        ]
      }
      property_payment_types: {
        Row: {
          created_at: string | null
          id: string
          payment_type_id: string
          property_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          payment_type_id: string
          property_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          payment_type_id?: string
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_payment_types_payment_type_id_fkey"
            columns: ["payment_type_id"]
            isOneToOne: false
            referencedRelation: "payment_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_payment_types_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_payment_types_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties_public"
            referencedColumns: ["id"]
          },
        ]
      }
      property_photos: {
        Row: {
          created_at: string
          display_order: number
          id: string
          photo_url: string
          property_id: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          photo_url: string
          property_id: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          photo_url?: string
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_photos_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_photos_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties_public"
            referencedColumns: ["id"]
          },
        ]
      }
      property_proposals: {
        Row: {
          code: string
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      property_statuses: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      property_subcategories: {
        Row: {
          category_id: string
          code: string
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          category_id: string
          code: string
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          category_id?: string
          code?: string
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "property_categories"
            referencedColumns: ["id"]
          },
        ]
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
      viewings: {
        Row: {
          assigned_by: string
          created_at: string
          id: string
          notes: string | null
          property_id: string
          scheduled_at: string
          status: Database["public"]["Enums"]["viewing_status"] | null
          updated_at: string
        }
        Insert: {
          assigned_by: string
          created_at?: string
          id?: string
          notes?: string | null
          property_id: string
          scheduled_at: string
          status?: Database["public"]["Enums"]["viewing_status"] | null
          updated_at?: string
        }
        Update: {
          assigned_by?: string
          created_at?: string
          id?: string
          notes?: string | null
          property_id?: string
          scheduled_at?: string
          status?: Database["public"]["Enums"]["viewing_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "viewings_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "viewings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "viewings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties_public"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      properties_public: {
        Row: {
          communications: string[] | null
          condition: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          documents: string[] | null
          furniture: string[] | null
          id: string | null
          land_area: number | null
          payment_methods: string[] | null
          price: number | null
          property_action_category_id: string | null
          property_area_id: string | null
          property_category_id: string | null
          property_condition_id: string | null
          property_lot_size: number | null
          property_number: number | null
          property_proposal_id: string | null
          property_rooms: string | null
          property_size: number | null
          property_status_id: string | null
          property_subcategory_id: string | null
          status: Database["public"]["Enums"]["property_status"] | null
          updated_at: string | null
        }
        Insert: {
          communications?: string[] | null
          condition?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          documents?: string[] | null
          furniture?: string[] | null
          id?: string | null
          land_area?: number | null
          payment_methods?: string[] | null
          price?: number | null
          property_action_category_id?: string | null
          property_area_id?: string | null
          property_category_id?: string | null
          property_condition_id?: string | null
          property_lot_size?: number | null
          property_number?: number | null
          property_proposal_id?: string | null
          property_rooms?: string | null
          property_size?: number | null
          property_status_id?: string | null
          property_subcategory_id?: string | null
          status?: Database["public"]["Enums"]["property_status"] | null
          updated_at?: string | null
        }
        Update: {
          communications?: string[] | null
          condition?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          documents?: string[] | null
          furniture?: string[] | null
          id?: string | null
          land_area?: number | null
          payment_methods?: string[] | null
          price?: number | null
          property_action_category_id?: string | null
          property_area_id?: string | null
          property_category_id?: string | null
          property_condition_id?: string | null
          property_lot_size?: number | null
          property_number?: number | null
          property_proposal_id?: string | null
          property_rooms?: string | null
          property_size?: number | null
          property_status_id?: string | null
          property_subcategory_id?: string | null
          status?: Database["public"]["Enums"]["property_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_property_action_category_id_fkey"
            columns: ["property_action_category_id"]
            isOneToOne: false
            referencedRelation: "property_action_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_property_area_id_fkey"
            columns: ["property_area_id"]
            isOneToOne: false
            referencedRelation: "property_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_property_category_id_fkey"
            columns: ["property_category_id"]
            isOneToOne: false
            referencedRelation: "property_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_property_condition_id_fkey"
            columns: ["property_condition_id"]
            isOneToOne: false
            referencedRelation: "property_conditions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_property_proposal_id_fkey"
            columns: ["property_proposal_id"]
            isOneToOne: false
            referencedRelation: "property_proposals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_property_status_id_fkey"
            columns: ["property_status_id"]
            isOneToOne: false
            referencedRelation: "property_statuses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_property_subcategory_id_fkey"
            columns: ["property_subcategory_id"]
            isOneToOne: false
            referencedRelation: "property_subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      has_any_role: {
        Args: {
          _roles: Database["public"]["Enums"]["app_role"][]
          _user_id: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_property_collaborator: {
        Args: { _property_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      action_type:
        | "create"
        | "update"
        | "delete"
        | "login"
        | "logout"
        | "view_contacts"
        | "assign_show"
        | "change_status"
      app_role: "super_admin" | "manager" | "intern" | "blocked"
      deal_status: "pending" | "confirmed" | "rejected" | "completed"
      deal_type: "sale" | "rent" | "exchange"
      property_category:
        | "apartment"
        | "house"
        | "commercial"
        | "land"
        | "garage"
      property_status: "published" | "no_ads" | "deleted" | "sold"
      user_role: "super_admin" | "manager" | "intern" | "blocked"
      viewing_status: "scheduled" | "completed" | "cancelled" | "rescheduled"
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
      action_type: [
        "create",
        "update",
        "delete",
        "login",
        "logout",
        "view_contacts",
        "assign_show",
        "change_status",
      ],
      app_role: ["super_admin", "manager", "intern", "blocked"],
      deal_status: ["pending", "confirmed", "rejected", "completed"],
      deal_type: ["sale", "rent", "exchange"],
      property_category: ["apartment", "house", "commercial", "land", "garage"],
      property_status: ["published", "no_ads", "deleted", "sold"],
      user_role: ["super_admin", "manager", "intern", "blocked"],
      viewing_status: ["scheduled", "completed", "cancelled", "rescheduled"],
    },
  },
} as const
