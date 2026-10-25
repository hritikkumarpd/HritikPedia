-- ==============================================================================
-- HRITIKPEDIA POSTGRESQL SCHEMA MIGRATION 003
-- Pan-India Education Ecosystem Expansion:
-- 1. General Competitions (UPSC, BPSC, SSC, Railways, Banking)
-- 2. School & Boards (CBSE, BSEB 10th/12th, UP Board)
-- 3. Engineering (University-wise: AKTU, BEU, VTU & Department-wise: CSE, ME, CE, ECE)
-- 4. General Degree (BCA, B.Sc, B.Com)
-- ==============================================================================

-- 1. Add Domain, Target Exam, Department to Subjects
ALTER TABLE subjects 
ADD COLUMN IF NOT EXISTS domain VARCHAR(50) DEFAULT 'engineering',
ADD COLUMN IF NOT EXISTS target_exam_or_board VARCHAR(100),
ADD COLUMN IF NOT EXISTS department VARCHAR(100);

-- 2. Add Domain, Medium, Target Exam, Department to Notes
ALTER TABLE notes 
ADD COLUMN IF NOT EXISTS domain VARCHAR(50) DEFAULT 'engineering',
ADD COLUMN IF NOT EXISTS target_exam_or_board VARCHAR(100),
ADD COLUMN IF NOT EXISTS medium VARCHAR(30) DEFAULT 'english',
ADD COLUMN IF NOT EXISTS department VARCHAR(100),
ADD COLUMN IF NOT EXISTS class_or_semester VARCHAR(50);

-- 3. Indexes for Instant Multi-Category & Multi-Medium Filtering
CREATE INDEX IF NOT EXISTS idx_subjects_domain ON subjects(domain);
CREATE INDEX IF NOT EXISTS idx_subjects_target ON subjects(target_exam_or_board);
CREATE INDEX IF NOT EXISTS idx_notes_domain ON notes(domain);
CREATE INDEX IF NOT EXISTS idx_notes_target ON notes(target_exam_or_board);
CREATE INDEX IF NOT EXISTS idx_notes_medium ON notes(medium);
CREATE INDEX IF NOT EXISTS idx_notes_dept ON notes(department);

-- 4. Update Published Notes View with Pan-India Meta Fields
DROP VIEW IF EXISTS view_published_notes;
CREATE VIEW view_published_notes AS
SELECT 
    n.id,
    n.title,
    n.slug,
    n.description,
    n.page_count,
    n.is_free,
    n.price,
    n.original_price,
    n.has_preview,
    n.preview_pages,
    n.is_featured,
    n.author,
    n.rating,
    n.domain,
    n.target_exam_or_board,
    n.medium,
    n.department,
    n.class_or_semester,
    n.published_at,
    s.id AS subject_id,
    s.name AS subject_name,
    s.slug AS subject_slug,
    s.code AS subject_code
FROM notes n
JOIN subjects s ON n.subject_id = s.id
WHERE n.status = 'published';

-- 5. Seed Pan-India Master Subjects
INSERT INTO subjects (id, name, slug, code, description, icon, color, note_count, is_featured, order_index, domain, target_exam_or_board, department)
VALUES
-- General Competitions
(101, 'UPSC Civil Services (GS-1 to GS-4)', 'upsc-general-studies', 'EXAM-UPSC-GS', 'Topper-verified handwritten notes for Modern Indian History, Art & Culture, Polity, and Indian Economy.', 'Landmark', '#8B5CF6', 15, TRUE, 10, 'general_competitions', 'UPSC', 'General Studies'),
(102, 'BPSC (Bihar Public Service Commission)', 'bpsc-bihar-special', 'EXAM-BPSC-70', 'Bihar Special GK, Bihar History & Geography, Economy, and State Polity for 70th/71st CCE in Hindi & English.', 'Award', '#EC4899', 12, TRUE, 11, 'general_competitions', 'BPSC', 'General Studies'),
(103, 'SSC (CGL, CHSL, MTS) Preparation', 'ssc-cgl-chsl', 'EXAM-SSC-ALL', 'Speed-maths shortcuts, Quantitative Aptitude formulas, English grammar rules, and Reasoning mind-maps.', 'Target', '#F59E0B', 14, TRUE, 12, 'general_competitions', 'SSC', 'General Aptitude'),
(104, 'Railway RRB (NTPC & Group D)', 'railway-rrb-ntpc', 'EXAM-RRB-NTPC', 'General Science (Physics, Chemistry, Biology) high-yield capsules, static GK tables, and solved formulas.', 'Train', '#10B981', 10, FALSE, 13, 'general_competitions', 'Railways', 'General Science'),

