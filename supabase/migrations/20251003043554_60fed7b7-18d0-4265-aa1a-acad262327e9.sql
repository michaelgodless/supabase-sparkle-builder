-- CRITICAL SECURITY FIX: Move roles to separate table (Fixed order)

-- Step 1: Create enum for roles
CREATE TYPE public.app_role AS ENUM ('super_admin', 'manager', 'intern', 'blocked');

-- Step 2: Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'Asia/Bishkek'),
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Step 3: Create security definer functions to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.has_any_role(_user_id UUID, _roles app_role[])
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = ANY(_roles)
  )
$$;

-- Step 4: Migrate existing roles from profiles to user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, role::text::app_role
FROM public.profiles
WHERE role IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 5: Drop ALL old policies that depend on profiles.role
DROP POLICY IF EXISTS "Super admins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view published properties" ON public.properties;
DROP POLICY IF EXISTS "Managers can create properties" ON public.properties;
DROP POLICY IF EXISTS "Owners and admins can update properties" ON public.properties;
DROP POLICY IF EXISTS "Owners and admins can delete properties" ON public.properties;
DROP POLICY IF EXISTS "Users can view their viewings" ON public.viewings;
DROP POLICY IF EXISTS "Managers can create viewings" ON public.viewings;
DROP POLICY IF EXISTS "Users can update their viewings" ON public.viewings;
DROP POLICY IF EXISTS "Deal participants can view" ON public.deals;
DROP POLICY IF EXISTS "Managers can create deals" ON public.deals;
DROP POLICY IF EXISTS "Super admins can view all logs" ON public.audit_logs;

-- Step 6: Now we can safely drop the role column
ALTER TABLE public.profiles DROP COLUMN role;

-- Step 7: Create RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Super admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));

-- Step 8: Recreate all policies using new role system

-- Properties policies
CREATE POLICY "Managers can create properties"
ON public.properties
FOR INSERT
TO authenticated
WITH CHECK (public.has_any_role(auth.uid(), ARRAY['manager', 'super_admin']::app_role[]));

CREATE POLICY "Anyone can view published properties"
ON public.properties
FOR SELECT
TO authenticated
USING (
  status IN ('published', 'no_ads') 
  OR created_by = auth.uid() 
  OR public.has_role(auth.uid(), 'super_admin')
);

CREATE POLICY "Owners and admins can update properties"
ON public.properties
FOR UPDATE
TO authenticated
USING (
  created_by = auth.uid() 
  OR public.has_role(auth.uid(), 'super_admin')
);

CREATE POLICY "Owners and admins can delete properties"
ON public.properties
FOR DELETE
TO authenticated
USING (
  created_by = auth.uid() 
  OR public.has_role(auth.uid(), 'super_admin')
);

-- Viewings policies
CREATE POLICY "Managers can create viewings"
ON public.viewings
FOR INSERT
TO authenticated
WITH CHECK (public.has_any_role(auth.uid(), ARRAY['manager', 'super_admin']::app_role[]));

CREATE POLICY "Users can view their viewings"
ON public.viewings
FOR SELECT
TO authenticated
USING (
  assigned_by = auth.uid() 
  OR EXISTS (
    SELECT 1 FROM public.properties 
    WHERE properties.id = viewings.property_id 
    AND properties.created_by = auth.uid()
  )
  OR public.has_role(auth.uid(), 'super_admin')
);

CREATE POLICY "Users can update their viewings"
ON public.viewings
FOR UPDATE
TO authenticated
USING (
  assigned_by = auth.uid() 
  OR public.has_role(auth.uid(), 'super_admin')
);

-- Deals policies
CREATE POLICY "Managers can create deals"
ON public.deals
FOR INSERT
TO authenticated
WITH CHECK (public.has_any_role(auth.uid(), ARRAY['manager', 'super_admin']::app_role[]));

CREATE POLICY "Deal participants can view"
ON public.deals
FOR SELECT
TO authenticated
USING (
  initiated_by = auth.uid() 
  OR confirmed_by = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.properties 
    WHERE properties.id = deals.property_id 
    AND properties.created_by = auth.uid()
  )
  OR public.has_role(auth.uid(), 'super_admin')
);

-- Profiles policies
CREATE POLICY "Super admins can manage all profiles"
ON public.profiles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));

-- Audit logs policies
CREATE POLICY "Super admins can view all logs"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));