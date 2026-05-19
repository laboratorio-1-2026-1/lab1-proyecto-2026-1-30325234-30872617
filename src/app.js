// 1. Cargar variables de entorno del archivo .env
require('dotenv').config();

// 2. Importar Express, Swagger y el Enrutador Central
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const mainRouter = require('./routes/index');

const app = express();

// Middleware para leer JSON en el cuerpo de las peticiones
app.use(express.json());

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SmartGym API',
      version: '1.0.0',
      description: 'Documentación de la API para el sistema SmartGym',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor Local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Login: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              example: 'user@example.com',
            },
            password: {
              type: 'string',
              example: 'password123',
            },
          },
        },
        Maquina: {
          type: 'object',
          properties: {
            id_maquina: {
              type: 'integer',
            },
            nombre: {
              type: 'string',
            },
            descripcion: {
              type: 'string',
            },
          },
        },
        Disciplina: {
          type: 'object',
          required: ['nombre'],
          properties: {
            id_disciplina: {
              type: 'integer',
            },
            nombre: {
              type: 'string',
            },
            descripcion: {
              type: 'string',
            },
          },
        },
        Sesion: {
          type: 'object',
          required: ['nombre', 'horario'],
          properties: {
            id_sesion: {
              type: 'integer',
            },
            nombre: {
              type: 'string',
            },
            horario: {
              type: 'string',
            },
            capacidad: {
              type: 'integer',
            },
          },
        },
        Suscripcion: {
          type: 'object',
          required: ['nombre', 'precio'],
          properties: {
            id_suscripcion: {
              type: 'integer',
            },
            nombre: {
              type: 'string',
            },
            precio: {
              type: 'number',
            },
            duracion: {
              type: 'integer',
            },
          },
        },
      },
    },
    paths: {},
  },
  apis: ['./src/routes/*.js', './src/app.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Conexión global: todas las rutas bajo el prefijo /api/v1
app.use('/api/v1', mainRouter);

// Definir el puerto: usa el del .env o el 3000 por defecto
const PORT = process.env.PORT || 3000;

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor SmartGym corriendo en el puerto ${PORT}`);
});

// Exportar la app para pruebas futuras
module.exports = app;

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Iniciar sesión
 *     description: Autentica un usuario y retorna un token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Credenciales inválidas
 *       400:
 *         description: Email o contraseña faltante
 */

/**
 * @swagger
 * /api/v1/maquinas:
 *   get:
 *     tags:
 *       - Máquinas
 *     summary: Obtener todas las máquinas
 *     description: Retorna la lista de todas las máquinas del gimnasio (solo admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de máquinas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Maquina'
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: No tiene permisos de administrador
 */

/**
 * @swagger
 * /api/v1/disciplinas:
 *   get:
 *     tags:
 *       - Disciplinas
 *     summary: Obtener todas las disciplinas
 *     description: Retorna la lista de todas las disciplinas disponibles
 *     responses:
 *       200:
 *         description: Lista de disciplinas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Disciplina'
 *   post:
 *     tags:
 *       - Disciplinas
 *     summary: Crear una nueva disciplina
 *     description: Crea una nueva disciplina (solo admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Disciplina'
 *     responses:
 *       201:
 *         description: Disciplina creada exitosamente
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: No tiene permisos de administrador
 */

/**
 * @swagger
 * /api/v1/sesiones:
 *   get:
 *     tags:
 *       - Sesiones
 *     summary: Obtener todas las sesiones
 *     description: Retorna la lista de todas las sesiones de entrenamiento
 *     responses:
 *       200:
 *         description: Lista de sesiones obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sesion'
 *   post:
 *     tags:
 *       - Sesiones
 *     summary: Crear una nueva sesión
 *     description: Crea una nueva sesión de entrenamiento (solo admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sesion'
 *     responses:
 *       201:
 *         description: Sesión creada exitosamente
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: No tiene permisos de administrador
 */

/**
 * @swagger
 * /api/v1/suscripciones:
 *   get:
 *     tags:
 *       - Suscripciones
 *     summary: Obtener todas las suscripciones
 *     description: Retorna la lista de todos los planes de suscripción
 *     responses:
 *       200:
 *         description: Lista de suscripciones obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Suscripcion'
 *   post:
 *     tags:
 *       - Suscripciones
 *     summary: Crear una nueva suscripción
 *     description: Crea un nuevo plan de suscripción (solo admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Suscripcion'
 *     responses:
 *       201:
 *         description: Suscripción creada exitosamente
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: No tiene permisos de administrador
 */

/**
 * @swagger
 * /api/v1/clientes/{id_cliente}/evaluaciones:
 *   get:
 *     tags:
 *       - Clientes
 *     summary: Obtener evaluaciones de un cliente
 *     description: Retorna todas las evaluaciones de un cliente específico
 *     parameters:
 *       - in: path
 *         name: id_cliente
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Evaluaciones obtenidas exitosamente
 *   post:
 *     tags:
 *       - Clientes
 *     summary: Crear evaluación para cliente
 *     description: Crea una nueva evaluación para un cliente específico
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_cliente
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Evaluación creada exitosamente
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: No tiene permisos de administrador
 */

/**
 * @swagger
 * /api/v1/clientes/{id_cliente}/membresias:
 *   get:
 *     tags:
 *       - Clientes
 *     summary: Obtener membresías de un cliente
 *     description: Retorna todas las membresías de un cliente específico
 *     parameters:
 *       - in: path
 *         name: id_cliente
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Membresías obtenidas exitosamente
 *   post:
 *     tags:
 *       - Clientes
 *     summary: Crear membresía para cliente
 *     description: Crea una nueva membresía para un cliente específico
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_cliente
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Membresía creada exitosamente
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: No tiene permisos de administrador
 */

/**
 * @swagger
 * /api/v1/reservas:
 *   post:
 *     tags:
 *       - Reservas
 *     summary: Crear una reserva en una sesión
 *     description: Reservar un cupo en una clase programada (valida solapamiento y disponibilidad)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['id_cliente', 'id_sesion']
 *             properties:
 *               id_cliente:
 *                 type: integer
 *               id_sesion:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Reserva creada exitosamente
 *       409:
 *         description: Conflicto - solapamiento horario o sin cupos
 *       401:
 *         description: Token no proporcionado o inválido
 */

/**
 * @swagger
 * /api/v1/sesiones/{id_sesion}/reservas:
 *   get:
 *     tags:
 *       - Reservas
 *     summary: Obtener reservas de una sesión
 *     description: Retorna todas las reservas registradas para una sesión específica
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_sesion
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reservas obtenidas exitosamente
 *       401:
 *         description: Token no proporcionado o inválido
 *   post:
 *     tags:
 *       - Reservas
 *     summary: Registrar reserva manualmente
 *     description: Admin registra una reserva manualmente para un cliente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_sesion
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['id_cliente']
 *             properties:
 *               id_cliente:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Reserva registrada exitosamente
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: No tiene permisos de administrador
 */

/**
 * @swagger
 * /api/v1/accesos/entrada:
 *   post:
 *     tags:
 *       - Control de Acceso
 *     summary: Registrar entrada al gimnasio
 *     description: Valida y registra el acceso de un cliente basado en su documento y membresía activa
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['documentoIdentidad']
 *             properties:
 *               documentoIdentidad:
 *                 type: string
 *                 example: "V-12345678"
 *     responses:
 *       200:
 *         description: Acceso permitido
 *       409:
 *         description: Conflicto - membresía vencida
 *       404:
 *         description: Cliente no encontrado
 *       401:
 *         description: Token no proporcionado o inválido
 */

/**
 * @swagger
 * /api/v1/pagos:
 *   post:
 *     tags:
 *       - Pagos
 *     summary: Registrar un pago
 *     description: Registra un nuevo pago de suscripción para un cliente
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['id_cliente', 'id_suscripcion', 'monto']
 *             properties:
 *               id_cliente:
 *                 type: integer
 *               id_suscripcion:
 *                 type: integer
 *               monto:
 *                 type: number
 *     responses:
 *       201:
 *         description: Pago registrado exitosamente
 *       400:
 *         description: Datos incompletos
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: No tiene permisos de administrador
 */

/**
 * @swagger
 * /api/v1/pagos/{id_pago}:
 *   get:
 *     tags:
 *       - Pagos
 *     summary: Obtener detalles de un pago
 *     description: Retorna la información de un pago específico
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_pago
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pago obtenido exitosamente
 *       404:
 *         description: Pago no encontrado
 *       401:
 *         description: Token no proporcionado o inválido
 */