-- School & Boards (10th & 12th)
(201, 'BSEB (Bihar Board) 12th Inter Science', 'bseb-12th-science', 'BOARD-BSEB-12', 'भौतिकी (Physics), रसायन शास्त्र (Chemistry), गणित (Maths) एवं जीव विज्ञान के संपूर्ण हस्तलिखित फॉर्मूला नोट्स।', 'GraduationCap', '#087BFF', 16, TRUE, 20, 'school_boards', 'BSEB', 'Science (PCM/PCB)'),
(202, 'BSEB (Bihar Board) 10th Matric Board', 'bseb-10th-matric', 'BOARD-BSEB-10', 'मैट्रिक परीक्षा 2026: विज्ञान (Science), गणित (Maths), सामाजिक विज्ञान (SST) के त्वरित पुनरावलोकन नोट्स।', 'School', '#059669', 12, TRUE, 21, 'school_boards', 'BSEB', 'Matriculation'),
(203, 'CBSE Class 12 Board (PCM/PCB)', 'cbse-class-12', 'BOARD-CBSE-12', 'Physics formulas & derivations, Chemistry organic reactions mechanisms, and Biology concise diagrams.', 'BookOpen', '#4F46E5', 18, TRUE, 22, 'school_boards', 'CBSE', 'Science'),
(204, 'CBSE Class 10 Board', 'cbse-class-10', 'BOARD-CBSE-10', 'Class 10 NCERT Mathematics solved theorems, Science chapterwise summary sheets, and Social Science timelines.', 'Sparkles', '#D97706', 15, TRUE, 23, 'school_boards', 'CBSE', 'General'),

-- Engineering Universities & Departments
(301, 'AKTU B.Tech CSE / IT Core', 'aktu-btech-cse', 'ENG-AKTU-CSE', 'Dr. A.P.J. Abdul Kalam Technical University (AKTU) syllabus-mapped notes for DBMS, OS, DAA, and Compiler Design.', 'Code2', '#2563EB', 20, TRUE, 30, 'engineering', 'AKTU', 'Computer Science'),
(302, 'BEU B.Tech (Bihar Engineering University)', 'beu-btech-core', 'ENG-BEU-CORE', 'Bihar Engineering University 1st & 2nd Year common foundation: Basic Electrical, Engineering Mechanics & Mathematics.', 'Building2', '#0D9488', 14, TRUE, 31, 'engineering', 'BEU', 'All Branches'),
(303, 'Mechanical Engineering (Core Subjects)', 'mechanical-engineering', 'ENG-CORE-ME', 'Thermodynamics, Fluid Mechanics, Strength of Materials (SOM), and Heat Transfer university-verified notes.', 'Wrench', '#DC2626', 12, FALSE, 32, 'engineering', 'All Universities', 'Mechanical'),
(304, 'Civil Engineering (Core Subjects)', 'civil-engineering', 'ENG-CORE-CE', 'Structural Analysis, Surveying, Concrete Technology, and Geotechnical Engineering revision sheets.', 'HardHat', '#7C3AED', 10, FALSE, 33, 'engineering', 'All Universities', 'Civil'),

