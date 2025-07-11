-- Remove password hashing and simplify admin table
DROP TABLE IF EXISTS public.admin_users;

CREATE TABLE IF NOT EXISTS public.admin_users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    username text UNIQUE NOT NULL,
    email text UNIQUE NOT NULL,
    password text NOT NULL,
    full_name text NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Insert simple admin user without password hashing
INSERT INTO public.admin_users (username, email, password, full_name, is_active)
VALUES 
('admin', 'admin@vhp.org', 'admin123', 'VHP Administrator', true)
ON CONFLICT (username) DO UPDATE SET
    password = EXCLUDED.password,
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    is_active = EXCLUDED.is_active;

alter publication supabase_realtime add table public.admin_users;
