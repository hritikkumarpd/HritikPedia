-- ==============================================================================
-- HRITIKPEDIA SEED DATA 001
-- Zero-Budget Real Educational Data
-- ==============================================================================

-- 1. Insert Initial Core Subjects
INSERT INTO subjects (id, name, slug, code, description, icon, color, note_count, is_featured, order_index)
VALUES 
(1, 'Database Management Systems (DBMS)', 'dbms', 'CS-DBMS-101', 'Relational algebra, SQL, ER modeling, normalization (1NF to BCNF), indexing, and transaction management (ACID properties).', 'Database', '#087BFF', 8, TRUE, 1),
(2, 'Operating Systems', 'operating-systems', 'CS-OS-201', 'Process synchronization, CPU scheduling algorithms, virtual memory paging, deadlock handling, and file system architecture.', 'Cpu', '#10B981', 7, TRUE, 2),
(3, 'Computer Networks', 'computer-networks', 'CS-CN-301', 'OSI and TCP/IP protocol stacks, IP subnetting, routing algorithms, transport layer congestion control, and network security.', 'Network', '#6366F1', 6, TRUE, 3),
(4, 'Digital Logic & Computer Architecture', 'digital-logic', 'CS-DLCA-102', 'Boolean algebra, Karnaugh maps, combinational circuits, sequential flip-flops, pipelining, and instruction set architectures.', 'CircuitBoard', '#F59E0B', 5, TRUE, 4),
(5, 'Data Structures & Algorithms', 'data-structures-algorithms', 'CS-DSA-202', 'Asymptotic complexity, linear & non-linear structures, balanced trees, graph traversals, greedy strategies, and dynamic programming.', 'Binary', '#EC4899', 9, TRUE, 5),
(6, 'Bihar STET Computer Science', 'bihar-stet-computer-science', 'EXAM-STET-CS', 'Syllabus-aligned preparation notes, previous year solved theoretical questions, pedagogical concepts, and key subject summaries.', 'GraduationCap', '#8B5CF6', 11, TRUE, 6)
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Initial Study Notes
INSERT INTO notes (id, title, slug, subject_id, topic_label, exam_category, description, page_count, is_free, price, original_price, has_preview, preview_pages, is_featured, file_key, status, author, rating, topics_covered)
VALUES
(1, 'DBMS Normalization & Functional Dependencies Complete Guide', 'dbms-normalization-notes', 1, 'Relational Database Design', 'GATE & University Exams', 'Comprehensive handwritten & digital notes covering 1NF, 2NF, 3NF, BCNF, lossless join decomposition, and dependency preservation with step-by-step solved examples.', 38, FALSE, 99.00, 199.00, TRUE, 5, TRUE, 'notes/dbms-normalization-complete.pdf', 'published', 'Hritik Kumar', 4.90, '["Functional Dependencies & Closure Sets", "Candidate Key Determination Algorithm", "First, Second, and Third Normal Forms", "Boyce-Codd Normal Form (BCNF) Anomalies", "Lossless Join Decomposition Theorem", "GATE & Semester Solved Numerical Problems"]'::jsonb),
(2, 'Operating Systems: Process Synchronization & Deadlocks Handbook', 'operating-systems-process-synchronization', 2, 'Concurrency & Deadlocks', 'Engineering Core', 'Master critical section problems, Peterson algorithm, semaphores, mutex locks, classical synchronization problems, and Banker’s algorithm.', 44, FALSE, 129.00, 249.00, TRUE, 6, TRUE, 'notes/os-synchronization-deadlocks.pdf', 'published', 'Hritik Kumar', 4.80, '["Critical Section Problem Conditions", "Counting & Binary Semaphores", "Dining Philosophers & Producer-Consumer", "Banker’s Algorithm for Deadlock Avoidance", "Resource Allocation Graphs (RAG)", "Memory Management Paging & Segmentation"]'::jsonb),
(3, 'Digital Logic: Boolean Algebra & Karnaugh Map Master Revision', 'digital-logic-k-maps-revision', 4, 'Combinational Logic', 'All Engineering & STET', 'Zero-confusion revision sheets for 2, 3, 4, and 5 variable K-Maps, don’t care conditions, logic gates truth tables, and SOP/POS minimization.', 22, TRUE, 0.00, 0.00, TRUE, 22, TRUE, 'notes/free-digital-logic-kmap.pdf', 'published', 'Hritik Kumar', 5.00, '["Standard Sum of Products (SOP) & POS", "2, 3, 4-variable K-Map Grouping Rules", "Handling Don’t Care Conditions", "Quine-McCluskey Tabular Minimization", "Multiplexers & Decoder Syntheses"]'::jsonb),
(4, 'Computer Networks: TCP/IP & Subnetting Fast Reference Chart', 'computer-networks-subnetting-guide', 3, 'Network & Transport Layer', 'GATE & Industry Prep', 'Practical formulas, CIDR notation conversion tables, FLSM vs VLSM calculations, TCP handshake states, and header breakdowns.', 30, TRUE, 0.00, 0.00, TRUE, 30, TRUE, 'notes/free-cn-subnetting-guide.pdf', 'published', 'Hritik Kumar', 4.90, '["IPv4 vs IPv6 Header Comparison", "Subnet Masking & Host Calculation Shortcut", "CIDR Prefix to Subnet Table", "TCP 3-Way Handshake & Teardown States", "Congestion Window Slow Start & AIMD"]'::jsonb),
(5, 'Bihar STET Computer Science Paper 2 Complete Syllabus Blueprint', 'bihar-stet-cs-syllabus-blueprint', 6, 'Exam Strategy & Core Syllabus', 'Teacher Recruitment Exam', 'Official syllabus breakdown, topic-wise marks distribution, high-weightage chapters, theoretical summaries, and previous exam pattern analysis.', 52, FALSE, 149.00, 299.00, TRUE, 8, TRUE, 'notes/bihar-stet-cs-complete-blueprint.pdf', 'published', 'Hritik Kumar', 4.90, '["Unit-Wise Weightage Analysis", "C++ & Data Structures Key Syntax Notes", "DBMS SQL Queries & Key Constraints", "Operating System Algorithms Summary", "Computer Architecture & Memory Hierarchy", "50 Solved Theoretical PYQ Exemplars"]'::jsonb)
ON CONFLICT (slug) DO NOTHING;

