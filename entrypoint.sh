#!/bin/bash
# =============================================================================
# SmartGym - Entrypoint: genera .env si no existe y luego inicia la API
# =============================================================================

set -e

# Solo generar .env en el HOST (no dentro del contenedor)
if [ ! -f .env ]; then
    echo "📝 Generando archivo .env automáticamente..."
    
    # Generar JWT_SECRET seguro
    JWT_SECRET=$(openssl rand -base64 32)
    
    cat > .env << 'EOF'
# SmartGym - Variables de entorno (auto-generadas)
PORT=3000
NODE_ENV=production
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=smartgym_db
DB_PORT=5432
PGHOST=db
PGPORT=5432
PGUSER=postgres
PGPASSWORD=postgres
PGDATABASE=smartgym_db
PGSSL=false
DATABASE_URL=postgres://postgres:postgres@db:5432/smartgym_db
JWT_SECRET=
JWT_EXPIRES_IN=24h
EOF
    
    # Insertar el JWT_SECRET generado
    sed -i "s/^JWT_SECRET=$/JWT_SECRET=$JWT_SECRET/" .env
    
    echo "✅ Archivo .env creado"
    echo "✅ JWT_SECRET generado automáticamente"
fi

# Iniciar la aplicación
echo "🚀 Iniciando SmartGym API..."
exec node src/app.js