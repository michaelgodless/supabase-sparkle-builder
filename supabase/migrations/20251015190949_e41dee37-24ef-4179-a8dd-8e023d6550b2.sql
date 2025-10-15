-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Public can view manager roles" ON public.user_roles;

-- Create new policy allowing everyone (including anonymous) to view manager roles
CREATE POLICY "Anyone can view manager roles"
ON public.user_roles
FOR SELECT
TO anon, authenticated
USING (role IN ('manager', 'super_admin'));