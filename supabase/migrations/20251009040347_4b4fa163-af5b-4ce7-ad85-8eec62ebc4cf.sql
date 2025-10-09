-- Drop the overly permissive policy that allows any authenticated user to view published properties
DROP POLICY IF EXISTS "Authenticated users can view all published property details" ON public.properties;

-- Create a new policy that only allows staff members (managers, super_admins, interns) to view published properties with full details including owner contact info
CREATE POLICY "Staff can view published property details"
ON public.properties
FOR SELECT
TO authenticated
USING (
  status = 'published'::property_status 
  AND has_any_role(auth.uid(), ARRAY['manager'::app_role, 'super_admin'::app_role, 'intern'::app_role])
);