INSERT INTO public.schools (name, address, phone) VALUES
('Delhi Public School', 'Sector 45, Gurgaon, Haryana', '+91-124-4513000'),
('Ryan International School', 'Vasant Kunj, New Delhi', '+91-11-26134444'),
('Modern School', 'Barakhamba Road, New Delhi', '+91-11-23316969'),
('St. Columba School', 'Ashok Place, New Delhi', '+91-11-23365754'),
('Amity International School', 'Saket, New Delhi', '+91-11-40503000')
ON CONFLICT DO NOTHING;

INSERT INTO public.subjects (name, description) VALUES
('Mathematics', 'Advanced Mathematics including Algebra, Geometry, and Calculus'),
('Physics', 'Classical and Modern Physics concepts'),
('Chemistry', 'Organic, Inorganic, and Physical Chemistry'),
('Biology', 'Botany, Zoology, and Human Biology'),
('English', 'English Language and Literature'),
('Hindi', 'Hindi Language and Literature'),
('History', 'Indian and World History'),
('Geography', 'Physical and Human Geography'),
('Economics', 'Micro and Macro Economics'),
('Computer Science', 'Programming and Computer Applications')
ON CONFLICT DO NOTHING;

INSERT INTO public.classes (name, description) VALUES
('Class 6', 'Sixth Standard'),
('Class 7', 'Seventh Standard'),
('Class 8', 'Eighth Standard'),
('Class 9', 'Ninth Standard'),
('Class 10', 'Tenth Standard - Board Exam'),
('Class 11', 'Eleventh Standard - Pre-University'),
('Class 12', 'Twelfth Standard - Board Exam')
ON CONFLICT DO NOTHING;

INSERT INTO public.parents (father_name, father_phone, father_occupation, mother_name, mother_phone, mother_occupation, address, email) VALUES
('Rajesh Kumar', '+91-9876543210', 'Software Engineer', 'Priya Kumar', '+91-9876543211', 'Teacher', 'A-123, Sector 15, Noida, UP', 'rajesh.kumar@email.com'),
('Amit Sharma', '+91-9876543212', 'Business Owner', 'Sunita Sharma', '+91-9876543213', 'Homemaker', 'B-456, Lajpat Nagar, Delhi', 'amit.sharma@email.com'),
('Vikram Singh', '+91-9876543214', 'Doctor', 'Kavita Singh', '+91-9876543215', 'Nurse', 'C-789, Sector 22, Gurgaon, HR', 'vikram.singh@email.com'),
('Suresh Gupta', '+91-9876543216', 'Accountant', 'Meera Gupta', '+91-9876543217', 'Bank Manager', 'D-101, Vasant Vihar, Delhi', 'suresh.gupta@email.com'),
('Ravi Agarwal', '+91-9876543218', 'Engineer', 'Pooja Agarwal', '+91-9876543219', 'Designer', 'E-202, Sector 18, Noida, UP', 'ravi.agarwal@email.com'),
('Manoj Verma', '+91-9876543220', 'Teacher', 'Sita Verma', '+91-9876543221', 'Government Officer', 'F-303, Dwarka, Delhi', 'manoj.verma@email.com'),
('Deepak Jain', '+91-9876543222', 'Businessman', 'Rekha Jain', '+91-9876543223', 'Homemaker', 'G-404, Sector 12, Faridabad, HR', 'deepak.jain@email.com'),
('Ashok Yadav', '+91-9876543224', 'Police Officer', 'Sunita Yadav', '+91-9876543225', 'Teacher', 'H-505, Rohini, Delhi', 'ashok.yadav@email.com')
ON CONFLICT DO NOTHING;

WITH school_data AS (
    SELECT id, name FROM public.schools
),
class_data AS (
    SELECT id, name FROM public.classes
),
parent_data AS (
    SELECT id, father_name FROM public.parents
)
INSERT INTO public.students (student_id, first_name, last_name, date_of_birth, gender, phone, email, address, school_id, class_id, parent_id, admission_date, status, remarks) 
SELECT 
    'VHP' || LPAD((ROW_NUMBER() OVER())::text, 4, '0') as student_id,
    first_name,
    last_name,
    date_of_birth,
    gender,
    phone,
    email,
    address,
    school_id,
    class_id,
    parent_id,
    admission_date,
    status,
    remarks
