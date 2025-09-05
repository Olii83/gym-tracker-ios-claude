-- Final safe exercise insertion script with proper UUID handling
-- This version is clean and handles UUID type correctly

-- Create temporary table to avoid type issues
CREATE TEMP TABLE temp_exercises AS
SELECT name, muscle_group, equipment
FROM (VALUES
-- Chest Exercises
('Bankdrücken (Langhantel)', 'Brust', 'Langhantel'),
('Schrägbankdrücken (Langhantel)', 'Brust', 'Langhantel'),
('Bankdrücken (Kurzhantel)', 'Brust', 'Kurzhantel'),
('Fliegende (Kurzhantel)', 'Brust', 'Kurzhantel'),
('Brustpresse (Maschine)', 'Brust', 'Maschine'),
('Butterfly (Maschine)', 'Brust', 'Maschine'),
('Liegestütze', 'Brust', 'Körpergewicht'),
('Dips', 'Brust', 'Körpergewicht'),

-- Back Exercises
('Kreuzheben (Langhantel)', 'Rücken', 'Langhantel'),
('Rudern vorgebeugt (Langhantel)', 'Rücken', 'Langhantel'),
('Rudern einarmig (Kurzhantel)', 'Rücken', 'Kurzhantel'),
('Latzug breit', 'Rücken', 'Maschine'),
('Latzug eng', 'Rücken', 'Maschine'),
('Klimmzüge breit', 'Rücken', 'Körpergewicht'),
('Klimmzüge eng', 'Rücken', 'Körpergewicht'),

-- Shoulder Exercises  
('Military Press (Langhantel)', 'Schultern', 'Langhantel'),
('Schulterdrücken (Kurzhantel)', 'Schultern', 'Kurzhantel'),
('Seitheben (Kurzhantel)', 'Schultern', 'Kurzhantel'),
('Schulterdrücken (Maschine)', 'Schultern', 'Maschine'),

-- Arms - Biceps
('Bizeps Curls (Langhantel)', 'Bizeps', 'Langhantel'),
('Bizeps Curls (Kurzhantel)', 'Bizeps', 'Kurzhantel'),
('Hammer Curls', 'Bizeps', 'Kurzhantel'),
('Bizeps Curls (Kabel)', 'Bizeps', 'Kabel'),

-- Arms - Triceps
('French Press (Langhantel)', 'Trizeps', 'Langhantel'),
('French Press (Kurzhantel)', 'Trizeps', 'Kurzhantel'),
('Trizeps Pushdowns', 'Trizeps', 'Kabel'),
('Close-Grip Push-ups', 'Trizeps', 'Körpergewicht'),

-- Legs
('Kniebeugen (Langhantel)', 'Beine', 'Langhantel'),
('Kniebeugen (Kurzhantel)', 'Beine', 'Kurzhantel'),
('Beinpresse', 'Beine', 'Maschine'),
('Leg Extensions', 'Beine', 'Maschine'),
('Leg Curls liegend', 'Beine', 'Maschine'),
('Kniebeugen (Körpergewicht)', 'Beine', 'Körpergewicht'),
('Jump Squats', 'Beine', 'Körpergewicht'),
('Ausfallschritte (Kurzhantel)', 'Beine', 'Kurzhantel'),

-- Core/Abs
('Crunches', 'Bauch', 'Körpergewicht'),
('Plank', 'Bauch', 'Körpergewicht'),
('Russian Twists', 'Bauch', 'Körpergewicht'),
('Mountain Climbers', 'Bauch', 'Körpergewicht'),
('Cable Crunches', 'Bauch', 'Kabel'),

-- Kettlebell
('Kettlebell Swings', 'Ganzkörper', 'Kettlebell'),
('Kettlebell Goblet Squats', 'Beine', 'Kettlebell'),
('Turkish Get-ups', 'Ganzkörper', 'Kettlebell'),

-- Compound/Functional
('Burpees', 'Ganzkörper', 'Körpergewicht'),
('Thrusters (Kurzhantel)', 'Ganzkörper', 'Kurzhantel'),
('Clean & Jerk', 'Ganzkörper', 'Langhantel'),

-- Cardio
('Laufband', 'Cardio', 'Maschine'),
('Fahrrad (Ergometer)', 'Cardio', 'Maschine'),
('Rudergerät', 'Cardio', 'Maschine'),

-- Calves
('Wadenheben stehend', 'Waden', 'Maschine'),
('Wadenheben (Kurzhantel)', 'Waden', 'Kurzhantel')

) AS exercise_data(name, muscle_group, equipment);

-- Insert exercises that don't already exist
INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT te.name, te.muscle_group, te.equipment, NULL::uuid
FROM temp_exercises te
WHERE NOT EXISTS (
    SELECT 1 FROM exercises e 
    WHERE e.name = te.name
);

-- Clean up
DROP TABLE temp_exercises;