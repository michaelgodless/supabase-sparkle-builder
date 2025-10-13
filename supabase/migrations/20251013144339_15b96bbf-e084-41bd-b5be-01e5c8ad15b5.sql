-- Create table for property collaborators (договорники)
CREATE TABLE public.property_collaborators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  added_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT (now() AT TIME ZONE 'Asia/Bishkek'),
  UNIQUE(property_id, user_id)
);

-- Enable RLS
ALTER TABLE public.property_collaborators ENABLE ROW LEVEL SECURITY;

-- Policy: Property owner and collaborators can view collaborators
CREATE POLICY "Property owners and collaborators can view collaborators"
ON public.property_collaborators
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.properties
    WHERE properties.id = property_collaborators.property_id
    AND (
      properties.created_by = auth.uid()
      OR EXISTS (
        SELECT 1 FROM public.property_collaborators pc2
        WHERE pc2.property_id = properties.id
        AND pc2.user_id = auth.uid()
      )
      OR has_role(auth.uid(), 'super_admin'::app_role)
    )
  )
);

-- Policy: Only property owner can add/remove collaborators
CREATE POLICY "Property owners can manage collaborators"
ON public.property_collaborators
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.properties
    WHERE properties.id = property_collaborators.property_id
    AND (properties.created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'::app_role))
  )
);

-- Update properties RLS policies to include collaborators
DROP POLICY IF EXISTS "Owners and admins can delete properties" ON public.properties;
CREATE POLICY "Owners, collaborators and admins can delete properties"
ON public.properties
FOR DELETE
USING (
  created_by = auth.uid()
  OR has_role(auth.uid(), 'super_admin'::app_role)
  OR EXISTS (
    SELECT 1 FROM public.property_collaborators
    WHERE property_collaborators.property_id = properties.id
    AND property_collaborators.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Managers can update properties" ON public.properties;
CREATE POLICY "Owners, collaborators and managers can update properties"
ON public.properties
FOR UPDATE
USING (
  created_by = auth.uid()
  OR has_any_role(auth.uid(), ARRAY['manager'::app_role, 'super_admin'::app_role])
  OR EXISTS (
    SELECT 1 FROM public.property_collaborators
    WHERE property_collaborators.property_id = properties.id
    AND property_collaborators.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Managers can view private properties" ON public.properties;
CREATE POLICY "Owners, collaborators and managers can view private properties"
ON public.properties
FOR SELECT
USING (
  status = 'no_ads'::property_status
  AND (
    created_by = auth.uid()
    OR has_any_role(auth.uid(), ARRAY['manager'::app_role, 'super_admin'::app_role])
    OR EXISTS (
      SELECT 1 FROM public.property_collaborators
      WHERE property_collaborators.property_id = properties.id
      AND property_collaborators.user_id = auth.uid()
    )
  )
);

-- Update property_photos RLS to include collaborators
DROP POLICY IF EXISTS "Property owners can manage photos" ON public.property_photos;
CREATE POLICY "Property owners and collaborators can manage photos"
ON public.property_photos
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.properties
    WHERE properties.id = property_photos.property_id
    AND (
      properties.created_by = auth.uid()
      OR EXISTS (
        SELECT 1 FROM public.property_collaborators
        WHERE property_collaborators.property_id = properties.id
        AND property_collaborators.user_id = auth.uid()
      )
    )
  )
);