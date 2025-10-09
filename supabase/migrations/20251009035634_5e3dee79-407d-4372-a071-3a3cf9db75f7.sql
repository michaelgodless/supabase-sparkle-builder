-- Drop the overly permissive public policy
DROP POLICY IF EXISTS "Anyone can view published properties" ON public.properties;

-- Create a secure view for public property listings that only exposes safe fields
CREATE OR REPLACE VIEW public.properties_public AS
SELECT 
  p.id,
  p.property_number,
  p.price,
  p.currency,
  p.property_size,
  p.property_lot_size,
  p.property_rooms,
  p.description,
  p.property_category_id,
  p.property_subcategory_id,
  p.property_action_category_id,
  p.property_area_id,
  p.property_condition_id,
  p.property_proposal_id,
  p.property_status_id,
  p.furniture,
  p.communications,
  p.documents,
  p.payment_methods,
  p.condition,
  p.land_area,
  p.status,
  p.created_at,
  p.updated_at
FROM public.properties p
WHERE p.status = 'published';

-- Enable RLS on the view
ALTER VIEW public.properties_public SET (security_invoker = true);

-- Grant SELECT access to the view for everyone
GRANT SELECT ON public.properties_public TO anon, authenticated;

-- Add a new restricted policy for authenticated staff to view all published properties
CREATE POLICY "Authenticated users can view all published property details"
ON public.properties
FOR SELECT
TO authenticated
USING (status = 'published');

-- Add a comment to document the security measure
COMMENT ON VIEW public.properties_public IS 'Public view of properties that hides PII: owner_name, owner_contacts, exact address, latitude, longitude, created_by';