-- Add 'deleted' status to property_status enum
ALTER TYPE property_status ADD VALUE IF NOT EXISTS 'deleted';

-- Add deleted_at column to properties table to track when property was deleted
ALTER TABLE properties ADD COLUMN IF NOT EXISTS deleted_at timestamp with time zone;

-- Add deleted_by column to track who deleted the property
ALTER TABLE properties ADD COLUMN IF NOT EXISTS deleted_by uuid;