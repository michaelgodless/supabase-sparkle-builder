-- Исправление маппинга TG_OP на значения enum action_type
-- INSERT -> 'create', UPDATE -> 'update', DELETE -> 'delete'

CREATE OR REPLACE FUNCTION public.log_property_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (TG_OP = 'UPDATE') THEN
    INSERT INTO public.audit_logs (
      action_type,
      entity_type,
      entity_id,
      user_id,
      old_values,
      new_values
    ) VALUES (
      'update'::action_type,
      'properties',
      NEW.id,
      auth.uid(),
      to_jsonb(OLD),
      to_jsonb(NEW)
    );
    RETURN NEW;
  
  ELSIF (TG_OP = 'INSERT') THEN
    INSERT INTO public.audit_logs (
      action_type,
      entity_type,
      entity_id,
      user_id,
      new_values
    ) VALUES (
      'create'::action_type,
      'properties',
      NEW.id,
      auth.uid(),
      to_jsonb(NEW)
    );
    RETURN NEW;
  
  ELSIF (TG_OP = 'DELETE') THEN
    INSERT INTO public.audit_logs (
      action_type,
      entity_type,
      entity_id,
      user_id,
      old_values
    ) VALUES (
      'delete'::action_type,
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
      'update'::action_type, 'viewings', NEW.id, auth.uid(), to_jsonb(OLD), to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF (TG_OP = 'INSERT') THEN
    INSERT INTO public.audit_logs (
      action_type, entity_type, entity_id, user_id, new_values
    ) VALUES (
      'create'::action_type, 'viewings', NEW.id, auth.uid(), to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    INSERT INTO public.audit_logs (
      action_type, entity_type, entity_id, user_id, old_values
    ) VALUES (
      'delete'::action_type, 'viewings', OLD.id, auth.uid(), to_jsonb(OLD)
    );
    RETURN OLD;
  END IF;
END;
$$;