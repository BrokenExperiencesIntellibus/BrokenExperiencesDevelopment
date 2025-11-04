-- Verify AI categorization setup is working
-- Run this after the schema fix to confirm everything is ready

-- 1. Verify all required categories exist
SELECT 'Required categories check:' as test;
SELECT name, id FROM category 
WHERE name IN (
    'Building Maintenance',
    'Environmental Issues', 
    'Graffiti & Vandalism',
    'Noise & Disturbances',
    'Parks & Recreation',
    'Public Safety',
    'Public Transportation',
    'Road & Infrastructure',
    'Sidewalks & Walkways',
    'Street Lighting',
    'Traffic & Parking',
    'Waste Management',
    'Water & Drainage',
    'Other'
)
ORDER BY name;

-- 2. Verify categoryId is nullable in experience table
SELECT 'Experience.categoryId nullable check:' as test;
SELECT 
    column_name,
    is_nullable,
    data_type
FROM information_schema.columns 
WHERE table_name = 'experience' 
AND column_name = 'categoryId';

-- 3. Verify foreign key constraint exists but allows NULL
SELECT 'Foreign key constraint check:' as test;
SELECT
    tc.constraint_name,
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name = 'experience'
AND kcu.column_name = 'categoryId';

-- 4. Test that we can insert experience without categoryId (for AI categorization)
-- This will test the setup without actually creating data
SELECT 'Test AI categorization compatibility:' as test;
-- Validate that NULL categoryId would be accepted
SELECT 
    CASE 
        WHEN (SELECT is_nullable FROM information_schema.columns WHERE table_name = 'experience' AND column_name = 'categoryId') = 'YES' 
        THEN 'PASS: Experience can be created without categoryId for AI processing'
        ELSE 'FAIL: categoryId is still required - schema update needed'
    END as ai_categorization_status;

-- 5. Show summary
SELECT 'Summary:' as info, COUNT(*) as total_categories FROM category;
SELECT 'Ready for AI categorization' as status WHERE EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'experience' 
    AND column_name = 'categoryId' 
    AND is_nullable = 'YES'
);