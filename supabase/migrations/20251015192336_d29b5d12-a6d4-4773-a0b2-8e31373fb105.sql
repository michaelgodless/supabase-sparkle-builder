-- Fix: Allow anonymous users to view published properties through joins
-- The previous migration blocked too much access
-- Anonymous users need to see published properties (just not owner contact info)

-- Drop the restrictive policy
DROP POLICY IF EXISTS "Public can view published property listings" ON public.properties;

-- Create a policy that allows anonymous users to see published properties
-- RLS doesn't filter columns, so we can't hide owner_name/owner_contacts this way
-- We need to create a view instead for public access
CREATE POLICY "Anonymous can view published properties"
ON public.properties
FOR SELECT
TO anon
USING (status = 'published');

-- Note: This temporarily re-exposes owner contact data
-- A proper fix requires creating a view and updating the frontend to use it
-- For now, this fixes the broken featured properties display