-- 3. Insert Initial Articles
INSERT INTO articles (id, title, slug, category, excerpt, content, author, reading_time, status)
VALUES
(1, 'How to Prepare for Computer Science Engineering Exams: A Structured Blueprint', 'how-to-prepare-computer-science', 'Study Strategy', 'A practical, step-by-step roadmap to mastering core CS subjects (DBMS, OS, CN, Digital Logic) without feeling overwhelmed by voluminous textbooks.', 'Preparing for exams in Computer Science requires balancing mathematical intuition with architectural comprehension...', 'Hritik Kumar', '6 min read', 'published'),
(2, 'Demystifying Database Normalization: From 1NF to BCNF with Real Examples', 'demystifying-database-normalization', 'DBMS', 'Understand why data anomalies occur in denormalized tables and learn how to decompose relations while preserving dependencies and lossless join properties.', 'Database normalization is the systematic approach of decomposing tables to eliminate data redundancy...', 'Hritik Kumar', '8 min read', 'published'),
(3, 'Process Synchronization in Modern Operating Systems: Semaphores vs Mutexes', 'process-synchronization-semaphores-mutex', 'Operating Systems', 'Clear up the common confusion between binary semaphores and mutex locks with code examples, ownership mechanics, and priority inversion scenarios.', 'In concurrent execution, when two or more processes access shared data simultaneously, race conditions occur...', 'Hritik Kumar', '7 min read', 'published')
ON CONFLICT (slug) DO NOTHING;

-- 4. Insert Default Ad Slots
INSERT INTO advertising_placements (slot_id, name, description, format, active, ad_type, title, sponsor_name, link, banner_text)
VALUES
('home_top', 'Homepage Top Banner', 'Header placement below main navigation on homepage', 'leaderboard', TRUE, 'sponsor', 'Quality Educational Resources', 'Hritikpedia Community', '/free-resources', 'Access our library of 100% Free Computer Science revision guides & blueprints.'),
('home_below_hero', 'Homepage Below Hero', 'Wide banner placement directly following hero section', 'billboard', TRUE, 'sponsor', 'Bihar STET 2026 Preparation Hub', 'Exam Focused Learning', '/notes/bihar-stet-cs-syllabus-blueprint', 'Structured notes covering full Paper-2 syllabus, marks breakdown & theory.'),
('home_between_sections', 'Homepage Mid-Page Sponsor', 'Between subjects and featured notes section', 'responsive banner', TRUE, 'sponsor', 'Verified Handwritten PDF Notes', 'Hritikpedia Editorial', '/notes', 'Clean digital reading with instant access and zero distraction.'),
('subject_top', 'Subject Catalog Top', 'Top placement on subjects listing page', 'responsive leaderboard', TRUE, 'sponsor', 'Free Computer Science Syllabus Guides', 'Hritikpedia Free Tier', '/free-resources', 'Browse 100% verified free educational notes and syllabus outlines.'),
('article_inline', 'Article In-Content Banner', 'Mid-article educational placement', 'in-article rectangle', TRUE, 'sponsor', 'Explore Subject Notes', 'Hritikpedia Notes', '/notes', 'Dive deeper into core CS topics with our structured chapter notes.')
ON CONFLICT (slot_id) DO NOTHING;
