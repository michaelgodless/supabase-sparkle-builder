-- Создание триггера для логирования изменений объявлений в audit_logs

-- Функция для логирования изменений
CREATE OR REPLACE FUNCTION public.log_property_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Для UPDATE записываем старые и новые значения
  IF (TG_OP = 'UPDATE') THEN
    INSERT INTO public.audit_logs (
      action_type,
      entity_type,
      entity_id,
      user_id,
      old_values,
      new_values
    ) VALUES (
      TG_OP,
      'properties',
      NEW.id,
      auth.uid(),
      to_jsonb(OLD),
      to_jsonb(NEW)
    );
    RETURN NEW;
  
  -- Для INSERT записываем только новые значения
  ELSIF (TG_OP = 'INSERT') THEN
    INSERT INTO public.audit_logs (
      action_type,
      entity_type,
      entity_id,
      user_id,
      new_values
    ) VALUES (
      TG_OP,
      'properties',
      NEW.id,
      auth.uid(),
      to_jsonb(NEW)
    );
    RETURN NEW;
  
  -- Для DELETE записываем старые значения
  ELSIF (TG_OP = 'DELETE') THEN
    INSERT INTO public.audit_logs (
      action_type,
      entity_type,
      entity_id,
      user_id,
      old_values
    ) VALUES (
      TG_OP,
      'properties',
      OLD.id,
      auth.uid(),
      to_jsonb(OLD)
    );
    RETURN OLD;
  END IF;
END;
$$;

-- Создание триггера для таблицы properties
DROP TRIGGER IF EXISTS properties_audit_trigger ON public.properties;

CREATE TRIGGER properties_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.log_property_changes();

-- Аналогичные триггеры для других важных таблиц

-- Триггер для viewings
CREATE OR REPLACE FUNCTION public.log_viewing_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (TG_OP = 'UPDATE') THEN
    INSERT INTO public.audit_logs (
      action_type, entity_type, entity_id, user_id, old_values, new_values
    ) VALUES (
      TG_OP, 'viewings', NEW.id, auth.uid(), to_jsonb(OLD), to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF (TG_OP = 'INSERT') THEN
    INSERT INTO public.audit_logs (
      action_type, entity_type, entity_id, user_id, new_values
    ) VALUES (
      TG_OP, 'viewings', NEW.id, auth.uid(), to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    INSERT INTO public.audit_logs (
      action_type, entity_type, entity_id, user_id, old_values
    ) VALUES (
      TG_OP, 'viewings', OLD.id, auth.uid(), to_jsonb(OLD)
    );
    RETURN OLD;
  END IF;
END;
$$;

DROP TRIGGER IF EXISTS viewings_audit_trigger ON public.viewings;

CREATE TRIGGER viewings_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.viewings
  FOR EACH ROW
  EXECUTE FUNCTION public.log_viewing_changes();