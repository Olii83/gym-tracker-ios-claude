-- Template zum sicheren Entfernen von Standard-Übungen
-- WICHTIG: Prüfe IMMER vor dem Löschen ob Übungen in Logs/Trainings verwendet werden!

-- SCHRITT 1: Prüfe welche Übungen verwendet werden (IMMER ZUERST AUSFÜHREN!)
SELECT 
    e.name,
    e.id,
    (SELECT COUNT(*) FROM workout_logs wl WHERE wl.exercise_id = e.id) as log_count,
    (SELECT COUNT(*) FROM training_exercises te WHERE te.exercise_id = e.id) as training_count
FROM exercises e 
WHERE e.user_id IS NULL -- Nur Standard-Übungen
    AND e.name IN (
        -- HIER deine zu löschenden Übungen eintragen:
        'Übung Name 1',
        'Übung Name 2',
        'Übung Name 3'
    )
ORDER BY e.name;

-- SCHRITT 2: Nur wenn log_count = 0 UND training_count = 0, dann löschen!
-- Niemals Übungen löschen die verwendet werden!

-- OPTION A: Einzelne Übung löschen (sicher)
DELETE FROM exercises 
WHERE user_id IS NULL 
    AND name = 'Exakter Übungsname'
    AND id NOT IN (
        SELECT DISTINCT exercise_id FROM workout_logs 
        WHERE exercise_id IS NOT NULL
    )
    AND id NOT IN (
        SELECT DISTINCT exercise_id FROM training_exercises 
        WHERE exercise_id IS NOT NULL
    );

-- OPTION B: Mehrere Übungen löschen (sicher)
DELETE FROM exercises 
WHERE user_id IS NULL 
    AND name IN (
        'Übung 1',
        'Übung 2', 
        'Übung 3'
    )
    AND id NOT IN (
        SELECT DISTINCT exercise_id FROM workout_logs 
        WHERE exercise_id IS NOT NULL
    )
    AND id NOT IN (
        SELECT DISTINCT exercise_id FROM training_exercises 
        WHERE exercise_id IS NOT NULL
    );

-- OPTION C: Übungen nach Muskelgruppe löschen (VORSICHTIG!)
DELETE FROM exercises 
WHERE user_id IS NULL 
    AND muscle_group = 'Cardio'  -- Beispiel: Alle Cardio-Übungen
    AND id NOT IN (
        SELECT DISTINCT exercise_id FROM workout_logs 
        WHERE exercise_id IS NOT NULL
    )
    AND id NOT IN (
        SELECT DISTINCT exercise_id FROM training_exercises 
        WHERE exercise_id IS NOT NULL
    );

-- SCHRITT 3: Prüfe was gelöscht wurde
SELECT 'Gelöschte Übungen:' as status;
-- Führe Schritt 1 nochmal aus um zu sehen was übrig ist