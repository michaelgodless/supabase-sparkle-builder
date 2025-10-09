-- Add explicit policy to deny anonymous access to profiles table
-- This prevents unauthenticated users from accessing employee personal information

CREATE POLICY "Anonymous users cannot view profiles"
ON public.profiles
FOR SELECT
TO anon
USING (false);