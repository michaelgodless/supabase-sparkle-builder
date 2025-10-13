-- Drop existing policies for property_collaborators
DROP POLICY IF EXISTS "Property owners and collaborators can view collaborators" ON public.property_collaborators;
DROP POLICY IF EXISTS "Property owners can manage collaborators" ON public.property_collaborators;

-- Create a function to check if user is property owner or super admin
CREATE OR REPLACE FUNCTION public.is_property_owner_or_admin(_user_id uuid, _property_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.properties
    WHERE id = _property_id
      AND (created_by = _user_id OR public.has_role(_user_id, 'super_admin'))
  )
$$;

-- Recreate policies using the new function
CREATE POLICY "Property owners can view collaborators"
ON public.property_collaborators
FOR SELECT
USING (
  public.is_property_owner_or_admin(auth.uid(), property_id)
  OR user_id = auth.uid()
);

CREATE POLICY "Property owners can manage collaborators"
ON public.property_collaborators
FOR ALL
USING (
  public.is_property_owner_or_admin(auth.uid(), property_id)
);

-- Update the properties SELECT policy to properly include collaborators
DROP POLICY IF EXISTS "Owners, collaborators and managers can view private properties" ON public.properties;

CREATE POLICY "Owners, collaborators and managers can view private properties"
ON public.properties
FOR SELECT
USING (
  status = 'no_ads'::property_status
  AND (
    created_by = auth.uid()
    OR has_any_role(auth.uid(), ARRAY['manager'::app_role, 'super_admin'::app_role])
    OR public.is_property_collaborator(auth.uid(), id)
  )
);