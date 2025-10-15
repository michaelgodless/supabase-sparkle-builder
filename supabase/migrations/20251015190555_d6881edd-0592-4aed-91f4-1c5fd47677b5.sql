-- Allow public to view manager and super_admin roles
CREATE POLICY "Public can view manager roles"
ON public.user_roles
FOR SELECT
USING (role IN ('manager', 'super_admin'));