FROM (
    VALUES 
    ('Aarav', 'Kumar', '2008-03-15'::date, 'Male', '+91-9876543230', 'aarav.kumar@email.com', 'A-123, Sector 15, Noida, UP', (SELECT id FROM school_data WHERE name = 'Delhi Public School'), (SELECT id FROM class_data WHERE name = 'Class 10'), (SELECT id FROM parent_data WHERE father_name = 'Rajesh Kumar'), '2023-04-01'::date, 'Active', 'Excellent student in Mathematics'),
    ('Diya', 'Sharma', '2009-07-22'::date, 'Female', '+91-9876543231', 'diya.sharma@email.com', 'B-456, Lajpat Nagar, Delhi', (SELECT id FROM school_data WHERE name = 'Ryan International School'), (SELECT id FROM class_data WHERE name = 'Class 9'), (SELECT id FROM parent_data WHERE father_name = 'Amit Sharma'), '2023-04-01'::date, 'Active', 'Good in Science subjects'),
    ('Arjun', 'Singh', '2007-11-08'::date, 'Male', '+91-9876543232', 'arjun.singh@email.com', 'C-789, Sector 22, Gurgaon, HR', (SELECT id FROM school_data WHERE name = 'Modern School'), (SELECT id FROM class_data WHERE name = 'Class 11'), (SELECT id FROM parent_data WHERE father_name = 'Vikram Singh'), '2023-04-01'::date, 'Active', 'Interested in Physics and Chemistry'),
    ('Ananya', 'Gupta', '2008-12-03'::date, 'Female', '+91-9876543233', 'ananya.gupta@email.com', 'D-101, Vasant Vihar, Delhi', (SELECT id FROM school_data WHERE name = 'St. Columba School'), (SELECT id FROM class_data WHERE name = 'Class 10'), (SELECT id FROM parent_data WHERE father_name = 'Suresh Gupta'), '2023-04-01'::date, 'Active', 'Strong in English and Hindi'),
    ('Karan', 'Agarwal', '2009-05-18'::date, 'Male', '+91-9876543234', 'karan.agarwal@email.com', 'E-202, Sector 18, Noida, UP', (SELECT id FROM school_data WHERE name = 'Amity International School'), (SELECT id FROM class_data WHERE name = 'Class 9'), (SELECT id FROM parent_data WHERE father_name = 'Ravi Agarwal'), '2023-04-01'::date, 'Active', 'Good at Computer Science'),
    ('Priya', 'Verma', '2010-01-25'::date, 'Female', '+91-9876543235', 'priya.verma@email.com', 'F-303, Dwarka, Delhi', (SELECT id FROM school_data WHERE name = 'Delhi Public School'), (SELECT id FROM class_data WHERE name = 'Class 8'), (SELECT id FROM parent_data WHERE father_name = 'Manoj Verma'), '2023-04-01'::date, 'Active', 'Excellent in Mathematics'),
    ('Rohit', 'Jain', '2007-09-12'::date, 'Male', '+91-9876543236', 'rohit.jain@email.com', 'G-404, Sector 12, Faridabad, HR', (SELECT id FROM school_data WHERE name = 'Ryan International School'), (SELECT id FROM class_data WHERE name = 'Class 11'), (SELECT id FROM parent_data WHERE father_name = 'Deepak Jain'), '2023-04-01'::date, 'Left', 'Left due to family relocation'),
    ('Sneha', 'Yadav', '2008-06-30'::date, 'Female', '+91-9876543237', 'sneha.yadav@email.com', 'H-505, Rohini, Delhi', (SELECT id FROM school_data WHERE name = 'Modern School'), (SELECT id FROM class_data WHERE name = 'Class 10'), (SELECT id FROM parent_data WHERE father_name = 'Ashok Yadav'), '2023-04-01'::date, 'Active', 'Good overall performance')
) AS student_data(first_name, last_name, date_of_birth, gender, phone, email, address, school_id, class_id, parent_id, admission_date, status, remarks)
ON CONFLICT DO NOTHING;

WITH student_data AS (
    SELECT id, first_name FROM public.students
),
subject_data AS (
    SELECT id, name FROM public.subjects
)
INSERT INTO public.student_subjects (student_id, subject_id, enrollment_date, status)
SELECT 
    s.id as student_id,
    sub.id as subject_id,
    '2023-04-01'::date as enrollment_date,
    'Active' as status
FROM student_data s
CROSS JOIN subject_data sub
WHERE 
    (s.first_name = 'Aarav' AND sub.name IN ('Mathematics', 'Physics', 'Chemistry', 'English')) OR
    (s.first_name = 'Diya' AND sub.name IN ('Mathematics', 'Physics', 'Biology', 'English')) OR
    (s.first_name = 'Arjun' AND sub.name IN ('Mathematics', 'Physics', 'Chemistry', 'Computer Science')) OR
    (s.first_name = 'Ananya' AND sub.name IN ('Mathematics', 'English', 'Hindi', 'History')) OR
    (s.first_name = 'Karan' AND sub.name IN ('Mathematics', 'Computer Science', 'English', 'Physics')) OR
    (s.first_name = 'Priya' AND sub.name IN ('Mathematics', 'English', 'Hindi', 'Geography')) OR
    (s.first_name = 'Rohit' AND sub.name IN ('Mathematics', 'Physics', 'Chemistry', 'English')) OR
    (s.first_name = 'Sneha' AND sub.name IN ('Mathematics', 'Biology', 'English', 'Hindi'))
ON CONFLICT DO NOTHING;

UPDATE public.students 
SET left_date = '2024-01-15'::date, left_reason = 'Family relocation to Mumbai'
WHERE first_name = 'Rohit' AND last_name = 'Jain';

INSERT INTO public.admin_users (username, email, password_hash, full_name, role, is_active)
VALUES 
('admin', 'admin@vhp.org', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'VHP Administrator', 'admin', true)
ON CONFLICT DO NOTHING;
