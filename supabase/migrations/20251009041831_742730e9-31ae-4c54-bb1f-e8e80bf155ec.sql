-- Allow anonymous users to view published properties (public catalog)
CREATE POLICY "Public can view published properties"
ON public.properties
FOR SELECT
TO anon
USING (status = 'published'::property_status);

-- Allow anonymous users to view photos of published properties
CREATE POLICY "Public can view photos of published properties"
ON public.property_photos
FOR SELECT
TO anon
USING (
  EXISTS (
    SELECT 1 FROM properties
    WHERE properties.id = property_photos.property_id
    AND properties.status = 'published'::property_status
  )
);