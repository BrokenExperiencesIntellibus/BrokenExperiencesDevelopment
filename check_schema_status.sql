-- Check current database schema status
-- Run this in Supabase SQL Editor to see current state

-- 1. Check if category table exists and its structure
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'category' 
ORDER BY ordinal_position;

-- 2. Check experience table structure, especially categoryId column
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'experience' 
AND column_name LIKE '%category%'
ORDER BY ordinal_position;

-- 3. Check if categories exist in database
SELECT COUNT(*) as category_count FROM category;

-- 4. List all existing categories
SELECT id, name, "createdAt", "updatedAt" FROM category ORDER BY name;

-- 5. Check foreign key constraint on experience.categoryId
SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name='experience'
AND kcu.column_name LIKE '%category%';

-- 6. Check experience table nullable constraints
SELECT 
    column_name,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'experience' 
AND column_name IN ('categoryId', 'category_id');