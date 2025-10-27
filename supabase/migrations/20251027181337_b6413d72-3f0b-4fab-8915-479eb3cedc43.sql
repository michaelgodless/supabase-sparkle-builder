-- Add super_admin role to admin@admin.com user
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'super_admin'::app_role
FROM profiles
WHERE email = 'admin@admin.com'
ON CONFLICT (user_id, role) DO NOTHING;