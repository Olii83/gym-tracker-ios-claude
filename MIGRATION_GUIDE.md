# 🗄️ Supabase Datenbank Migration Guide

## Migration: Preferred Unit für Exercises

### ⚠️ Vor der Migration

1. **Backup erstellen** (empfohlen):
   ```sql
   -- Exportiere die exercises Tabelle als Backup
   SELECT * FROM exercises;
   ```

2. **Teste zuerst in einer Entwicklungsumgebung** wenn verfügbar

### 🚀 Migration durchführen

#### Schritt 1: Hauptmigration
Führe das komplette Script aus: `migration_add_preferred_unit.sql`

```bash
# In Supabase Dashboard:
# 1. Gehe zu "SQL Editor"  
# 2. Kopiere den Inhalt von migration_add_preferred_unit.sql
# 3. Führe das Script aus
```

#### Schritt 2: Verifikation
```sql
-- Überprüfe die Migration
SELECT preferred_unit, COUNT(*) as count 
FROM exercises 
GROUP BY preferred_unit;

-- Sollte etwa so aussehen:
-- kg: ~80-90% der Übungen
-- lb: ~10-20% der Übungen
```

#### Schritt 3: Feintuning (optional)
Führe `exercise_unit_recommendations.sql` aus für spezifischere Zuweisungen

### 🔍 Nach der Migration

#### Test 1: Neue Übungen erstellen
- Öffne die App
- Gehe zu Tracking → "Übung hinzufügen" → "Neue Übung"
- ✅ Dropdown für Gewichtseinheit sollte sichtbar sein

#### Test 2: Bestehende Übungen
- Öffne ein Training
- ✅ Jede Übung sollte ihren eigenen kg/lb Toggle-Button haben
- ✅ Standard sollte basierend auf Übungstyp gesetzt sein

#### Test 3: Funktionalität
- Schalte Einheit einer Übung um (kg ↔ lb)  
- ✅ Alle Gewichtsanzeigen sollten sich entsprechend konvertieren
- ✅ Werte sollten zwischen Sessions gespeichert bleiben

### 🐛 Troubleshooting

**Problem**: Migration fehlgeschlagen
```sql
-- Rollback (falls nötig):
ALTER TABLE exercises DROP COLUMN IF EXISTS preferred_unit;
```

**Problem**: Alle Übungen sind auf 'kg'
- Das ist normal! Deutsche Fitnessstudios nutzen hauptsächlich kg
- Kabel-Übungen sollten 'lb' haben - prüfe mit:
```sql
SELECT name, equipment, preferred_unit 
FROM exercises 
WHERE name ILIKE '%kabel%' OR equipment ILIKE '%kabel%';
```

**Problem**: App zeigt Fehler
- Stelle sicher, dass alle TypeScript-Änderungen deployed sind
- Prüfe Browser-Console auf Fehler
- Refreshe die App vollständig (Ctrl+Shift+R)

### 📊 Erwartete Verteilung

**Typische deutsche Fitnessstudios:**
- **kg (80-90%)**: Langhantel, Kurzhanteln, deutsche Maschinen
- **lb (10-20%)**: Kabel-Systeme, importierte Geräte

### 🔄 Rollback Plan

Falls etwas schiefgeht:
```sql
-- Komplett entfernen:
ALTER TABLE exercises DROP COLUMN preferred_unit;

-- Oder zurücksetzen:
UPDATE exercises SET preferred_unit = 'kg';
```

### ✅ Migration erfolgreich!

Nach erfolgreicher Migration:
- [ ] Spalte `preferred_unit` existiert
- [ ] Alle Übungen haben eine Einheit (kg oder lb)  
- [ ] App funktioniert normal
- [ ] Neue Übungen können mit Einheit erstellt werden
- [ ] Toggle-Buttons funktionieren pro Übung