-- Drop the properties_public view as it's redundant and flagged as a security issue
-- The properties table already has proper RLS policies for public access to published properties
DROP VIEW IF EXISTS public.properties_public CASCADE;