#!/bin/bash

# Deployment Script für Gym Tracker auf Proxmox Homeserver

echo "🏋️ Gym Tracker Deployment Script"
echo "================================"

# Baue die App
echo "📦 Building App..."
npm run build

# Erstelle Docker Image
echo "🐳 Building Docker Image..."
docker build -t gym-tracker:latest .

# Stoppe bestehenden Container
echo "🛑 Stopping existing container..."
docker-compose down

# Starte neuen Container
echo "🚀 Starting new container..."
docker-compose up -d

# Zeige Status
echo "📊 Container Status:"
docker ps | grep gym-tracker

echo ""
echo "✅ Deployment Complete!"
echo "🌐 App verfügbar unter: http://localhost:3000"
echo ""
echo "🔧 Nächste Schritte:"
echo "1. Reverse Proxy konfigurieren (Nginx Proxy Manager/Traefik)"
echo "2. SSL-Zertifikat einrichten"
echo "3. Domain konfigurieren"