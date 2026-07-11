-- 2024-07-12: Add admin role to existing admin users and create a view for easy lookup
-- Ensure you have at least one admin user already (identified by email)

-- 1️⃣ Set role = 'admin' for the existing admin(s)
UPDATE auth.users
SET user_metadata = jsonb_set(coalesce(user_metadata, '{}'::jsonb), '{role}', '"admin"')
WHERE email = 'admin@example.com';  -- replace with your admin email(s)

-- 2️⃣ Create a view that only returns users with role = 'admin'
CREATE OR REPLACE VIEW public.admin_users AS
SELECT id, email, user_metadata
FROM auth.users
WHERE (user_metadata ->> 'role') = 'admin';

-- 3️⃣ (Optional) Grant SELECT on the view to the anon/public role if you want the client to read it
GRANT SELECT ON public.admin_users TO anon;

-- 4️⃣ Add a JWT claim mapping in Supabase dashboard (UI step, not SQL):
-- Settings → Authentication → JWT Claims → Add custom claim:
--   Claim name: role
--   JSON Path: user_metadata.role
