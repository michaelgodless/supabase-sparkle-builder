export type AppRole = 'super_admin' | 'manager' | 'intern' | 'blocked';
export type PropertyStatus = 'published' | 'no_ads' | 'deleted' | 'sold';
export type DealType = 'sale' | 'rent' | 'exchange';
export type PropertyCategory = 'apartment' | 'house' | 'commercial' | 'land' | 'garage';
export type ViewingStatus = 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
export type DealStatus = 'pending' | 'confirmed' | 'rejected' | 'completed';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'super_admin' | 'manager' | 'intern' | 'blocked';
  created_at: string;
}

export interface Property {
  id: string;
  property_number: number;
  created_by: string;
  owner_name: string;
  owner_contacts: string;
  
  // Новая структура с использованием справочников
  property_action_category_id?: string;
  property_category_id?: string;
  property_subcategory_id?: string;
  property_rooms?: string;
  property_size?: number;
  property_lot_size?: number;
  property_area_id?: string;
  property_proposal_id?: string;
  property_condition_id?: string;
  property_status_id?: string;
  is_demo?: boolean;
  
  // Старые поля для обратной совместимости
  deal_type?: DealType;
  category?: PropertyCategory;
  rooms_count?: number;
  total_area?: number;
  land_area?: number;
  area?: string;
  
  // Общие поля
  floor?: number;
  total_floors?: number;
  address: string;
  latitude?: number;
  longitude?: number;
  price: number;
  currency: string;
  payment_methods?: string[];
  condition?: string;
  documents?: string[];
  communications?: string[];
  furniture?: string[];
  description?: string;
  status: PropertyStatus;
  created_at: string;
  updated_at: string;
}

export interface PropertyPhoto {
  id: string;
  property_id: string;
  photo_url: string;
  display_order: number;
  created_at: string;
}

export interface Viewing {
  id: string;
  property_id: string;
  assigned_by: string;
  scheduled_at: string;
  status: ViewingStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  property_id: string;
  priority: 'high' | 'medium' | 'low';
  notes?: string;
  created_at: string;
}

export interface Deal {
  id: string;
  property_id: string;
  initiated_by: string;
  confirmed_by?: string;
  deal_price: number;
  deal_date: string;
  commission_amount?: number;
  payment_method?: string;
  buyer_name?: string;
  buyer_contacts?: string;
  status: DealStatus;
  notes?: string;
  created_at: string;
  confirmed_at?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  related_entity_type?: string;
  related_entity_id?: string;
  is_read: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  action_type: string;
  entity_type: string;
  entity_id?: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  created_at: string;
}
