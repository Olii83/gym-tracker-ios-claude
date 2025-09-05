# 🏠 Proxmox Homeserver Deployment Guide

## 🚀 Schnellstart (Docker - Empfohlen)

### Option 1: Mit Docker Compose (Einfachste Methode)

```bash
# 1. Projekt auf deinen Proxmox Server kopieren
scp -r gym-tracker-ios-claude/ user@proxmox-server:/home/user/

# 2. Auf dem Server
cd /home/user/gym-tracker-ios-claude/

# 3. Deployment ausführen
./deploy.sh
```

**Fertig!** App läuft unter `http://server-ip:3000`

### Option 2: Manueller Docker Build

```bash
# 1. App bauen
npm run build

# 2. Docker Image erstellen
docker build -t gym-tracker:latest .

# 3. Container starten
docker run -d \
  --name gym-tracker-pwa \
  --restart unless-stopped \
  -p 3000:80 \
  gym-tracker:latest

# 4. Status prüfen
docker ps | grep gym-tracker
```

## 🌐 Zugriff von außen (Reverse Proxy)

### Mit Nginx Proxy Manager (GUI)
1. **Proxy Host hinzufügen**:
   - Domain: `gym.deindomain.de`
   - Forward to: `server-ip:3000`
   - SSL: Let's Encrypt aktivieren

### Mit Traefik (docker-compose.yml bereits konfiguriert)
```bash
# Domain in docker-compose.yml anpassen:
- "traefik.http.routers.gym-tracker.rule=Host(`gym.deindomain.de`)"

# Dann starten:
docker-compose up -d
```

### Mit direktem Nginx
```nginx
server {
    listen 80;
    server_name gym.deindomain.de;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📱 Proxmox LXC Container (Alternative)

### LXC Container erstellen
```bash
# 1. Ubuntu LXC Container erstellen (via Proxmox Web UI)
# Template: Ubuntu 22.04
# RAM: 512MB
# Storage: 8GB

# 2. In Container einloggen
pct enter <container-id>

# 3. Updates & Node.js installieren
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs nginx

# 4. Projekt deployment
cd /var/www/
git clone <your-repo> gym-tracker
cd gym-tracker
npm install
npm run build

# 5. Nginx konfigurieren
cp nginx.conf /etc/nginx/sites-available/gym-tracker
ln -s /etc/nginx/sites-available/gym-tracker /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
systemctl restart nginx

# 6. Statische Dateien kopieren
cp -r dist/* /var/www/html/
```

## 🔧 Konfiguration

### Ports anpassen
```yaml
# docker-compose.yml
ports:
  - "8080:80"  # Statt 3000:80
```

### Domain konfigurieren
```yaml
# docker-compose.yml
labels:
  - "traefik.http.routers.gym-tracker.rule=Host(`deine-domain.de`)"
```

### SSL aktivieren
```bash
# Mit certbot (falls direkter Nginx)
certbot --nginx -d gym.deindomain.de
```

## 🚦 Monitoring & Logs

```bash
# Container Logs anzeigen
docker logs gym-tracker-pwa

# Container Status
docker stats gym-tracker-pwa

# Ressourcen-Verbrauch
docker system df
```

## 🔄 Updates deployen

```bash
# 1. Neue Version bauen
npm run build

# 2. Container neu erstellen
docker-compose down
docker-compose up -d --build

# Oder mit deploy script:
./deploy.sh
```

## 📋 Empfohlene Proxmox Konfiguration

### Hardware-Anforderungen:
- **RAM**: 512MB (Container) oder 1GB (VM)
- **CPU**: 1 Core
- **Storage**: 2GB
- **Netzwerk**: Bridge zu deinem LAN

### Container Settings:
- **Privileged**: Nein
- **Nesting**: Nein (außer für Docker-in-Docker)
- **Keyctl**: Nein
- **Fuse**: Nein

## ✅ Post-Deployment Checklist

- [ ] App läuft unter `http://server-ip:3000`
- [ ] PWA Manifest erreichbar (`/manifest.webmanifest`)
- [ ] Icons werden geladen (`/icons/icon-192x192.png`)
- [ ] Service Worker registriert sich korrekt
- [ ] Reverse Proxy konfiguriert (optional)
- [ ] SSL-Zertifikat installiert (für HTTPS)
- [ ] Domain zeigt auf Server-IP
- [ ] Firewall-Regeln angepasst

## 🎯 Finale URL-Struktur:
- **Lokal**: `http://proxmox-server-ip:3000`
- **Domain**: `https://gym.deindomain.de` 
- **PWA**: Installierbar vom Homescreen

**Die App ist jetzt produktionsreif für deinen Homeserver!** 🏋️💪