-- Разрешаем менеджерам обновлять статус объявлений
DROP POLICY IF EXISTS "Owners and admins can update properties" ON public.properties;

-- Менеджеры, создатели и админы могут обновлять объявления
CREATE POLICY "Managers can update properties"
ON public.properties
FOR UPDATE
USING (
  created_by = auth.uid() 
  OR has_any_role(auth.uid(), ARRAY['manager'::app_role, 'super_admin'::app_role])
);