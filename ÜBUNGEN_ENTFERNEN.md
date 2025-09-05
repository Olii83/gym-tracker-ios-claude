# Standard-Übungen sicher entfernen - Anleitung

## ⚠️ WICHTIG: Sicherheitsregeln

### 🚫 NIEMALS löschen wenn:
- Übung in **WorkoutLogs** verwendet wird (Trainingsdaten gehen verloren!)
- Übung in **Trainings** verwendet wird (Training wird kaputt!)
- Du dir nicht 100% sicher bist

### ✅ Sicher zu löschen:
- Nur **Standard-Übungen** (`user_id IS NULL`)
- **Nie** in Logs oder Trainings verwendet
- Nach **Sicherheitsprüfung**

## 📋 Schritt-für-Schritt Anleitung

### Schritt 1: Verwendung prüfen (PFLICHT!)
```sql
SELECT 
    e.name,
    e.id,
    (SELECT COUNT(*) FROM workout_logs wl WHERE wl.exercise_id = e.id) as log_count,
    (SELECT COUNT(*) FROM training_exercises te WHERE te.exercise_id = e.id) as training_count
FROM exercises e 
WHERE e.user_id IS NULL 
    AND e.name IN (
        'Übung die weg soll',
        'Noch eine Übung'
    );
```

### Schritt 2: Nur bei log_count = 0 UND training_count = 0 → Löschen!

**Einzelne Übung:**
```sql
DELETE FROM exercises 
WHERE user_id IS NULL 
    AND name = 'Exakter Übungsname'
    AND id NOT IN (SELECT DISTINCT exercise_id FROM workout_logs WHERE exercise_id IS NOT NULL)
    AND id NOT IN (SELECT DISTINCT exercise_id FROM training_exercises WHERE exercise_id IS NOT NULL);
```

**Mehrere Übungen:**
```sql
DELETE FROM exercises 
WHERE user_id IS NULL 
    AND name IN ('Übung 1', 'Übung 2', 'Übung 3')
    AND id NOT IN (SELECT DISTINCT exercise_id FROM workout_logs WHERE exercise_id IS NOT NULL)
    AND id NOT IN (SELECT DISTINCT exercise_id FROM training_exercises WHERE exercise_id IS NOT NULL);
```

## 🎯 Häufige Anwendungsfälle

### 1. Cardio-Übungen entfernen
```sql
-- Prüfen:
SELECT name, 
    (SELECT COUNT(*) FROM workout_logs wl WHERE wl.exercise_id = exercises.id) as used_in_logs
FROM exercises 
WHERE muscle_group = 'Cardio' AND user_id IS NULL;

-- Löschen (nur wenn used_in_logs = 0):
DELETE FROM exercises 
WHERE user_id IS NULL 
    AND muscle_group = 'Cardio'
    AND id NOT IN (SELECT DISTINCT exercise_id FROM workout_logs WHERE exercise_id IS NOT NULL)
    AND id NOT IN (SELECT DISTINCT exercise_id FROM training_exercises WHERE exercise_id IS NOT NULL);
```

### 2. Spezifische Übungen entfernen
```sql
DELETE FROM exercises 
WHERE user_id IS NULL 
    AND name IN (
        'Laufband',
        'Fahrrad (Ergometer)', 
        'Ellipsentrainer'
    )
    AND id NOT IN (SELECT DISTINCT exercise_id FROM workout_logs WHERE exercise_id IS NOT NULL)
    AND id NOT IN (SELECT DISTINCT exercise_id FROM training_exercises WHERE exercise_id IS NOT NULL);
```

### 3. Equipment-basiert entfernen
```sql
-- Alle Kettlebell-Übungen entfernen:
DELETE FROM exercises 
WHERE user_id IS NULL 
    AND equipment = 'Kettlebell'
    AND id NOT IN (SELECT DISTINCT exercise_id FROM workout_logs WHERE exercise_id IS NOT NULL)
    AND id NOT IN (SELECT DISTINCT exercise_id FROM training_exercises WHERE exercise_id IS NOT NULL);
```

## 🛡️ Zusätzliche Sicherheit

### Backup vor dem Löschen:
```sql
-- Erstelle Backup der zu löschenden Übungen:
CREATE TABLE exercises_backup AS
SELECT * FROM exercises 
WHERE user_id IS NULL 
    AND name IN ('Übung 1', 'Übung 2');
```

### Wiederherstellen falls nötig:
```sql
INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT name, muscle_group, equipment, user_id 
FROM exercises_backup;
```

## ❌ Was NICHT funktioniert:
- **Eigene Benutzer-Übungen** löschen (user_id IS NOT NULL) → Gehören dem User
- **Verwendete Übungen** löschen → Zerstört Daten
- **Batch-Delete ohne Prüfung** → Gefährlich

## ✅ Best Practices:
1. **Immer zuerst prüfen** ob Übung verwendet wird
2. **Einzeln löschen** statt Bulk-Delete
3. **Template verwenden** für Sicherheitschecks
4. **Bei Unsicherheit** → Lieber nicht löschen

## 🔄 Alternative: "Verstecken" statt Löschen
Falls du Übungen nur ausblenden willst (ohne Löschen):
```sql
-- Füge "hidden" Spalte hinzu (einmalig):
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT FALSE;

-- Übung verstecken:
UPDATE exercises SET hidden = TRUE WHERE name = 'Übungsname' AND user_id IS NULL;

-- In der App: Übungen mit hidden = TRUE nicht anzeigen
```

**Verwende immer `remove_standard_exercises.sql` als Template!**