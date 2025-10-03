-- Разделение объявлений на публичные и приватные
-- published = публичные (видны всем)
-- no_ads = приватные (видны только менеджерам и создателю)

-- Удаляем старую политику
DROP POLICY IF EXISTS "Anyone can view published properties" ON public.properties;

-- Создаем новые политики для просмотра
-- 1. Публичные объявления видны всем
CREATE POLICY "Anyone can view published properties"
ON public.properties
FOR SELECT
USING (status = 'published'::property_status);

-- 2. Приватные объявления видны только менеджерам, админам и создателю
CREATE POLICY "Managers can view private properties"
ON public.properties
FOR SELECT
USING (
  status = 'no_ads'::property_status 
  AND (
    created_by = auth.uid() 
    OR has_any_role(auth.uid(), ARRAY['manager'::app_role, 'super_admin'::app_role])
  )
);

-- Обновляем политику для фотографий
DROP POLICY IF EXISTS "Anyone can view photos of visible properties" ON public.property_photos;

CREATE POLICY "Users can view photos based on property visibility"
ON public.property_photos
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM properties
    WHERE properties.id = property_photos.property_id
    AND (
      properties.status = 'published'::property_status
      OR (
        properties.status = 'no_ads'::property_status 
        AND (
          properties.created_by = auth.uid() 
          OR has_any_role(auth.uid(), ARRAY['manager'::app_role, 'super_admin'::app_role])
        )
      )
    )
  )
);