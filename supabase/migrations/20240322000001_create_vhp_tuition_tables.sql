CREATE TABLE IF NOT EXISTS public.schools (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    address text,
    phone text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.subjects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    description text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.classes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    description text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.parents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    father_name text,
    father_phone text,
    father_occupation text,
    mother_name text,
    mother_phone text,
    mother_occupation text,
    address text NOT NULL,
    email text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.students (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id text UNIQUE NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    date_of_birth date,
    gender text CHECK (gender IN ('Male', 'Female', 'Other')),
    phone text,
    email text,
    address text,
    school_id uuid REFERENCES public.schools(id),
    class_id uuid REFERENCES public.classes(id),
    parent_id uuid REFERENCES public.parents(id),
    admission_date date DEFAULT CURRENT_DATE,
    status text DEFAULT 'Active' CHECK (status IN ('Active', 'Left', 'Suspended')),
    left_date date,
    left_reason text,
    remarks text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.student_subjects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id uuid REFERENCES public.students(id) ON DELETE CASCADE,
    subject_id uuid REFERENCES public.subjects(id) ON DELETE CASCADE,
    enrollment_date date DEFAULT CURRENT_DATE,
    status text DEFAULT 'Active' CHECK (status IN ('Active', 'Completed', 'Dropped')),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    UNIQUE(student_id, subject_id)
);

CREATE TABLE IF NOT EXISTS public.admin_users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    username text UNIQUE NOT NULL,
    email text UNIQUE NOT NULL,
    password_hash text NOT NULL,
    full_name text NOT NULL,
    role text DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

alter publication supabase_realtime add table public.schools;
alter publication supabase_realtime add table public.subjects;
alter publication supabase_realtime add table public.classes;
alter publication supabase_realtime add table public.parents;
alter publication supabase_realtime add table public.students;
alter publication supabase_realtime add table public.student_subjects;
alter publication supabase_realtime add table public.admin_users;

CREATE INDEX IF NOT EXISTS idx_students_status ON public.students(status);
CREATE INDEX IF NOT EXISTS idx_students_class ON public.students(class_id);
CREATE INDEX IF NOT EXISTS idx_students_school ON public.students(school_id);
CREATE INDEX IF NOT EXISTS idx_student_subjects_student ON public.student_subjects(student_id);
CREATE INDEX IF NOT EXISTS idx_student_subjects_subject ON public.student_subjects(subject_id);
