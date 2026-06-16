# =============================================================================
# SmartGym - Dockerfile
# =============================================================================
FROM node:20-alpine

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm ci --only=production

# Copiar código fuente
COPY src/ ./src/
COPY database/ ./database/

EXPOSE 3000

CMD ["node", "src/app.js"]