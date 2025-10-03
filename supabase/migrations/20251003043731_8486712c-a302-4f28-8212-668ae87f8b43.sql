-- Complete the role security fix (app_role and user_roles already exist)

-- Step 1: Drop ALL old policies that depend on profiles.role
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

-- Step 2: Now we can safely drop the role column
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;

-- Step 3: Recreate all policies using the new role system (has_role and has_any_role functions already exist)

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