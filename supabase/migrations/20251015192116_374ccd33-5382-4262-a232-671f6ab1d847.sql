-- Fix 1: Restrict public access to property owner sensitive data
-- Drop the overly permissive policy for anonymous users
DROP POLICY IF EXISTS "Public can view published properties" ON public.properties;

-- Anonymous users cannot see owner contact details - this is already handled by the existing
-- "Public can view published property listings" policy if it exists
-- We just need to ensure the old permissive one is removed

-- Fix 2: Restrict staff profile visibility to only super_admins  
-- Drop the overly permissive policy that allows all staff to see each other's contact info
DROP POLICY IF EXISTS "Staff can view colleague profiles" ON public.profiles;

-- Super admins can already view all profiles through the existing "Super admins can manage all profiles" policy
-- No need to add a duplicate policy