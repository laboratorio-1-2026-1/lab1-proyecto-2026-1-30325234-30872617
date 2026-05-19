const pool = require('../config/db');
const tiendaRepository = require('../repositories/tiendaRepository');
const clienteRepository = require('../repositories/clienteRepository');

const getProductos = async (req, res) => {
    try {
        const productos = await tiendaRepository.listProductos();
        return res.status(200).json(productos);
    } catch (error) {
        console.error('Error en tiendaController.getProductos:', error.message);
        return res.status(500).json({
            error: 'Internal Server Error',
            mensaje: 'Error al obtener los productos',
            timestamp: new Date().toISOString()
        });
    }
};

const updateProductoStock = async (req, res) => {
    try {
        const { id_producto } = req.params;
        const { stock } = req.body;

        if (stock == null || stock < 0) {
            return res.status(400).json({
                error: 'Bad Request',
                mensaje: 'El stock debe ser un valor entero mayor o igual a cero',
                timestamp: new Date().toISOString()
            });
        }

        const producto = await tiendaRepository.findProductoById(id_producto);
        if (!producto) {
            return res.status(404).json({
                error: 'Not Found',
                codigoInterno: 'ERR_PRODUCTO_NO_ENCONTRADO',
                mensaje: 'No se encontró el producto especificado',
                timestamp: new Date().toISOString()
            });
        }

        const actualizado = await tiendaRepository.updateProductoStock(id_producto, stock);
        return res.status(200).json(actualizado);
    } catch (error) {
        console.error('Error en tiendaController.updateProductoStock:', error.message);
        return res.status(500).json({
            error: 'Internal Server Error',
            mensaje: 'Error al actualizar el stock del producto',
            timestamp: new Date().toISOString()
        });
    }
};

const createVenta = async (req, res) => {
    const client = await pool.connect();
    try {
        const { id_client, items } = req.body;
        let clienteId = null;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                error: 'Bad Request',
                mensaje: 'Se requieren productos para registrar la venta',
                timestamp: new Date().toISOString()
            });
        }

        if (req.user.role === 3) {
            const cliente = await clienteRepository.findClientByUserId(req.user.id);
            if (!cliente) {
                return res.status(404).json({
                    error: 'Not Found',
                    codigoInterno: 'ERR_CLIENTE_NO_ENCONTRADO',
                    mensaje: 'No se encontró el cliente asociado al token',
                    timestamp: new Date().toISOString()
                });
            }
            clienteId = cliente.id_client;
        } else {
            if (!id_client) {
                return res.status(400).json({
                    error: 'Bad Request',
                    mensaje: 'Se requiere id_client para registrar la venta',
                    timestamp: new Date().toISOString()
                });
            }
            const cliente = await clienteRepository.findClientById(id_client);
            if (!cliente) {
                return res.status(404).json({
                    error: 'Not Found',
                    codigoInterno: 'ERR_CLIENTE_NO_ENCONTRADO',
                    mensaje: 'No se encontró el cliente especificado',
                    timestamp: new Date().toISOString()
                });
            }
            clienteId = cliente.id_client;
        }

        await client.query('BEGIN');

        let total = 0;
        const detalles = [];
        let detalleId = await tiendaRepository.getNextDetalleVentaId(client);

        for (const item of items) {
            const { id_producto, cantidad } = item;
            if (!id_producto || !cantidad || cantidad <= 0) {
                await client.query('ROLLBACK');
                return res.status(400).json({
                    error: 'Bad Request',
                    mensaje: 'Cada producto debe incluir id_producto y cantidad mayor a cero',
                    timestamp: new Date().toISOString()
                });
            }

            const producto = await tiendaRepository.findProductoByIdForUpdate(client, id_producto);
            if (!producto) {
                await client.query('ROLLBACK');
                return res.status(404).json({
                    error: 'Not Found',
                    codigoInterno: 'ERR_PRODUCTO_NO_ENCONTRADO',
                    mensaje: `No se encontró el producto con id ${id_producto}`,
                    timestamp: new Date().toISOString()
                });
            }

            if (producto.stock < cantidad) {
                await client.query('ROLLBACK');
                return res.status(409).json({
                    error: 'Conflict',
                    codigoInterno: 'ERR_STOCK_INSUFICIENTE',
                    mensaje: `No hay stock suficiente para el producto ${producto.nombre}`,
                    timestamp: new Date().toISOString()
                });
            }

            const subtotal = Number(producto.precio) * cantidad;
            total += subtotal;
            detalles.push({ id_detalle: detalleId++, id_producto, cantidad, precio_unidad: producto.precio });
        }

        const fecha = new Date().toISOString().split('T')[0];
        const ventaCreada = await tiendaRepository.insertVenta(client, clienteId, total, fecha);

        for (const detalle of detalles) {
            await tiendaRepository.insertDetalleVenta(
                client,
                detalle.id_detalle,
                ventaCreada.id_venta,
                detalle.id_producto,
                detalle.cantidad,
                detalle.precio_unidad
            );
            await tiendaRepository.decrementProductoStock(client, detalle.id_producto, detalle.cantidad);
        }

        await client.query('COMMIT');
        return res.status(201).json({
            id_venta: ventaCreada.id_venta,
            id_client: ventaCreada.id_client,
            fecha: ventaCreada.fecha,
            total: ventaCreada.total,
            detalles
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error en tiendaController.createVenta:', error.message);
        return res.status(500).json({
            error: 'Internal Server Error',
            mensaje: 'Error al registrar la venta',
            timestamp: new Date().toISOString()
        });
    } finally {
        client.release();
    }
};

const getVentas = async (req, res) => {
    try {
        const ventas = await tiendaRepository.listVentasHistory();
        return res.status(200).json(ventas);
    } catch (error) {
        console.error('Error en tiendaController.getVentas:', error.message);
        return res.status(500).json({
            error: 'Internal Server Error',
            mensaje: 'Error al obtener el historial de ventas',
            timestamp: new Date().toISOString()
        });
    }
};

module.exports = {
    getProductos,
    updateProductoStock,
    createVenta,
    getVentas
};