-- Migration: Add image_url column to local_spots table
-- Date: 2025-11-06
-- Description: Add support for image URLs in local spots for better visual presentation

-- Add image_url column to local_spots table
ALTER TABLE local_spots ADD COLUMN image_url TEXT;

-- Note: This migration was applied manually to production on 2025-11-06
-- guide_articles table already had image_url column
-- guide_articles.icon and guide_articles.description columns were also added manually to production
