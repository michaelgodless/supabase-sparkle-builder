-- Создание справочных таблиц

-- Категории действий (Продажа/Аренда)
CREATE TABLE IF NOT EXISTS public.property_action_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'Asia/Bishkek')
);

-- Категории недвижимости (Вторичная, Дома и Участки, Коммерческая, Элитка, Парковка)
CREATE TABLE IF NOT EXISTS public.property_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'Asia/Bishkek')
);

-- Подкатегории недвижимости (зависят от категории)
CREATE TABLE IF NOT EXISTS public.property_subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.property_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'Asia/Bishkek'),
  UNIQUE(category_id, code)
);

-- Районы (многоуровневая структура)
CREATE TABLE IF NOT EXISTS public.property_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES public.property_areas(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  full_name TEXT,
  level INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'Asia/Bishkek')
);

-- Типы предложений
CREATE TABLE IF NOT EXISTS public.property_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'Asia/Bishkek')
);

-- Состояния недвижимости
CREATE TABLE IF NOT EXISTS public.property_conditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  applicable_to TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'Asia/Bishkek')
);

-- Статусы объявлений (расширенный список)
CREATE TABLE IF NOT EXISTS public.property_statuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'Asia/Bishkek')
);

-- Виды платежей
CREATE TABLE IF NOT EXISTS public.payment_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'Asia/Bishkek')
);

-- Типы документов
CREATE TABLE IF NOT EXISTS public.document_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'Asia/Bishkek')
);

-- Типы коммуникаций
CREATE TABLE IF NOT EXISTS public.communication_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'Asia/Bishkek')
);

-- Типы мебели
CREATE TABLE IF NOT EXISTS public.furniture_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'Asia/Bishkek')
);

-- Обновление таблицы properties с новыми полями
ALTER TABLE public.properties 
  DROP COLUMN IF EXISTS deal_type,
  DROP COLUMN IF EXISTS category,
  ADD COLUMN IF NOT EXISTS property_action_category_id UUID REFERENCES public.property_action_categories(id),
  ADD COLUMN IF NOT EXISTS property_category_id UUID REFERENCES public.property_categories(id),
  ADD COLUMN IF NOT EXISTS property_subcategory_id UUID REFERENCES public.property_subcategories(id),
  ADD COLUMN IF NOT EXISTS property_rooms TEXT,
  ADD COLUMN IF NOT EXISTS property_size NUMERIC,
  ADD COLUMN IF NOT EXISTS property_lot_size NUMERIC,
  ADD COLUMN IF NOT EXISTS property_area_id UUID REFERENCES public.property_areas(id),
  ADD COLUMN IF NOT EXISTS property_proposal_id UUID REFERENCES public.property_proposals(id),
  ADD COLUMN IF NOT EXISTS property_condition_id UUID REFERENCES public.property_conditions(id),
  ADD COLUMN IF NOT EXISTS property_status_id UUID REFERENCES public.property_statuses(id),
  ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Переименование полей для соответствия новой структуре
ALTER TABLE public.properties 
  RENAME COLUMN total_area TO property_total_area_old;
ALTER TABLE public.properties 
  RENAME COLUMN floor TO property_floor_old;
ALTER TABLE public.properties 
  RENAME COLUMN total_floors TO property_floor_from_old;
ALTER TABLE public.properties 
  RENAME COLUMN area TO property_area_old;
ALTER TABLE public.properties 
  RENAME COLUMN rooms_count TO property_rooms_old;

-- Связующие таблицы для множественных выборов

-- Виды платежей для объявления
CREATE TABLE IF NOT EXISTS public.property_payment_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  payment_type_id UUID NOT NULL REFERENCES public.payment_types(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'Asia/Bishkek'),
  UNIQUE(property_id, payment_type_id)
);

