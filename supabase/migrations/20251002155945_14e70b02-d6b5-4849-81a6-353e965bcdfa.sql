-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('super_admin', 'manager', 'intern', 'blocked');
CREATE TYPE property_status AS ENUM ('published', 'no_ads', 'deleted', 'sold');
CREATE TYPE deal_type AS ENUM ('sale', 'rent', 'exchange');
CREATE TYPE property_category AS ENUM ('apartment', 'house', 'commercial', 'land', 'garage');
CREATE TYPE viewing_status AS ENUM ('scheduled', 'completed', 'cancelled', 'rescheduled');
CREATE TYPE deal_status AS ENUM ('pending', 'confirmed', 'rejected', 'completed');
CREATE TYPE action_type AS ENUM ('create', 'update', 'delete', 'login', 'logout', 'view_contacts', 'assign_show', 'change_status');

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'intern',
  phone TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'Asia/Bishkek'),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'Asia/Bishkek')
);

-- Properties table (27 fields from PRD)
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_number SERIAL UNIQUE NOT NULL,
  
  -- Owner info
  created_by UUID NOT NULL REFERENCES profiles(id),
  owner_name TEXT NOT NULL,
  owner_contacts TEXT NOT NULL, -- Protected field
  
  -- Categorization
  deal_type deal_type NOT NULL,
  category property_category NOT NULL,
  rooms_count INTEGER,
  
  -- Characteristics
  total_area NUMERIC(10,2),
  land_area NUMERIC(10,2),
  floor INTEGER,
  total_floors INTEGER,
  
  -- Location
  area TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  
  -- Price
  price NUMERIC(12,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_methods TEXT[], -- Multiple values
  
  -- Condition
  condition TEXT,
  documents TEXT[], -- Multiple values
  
  -- Infrastructure
  communications TEXT[], -- Multiple values
  furniture TEXT[], -- Multiple values
  
  -- Description
  description TEXT,
  
  -- Status
  status property_status DEFAULT 'no_ads',
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'Asia/Bishkek'),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'Asia/Bishkek')
);

-- Property photos
CREATE TABLE property_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'Asia/Bishkek')
);

-- Viewings (showings)
CREATE TABLE viewings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  assigned_by UUID NOT NULL REFERENCES profiles(id),
  scheduled_at TIMESTAMPTZ NOT NULL,
  status viewing_status DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'Asia/Bishkek'),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'Asia/Bishkek'),
  
  -- Validation: scheduled_at must be at least 1 hour in the future
  CONSTRAINT viewing_future_check CHECK (scheduled_at > (NOW() AT TIME ZONE 'Asia/Bishkek') + INTERVAL '1 hour')
);

-- Favorites
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  priority TEXT DEFAULT 'medium', -- high, medium, low
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'Asia/Bishkek'),
  UNIQUE(user_id, property_id)
);

-- Deals
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id),
  initiated_by UUID NOT NULL REFERENCES profiles(id),
  confirmed_by UUID REFERENCES profiles(id),
  deal_price NUMERIC(12,2) NOT NULL,
  deal_date DATE NOT NULL,
  commission_amount NUMERIC(12,2),
  payment_method TEXT,
  buyer_name TEXT,
  buyer_contacts TEXT,
  status deal_status DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'Asia/Bishkek'),
  confirmed_at TIMESTAMPTZ
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL, -- viewing_assigned, deal_request, property_updated, etc.
  related_entity_type TEXT,
  related_entity_id UUID,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'Asia/Bishkek')
);

-- Audit logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  action_type action_type NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'Asia/Bishkek')
);

-- Create indexes for performance
CREATE INDEX idx_properties_created_by ON properties(created_by);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_property_number ON properties(property_number);
CREATE INDEX idx_viewings_property_id ON viewings(property_id);
CREATE INDEX idx_viewings_assigned_by ON viewings(assigned_by);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE viewings ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Super admins can manage all profiles" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
);

-- RLS Policies for properties
CREATE POLICY "Anyone can view published properties" ON properties FOR SELECT USING (
  status = 'published' OR
  status = 'no_ads' OR
  created_by = auth.uid() OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
);

CREATE POLICY "Managers can create properties" ON properties FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('manager', 'super_admin'))
);

CREATE POLICY "Owners and admins can update properties" ON properties FOR UPDATE USING (
  created_by = auth.uid() OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
);

CREATE POLICY "Owners and admins can delete properties" ON properties FOR DELETE USING (
  created_by = auth.uid() OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
);

-- RLS Policies for property_photos
CREATE POLICY "Anyone can view photos of visible properties" ON property_photos FOR SELECT USING (
  EXISTS (SELECT 1 FROM properties WHERE id = property_id AND (status = 'published' OR status = 'no_ads'))
);

CREATE POLICY "Property owners can manage photos" ON property_photos FOR ALL USING (
  EXISTS (SELECT 1 FROM properties WHERE id = property_id AND created_by = auth.uid())
);

-- RLS Policies for viewings
CREATE POLICY "Users can view their viewings" ON viewings FOR SELECT USING (
  assigned_by = auth.uid() OR
  EXISTS (SELECT 1 FROM properties WHERE id = property_id AND created_by = auth.uid()) OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
);

CREATE POLICY "Managers can create viewings" ON viewings FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('manager', 'super_admin'))
);

CREATE POLICY "Users can update their viewings" ON viewings FOR UPDATE USING (
  assigned_by = auth.uid() OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
);

-- RLS Policies for favorites
CREATE POLICY "Users can view own favorites" ON favorites FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can manage own favorites" ON favorites FOR ALL USING (user_id = auth.uid());

-- RLS Policies for deals
CREATE POLICY "Deal participants can view" ON deals FOR SELECT USING (
  initiated_by = auth.uid() OR
  confirmed_by = auth.uid() OR
  EXISTS (SELECT 1 FROM properties WHERE id = property_id AND created_by = auth.uid()) OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
);

CREATE POLICY "Managers can create deals" ON deals FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('manager', 'super_admin'))
);

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "System can create notifications" ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for audit_logs
CREATE POLICY "Super admins can view all logs" ON audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
);
CREATE POLICY "System can create logs" ON audit_logs FOR INSERT WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW() AT TIME ZONE 'Asia/Bishkek';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_viewings_updated_at BEFORE UPDATE ON viewings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();