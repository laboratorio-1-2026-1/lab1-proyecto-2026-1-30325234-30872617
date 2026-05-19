const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || undefined,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'smartgym_db',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

const seedData = async () => {
    try {
        console.log('Iniciando seeders de datos de prueba...');

        // 1. Insertar Roles
        console.log('Insertando roles...');
        const rolesQuery = `
            INSERT INTO Rol (Nombre, Descripcion) VALUES
            ('Administrador', 'Administrador del sistema'),
            ('Finanzas', 'Responsable de finanzas'),
            ('Entrenador', 'Entrenador del gimnasio'),
            ('Cliente', 'Cliente del gimnasio')
            ON CONFLICT DO NOTHING;
        `;
        await pool.query(rolesQuery);

        // 2. Insertar Usuario Administrador
        console.log('Insertando usuario administrador...');
        const userQuery = `
            INSERT INTO Usuario (Email, Contrasena, Cedula, ID_rol) VALUES
            ('admin@smartgym.com', '$2a$10$K8M9p.1XqfVf8uM2xX8XKe3k8uM2xX8XKe3k8uM2xX8XKe3k8uM2x', 'V-12345678', 1)
            ON CONFLICT (Email) DO NOTHING
            RETURNING ID_user;
        `;
        const userResult = await pool.query(userQuery);
        const adminUserId = userResult.rows[0]?.ID_user || 1;

        // 3. Insertar Categorías de Máquinas
        console.log('Insertando categorías de máquinas...');
        const categoriasQuery = `
            INSERT INTO CategoriaMaquina (Nombre, Descripcion) VALUES
            ('Cardiovascular', 'Máquinas para ejercicios cardiovasculares'),
            ('Musculación', 'Máquinas para ejercicios de fuerza'),
            ('Peso Libre', 'Mancuernas, barras y discos')
            ON CONFLICT DO NOTHING;
        `;
        await pool.query(categoriasQuery);

        // 4. Insertar Máquinas de ejemplo
        console.log('Insertando máquinas de ejemplo...');
        const maquinasQuery = `
            INSERT INTO Maquina (Nombre, Descripcion, Estado, ID_categoria) VALUES
            ('Cinta de correr 1', 'Cinta de correr de alta velocidad', 'Activa', 1),
            ('Bicicleta estática 1', 'Bicicleta estática para ejercicio', 'Activa', 1),
            ('Press de pecho', 'Máquina para ejercicios de pecho', 'Activa', 2),
            ('Leg press', 'Máquina para ejercicios de piernas', 'Activa', 2),
            ('Mancuernas ajustables', 'Set de mancuernas de 5 a 50 kg', 'Activa', 3)
            ON CONFLICT DO NOTHING;
        `;
        await pool.query(maquinasQuery);

        // 5. Insertar Planes de Suscripción
        console.log('Insertando planes de suscripción...');
        const suscripcionesQuery = `
            INSERT INTO Suscripcion (Nombre, Precio, Duracion) VALUES
            ('Plan Mensual', 50.00, 30),
            ('Plan Trimestral VIP', 120.00, 90),
            ('Pase Diario', 15.00, 1)
            ON CONFLICT DO NOTHING;
        `;
        await pool.query(suscripcionesQuery);

        // 6. Insertar Disciplinas
        console.log('Insertando disciplinas...');
        const disciplinasQuery = `
            INSERT INTO Disciplina (Nombre, Descripcion) VALUES
            ('Spinning', 'Clases de bicicleta estática'),
            ('Yoga', 'Clases de yoga y meditación'),
            ('CrossFit', 'Entrenamientos funcionales'),
            ('Zumba', 'Clases de baile al ritmo de la música'),
            ('Pilates', 'Ejercicios de Pilates')
            ON CONFLICT DO NOTHING;
        `;
        await pool.query(disciplinasQuery);

        // 7. Insertar Entrenador
        console.log('Insertando entrenador de prueba...');
        const trainerUserQuery = `
            INSERT INTO Usuario (Email, Contrasena, Cedula, ID_rol) VALUES
            ('trainer@smartgym.com', '$2a$10$K8M9p.1XqfVf8uM2xX8XKe3k8uM2xX8XKe3k8uM2xX8XKe3k8uM2x', 'V-87654321', 3)
            ON CONFLICT (Email) DO NOTHING
            RETURNING ID_user;
        `;
        const trainerResult = await pool.query(trainerUserQuery);
        const trainerId = trainerResult.rows[0]?.ID_user || 2;

        const entrenadorQuery = `
            INSERT INTO Entrenador (Nombre, Especialidad, ID_user) VALUES
            ('Carlos López', 'Crossfit y Musculación', $1)
            ON CONFLICT DO NOTHING;
        `;
        await pool.query(entrenadorQuery, [trainerId]);

        // 8. Insertar Cliente de prueba
        console.log('Insertando cliente de prueba...');
        const clienteUserQuery = `
            INSERT INTO Usuario (Email, Contrasena, Cedula, ID_rol) VALUES
            ('cliente@smartgym.com', '$2a$10$K8M9p.1XqfVf8uM2xX8XKe3k8uM2xX8XKe3k8uM2xX8XKe3k8uM2x', 'V-11111111', 4)
            ON CONFLICT (Email) DO NOTHING
            RETURNING ID_user;
        `;
        const clienteResult = await pool.query(clienteUserQuery);
        const clienteUserId = clienteResult.rows[0]?.ID_user || 3;

        const clienteQuery = `
            INSERT INTO Cliente (Nombre, Apellido, Telefono, ID_user) VALUES
            ('Juan', 'Pérez', '04121234567', $1)
            ON CONFLICT DO NOTHING
            RETURNING ID_cliente;
        `;
        const clienteDataResult = await pool.query(clienteQuery, [clienteUserId]);
        const clienteId = clienteDataResult.rows[0]?.ID_cliente || 1;

        // 9. Insertar Pago y Membresía de prueba
        console.log('Insertando pago y membresía de prueba...');
        const pagoQuery = `
            INSERT INTO Pago (ID_cliente, ID_suscripcion, Monto, Fecha) VALUES
            ($1, 1, 50.00, NOW())
            ON CONFLICT DO NOTHING
            RETURNING ID_pago;
        `;
        const pagoResult = await pool.query(pagoQuery, [clienteId]);
        const pagoId = pagoResult.rows[0]?.ID_pago || 1;

        const membresiQuery = `
            INSERT INTO Membresia (ID_cliente, ID_pago) VALUES
            ($1, $2)
            ON CONFLICT DO NOTHING;
        `;
        await pool.query(membresiQuery, [clienteId, pagoId]);

        // 10. Insertar Sesiones de ejemplo
        console.log('Insertando sesiones de ejemplo...');
        const sesionesQuery = `
            INSERT INTO Sesion (Nombre, ID_disciplina, ID_entrenador, Hora_inicio, Hora_fin, Cupos) VALUES
            ('Spinning Mañana', 1, $1, '07:00:00', '08:00:00', 20),
            ('Yoga Tarde', 2, $1, '18:00:00', '19:00:00', 15),
            ('CrossFit Noche', 3, $1, '19:30:00', '20:30:00', 12),
            ('Zumba Mañana', 4, $1, '08:00:00', '09:00:00', 25),
            ('Pilates Tarde', 5, $1, '17:00:00', '18:00:00', 18)
            ON CONFLICT DO NOTHING;
        `;
        await pool.query(sesionesQuery, [trainerId]);

        // 11. Insertar Productos de tienda
        console.log('Insertando productos de tienda...');
        const productosQuery = `
            INSERT INTO Producto (Nombre, Descripcion, Precio, Stock) VALUES
            ('Botella de agua 1L', 'Botella reutilizable de 1 litro', 15.00, 50),
            ('Toalla de microfibra', 'Toalla absorbente premium', 20.00, 30),
            ('Suplemento Proteína', 'Polvo de proteína 1kg', 45.00, 25)
            ON CONFLICT DO NOTHING;
        `;
        await pool.query(productosQuery);

        console.log('✅ Datos de prueba insertados exitosamente');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error al insertar datos:', error.message);
        process.exit(1);
    }
};

seedData();
