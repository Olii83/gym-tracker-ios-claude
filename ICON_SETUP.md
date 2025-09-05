# Kurzhantel App-Icon Setup

## 🏋️ Was wurde erstellt:

### SVG-Vorlagen:
- `public/icons/icon-192x192.svg` - Standard App-Icon
- `public/icons/icon-512x512.svg` - Hochauflösend
- `public/icons/icon-512x512-maskable.svg` - Für Android adaptive Icons

## 🔄 Nächste Schritte (SVG → PNG konvertieren):

### Option 1: Online Converter (einfach)
1. Gehe zu https://convertio.co/svg-png/
2. Lade jede SVG-Datei hoch
3. Stelle die richtige Größe ein:
   - `icon-192x192.svg` → 192x192 PNG
   - `icon-512x512.svg` → 512x512 PNG  
   - `icon-512x512-maskable.svg` → 512x512 PNG
4. Benenne die PNGs entsprechend um:
   - `icon-192x192.png`
   - `icon-512x512.png`
   - `icon-512x512-maskable.png`

### Option 2: Command Line (falls Inkscape installiert)
```bash
# Von public/icons/ Ordner aus:
inkscape icon-192x192.svg --export-png=icon-192x192.png --export-width=192 --export-height=192
inkscape icon-512x512.svg --export-png=icon-512x512.png --export-width=512 --export-height=512
inkscape icon-512x512-maskable.svg --export-png=icon-512x512-maskable.png --export-width=512 --export-height=512
```

### Option 3: VS Code Extension
1. Installiere "SVG" Extension in VS Code
2. Rechtsklick auf SVG → "Export SVG" → PNG

## 📱 Icon-Design Details:

### Kurzhantel-Design:
- **Rotes Theme** (#dc2626) - Passend zur App
- **Weiße Kurzhantel** - Guter Kontrast
- **Detaillierte Gewichtsplatten** mit Linien
- **Grip-Linien** am Griff für Realismus

### PWA-Kompatibilität:
- **192x192**: Standard Web App Icon
- **512x512**: Hochauflösende Version
- **Maskable**: Für Android adaptive Icons mit Safe Zone

## 🔧 Nach PNG-Erstellung:

1. **PNG-Dateien in `public/icons/` ablegen**
2. **App neu builden**: `npm run build`
3. **Auf iOS testen**: App vom Homescreen entfernen → Neu hinzufügen

## 📂 Finale Ordnerstruktur:
```
public/icons/
├── icon-192x192.png    ✓ (nach Konvertierung)
├── icon-512x512.png    ✓ (nach Konvertierung)
├── icon-512x512-maskable.png ✓ (nach Konvertierung)
├── icon-192x192.svg    ✓ (Vorlage)
├── icon-512x512.svg    ✓ (Vorlage)
└── icon-512x512-maskable.svg ✓ (Vorlage)
```

## 🎨 Icon-Vorschau:
Das Icon zeigt eine moderne Kurzhantel mit:
- Runden Gewichtsplatten auf beiden Seiten
- Detaillierter Griffstange mit Grip-Linien
- Sauberer weißer Kurzhantel auf rotem Hintergrund
- Professionelles Fitness-App-Design

Die SVG-Icons sind bereit - du musst sie nur noch zu PNG konvertieren! 💪