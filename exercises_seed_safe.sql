-- Safe exercise insertion script that avoids duplicates
-- This version uses INSERT ... WHERE NOT EXISTS to prevent duplicates

-- Chest Exercises
INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT name, muscle_group, equipment, user_id::uuid FROM (VALUES
-- Barbell
('Bankdrücken (Langhantel)', 'Brust', 'Langhantel', NULL),
('Schrägbankdrücken (Langhantel)', 'Brust', 'Langhantel', NULL),
('Negativ-Bankdrücken (Langhantel)', 'Brust', 'Langhantel', NULL),
('Bankdrücken eng (Langhantel)', 'Brust', 'Langhantel', NULL),
-- Dumbbell
('Bankdrücken (Kurzhantel)', 'Brust', 'Kurzhantel', NULL),
('Schrägbankdrücken (Kurzhantel)', 'Brust', 'Kurzhantel', NULL),
('Fliegende (Kurzhantel)', 'Brust', 'Kurzhantel', NULL),
('Pullover (Kurzhantel)', 'Brust', 'Kurzhantel', NULL),
-- Machine
('Brustpresse (Maschine)', 'Brust', 'Maschine', NULL),
('Butterfly (Maschine)', 'Brust', 'Maschine', NULL),
('Cable Crossover', 'Brust', 'Kabel', NULL),
-- Bodyweight
('Liegestütze', 'Brust', 'Körpergewicht', NULL),
('Dips', 'Brust', 'Körpergewicht', NULL),
('Archer Pushups', 'Brust', 'Körpergewicht', NULL),
('Diamond Pushups', 'Brust', 'Körpergewicht', NULL),

-- Back Exercises
-- Barbell
('Kreuzheben (Langhantel)', 'Rücken', 'Langhantel', NULL),
('Rudern vorgebeugt (Langhantel)', 'Rücken', 'Langhantel', NULL),
('T-Bar Rudern', 'Rücken', 'Langhantel', NULL),
('Pendlay Rows', 'Rücken', 'Langhantel', NULL),
-- Dumbbell
('Rudern einarmig (Kurzhantel)', 'Rücken', 'Kurzhantel', NULL),
('Rudern beidarmig (Kurzhantel)', 'Rücken', 'Kurzhantel', NULL),
('Reverse Flyes (Kurzhantel)', 'Rücken', 'Kurzhantel', NULL),
-- Machine
('Latzug breit', 'Rücken', 'Maschine', NULL),
('Latzug eng', 'Rücken', 'Maschine', NULL),
('Rudern sitzend (Kabel)', 'Rücken', 'Kabel', NULL),
('Hyperextensions', 'Rücken', 'Maschine', NULL),
-- Bodyweight
('Klimmzüge breit', 'Rücken', 'Körpergewicht', NULL),
('Klimmzüge eng', 'Rücken', 'Körpergewicht', NULL),
('Chin-ups', 'Rücken', 'Körpergewicht', NULL),
('Australian Pull-ups', 'Rücken', 'Körpergewicht', NULL),

-- Shoulder Exercises
-- Barbell
('Military Press (Langhantel)', 'Schultern', 'Langhantel', NULL),
('Behind-the-neck Press', 'Schultern', 'Langhantel', NULL),
('Upright Rows (Langhantel)', 'Schultern', 'Langhantel', NULL),
-- Dumbbell
('Schulterdrücken (Kurzhantel)', 'Schultern', 'Kurzhantel', NULL),
('Seitheben (Kurzhantel)', 'Schultern', 'Kurzhantel', NULL),
('Frontheben (Kurzhantel)', 'Schultern', 'Kurzhantel', NULL),
('Reverse Flyes (Kurzhantel)', 'Schultern', 'Kurzhantel', NULL),
('Arnold Press', 'Schultern', 'Kurzhantel', NULL),
-- Machine
('Schulterdrücken (Maschine)', 'Schultern', 'Maschine', NULL),
('Seitheben (Kabel)', 'Schultern', 'Kabel', NULL),
('Face Pulls', 'Schultern', 'Kabel', NULL),
-- Bodyweight
('Pike Push-ups', 'Schultern', 'Körpergewicht', NULL),
('Handstand Push-ups', 'Schultern', 'Körpergewicht', NULL),

-- Arms - Biceps
-- Barbell
('Bizeps Curls (Langhantel)', 'Bizeps', 'Langhantel', NULL),
('EZ-Bar Curls', 'Bizeps', 'Langhantel', NULL),
('Preacher Curls (Langhantel)', 'Bizeps', 'Langhantel', NULL),
-- Dumbbell
('Bizeps Curls (Kurzhantel)', 'Bizeps', 'Kurzhantel', NULL),
('Hammer Curls', 'Bizeps', 'Kurzhantel', NULL),
('Concentration Curls', 'Bizeps', 'Kurzhantel', NULL),
('Incline Curls', 'Bizeps', 'Kurzhantel', NULL),
-- Machine
('Bizeps Curls (Kabel)', 'Bizeps', 'Kabel', NULL),
('Preacher Curls (Maschine)', 'Bizeps', 'Maschine', NULL),

-- Arms - Triceps
-- Barbell
('French Press (Langhantel)', 'Trizeps', 'Langhantel', NULL),
('Bankdrücken eng (Langhantel)', 'Trizeps', 'Langhantel', NULL),
-- Dumbbell
('French Press (Kurzhantel)', 'Trizeps', 'Kurzhantel', NULL),
('Kickbacks (Kurzhantel)', 'Trizeps', 'Kurzhantel', NULL),
('Overhead Extension', 'Trizeps', 'Kurzhantel', NULL),
-- Machine
('Trizeps Pushdowns', 'Trizeps', 'Kabel', NULL),
('Overhead Extension (Kabel)', 'Trizeps', 'Kabel', NULL),
-- Bodyweight
('Close-Grip Push-ups', 'Trizeps', 'Körpergewicht', NULL),
('Bench Dips', 'Trizeps', 'Körpergewicht', NULL),

-- Legs - Quadriceps
-- Barbell
('Kniebeugen (Langhantel)', 'Beine', 'Langhantel', NULL),
('Front Squats', 'Beine', 'Langhantel', NULL),
('Bulgarian Split Squats', 'Beine', 'Langhantel', NULL),
('Ausfallschritte (Langhantel)', 'Beine', 'Langhantel', NULL),
-- Dumbbell
('Kniebeugen (Kurzhantel)', 'Beine', 'Kurzhantel', NULL),
('Ausfallschritte (Kurzhantel)', 'Beine', 'Kurzhantel', NULL),
('Step-ups (Kurzhantel)', 'Beine', 'Kurzhantel', NULL),
-- Machine
('Beinpresse', 'Beine', 'Maschine', NULL),
('Leg Extensions', 'Beine', 'Maschine', NULL),
('Hack Squats', 'Beine', 'Maschine', NULL),
-- Bodyweight
('Kniebeugen (Körpergewicht)', 'Beine', 'Körpergewicht', NULL),
('Jump Squats', 'Beine', 'Körpergewicht', NULL),
('Pistol Squats', 'Beine', 'Körpergewicht', NULL),
('Wall Sits', 'Beine', 'Körpergewicht', NULL),

-- Legs - Hamstrings/Glutes
-- Barbell
('Rumänisches Kreuzheben', 'Beine', 'Langhantel', NULL),
('Sumo Kreuzheben', 'Beine', 'Langhantel', NULL),
('Good Mornings', 'Beine', 'Langhantel', NULL),
-- Dumbbell
('Rumänisches Kreuzheben (Kurzhantel)', 'Beine', 'Kurzhantel', NULL),
('Ausfallschritte rückwärts', 'Beine', 'Kurzhantel', NULL),
-- Machine
('Leg Curls liegend', 'Beine', 'Maschine', NULL),
('Leg Curls sitzend', 'Beine', 'Maschine', NULL),
('Hip Thrusts (Maschine)', 'Beine', 'Maschine', NULL),
-- Bodyweight
('Glute Bridges', 'Beine', 'Körpergewicht', NULL),
('Hip Thrusts', 'Beine', 'Körpergewicht', NULL),
('Single Leg Glute Bridge', 'Beine', 'Körpergewicht', NULL),

-- Calves
('Wadenheben stehend', 'Waden', 'Maschine', NULL),
('Wadenheben sitzend', 'Waden', 'Maschine', NULL),
('Wadenheben (Kurzhantel)', 'Waden', 'Kurzhantel', NULL),
('Wadenheben einbeinig', 'Waden', 'Körpergewicht', NULL),

-- Core/Abs
-- Bodyweight
('Crunches', 'Bauch', 'Körpergewicht', NULL),
('Sit-ups', 'Bauch', 'Körpergewicht', NULL),
('Plank', 'Bauch', 'Körpergewicht', NULL),
('Side Plank', 'Bauch', 'Körpergewicht', NULL),
('Mountain Climbers', 'Bauch', 'Körpergewicht', NULL),
('Russian Twists', 'Bauch', 'Körpergewicht', NULL),
('Bicycle Crunches', 'Bauch', 'Körpergewicht', NULL),
('Leg Raises', 'Bauch', 'Körpergewicht', NULL),
('Dead Bug', 'Bauch', 'Körpergewicht', NULL),
-- Machine/Equipment
('Cable Crunches', 'Bauch', 'Kabel', NULL),
('Ab Wheel', 'Bauch', 'Equipment', NULL),
('Hanging Knee Raises', 'Bauch', 'Körpergewicht', NULL),

-- Kettlebell Exercises
('Kettlebell Swings', 'Ganzkörper', 'Kettlebell', NULL),
('Kettlebell Deadlift', 'Beine', 'Kettlebell', NULL),
('Kettlebell Goblet Squats', 'Beine', 'Kettlebell', NULL),
('Kettlebell Press', 'Schultern', 'Kettlebell', NULL),
('Kettlebell Rows', 'Rücken', 'Kettlebell', NULL),
('Turkish Get-ups', 'Ganzkörper', 'Kettlebell', NULL),
('Kettlebell Snatches', 'Ganzkörper', 'Kettlebell', NULL),
('Kettlebell Clean & Press', 'Ganzkörper', 'Kettlebell', NULL),

-- Functional/Compound Movements
('Burpees', 'Ganzkörper', 'Körpergewicht', NULL),
('Thrusters (Langhantel)', 'Ganzkörper', 'Langhantel', NULL),
('Thrusters (Kurzhantel)', 'Ganzkörper', 'Kurzhantel', NULL),
('Man Makers', 'Ganzkörper', 'Kurzhantel', NULL),
('Bear Crawls', 'Ganzkörper', 'Körpergewicht', NULL),
('Farmer''s Walk', 'Ganzkörper', 'Kurzhantel', NULL),

-- Olympic Lifts
('Clean & Jerk', 'Ganzkörper', 'Langhantel', NULL),
('Snatch', 'Ganzkörper', 'Langhantel', NULL),
('Power Clean', 'Ganzkörper', 'Langhantel', NULL),
('Hang Clean', 'Ganzkörper', 'Langhantel', NULL),

-- Cardio Equipment
('Laufband', 'Cardio', 'Maschine', NULL),
('Fahrrad (Ergometer)', 'Cardio', 'Maschine', NULL),
('Rudergerät', 'Cardio', 'Maschine', NULL),
('Ellipsentrainer', 'Cardio', 'Maschine', NULL),
('Stepper', 'Cardio', 'Maschine', NULL),

-- Stretching/Mobility
('Hip Flexor Stretch', 'Beweglichkeit', 'Körpergewicht', NULL),
('Hamstring Stretch', 'Beweglichkeit', 'Körpergewicht', NULL),
('Shoulder Stretch', 'Beweglichkeit', 'Körpergewicht', NULL),
('Cat-Cow Stretch', 'Beweglichkeit', 'Körpergewicht', NULL),
('Pigeon Pose', 'Beweglichkeit', 'Körpergewicht', NULL)
) AS new_exercises(name, muscle_group, equipment, user_id)
WHERE NOT EXISTS (
    SELECT 1 FROM exercises 
    WHERE exercises.name = new_exercises.name
);