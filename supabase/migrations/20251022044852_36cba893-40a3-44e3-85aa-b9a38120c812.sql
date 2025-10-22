-- Update RLS policy to allow managers to set deleted status
DROP POLICY IF EXISTS "Owners, collaborators and managers can update properties" ON properties;

CREATE POLICY "Owners, collaborators and managers can update properties"
ON properties
FOR UPDATE
USING (
  created_by = auth.uid() 
  OR has_any_role(auth.uid(), ARRAY['manager'::app_role, 'super_admin'::app_role])
  OR is_property_collaborator(auth.uid(), id)
)
WITH CHECK (
  created_by = auth.uid() 
  OR has_any_role(auth.uid(), ARRAY['manager'::app_role, 'super_admin'::app_role])
  OR is_property_collaborator(auth.uid(), id)
);

-- Add policy to allow managers and admins to view deleted properties
DROP POLICY IF EXISTS "Managers can view deleted properties" ON properties;

CREATE POLICY "Managers can view deleted properties"
ON properties
FOR SELECT
USING (
  status = 'deleted'
  AND has_any_role(auth.uid(), ARRAY['manager'::app_role, 'super_admin'::app_role])
);