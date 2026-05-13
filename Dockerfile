# Etapa 1: Build de Angular
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Servidor Nginx (Unprivileged por seguridad)
FROM nginxinc/nginx-unprivileged:alpine

# 1. Copiar a /templates en lugar de /conf.d
# Esto permite que Nginx use 'envsubst' para inyectar la IP del backend
COPY default.conf.template /etc/nginx/templates/default.conf.template

# 2. VERIFICACIÓN DE RUTA: Asegúrate de que esta ruta sea la que genera tu Angular
# (Angular 17+ suele usar dist/nombre-app/browser)
COPY --from=builder /app/dist/casino-frontend/browser /usr/share/nginx/html

EXPOSE 8080

# El CMD no es estrictamente necesario en esta imagen porque ya trae su propio 
# entrypoint que maneja el envsubst y lanza nginx, pero dejarlo no hace daño.
CMD ["nginx", "-g", "daemon off;"]