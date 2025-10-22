-- Create a function to automatically remove featured status when property is deleted or status changed
CREATE OR REPLACE FUNCTION handle_property_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- If property status is not 'published', remove it from featured_properties
  IF NEW.status != 'published' THEN
    DELETE FROM featured_properties WHERE property_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to handle status changes
DROP TRIGGER IF EXISTS property_status_change_trigger ON properties;

CREATE TRIGGER property_status_change_trigger
  AFTER UPDATE OF status ON properties
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION handle_property_status_change();