-- Degree & College Courses
(401, 'BCA (Bachelor of Computer Applications)', 'bca-degree-core', 'DEGREE-BCA-ALL', 'Python programming, C/C++, Web Technologies, and Software Engineering blueprints for BCA semesters.', 'Terminal', '#0284C7', 12, TRUE, 40, 'general_degree', 'All Universities', 'Computer Applications'),
(402, 'B.Com / BBA Financial Studies', 'bcom-finance-accounting', 'DEGREE-BCOM-FIN', 'Financial Accounting, Corporate Law, Cost Accounting, and Business Statistics fast-revision notes.', 'TrendingUp', '#16A34A', 9, FALSE, 41, 'general_degree', 'All Universities', 'Commerce & Finance')
ON CONFLICT (slug) DO UPDATE SET 
    domain = EXCLUDED.domain,
    target_exam_or_board = EXCLUDED.target_exam_or_board,
    department = EXCLUDED.department;

-- 6. Seed Pan-India High-Yield Study Notes
INSERT INTO notes (id, title, slug, subject_id, topic_label, exam_category, description, page_count, is_free, price, original_price, has_preview, preview_pages, is_featured, file_key, status, author, rating, topics_covered, domain, target_exam_or_board, medium, department, class_or_semester)
VALUES
-- UPSC
(101, 'UPSC Modern Indian History & Freedom Struggle Topper Notes', 'upsc-modern-indian-history-topper-notes', 101, 'Modern History & National Movement', 'UPSC Civil Services Prelims & Mains', 'Comprehensive chronological mind-maps from 1757 to 1947, Governor-Generals, Congress sessions, peasant revolts, and constitutional developments.', 72, FALSE, 89.00, 199.00, TRUE, 8, TRUE, 'notes/upsc-modern-history.pdf', 'published', 'Hritik Kumar & UPSC Toppers', 4.95, '["Advent of Europeans & Battle of Plassey/Buxar", "Socio-Religious Reform Movements", "Revolt of 1857: Causes & Consequences", "Gandhian Era Movements (NCM, CDM, QIM)", "Constitutional Acts (1773 to 1947)", "Important Committees & Freedom Fighters"]'::jsonb, 'general_competitions', 'UPSC', 'english', 'General Studies', 'Prelims & Mains'),

-- BPSC (हिंदी माध्यम)
(102, 'BPSC 70वीं/71वीं CCE: बिहार विशेष सामान्य ज्ञान एवं भूगोल मास्टर नोट्स', 'bpsc-bihar-special-gk-geography-notes', 102, 'बिहार का इतिहास, भूगोल एवं अर्थव्यवस्था', 'BPSC Prelims & Mains Special', 'बिहार का प्राचीन से आधुनिक इतिहास, भौतिक विभाजन, नदियाँ, खनिज, कृषि, महत्वपूर्ण योजनाएं एवं जनगणना 2011 का संपूर्ण हस्तलिखित सार।', 58, FALSE, 49.00, 129.00, TRUE, 7, TRUE, 'notes/bpsc-bihar-special.pdf', 'published', 'Hritik Kumar', 4.90, '["बिहार का प्राचीन इतिहास (मगध, मौर्य, गुप्त)", "बिहार का आधुनिक इतिहास एवं 1857 क्रांति (कुंवर सिंह)", "बिहार का भौतिक भूगोल एवं नदी तंत्र (गंगा, सोन, कोसी)", "बिहार की कृषि, मिट्टी एवं खनिज संपदा", "बिहार बजट, आर्थिक सर्वेक्षण एवं सात निश्चय योजना"]'::jsonb, 'general_competitions', 'BPSC', 'hindi', 'General Studies', 'Prelims & Mains'),

