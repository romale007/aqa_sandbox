const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

// Load environment variables
dotenv.config();

const app = express();
const API_PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the assets directory
const assetsPath = path.join(__dirname, '../assets');
console.log('Serving static files from:', assetsPath);
app.use('/assets', express.static(assetsPath, {
    setHeaders: (res, path, stat) => {
        res.set('Access-Control-Allow-Origin', '*');
    }
}));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/motorbike_store'
});

// Routes
/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check API health
 *     description: Returns the health status of the API
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Motorbikes routes
/**
 * @swagger
 * /api/motorbikes:
 *   get:
 *     summary: Get all motorbikes
 *     description: Retrieve a list of all motorbikes from the database
 *     responses:
 *       200:
 *         description: A list of motorbikes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   brand:
 *                     type: string
 *                   model:
 *                     type: string
 *                   year:
 *                     type: integer
 *                   price:
 *                     type: number
 *                   stock:
 *                     type: integer
 *                   image_url:
 *                     type: string
 */
app.get('/api/motorbikes', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM motorbikes ORDER BY brand, model');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching motorbikes:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @swagger
 * /api/motorbikes/{id}:
 *   get:
 *     summary: Get a motorbike by ID
 *     description: Retrieve a specific motorbike by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The motorbike ID
 *     responses:
 *       200:
 *         description: A motorbike object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 brand:
 *                   type: string
 *                 model:
 *                   type: string
 *                 year:
 *                   type: integer
 *                 price:
 *                   type: number
 *                 stock:
 *                   type: integer
 *                 image_url:
 *                   type: string
 *       404:
 *         description: Motorbike not found
 */
app.get('/api/motorbikes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM motorbikes WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Motorbike not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching motorbike:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Orders routes
/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     description: Create a new order with the provided items
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - total_amount
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - motorbike_id
 *                     - quantity
 *                   properties:
 *                     motorbike_id:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *               total_amount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */
app.post('/api/orders', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { items, total_amount } = req.body;

        // Create order
        const orderResult = await client.query(
            'INSERT INTO orders (total_amount, status) VALUES ($1, $2) RETURNING id',
            [total_amount, 'pending']
        );
        const orderId = orderResult.rows[0].id;

        // Add order items and update stock
        for (const item of items) {
            // First get the current price of the motorbike
            const motorbikeResult = await client.query(
                'SELECT price FROM motorbikes WHERE id = $1',
                [item.motorbike_id]
            );

            if (motorbikeResult.rows.length === 0) {
                throw new Error(`Motorbike with id ${item.motorbike_id} not found`);
            }

            const price_at_time = motorbikeResult.rows[0].price;

            // Insert order item with the current price
            await client.query(
                'INSERT INTO order_items (order_id, motorbike_id, quantity, price_at_time) VALUES ($1, $2, $3, $4)',
                [orderId, item.motorbike_id, item.quantity, price_at_time]
            );

            // Update stock
            await client.query(
                'UPDATE motorbikes SET stock = stock - $1 WHERE id = $2',
                [item.quantity, item.motorbike_id]
            );
        }

        await client.query('COMMIT');
        res.status(201).json({ message: 'Order created successfully', orderId });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error creating order:', err);
        res.status(500).json({ error: err.message || 'Internal server error' });
    } finally {
        client.release();
    }
});

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     description: Retrieve a list of all orders with their items
 *     responses:
 *       200:
 *         description: A list of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   total_amount:
 *                     type: number
 *                   status:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         motorbike_id:
 *                           type: integer
 *                         quantity:
 *                           type: integer
 *                         price_at_time:
 *                           type: number
 */
app.get('/api/orders', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                o.id,
                o.total_amount,
                o.status,
                o.created_at,
                json_agg(json_build_object(
                    'motorbike_id', oi.motorbike_id,
                    'quantity', oi.quantity,
                    'price_at_time', oi.price_at_time
                )) as items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            GROUP BY o.id
            ORDER BY o.created_at DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     description: Retrieve a specific order by its ID with all items
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The order ID
 *     responses:
 *       200:
 *         description: An order object with items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 total_amount:
 *                   type: number
 *                 status:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       motorbike_id:
 *                         type: integer
 *                       quantity:
 *                         type: integer
 *                       price_at_time:
 *                         type: number
 *       404:
 *         description: Order not found
 */
app.get('/api/orders/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`
            SELECT 
                o.id,
                o.total_amount,
                o.status,
                o.created_at,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'motorbike_id', oi.motorbike_id,
                            'quantity', oi.quantity,
                            'price_at_time', oi.price_at_time,
                            'brand', m.brand,
                            'model', m.model
                        )
                    ) FILTER (WHERE oi.id IS NOT NULL),
                    '[]'::json
                ) as items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN motorbikes m ON oi.motorbike_id = m.id
            WHERE o.id = $1
            GROUP BY o.id
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching order:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start API server
app.listen(API_PORT, () => {
    console.log(`API Server running at http://localhost:${API_PORT}`);
    console.log(`API documentation available at http://localhost:${API_PORT}/api-docs`);
}); 