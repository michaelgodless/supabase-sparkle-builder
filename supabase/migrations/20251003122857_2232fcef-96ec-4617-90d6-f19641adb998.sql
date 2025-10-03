-- Исправление функций триггеров - приведение TG_OP к нижнему регистру

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
      LOWER(TG_OP)::action_type,
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
      LOWER(TG_OP)::action_type,
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
      LOWER(TG_OP)::action_type,
      'properties',
      OLD.id,
      auth.uid(),
      to_jsonb(OLD)
    );
    RETURN OLD;
  END IF;
END;
$$;

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
      LOWER(TG_OP)::action_type, 'viewings', NEW.id, auth.uid(), to_jsonb(OLD), to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF (TG_OP = 'INSERT') THEN
    INSERT INTO public.audit_logs (
      action_type, entity_type, entity_id, user_id, new_values
    ) VALUES (
      LOWER(TG_OP)::action_type, 'viewings', NEW.id, auth.uid(), to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    INSERT INTO public.audit_logs (
      action_type, entity_type, entity_id, user_id, old_values
    ) VALUES (
      LOWER(TG_OP)::action_type, 'viewings', OLD.id, auth.uid(), to_jsonb(OLD)
    );
    RETURN OLD;
  END IF;
END;
$$;