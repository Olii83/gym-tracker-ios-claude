-- Template für das Hinzufügen neuer Standard-Übungen
-- Kopiere dieses Template und füge deine neuen Übungen hinzu

-- Beispiel für das Hinzufügen einzelner Übungen:

INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Deine neue Übung', 'Muskelgruppe', 'Equipment-Typ', NULL::uuid
WHERE NOT EXISTS (
    SELECT 1 FROM exercises 
    WHERE name = 'Deine neue Übung'
);

-- Für mehrere Übungen auf einmal (empfohlene Methode):

CREATE TEMP TABLE new_standard_exercises AS
SELECT name, muscle_group, equipment
FROM (VALUES
-- Füge hier deine neuen Übungen ein:
('Übung 1', 'Brust', 'Langhantel'),
('Übung 2', 'Rücken', 'Kurzhantel'),
('Übung 3', 'Beine', 'Körpergewicht'),
('Übung 4', 'Schultern', 'Maschine')
-- ... weitere Übungen
) AS exercise_data(name, muscle_group, equipment);

-- Sicher einfügen (nur wenn noch nicht vorhanden)
INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT nse.name, nse.muscle_group, nse.equipment, NULL::uuid
FROM new_standard_exercises nse
WHERE NOT EXISTS (
    SELECT 1 FROM exercises e 
    WHERE e.name = nse.name
);

-- Aufräumen
DROP TABLE new_standard_exercises;

-- Verfügbare Equipment-Typen:
-- 'Langhantel', 'Kurzhantel', 'Kettlebell', 'Maschine', 'Kabel', 
-- 'Körpergewicht', 'Equipment', 'Sonstiges'

-- Verfügbare Muskelgruppen:
-- 'Brust', 'Rücken', 'Schultern', 'Bizeps', 'Trizeps', 'Beine', 
-- 'Waden', 'Bauch', 'Ganzkörper', 'Cardio', 'Beweglichkeit'