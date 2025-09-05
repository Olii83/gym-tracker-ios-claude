-- Database Migration: Add equipment column to exercises table
-- This script safely adds the equipment column and preserves existing data

-- Step 1: Add equipment column to exercises table
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS equipment TEXT;

-- Step 2: Update existing exercises with equipment information where possible
-- Based on common exercise names, we can infer some equipment types

-- Langhantel exercises
UPDATE exercises SET equipment = 'Langhantel' 
WHERE equipment IS NULL AND (
  name ILIKE '%langhantel%' OR 
  name ILIKE '%barbell%' OR
  name IN ('Bankdrücken', 'Kreuzheben', 'Kniebeugen', 'Military Press', 'Rudern vorgebeugt')
);

-- Kurzhantel exercises  
UPDATE exercises SET equipment = 'Kurzhantel'
WHERE equipment IS NULL AND (
  name ILIKE '%kurzhantel%' OR 
  name ILIKE '%dumbbell%' OR
  name IN ('Bizeps Curls', 'Schulterdrücken', 'Fliegende')
);

-- Körpergewicht exercises
UPDATE exercises SET equipment = 'Körpergewicht'
WHERE equipment IS NULL AND (
  name IN ('Liegestütze', 'Klimmzüge', 'Dips', 'Crunches', 'Plank', 'Burpees', 'Mountain Climbers')
);

-- Maschinen exercises
UPDATE exercises SET equipment = 'Maschine'
WHERE equipment IS NULL AND (
  name ILIKE '%maschine%' OR
  name ILIKE '%presse%' OR
  name IN ('Latzug', 'Beinpresse', 'Leg Extensions', 'Leg Curls')
);

-- Set default equipment for remaining exercises
UPDATE exercises SET equipment = 'Sonstiges' WHERE equipment IS NULL;