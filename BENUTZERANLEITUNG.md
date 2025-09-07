# Gym Tracker - Benutzeranleitung

## Überblick
Der Gym Tracker ist eine Progressive Web App (PWA) zum Verfolgen deiner Workouts und Trainingsfortschritte. Die App funktioniert offline und kann wie eine native App auf dem Smartphone installiert werden.

## Installation
1. Öffne die App im Browser
2. Bei iOS: "Zur Startseite hinzufügen" über das Teilen-Menü
3. Bei Android: "App installieren" über das Browser-Menü
4. Die App ist jetzt als Icon auf dem Startbildschirm verfügbar

## Hauptfunktionen

### 🏋️ Trainings
**Was es ist:** Erstelle und verwalte strukturierte Trainingspläne mit mehreren Übungen.

**So funktioniert es:**
- **Neues Training erstellen:** Tippe auf "Neues Training" und gib einen Namen ein
- **Training bearbeiten:** Tippe auf ein Training und füge Übungen hinzu
- **Übungen hinzufügen:** Wähle aus vorhandenen Übungen oder erstelle neue
- **Sätze planen:** Definiere für jede Übung die geplanten Sätze (Wiederholungen × Gewicht)
- **Reihenfolge ändern:** Ziehe Übungen mit dem Griff-Symbol nach oben/unten
- **Training starten:** Tippe auf "Training starten" um das Workout zu beginnen

**Aufklappbare Details:** Tippe auf den Pfeil neben einer Übung um Details ein-/auszublenden

### 📝 Tracking (Workout ausführen)
**Was es ist:** Führe dein geplantes Training durch und protokolliere jeden Satz.

**So funktioniert es:**
- Starte ein Training über die Trainings-Seite
- Für jeden geplanten Satz:
  - Gib die tatsächlich ausgeführten Wiederholungen ein
  - Gib das verwendete Gewicht ein
  - Tippe auf "Satz abschließen"
- **Zusätzliche Sätze:** Füge bei Bedarf extra Sätze hinzu
- **Training beenden:** Alle Sätze werden automatisch als Logs gespeichert

### 💪 Übungen
**Was es ist:** Verwalte deine Übungsbibliothek mit Standard- und eigenen Übungen.

**So funktioniert es:**
- **Suchen:** Nutze die Suchleiste um Übungen zu finden
- **Filtern:** Wähle Muskelgruppe oder Gerät aus den Dropdowns
- **Neue Übung:** Tippe auf "Eigene Übung hinzufügen"
- **Details anzeigen:** Tippe auf eine Übung um Details zu sehen
- **Bearbeiten:** Nur selbst erstellte Übungen können bearbeitet werden (erkennbar am Edit-Icon)
- **Zum Training hinzufügen:** Über das Plus-Icon direkt zu einem Training hinzufügen

**Standard-Übungen vs. Eigene Übungen:**
- Standard-Übungen sind vorgegeben und nicht editierbar
- Eigene Übungen können bearbeitet und gelöscht werden

### 📊 Logs
**Was es ist:** Übersicht aller durchgeführten Trainingseinheiten und Sätze.

**So funktioniert es:**
- **Zeitfilter:** "Alle", "Diese Woche", "Dieser Monat"
- **Trainings-Übersicht:** Gruppiert nach Datum mit Trainingszeit
- **Übungsdetails:** Sätze, Gesamtwiederholungen, Maximalgewicht pro Übung
- **Löschen:** 
  - Einzelne Sätze auswählen über den Lösch-Modus
  - Komplette Trainingseinheiten löschen
  - Mehrfachauswahl mit Checkboxen

### 📈 Statistiken
**Was es ist:** Visualisierung deines Fortschritts über Zeit.

**So funktioniert es:**
- **Muskelgruppe wählen:** Filter nach Körperpartie (z.B. "Brust", "Beine")
- **Übung wählen:** Aus der gefilterten Liste eine spezifische Übung auswählen
- **Fortschritts-Chart:** Zeigt Gewichtsentwicklung über Zeit
- **Filter zurücksetzen:** Alle Filter auf einmal löschen

### ⚙️ Einstellungen
**Was es ist:** Personalisierung und Profilverwaltung.

**Funktionen:**
- **Profil verwalten:** Name, E-Mail, Passwort ändern
- **Gewichtseinheit:** Wechsel zwischen kg und lb
- **Dark Mode:** Ein-/Ausschalten des dunklen Themes
- **Akzentfarbe:** Wähle zwischen Rot, Blau, Grün, Lila, Orange
- **Backup erstellen:** Daten exportieren (in Entwicklung)
- **Abmelden:** Aus dem Account abmelden

## Tipps zur Nutzung

### Workflow für Anfänger:
1. **Setup:** Erstelle dein Profil in den Einstellungen
2. **Übungen erkunden:** Schau dir die vorhandenen Übungen an
3. **Erstes Training:** Erstelle ein einfaches Training mit 2-3 Übungen
4. **Sätze planen:** Definiere realistische Wiederholungen und Gewichte
5. **Training durchführen:** Nutze das Tracking um dein Workout zu protokollieren
6. **Fortschritt verfolgen:** Schaue regelmäßig in die Statistiken

### Best Practices:
- **Konsistente Eingaben:** Achte auf korrekte Gewichts- und Wiederholungsangaben
- **Regelmäßiges Training:** Nutze die gleichen Übungen um Fortschritt zu messen
- **Backup:** Exportiere regelmäßig deine Daten (wenn verfügbar)

### Fehlerbehebung:
- **App langsam:** Lade die App neu durch Ziehen nach unten
- **Daten nicht sichtbar:** Überprüfe deine Internetverbindung
- **Training nicht gefunden:** Überprüfe ob du eingeloggt bist

## Offline-Nutzung
Die App funktioniert offline durch:
- **Cached Daten:** Bereits geladene Daten sind offline verfügbar
- **Offline-Eingaben:** Neue Logs werden lokal gespeichert
- **Auto-Sync:** Bei Internetverbindung werden Daten automatisch synchronisiert

## Datenschutz & Sicherheit
- Alle Daten werden verschlüsselt in Supabase gespeichert
- Nur du hast Zugriff auf deine Trainingsdaten
- Passwörter werden gehasht und nie im Klartext gespeichert
- Die App verwendet moderne Sicherheitsstandards

## Support
Bei Problemen oder Fragen:
- Überprüfe diese Anleitung
- Teste die App in einem anderen Browser
- Stelle sicher, dass JavaScript aktiviert ist

---
*Diese Anleitung bezieht sich auf Version 1.0 des Gym Trackers*