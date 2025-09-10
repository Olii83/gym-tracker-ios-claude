-- Migration: Add preferred_unit column to exercises table
-- Date: 2025-01-09
-- Description: Adds preferred weight unit (kg/lb) to exercises for better UX

-- 1. Add the new column with constraint
ALTER TABLE exercises 
ADD COLUMN preferred_unit TEXT CHECK (preferred_unit IN ('kg', 'lb'));

-- 2. Set intelligent defaults based on exercise names and equipment
-- German/European exercises typically use kg
UPDATE exercises SET preferred_unit = 'kg' 
WHERE preferred_unit IS NULL 
AND (
  -- Langhantel exercises
  name ILIKE '%langhantel%' OR
  name ILIKE '%hantel%' OR
  name ILIKE '%barbell%' OR
  -- Kurzhanteln
  name ILIKE '%kurzhantel%' OR
  name ILIKE '%dumbbell%' OR
  -- Machine exercises (typical German gym equipment)
  name ILIKE '%maschine%' OR
  name ILIKE '%beinpresse%' OR
  name ILIKE '%latzug%' OR
  name ILIKE '%rudern%' OR
  name ILIKE '%bankdr%' OR
  name ILIKE '%schulterdr%' OR
  -- Equipment that's typically metric
  equipment ILIKE '%langhantel%' OR
  equipment ILIKE '%kurzhantel%' OR
  equipment ILIKE '%maschine%' OR
  equipment ILIKE '%smith%'
);

-- 3. Set lb for exercises that are commonly tracked in pounds
UPDATE exercises SET preferred_unit = 'lb' 
WHERE preferred_unit IS NULL 
AND (
  -- Cable exercises (often have plate stacks in lb)
  name ILIKE '%kabel%' OR
  name ILIKE '%cable%' OR
  name ILIKE '%seil%' OR
  equipment ILIKE '%kabel%' OR
  equipment ILIKE '%cable%' OR
  equipment ILIKE '%seilzug%' OR
  -- Some cardio equipment with weights
  equipment ILIKE '%crosstrainer%' OR
  equipment ILIKE '%elliptical%'
);

-- 4. Default remaining exercises to kg (German standard)
UPDATE exercises SET preferred_unit = 'kg' 
WHERE preferred_unit IS NULL;

-- 5. Add index for performance (optional but recommended)
CREATE INDEX IF NOT EXISTS idx_exercises_preferred_unit 
ON exercises(preferred_unit);

-- 6. Verification queries (run these to check the migration)
-- SELECT preferred_unit, COUNT(*) as count 
-- FROM exercises 
-- GROUP BY preferred_unit;

-- SELECT name, equipment, preferred_unit 
-- FROM exercises 
-- WHERE user_id IS NULL  -- Default exercises
-- ORDER BY name;