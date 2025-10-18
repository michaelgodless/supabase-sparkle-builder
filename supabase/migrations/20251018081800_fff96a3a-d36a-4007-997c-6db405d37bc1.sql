-- Добавляем поле "застройщик" для квартир в таблицу properties
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS property_developer text;