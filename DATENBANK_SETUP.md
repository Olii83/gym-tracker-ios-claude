# Datenbank Setup für erweiterte Übungen

## Schritt 1: Equipment-Spalte hinzufügen und bestehende Daten migrieren

Führe das Migrations-Skript in deiner Supabase-Datenbank aus:

```sql
-- Inhalt von database_migration.sql ausführen
```

## Schritt 2: Neue Übungen hinzufügen

Führe das finale Seed-Skript aus, um 50+ wichtige Übungen hinzuzufügen:

```sql  
-- Inhalt von exercises_seed_final.sql ausführen
```

## Was passiert:

### Migration (`database_migration.sql`):
1. Fügt `equipment` Spalte zur `exercises` Tabelle hinzu
2. Aktualisiert bestehende Übungen mit Equipment-Information basierend auf Namen
3. Setzt Standard-Equipment für unbekannte Übungen

### Seed (`exercises_seed_final.sql`):
1. Fügt 50+ wichtige Übungen hinzu (alle Kategorien abgedeckt)
2. Verwendet temporäre Tabelle und korrekte UUID-Castings
3. Überspringt Übungen die bereits existieren (sicher für bestehende Daten)

### Ergebnis:
- Bestehende Daten bleiben erhalten
- Neue umfassende Übungsdatenbank
- Equipment-Filter funktioniert
- Such- und Filterfunktionen aktiv

## Ausführungsreihenfolge:
1. Zuerst: `database_migration.sql`
2. Dann: `exercises_seed_final.sql`

## ⚠️ Wichtige Hinweise:
- Das ursprüngliche `exercises_seed.sql` funktioniert NICHT (UNIQUE Constraint Fehler)
- `exercises_seed_safe.sql` funktioniert NICHT (UUID Type Fehler)  
- **Verwende `exercises_seed_final.sql`** - funktioniert korrekt mit UUID-Casting

Die bestehenden Übungen werden **NICHT** überschrieben, sondern nur erweitert und mit Equipment-Information ergänzt.