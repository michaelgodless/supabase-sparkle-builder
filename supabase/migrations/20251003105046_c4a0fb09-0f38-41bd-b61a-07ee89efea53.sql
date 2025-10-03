-- Remove the problematic check constraint that uses NOW() with timezone
-- Check constraints with time-based validations cause issues with datetime conversions
ALTER TABLE viewings DROP CONSTRAINT IF EXISTS viewing_future_check;

-- The validation will be handled on the client side instead