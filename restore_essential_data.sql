-- ================================================
-- RESTORE ESSENTIAL DATA AFTER DATABASE RESET
-- ================================================

-- 1. Create default categories (no description column in current schema)
INSERT INTO category (id, name, "createdAt", "updatedAt") VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Infrastructure', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'Safety', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'Environment', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'Public Services', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'Community', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 2. Create a sample user first
INSERT INTO "user" (id, name, email, image, "emailVerified", "createdAt", "updatedAt") VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Doug', 'dougy30@gmail.com', NULL, true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Create user settings for the current user (dougy)
-- First, let's check if the user exists and get their ID
DO $$
DECLARE
    user_id_var UUID := '550e8400-e29b-41d4-a716-446655440000';
BEGIN
    -- If user exists, create their settings
    IF user_id_var IS NOT NULL THEN
        INSERT INTO user_settings (
            user_id,
            email_notifications,
            push_notifications, 
            issue_updates,
            weekly_report,
            show_profile,
            show_activity, 
            show_stats,
            theme,
            language,
            map_style,
            pwa_install_prompt_seen,
            proximity_notifications,
            proximity_radius,
            created_at,
            updated_at
        ) VALUES (
            user_id_var,
            true,
            true,
            true,
            false,
            true,
            true,
            true,
            'system',
            'en',
            'satellite-v9',
            false,
            true,
            5.0,
            NOW(),
            NOW()
        ) ON CONFLICT (user_id) DO NOTHING;
        
        RAISE NOTICE 'Created settings for user: %', user_id_var;
    ELSE
        RAISE NOTICE 'User not found with email dougy30@gmail.com';
    END IF;
END $$;

-- 3. Create a sample experience to test the system
DO $$
DECLARE
    user_id_var UUID := '550e8400-e29b-41d4-a716-446655440000';
    category_id_var UUID := '550e8400-e29b-41d4-a716-446655440001'; -- Infrastructure category
    experience_id_var UUID := '550e8400-e29b-41d4-a716-446655440010';
BEGIN
    
    IF user_id_var IS NOT NULL THEN
        -- Create sample experience
        INSERT INTO experience (
            id,
            "reportedBy",
            "categoryId",
            title,
            description,
            latitude,
            longitude,
            address,
            status,
            priority,
            "createdAt",
            "updatedAt",
            upvotes,
            downvotes
        ) VALUES (
            experience_id_var,
            user_id_var,
            category_id_var,
            'Pothole on Main Street',
            'Large pothole causing damage to vehicles. Located near the intersection with Oak Street.',
            40.7128, -- NYC coordinates as example
            -74.0060,
            'Main Street near Oak Street intersection',
            'pending',
            'medium',
            NOW(),
            NOW(),
            0,
            0
        ) ON CONFLICT (id) DO NOTHING;
        
        -- Create a geofence region for this experience
        INSERT INTO geofence_regions (
            id,
            experience_id,
            latitude,
            longitude,
            radius,
            active,
            created_by,
            created_at,
            updated_at
        ) VALUES (
            'geo-' || experience_id_var::text,
            experience_id_var::text,
            '40.7128',
            '-74.0060', 
            100, -- 100 meter radius
            true,
            user_id_var::text,
            NOW(),
            NOW()
        ) ON CONFLICT (id) DO NOTHING;
        
        RAISE NOTICE 'Created sample experience: %', experience_id_var;
    END IF;
END $$;

-- ================================================
-- VERIFICATION QUERIES
-- ================================================

-- Verify categories were created
SELECT COUNT(*) as category_count FROM category;
SELECT name FROM category ORDER BY name;

-- Verify user settings
SELECT COUNT(*) as user_settings_count FROM user_settings;

-- Verify experience was created  
SELECT COUNT(*) as experience_count FROM experience;
SELECT id, title, status FROM experience;

-- Verify geofence region was created
SELECT COUNT(*) as geofence_count FROM geofence_regions;

-- Database restoration complete!