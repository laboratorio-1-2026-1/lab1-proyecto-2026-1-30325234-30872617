const pool = require('../config/db');

const listProductos = async () => {
    try {
        const query = 'SELECT id_producto, nombre, descripcion, precio, stock FROM productostienda ORDER BY id_producto';
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error en tiendaRepository.listProductos:', error.message);
        throw error;
    }
};

const findProductoById = async (id_producto) => {
    try {
        const query = 'SELECT id_producto, nombre, descripcion, precio, stock FROM productostienda WHERE id_producto = $1';
        const result = await pool.query(query, [id_producto]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error en tiendaRepository.findProductoById:', error.message);
        throw error;
    }
};

const findProductoByIdForUpdate = async (client, id_producto) => {
    try {
        const query = 'SELECT id_producto, nombre, descripcion, precio, stock FROM productostienda WHERE id_producto = $1 FOR UPDATE';
        const result = await client.query(query, [id_producto]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error en tiendaRepository.findProductoByIdForUpdate:', error.message);
        throw error;
    }
};

const updateProductoStock = async (id_producto, stock) => {
    try {
        const query = `
            UPDATE productostienda
            SET stock = $1
            WHERE id_producto = $2
            RETURNING *`;
        const result = await pool.query(query, [stock, id_producto]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error en tiendaRepository.updateProductoStock:', error.message);
        throw error;
    }
};

const getNextDetalleVentaId = async (client) => {
    try {
        const query = 'SELECT COALESCE(MAX(id_detalle), 0) + 1 AS next_id FROM detalleventa';
        const result = await client.query(query);
        return parseInt(result.rows[0].next_id, 10);
    } catch (error) {
        console.error('Error en tiendaRepository.getNextDetalleVentaId:', error.message);
        throw error;
    }
};

const insertVenta = async (client, id_client, total, fecha) => {
    try {
        const query = `
            INSERT INTO ventastienda (id_client, fecha, total)
            VALUES ($1, $2, $3)
            RETURNING id_venta, id_client, fecha, total`;
        const result = await client.query(query, [id_client, fecha, total]);
        return result.rows[0];
    } catch (error) {
        console.error('Error en tiendaRepository.insertVenta:', error.message);
        throw error;
    }
};

const insertDetalleVenta = async (client, id_detalle, id_venta, id_producto, cantidad, precio_unidad) => {
    try {
        const query = `
            INSERT INTO detalleventa (id_detalle, id_venta, id_producto, cantidad, precio_unidad)
            VALUES ($1, $2, $3, $4, $5)`;
        await client.query(query, [id_detalle, id_venta, id_producto, cantidad, precio_unidad]);
    } catch (error) {
        console.error('Error en tiendaRepository.insertDetalleVenta:', error.message);
        throw error;
    }
};

const decrementProductoStock = async (client, id_producto, cantidad) => {
    try {
        const query = `
            UPDATE productostienda
            SET stock = stock - $1
            WHERE id_producto = $2
            RETURNING stock`;
        const result = await client.query(query, [cantidad, id_producto]);
        return result.rows[0] || null;
    } catch (error) {
        console.error('Error en tiendaRepository.decrementProductoStock:', error.message);
        throw error;
    }
};

const listVentasHistory = async () => {
    try {
        const query = `
            SELECT
                v.id_venta,
                v.id_client,
                c.nombre AS cliente_nombre,
                c.apellido AS cliente_apellido,
                v.total,
                v.fecha,
                json_agg(
                    json_build_object(
                        'id_producto', dv.id_producto,
                        'cantidad', dv.cantidad,
                        'precio_unidad', dv.precio_unidad
                    ) ORDER BY dv.id_detalle
                ) AS productos
            FROM ventastienda v
            JOIN clientes c ON c.id_client = v.id_client
            JOIN detalleventa dv ON dv.id_venta = v.id_venta
            GROUP BY v.id_venta, c.nombre, c.apellido
            ORDER BY v.fecha DESC, v.id_venta DESC`;
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error en tiendaRepository.listVentasHistory:', error.message);
        throw error;
    }
};

module.exports = {
    listProductos,
    findProductoById,
    updateProductoStock,
    getNextDetalleVentaId,
    insertVenta,
    insertDetalleVenta,
    decrementProductoStock,
    findProductoByIdForUpdate,
    listVentasHistory
};
