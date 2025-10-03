-- Сделать поле property_area_old необязательным
ALTER TABLE properties 
ALTER COLUMN property_area_old DROP NOT NULL;