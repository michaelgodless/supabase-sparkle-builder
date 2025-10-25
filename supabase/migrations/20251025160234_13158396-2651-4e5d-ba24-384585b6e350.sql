-- Add exchange_rate column to properties table
ALTER TABLE properties ADD COLUMN IF NOT EXISTS exchange_rate numeric;

-- Add comment to the column
COMMENT ON COLUMN properties.exchange_rate IS 'Exchange rate for converting currency to KGS (Kyrgyz Som)';
