-- Spezifische Empfehlungen für Standard-Übungen
-- Diese können als zusätzliche Updates nach der Hauptmigration ausgeführt werden

-- === KILOGRAMM (kg) Übungen ===
-- Typisch für deutsche Fitnessstudios, Hanteln, Maschinen

-- Langhantel-Übungen
UPDATE exercises SET preferred_unit = 'kg' WHERE name IN (
  'Bankdrücken Langhantel',
  'Kniebeugen Langhantel',
  'Kreuzheben Langhantel',
  'Rudern Langhantel',
  'Schulterdrücken Langhantel',
  'Bizeps-Curls Langhantel',
  'French Press Langhantel'
);

-- Kurzhantel-Übungen  
UPDATE exercises SET preferred_unit = 'kg' WHERE name IN (
  'Bankdrücken Kurzhanteln',
  'Schulterdrücken Kurzhanteln',
  'Bizeps-Curls Kurzhanteln',
  'Trizeps-Kickbacks',
  'Lunges Kurzhanteln',
  'Seitenheben',
  'Butterfly Kurzhanteln'
);

-- Maschinen-Übungen (deutsche/europäische Geräte)
UPDATE exercises SET preferred_unit = 'kg' WHERE name IN (
  'Beinpresse',
  'Latzug breit',
  'Latzug eng',
  'Rudern am Kabelzug',
  'Brustpresse Maschine',
  'Schulterdrücken Maschine',
  'Beinstrecker',
  'Beinbeuger',
  'Wadendrücken',
  'Butterfly Maschine'
);

-- === PFUND (lb) Übungen ===
-- Typisch für Kabel-Systeme, manche importierte Geräte

-- Kabel-Übungen (oft mit Gewichtsstapeln in lb)
UPDATE exercises SET preferred_unit = 'lb' WHERE name IN (
  'Bizeps-Curls Kabel',
  'Trizeps-Drücken Kabel',
  'Seitheben Kabel',
  'Rudern Kabel',
  'Face Pulls',
  'Kabelzug Brust',
  'Latzug Kabel',
  'Beinstecker Kabel'
);

-- Funktionale Trainer / Cable Crossover
UPDATE exercises SET preferred_unit = 'lb' WHERE name ILIKE '%cable%' OR equipment ILIKE '%functional%';

-- Pneumatische Geräte (HUR, KEISER)
UPDATE exercises SET preferred_unit = 'lb' WHERE equipment ILIKE '%pneumat%' OR equipment ILIKE '%hur%' OR equipment ILIKE '%keiser%';

-- === SPEZIELLE FÄLLE ===

-- Körpergewichts-Übungen (eigentlich keine Einheit, aber für Zusatzgewicht kg)
UPDATE exercises SET preferred_unit = 'kg' WHERE name IN (
  'Liegestütze',
  'Klimmzüge', 
  'Dips',
  'Plank',
  'Burpees'
);

-- Kardio mit Widerstand (oft lb)
UPDATE exercises SET preferred_unit = 'lb' WHERE name ILIKE '%crosstrainer%' OR name ILIKE '%elliptical%';

-- Ausgabe zur Überprüfung
SELECT 
  preferred_unit,
  COUNT(*) as anzahl_übungen,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM exercises), 1) as prozent
FROM exercises 
GROUP BY preferred_unit
ORDER BY anzahl_übungen DESC;