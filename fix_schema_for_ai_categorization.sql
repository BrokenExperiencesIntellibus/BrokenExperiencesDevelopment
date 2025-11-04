-- Fix schema for AI categorization
-- Run this in Supabase SQL Editor after checking current status

-- 1. Make categoryId nullable in experience table (if not already)
-- This allows AI to determine category after experience creation
ALTER TABLE experience 
ALTER COLUMN "categoryId" DROP NOT NULL;

-- 2. Ensure category table exists with proper structure
CREATE TABLE IF NOT EXISTS category (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL UNIQUE,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 3. Create index on category.id for better performance
CREATE INDEX IF NOT EXISTS idx_category_id ON category(id);

-- 4. Insert all required categories if they don't exist
INSERT INTO category (name) VALUES 
    ('Building Maintenance'),
    ('Environmental Issues'),
    ('Graffiti & Vandalism'),
    ('Noise & Disturbances'),
    ('Parks & Recreation'),
    ('Public Safety'),
    ('Public Transportation'),
    ('Road & Infrastructure'),
    ('Sidewalks & Walkways'),
    ('Street Lighting'),
    ('Traffic & Parking'),
    ('Waste Management'),
    ('Water & Drainage'),
    ('Other')
ON CONFLICT (name) DO NOTHING;

-- 5. Ensure foreign key relationship exists (but allows NULL)
-- First drop existing constraint if it exists and is too restrictive
DO $$ 
BEGIN
    -- Check if constraint exists and drop if needed
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'experience_categoryId_fkey' 
        AND table_name = 'experience'
    ) THEN
        ALTER TABLE experience DROP CONSTRAINT experience_categoryId_fkey;
    END IF;
END $$;

-- Add proper foreign key constraint that allows NULL
ALTER TABLE experience 
ADD CONSTRAINT experience_categoryId_fkey 
FOREIGN KEY ("categoryId") REFERENCES category(id) 
ON DELETE SET NULL;

-- 6. Update any existing experiences with NULL categoryId to use "Other" category
UPDATE experience 
SET "categoryId" = (SELECT id FROM category WHERE name = 'Other' LIMIT 1)
WHERE "categoryId" IS NULL;

-- 7. Verify the changes
SELECT 'Schema update completed' as status;

-- 8. Show final category counts
SELECT 
    'Categories available:' as info,
    COUNT(*) as count 
FROM category;

-- 9. Show sample of experience table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'experience' 
AND column_name IN ('id', 'title', 'categoryId', 'createdAt')
ORDER BY ordinal_position;