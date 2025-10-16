-- Drop the restrictive anonymous policy
DROP POLICY IF EXISTS "Anonymous users cannot view profiles" ON public.profiles;

-- Allow everyone to view manager and super_admin profiles
CREATE POLICY "Anyone can view manager profiles"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = profiles.id
    AND user_roles.role IN ('manager', 'super_admin')
  )
);