-- Документы для объявления
CREATE TABLE IF NOT EXISTS public.property_document_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  document_type_id UUID NOT NULL REFERENCES public.document_types(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'Asia/Bishkek'),
  UNIQUE(property_id, document_type_id)
);

-- Коммуникации для объявления
CREATE TABLE IF NOT EXISTS public.property_communication_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  communication_type_id UUID NOT NULL REFERENCES public.communication_types(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'Asia/Bishkek'),
  UNIQUE(property_id, communication_type_id)
);

-- Мебель для объявления
CREATE TABLE IF NOT EXISTS public.property_furniture_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  furniture_type_id UUID NOT NULL REFERENCES public.furniture_types(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'Asia/Bishkek'),
  UNIQUE(property_id, furniture_type_id)
);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_properties_action_category ON public.properties(property_action_category_id);
CREATE INDEX IF NOT EXISTS idx_properties_category ON public.properties(property_category_id);
CREATE INDEX IF NOT EXISTS idx_properties_subcategory ON public.properties(property_subcategory_id);
CREATE INDEX IF NOT EXISTS idx_properties_area ON public.properties(property_area_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(property_status_id);
CREATE INDEX IF NOT EXISTS idx_properties_created_by ON public.properties(created_by);
CREATE INDEX IF NOT EXISTS idx_property_areas_parent ON public.property_areas(parent_id);

-- RLS политики для справочных таблиц (все могут читать)
ALTER TABLE public.property_action_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.furniture_types ENABLE ROW LEVEL SECURITY;

-- Политики чтения для всех справочников
CREATE POLICY "Anyone can view action categories" ON public.property_action_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view property categories" ON public.property_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view subcategories" ON public.property_subcategories FOR SELECT USING (true);
CREATE POLICY "Anyone can view areas" ON public.property_areas FOR SELECT USING (true);
CREATE POLICY "Anyone can view proposals" ON public.property_proposals FOR SELECT USING (true);
CREATE POLICY "Anyone can view conditions" ON public.property_conditions FOR SELECT USING (true);
CREATE POLICY "Anyone can view statuses" ON public.property_statuses FOR SELECT USING (true);
CREATE POLICY "Anyone can view payment types" ON public.payment_types FOR SELECT USING (true);
CREATE POLICY "Anyone can view document types" ON public.document_types FOR SELECT USING (true);
CREATE POLICY "Anyone can view communication types" ON public.communication_types FOR SELECT USING (true);
CREATE POLICY "Anyone can view furniture types" ON public.furniture_types FOR SELECT USING (true);

-- RLS для связующих таблиц
ALTER TABLE public.property_payment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_document_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_communication_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_furniture_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view payment types of visible properties" ON public.property_payment_types
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM properties 
    WHERE properties.id = property_payment_types.property_id 
    AND (properties.status IN ('published', 'no_ads') OR properties.created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'))
  )
);

CREATE POLICY "Property owners can manage payment types" ON public.property_payment_types
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM properties 
    WHERE properties.id = property_payment_types.property_id 
    AND (properties.created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'))
  )
);

CREATE POLICY "Users can view document types of visible properties" ON public.property_document_types
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM properties 
    WHERE properties.id = property_document_types.property_id 
    AND (properties.status IN ('published', 'no_ads') OR properties.created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'))
  )
);

CREATE POLICY "Property owners can manage document types" ON public.property_document_types
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM properties 
    WHERE properties.id = property_document_types.property_id 
    AND (properties.created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'))
  )
);

CREATE POLICY "Users can view communication types of visible properties" ON public.property_communication_types
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM properties 
    WHERE properties.id = property_communication_types.property_id 
    AND (properties.status IN ('published', 'no_ads') OR properties.created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'))
  )
);

CREATE POLICY "Property owners can manage communication types" ON public.property_communication_types
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM properties 
    WHERE properties.id = property_communication_types.property_id 
    AND (properties.created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'))
  )
);

