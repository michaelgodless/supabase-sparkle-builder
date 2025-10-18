-- Add RLS policy for super admins to manage property_areas
CREATE POLICY "Super admins can manage areas"
ON public.property_areas
FOR ALL
USING (has_role(auth.uid(), 'super_admin'));
