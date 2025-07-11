-- Add more classes from LKG to Grade 12
INSERT INTO public.classes (name, description) VALUES
('LKG', 'Lower Kindergarten'),
('UKG', 'Upper Kindergarten'),
('Class 1', 'First Standard'),
('Class 2', 'Second Standard'),
('Class 3', 'Third Standard'),
('Class 4', 'Fourth Standard'),
('Class 5', 'Fifth Standard')
ON CONFLICT (name) DO NOTHING;

-- Add more important subjects
INSERT INTO public.subjects (name, description) VALUES
('Sanskrit', 'Sanskrit Language and Literature'),
('Social Science', 'Combined Social Studies'),
('Political Science', 'Government and Politics'),
('Accountancy', 'Financial Accounting and Business Studies'),
('Business Studies', 'Commerce and Business Management'),
('Psychology', 'Human Psychology and Behavior'),
('Sociology', 'Society and Social Relationships'),
('Philosophy', 'Logic and Ethics'),
('Physical Education', 'Sports and Physical Fitness'),
('Art and Craft', 'Creative Arts and Handicrafts'),
('Music', 'Vocal and Instrumental Music'),
('Dance', 'Classical and Folk Dance'),
('Environmental Science', 'Environment and Ecology'),
('General Knowledge', 'Current Affairs and General Awareness'),
('Moral Science', 'Ethics and Values'),
('Drawing', 'Technical and Artistic Drawing')
ON CONFLICT (name) DO NOTHING;

-- Enable realtime for all tables
alter publication supabase_realtime add table students;
alter publication supabase_realtime add table parents;
alter publication supabase_realtime add table schools;
alter publication supabase_realtime add table classes;
alter publication supabase_realtime add table subjects;
alter publication supabase_realtime add table student_subjects;
alter publication supabase_realtime add table admin_users;