CREATE POLICY "Users can view furniture types of visible properties" ON public.property_furniture_types
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM properties 
    WHERE properties.id = property_furniture_types.property_id 
    AND (properties.status IN ('published', 'no_ads') OR properties.created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'))
  )
);

CREATE POLICY "Property owners can manage furniture types" ON public.property_furniture_types
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM properties 
    WHERE properties.id = property_furniture_types.property_id 
    AND (properties.created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'))
  )
);

-- Заполнение справочных данных

-- Категории действий
INSERT INTO public.property_action_categories (name, code) VALUES
  ('Продажа', 'sale'),
  ('Аренда', 'rent')
ON CONFLICT (code) DO NOTHING;

-- Категории недвижимости
INSERT INTO public.property_categories (name, code) VALUES
  ('Вторичная', 'secondary'),
  ('Дома и Участки', 'houses_land'),
  ('Коммерческая', 'commercial'),
  ('Элитка', 'elite'),
  ('Парковка', 'parking')
ON CONFLICT (code) DO NOTHING;

-- Типы предложений
INSERT INTO public.property_proposals (name, code) VALUES
  ('От собственника', 'owner'),
  ('От застройщика', 'developer'),
  ('От агентства', 'agency')
ON CONFLICT (code) DO NOTHING;

-- Состояния
INSERT INTO public.property_conditions (name, code, applicable_to) VALUES
  ('Евроремонт', 'euro_renovation', ARRAY['secondary', 'elite']),
  ('Свежий ремонт', 'fresh_renovation', ARRAY['secondary', 'elite']),
  ('Требует ремонта', 'needs_renovation', ARRAY['secondary', 'houses_land']),
  ('Черновая', 'rough', ARRAY['secondary', 'elite']),
  ('Под ключ', 'turnkey', ARRAY['secondary', 'elite', 'houses_land'])
ON CONFLICT (code) DO NOTHING;

-- Статусы объявлений
INSERT INTO public.property_statuses (name, code, description) VALUES
  ('Опубликовано', 'published', 'Объявление активно и видно всем'),
  ('Без рекламы', 'no_ads', 'Только в базе, без публикации'),
  ('Продано', 'sold', 'Сделка завершена'),
  ('Удалено', 'deleted', 'Объявление удалено'),
  ('На модерации', 'moderation', 'Ожидает проверки'),
  ('Снято с публикации', 'unpublished', 'Временно не активно')
ON CONFLICT (code) DO NOTHING;

-- Виды платежей
INSERT INTO public.payment_types (name, code) VALUES
  ('Наличные', 'cash'),
  ('Банковский перевод', 'bank_transfer'),
  ('Ипотека', 'mortgage'),
  ('Рассрочка', 'installment'),
  ('Обмен', 'exchange')
ON CONFLICT (code) DO NOTHING;

-- Типы документов
INSERT INTO public.document_types (name, code) VALUES
  ('Красная книга', 'red_book'),
  ('Тех паспорт', 'tech_passport'),
  ('Договор купли-продажи', 'purchase_agreement'),
  ('Свидетельство о собственности', 'ownership_certificate')
ON CONFLICT (code) DO NOTHING;

-- Типы коммуникаций
INSERT INTO public.communication_types (name, code) VALUES
  ('Электричество', 'electricity'),
  ('Газ', 'gas'),
  ('Вода', 'water'),
  ('Канализация', 'sewerage'),
  ('Отопление', 'heating'),
  ('Интернет', 'internet'),
  ('Телефон', 'phone')
ON CONFLICT (code) DO NOTHING;

-- Типы мебели
INSERT INTO public.furniture_types (name, code) VALUES
  ('Кухонная мебель', 'kitchen'),
  ('Спальная мебель', 'bedroom'),
  ('Гостиная', 'living_room'),
  ('Бытовая техника', 'appliances'),
  ('Встроенные шкафы', 'built_in_closets')
ON CONFLICT (code) DO NOTHING;