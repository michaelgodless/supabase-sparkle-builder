-- Add "Дежурка" subcategory for secondary housing
INSERT INTO public.property_subcategories (category_id, name, code)
SELECT 
  pc.id,
  'Дежурка',
  'on_duty'
FROM public.property_categories pc
WHERE pc.code = 'secondary'
ON CONFLICT DO NOTHING;