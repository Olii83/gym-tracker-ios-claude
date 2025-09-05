# Dockerfile für Gym Tracker PWA
FROM nginx:alpine

# Kopiere die gebaute App
COPY dist/ /usr/share/nginx/html/

# Custom Nginx Konfiguration für PWA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponiere Port 80
EXPOSE 80

# Starte Nginx
CMD ["nginx", "-g", "daemon off;"]