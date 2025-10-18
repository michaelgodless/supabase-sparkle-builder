-- Добавляем категорию "Квартира"
INSERT INTO public.property_categories (name, code)
VALUES ('Квартира', 'apartment')
ON CONFLICT DO NOTHING;

-- Переносим все объявления с категорией "Вторичная" и "Элитка" на "Квартира"
UPDATE public.properties
SET property_category_id = (SELECT id FROM public.property_categories WHERE code = 'apartment')
WHERE property_category_id IN (
  SELECT id FROM public.property_categories WHERE code IN ('secondary', 'elite')
);

-- Теперь можно удалить старые категории
DELETE FROM public.property_categories WHERE code IN ('secondary', 'elite');

-- Добавляем поле "серия" для квартир в таблицу properties
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS property_series text;