-- =============================================================================
-- SmartGym - Script de inicialización de base de datos
-- =============================================================================
-- Este archivo se ejecuta automáticamente cuando PostgreSQL se inicia por primera vez
-- Ubicación: /docker-entrypoint-initdb.d/init.sql
-- =============================================================================

-- Habilitar extensiones útiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear tabla de control de migraciones (para tracking)
CREATE TABLE IF NOT EXISTS schema_migrations (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL UNIQUE,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Registrar que este init script se ejecutó
INSERT INTO schema_migrations (filename) VALUES ('init.sql')
ON CONFLICT (filename) DO NOTHING;

-- Configuración de timezone
SET timezone = 'America/Caracas';

-- =============================================================================
-- NOTA: Los archivos schema.sql y seeds.sql se ejecutan después
-- en el orden: 1-init.sql → 2-schema.sql → 3-seeds.sql
-- =============================================================================