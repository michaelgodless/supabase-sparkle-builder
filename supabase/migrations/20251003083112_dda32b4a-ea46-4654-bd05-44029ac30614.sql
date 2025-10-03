-- Создание bucket для фотографий объектов недвижимости
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-photos',
  'property-photos',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
);

-- RLS политики для property-photos bucket
CREATE POLICY "Anyone can view property photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-photos');

CREATE POLICY "Authenticated users can upload property photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'property-photos' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update own property photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'property-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own property photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'property-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);