-- SSC
(103, 'SSC CGL/CHSL: Quantitative Aptitude Speed Maths & Formula Blueprint', 'ssc-cgl-quantitative-aptitude-speed-maths', 103, 'Arithmetic & Advance Mathematics', 'SSC CGL / CHSL / CPO', 'All 25 chapters formula tricks: Geometry, Trigonometry, Algebra, Mensuration, SI/CI shortcuts, Time & Work 15-second calculation techniques.', 64, FALSE, 29.00, 99.00, TRUE, 8, TRUE, 'notes/ssc-maths-speed-tricks.pdf', 'published', 'Hritik Kumar', 4.88, '["Algebraic Identities & Value-Putting Method", "Trigonometric Heights & Distances Direct Ratios", "Circle Theorems & Tangent Properties (Geometry)", "Mensuration 2D & 3D Volume Formulas", "Percentage, Profit & Loss Multiplier Tricks", "Time & Work LCM Efficiency Method"]'::jsonb, 'general_competitions', 'SSC', 'bilingual', 'General Aptitude', 'Tier 1 & 2'),

-- BSEB 12th (हिंदी माध्यम)
(201, 'BSEB 12th Inter: भौतिकी (Physics) संपूर्ण सूत्र, व्युत्पत्ति एवं महत्वपूर्ण थ्योरी', 'bseb-12th-physics-complete-formula-theory', 201, 'विद्युतस्थैतिकी, प्रकाशिकी एवं आधुनिक भौतिकी', 'Bihar School Examination Board 12th', 'बिहार बोर्ड 12वीं भौतिकी के सभी 15 अध्यायों के सूत्र, नियम (कूलॉम, गॉस, फैराडे, लेंस मेकर सूत्र) एवं 5 अंक वाले महत्वपूर्ण प्रश्न उत्तर।', 52, FALSE, 39.00, 119.00, TRUE, 6, TRUE, 'notes/bseb-12th-physics.pdf', 'published', 'Hritik Kumar', 4.92, '["विद्युत आवेश तथा क्षेत्र (गॉस का नियम)", "विद्युत धारा एवं किरचॉफ के नियम", "गतिमान आवेश और चुंबकत्व (बायो-सावर्ट नियम)", "किरण प्रकाशिकी (गोलीय दर्पण, लेंस मेकर सूत्र)", "तरंग प्रकाशिकी (हाइगेंस सिद्धांत, व्यतिकरण)", "परमाणु, नाभिक एवं अर्धचालक इलेक्ट्रॉनिकी"]'::jsonb, 'school_boards', 'BSEB', 'hindi', 'Science (PCM)', 'Class 12'),

-- CBSE 12th
(202, 'CBSE Class 12: Organic Chemistry Reaction Mechanisms & Mind-Maps', 'cbse-12th-organic-chemistry-reaction-mechanisms', 203, 'Organic Chemistry (All Units)', 'CBSE Class 12 Board', 'Reaction flowcharts, named reactions (Aldol, Cannizzaro, Reimer-Tiemann, Sandmeyer), conversions, and distinction tests (Lucas, Tollens, Fehling).', 48, FALSE, 49.00, 149.00, TRUE, 6, TRUE, 'notes/cbse-12th-organic-chemistry.pdf', 'published', 'Hritik Kumar', 4.90, '["Haloalkanes & Haloarenes (SN1 vs SN2)", "Alcohols, Phenols and Ethers (Kolbe & Reimer-Tiemann)", "Aldehydes, Ketones & Carboxylic Acids Conversions", "Amines: Basicity Order & Hoffmann Degradation", "Biomolecules: Glucose Structure & Peptide Bonds", "Top 30 Mandatory Named Reactions for 2026 Board"]'::jsonb, 'school_boards', 'CBSE', 'english', 'Science', 'Class 12'),

