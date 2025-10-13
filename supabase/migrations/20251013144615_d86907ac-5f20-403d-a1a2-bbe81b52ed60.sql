-- Create security definer function to check if user is a collaborator
CREATE OR REPLACE FUNCTION public.is_property_collaborator(_user_id uuid, _property_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.property_collaborators
    WHERE property_id = _property_id
      AND user_id = _user_id
  )
$$;

-- Drop and recreate policies without recursion

-- Properties DELETE policy
DROP POLICY IF EXISTS "Owners, collaborators and admins can delete properties" ON public.properties;
CREATE POLICY "Owners, collaborators and admins can delete properties"
ON public.properties
FOR DELETE
USING (
  created_by = auth.uid()
  OR has_role(auth.uid(), 'super_admin'::app_role)
  OR is_property_collaborator(auth.uid(), id)
);

-- Properties UPDATE policy
DROP POLICY IF EXISTS "Owners, collaborators and managers can update properties" ON public.properties;
CREATE POLICY "Owners, collaborators and managers can update properties"
ON public.properties
FOR UPDATE
USING (
  created_by = auth.uid()
  OR has_any_role(auth.uid(), ARRAY['manager'::app_role, 'super_admin'::app_role])
  OR is_property_collaborator(auth.uid(), id)
);

-- Properties SELECT policy for private properties
DROP POLICY IF EXISTS "Owners, collaborators and managers can view private properties" ON public.properties;
CREATE POLICY "Owners, collaborators and managers can view private properties"
ON public.properties
FOR SELECT
USING (
  status = 'no_ads'::property_status
  AND (
    created_by = auth.uid()
    OR has_any_role(auth.uid(), ARRAY['manager'::app_role, 'super_admin'::app_role])
    OR is_property_collaborator(auth.uid(), id)
  )
);

-- Update property_photos policy
DROP POLICY IF EXISTS "Property owners and collaborators can manage photos" ON public.property_photos;
CREATE POLICY "Property owners and collaborators can manage photos"
ON public.property_photos
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.properties
    WHERE properties.id = property_photos.property_id
    AND (
      properties.created_by = auth.uid()
      OR is_property_collaborator(auth.uid(), properties.id)
    )
  )
);