-- Создаем таблицы для справочников серий и застройщиков
CREATE TABLE IF NOT EXISTS public.property_series (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT (now() AT TIME ZONE 'Asia/Bishkek'::text)
);

CREATE TABLE IF NOT EXISTS public.property_developers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT (now() AT TIME ZONE 'Asia/Bishkek'::text)
);

-- Включаем RLS
ALTER TABLE public.property_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_developers ENABLE ROW LEVEL SECURITY;

-- Политики для просмотра (все могут видеть)
CREATE POLICY "Anyone can view series"
  ON public.property_series
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view developers"
  ON public.property_developers
  FOR SELECT
  USING (true);

-- Политики для управления (только super_admin)
CREATE POLICY "Super admins can manage series"
  ON public.property_series
  FOR ALL
  USING (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Super admins can manage developers"
  ON public.property_developers
  FOR ALL
  USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Вставляем начальные данные для серий
INSERT INTO public.property_series (name) VALUES
  ('105'),
  ('106'),
  ('Хрущевка'),
  ('Сталинка'),
  ('Брежневка'),
  ('Новая планировка')
ON CONFLICT (name) DO NOTHING;

-- Вставляем начальные данные для застройщиков
INSERT INTO public.property_developers (name) VALUES
  ('ГлавСтрой'),
  ('БишкекСтрой'),
  ('АзияСтрой'),
  ('НурСтрой')
ON CONFLICT (name) DO NOTHING;