-- CBSE 10th (100% Free)
(203, 'CBSE Class 10 Mathematics: Chapterwise Formula Sheet & Solved Theorems', 'cbse-class-10-maths-formula-sheet', 204, 'All NCERT Chapters (Term 1 & 2)', 'CBSE Class 10 Board', 'Complete 100% Free master formula sheet covering Real Numbers, Polynomials, Triangles (BPT Theorem), Circles, Trigonometry, and Statistics.', 32, TRUE, 0.00, 0.00, TRUE, 32, TRUE, 'notes/free-cbse-10th-maths.pdf', 'published', 'Hritik Kumar', 5.00, '["Basic Proportionality Theorem (BPT Proof)", "Quadratic Formula & Nature of Roots (Discriminant)", "Trigonometric Identities (sin^2 + cos^2 = 1)", "Coordinate Geometry Distance & Section Formula", "Surface Areas and Volumes Quick Reference", "Mean, Median, Mode Empirical Relationship"]'::jsonb, 'school_boards', 'CBSE', 'english', 'Mathematics', 'Class 10'),

-- AKTU Engineering
(301, 'AKTU B.Tech CSE: Database Management Systems (Semester 4/5 Complete Notes)', 'aktu-btech-cse-dbms-complete-notes', 301, 'AKTU KCS-501 / BCS-401 Syllabus', 'Dr. APJ Abdul Kalam Technical University', 'Unit-wise mapped notes for AKTU: ER Modeling, Relational Algebra, SQL queries, Normalization (1NF to 5NF), Transaction ACID, and Concurrency Control.', 68, FALSE, 49.00, 149.00, TRUE, 8, TRUE, 'notes/aktu-btech-dbms.pdf', 'published', 'Hritik Kumar', 4.93, '["Unit 1: Database System Concepts & ER Diagrams", "Unit 2: Relational Model & Relational Algebra Operators", "Unit 3: SQL Triggers, Views & Complex Nested Queries", "Unit 4: Functional Dependencies & Normal Forms (1NF-BCNF)", "Unit 5: Transaction Serializability, Two-Phase Locking (2PL)"]'::jsonb, 'engineering', 'AKTU', 'english', 'Computer Science', 'Sem 4/5'),

-- BEU Engineering
(302, 'BEU B.Tech: Basic Electrical Engineering (1st Year All Branches)', 'beu-btech-basic-electrical-engineering', 302, 'BEU Code 100101 / 100201 Syllabus', 'Bihar Engineering University', 'DC Circuits (Thevenin, Norton, Superposition), AC fundamentals, Single-phase Transformers, and 3-phase Induction Motors with solved derivations.', 46, FALSE, 49.00, 129.00, TRUE, 6, TRUE, 'notes/beu-basic-electrical.pdf', 'published', 'Hritik Kumar', 4.87, '["DC Network Theorems: Thevenin & Norton with Examples", "AC Fundamentals: RMS, Average Value, Power Factor", "Single-Phase Transformer Equivalent Circuit & Efficiency", "Three-Phase Star & Delta Connection Calculations", "DC Machines & Induction Motors Operating Principles"]'::jsonb, 'engineering', 'BEU', 'english', 'All Branches', '1st Year'),

-- BCA Degree
(401, 'BCA: Python Programming & Object-Oriented Software Design', 'bca-python-programming-oops-notes', 401, 'Core Python & Object-Oriented Design', 'BCA / B.Sc Computer Science', 'Python data structures (lists, tuples, dicts), file handling, OOPs (Classes, Inheritance, Polymorphism), exception handling, and Tkinter GUI basics.', 54, FALSE, 39.00, 119.00, TRUE, 7, TRUE, 'notes/bca-python-programming.pdf', 'published', 'Hritik Kumar', 4.89, '["Python Syntax, Slicing & Built-in Functions", "List Comprehensions & Dictionary Transformations", "OOP: Encapsulation, Method Overriding & Dunder Methods", "Exception Handling with try-except-finally blocks", "File I/O and JSON Serialization", "Mini Project Blueprints for Practical Lab Viva"]'::jsonb, 'general_degree', 'All Universities', 'english', 'Computer Applications', 'Sem 2/3')
ON CONFLICT (slug) DO UPDATE SET 
    domain = EXCLUDED.domain,
    target_exam_or_board = EXCLUDED.target_exam_or_board,
    medium = EXCLUDED.medium,
    department = EXCLUDED.department,
    class_or_semester = EXCLUDED.class_or_semester;
