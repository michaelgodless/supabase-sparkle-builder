-- Увеличить лимит размера файлов до 10MB
UPDATE storage.buckets 
SET file_size_limit = 10485760
WHERE id = 'property-photos';