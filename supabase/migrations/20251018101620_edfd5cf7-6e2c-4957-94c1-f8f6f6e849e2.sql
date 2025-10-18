-- Обновляем справочник видов платежа
DELETE FROM payment_types;

INSERT INTO payment_types (name, code) VALUES 
  ('Наличный', 'cash'),
  ('Ипотека', 'mortgage'),
  ('Обмен', 'exchange');

-- Добавляем поле "цена на руку" в таблицу properties
ALTER TABLE properties 
ADD COLUMN price_in_hand numeric;

-- Обновляем представление properties_public чтобы исключить price_in_hand
DROP VIEW IF EXISTS properties_public;

CREATE VIEW properties_public AS
SELECT 
  id,
  property_number,
  price,
  property_size,
  property_lot_size,
  property_rooms,
  documents,
  condition,
  property_category_id,
  property_subcategory_id,
  property_action_category_id,
  property_area_id,
  property_condition_id,
  property_proposal_id,
  property_status_id,
  furniture,
  land_area,
  description,
  status,
  created_at,
  updated_at,
  currency,
  payment_methods,
  communications
FROM properties
WHERE status = 'published';