-- Add lawrence@ourfamilydinner.org as super admin
INSERT INTO public.admin_users (user_id, role)
VALUES ('f11dcfa8-c2fd-425e-bfd7-19aa2c101966', 'super_admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';