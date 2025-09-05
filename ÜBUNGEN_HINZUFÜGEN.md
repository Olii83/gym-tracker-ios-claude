# Standard-Übungen hinzufügen - Anleitung

## 📋 Schritt-für-Schritt Anleitung

### 1. Template verwenden
Kopiere `add_standard_exercises_template.sql` und benenne es um, z.B.:
- `add_exercises_2024_12.sql`
- `add_yoga_exercises.sql`
- `add_powerlifting_exercises.sql`

### 2. Übungen eintragen
```sql
CREATE TEMP TABLE new_standard_exercises AS
SELECT name, muscle_group, equipment
FROM (VALUES
-- Hier deine neuen Übungen:
('Romanian Deadlift', 'Beine', 'Langhantel'),
('Face Pulls', 'Schultern', 'Kabel'),
('Pistol Squats', 'Beine', 'Körpergewicht')
) AS exercise_data(name, muscle_group, equipment);
```

### 3. In Supabase ausführen
- Gehe zu Supabase SQL Editor
- Kopiere das komplette Skript
- Ausführen → Fertig!

## 🎯 Wichtige Regeln

### ✅ DO's:
- **Immer `NULL::uuid` für user_id** (Standard-Übungen)
- **`WHERE NOT EXISTS` verwenden** (Duplikat-Schutz)
- **Konsistente Namen** verwenden
- **Korrekte Muskelgruppen** aus der Liste wählen

### ❌ DON'Ts:
- **Nie direkte INSERT** ohne Duplikat-Check
- **Nie user_id setzen** (bleibt NULL für Standard)
- **Keine neuen Muskelgruppen** erfinden

## 📊 Verfügbare Kategorien

### Equipment-Typen:
```
'Langhantel', 'Kurzhantel', 'Kettlebell', 'Maschine', 
'Kabel', 'Körpergewicht', 'Equipment', 'Sonstiges'
```

### Muskelgruppen:
```
'Brust', 'Rücken', 'Schultern', 'Bizeps', 'Trizeps', 
'Beine', 'Waden', 'Bauch', 'Ganzkörper', 'Cardio', 'Beweglichkeit'
```

## 🔄 Alternative: Einzelne Übung hinzufügen

Für eine schnelle einzelne Übung:
```sql
INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT 'Neue Übung Name', 'Muskelgruppe', 'Equipment', NULL::uuid
WHERE NOT EXISTS (
    SELECT 1 FROM exercises 
    WHERE name = 'Neue Übung Name'
);
```

## 📝 Beispiel-Skript

```sql
-- Beispiel: Yoga-Übungen hinzufügen
CREATE TEMP TABLE new_standard_exercises AS
SELECT name, muscle_group, equipment
FROM (VALUES
('Downward Dog', 'Beweglichkeit', 'Körpergewicht'),
('Warrior Pose', 'Beweglichkeit', 'Körpergewicht'),
('Child Pose', 'Beweglichkeit', 'Körpergewicht'),
('Sun Salutation', 'Ganzkörper', 'Körpergewicht')
) AS exercise_data(name, muscle_group, equipment);

INSERT INTO exercises (name, muscle_group, equipment, user_id)
SELECT nse.name, nse.muscle_group, nse.equipment, NULL::uuid
FROM new_standard_exercises nse
WHERE NOT EXISTS (
    SELECT 1 FROM exercises e 
    WHERE e.name = nse.name
);

DROP TABLE new_standard_exercises;
```

## ✅ Vorteile dieser Methode:
- **Sicher**: Keine Duplikate möglich
- **Effizient**: Mehrere Übungen auf einmal
- **Konsistent**: Gleiche Struktur wie bestehende Skripte
- **Sauber**: Temporäre Tabellen werden automatisch gelöscht