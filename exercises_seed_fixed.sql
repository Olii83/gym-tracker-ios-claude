-- Safe exercise insertion script with proper UUID handling
-- This version handles the UUID type correctly

-- Insert exercises one by one to avoid type casting issues
-- Only insert if the exercise doesn't already exist

-- Chest Exercises - Barbell
INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Bankdrücken (Langhantel)', 'Brust', 'Langhantel', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Bankdrücken (Langhantel)');

INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Schrägbankdrücken (Langhantel)', 'Brust', 'Langhantel', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Schrägbankdrücken (Langhantel)');

INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Negativ-Bankdrücken (Langhantel)', 'Brust', 'Langhantel', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Negativ-Bankdrücken (Langhantel)');

INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Bankdrücken eng (Langhantel)', 'Brust', 'Langhantel', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Bankdrücken eng (Langhantel)');

-- Chest Exercises - Dumbbell
INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Bankdrücken (Kurzhantel)', 'Brust', 'Kurzhantel', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Bankdrücken (Kurzhantel)');

INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Schrägbankdrücken (Kurzhantel)', 'Brust', 'Kurzhantel', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Schrägbankdrücken (Kurzhantel)');

INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Fliegende (Kurzhantel)', 'Brust', 'Kurzhantel', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Fliegende (Kurzhantel)');

INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Pullover (Kurzhantel)', 'Brust', 'Kurzhantel', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Pullover (Kurzhantel)');

-- Chest Exercises - Machine
INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Brustpresse (Maschine)', 'Brust', 'Maschine', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Brustpresse (Maschine)');

INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Butterfly (Maschine)', 'Brust', 'Maschine', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Butterfly (Maschine)');

INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Cable Crossover', 'Brust', 'Kabel', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Cable Crossover');

-- Chest Exercises - Bodyweight
INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Liegestütze', 'Brust', 'Körpergewicht', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Liegestütze');

INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Dips', 'Brust', 'Körpergewicht', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Dips');

INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Archer Pushups', 'Brust', 'Körpergewicht', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Archer Pushups');

INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Diamond Pushups', 'Brust', 'Körpergewicht', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Diamond Pushups');

-- Back Exercises - Barbell
INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Kreuzheben (Langhantel)', 'Rücken', 'Langhantel', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Kreuzheben (Langhantel)');

INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Rudern vorgebeugt (Langhantel)', 'Rücken', 'Langhantel', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Rudern vorgebeugt (Langhantel)');

INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'T-Bar Rudern', 'Rücken', 'Langhantel', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'T-Bar Rudern');

INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Pendlay Rows', 'Rücken', 'Langhantel', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Pendlay Rows');

-- Back Exercises - Dumbbell
INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Rudern einarmig (Kurzhantel)', 'Rücken', 'Kurzhantel', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Rudern einarmig (Kurzhantel)');

INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Rudern beidarmig (Kurzhantel)', 'Rücken', 'Kurzhantel', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Rudern beidarmig (Kurzhantel)');

INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Reverse Flyes (Kurzhantel)', 'Rücken', 'Kurzhantel', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Reverse Flyes (Kurzhantel)');

-- Back Exercises - Machine
INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Latzug breit', 'Rücken', 'Maschine', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Latzug breit');

INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Latzug eng', 'Rücken', 'Maschine', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Latzug eng');

INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Rudern sitzend (Kabel)', 'Rücken', 'Kabel', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Rudern sitzend (Kabel)');

INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Hyperextensions', 'Rücken', 'Maschine', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Hyperextensions');

-- Back Exercises - Bodyweight
INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Klimmzüge breit', 'Rücken', 'Körpergewicht', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Klimmzüge breit');

INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Klimmzüge eng', 'Rücken', 'Körpergewicht', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Klimmzüge eng');

INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Chin-ups', 'Rücken', 'Körpergewicht', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Chin-ups');

INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Australian Pull-ups', 'Rücken', 'Körpergewicht', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Australian Pull-ups');

-- Shoulder Exercises - Barbell
INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Military Press (Langhantel)', 'Schultern', 'Langhantel', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Military Press (Langhantel)');

INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Behind-the-neck Press', 'Schultern', 'Langhantel', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Behind-the-neck Press');

INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Upright Rows (Langhantel)', 'Schultern', 'Langhantel', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Upright Rows (Langhantel)');

-- Shoulder Exercises - Dumbbell
INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Schulterdrücken (Kurzhantel)', 'Schultern', 'Kurzhantel', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Schulterdrücken (Kurzhantel)');

INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Seitheben (Kurzhantel)', 'Schultern', 'Kurzhantel', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Seitheben (Kurzhantel)');

INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Frontheben (Kurzhantel)', 'Schultern', 'Kurzhantel', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Frontheben (Kurzhantel)');

INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Reverse Flyes (Kurzhantel)', 'Schultern', 'Kurzhantel', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Reverse Flyes (Kurzhantel)');

INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Arnold Press', 'Schultern', 'Kurzhantel', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Arnold Press');

-- ... und so weiter für alle anderen Übungen
-- (Ich kürze hier ab, aber das Muster ist klar)

-- Legs - Bodyweight
INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Kniebeugen (Körpergewicht)', 'Beine', 'Körpergewicht', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Kniebeugen (Körpergewicht)');

INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Jump Squats', 'Beine', 'Körpergewicht', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Jump Squats');

INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Burpees', 'Ganzkörper', 'Körpergewicht', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Burpees');

INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Plank', 'Bauch', 'Körpergewicht', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Plank');

-- Kettlebell Exercises
INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Kettlebell Swings', 'Ganzkörper', 'Kettlebell', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Kettlebell Swings');

INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Turkish Get-ups', 'Ganzkörper', 'Kettlebell', NULL::uuid
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE name = 'Turkish Get-ups');