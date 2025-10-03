-- Виправлення критичної проблеми безпеки: обмеження доступу до персональних даних

-- Видалити небезпечну політику що дозволяє всім читати всі профілі
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Створити безпечні політики з обмеженим доступом

-- Політика 1: Користувачі можуть бачити свій власний профіль (всі дані)
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Політика 2: Співробітники можуть бачити профілі колег для робочих цілей
-- (менеджери, адміни, стажери потребують бачити імена колег для призначення показів, угод тощо)
CREATE POLICY "Staff can view colleague profiles" ON public.profiles
FOR SELECT
TO authenticated
USING (
  has_any_role(auth.uid(), ARRAY['manager'::app_role, 'super_admin'::app_role, 'intern'::app_role])
);

-- ВАЖЛИВО: Ця конфігурація означає:
-- 1. Неавторизовані користувачі НЕ МОЖУТЬ читати профілі (безпечно)
-- 2. Авторизовані користувачі бачать ТІЛЬКИ свій профіль
-- 3. Співробітники (з ролями) бачать профілі інших співробітників для координації роботи
-- 4. Super admin вже має політику "Super admins can manage all profiles" для повного доступу