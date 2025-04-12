const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

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

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/motorbike_store'
});

// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Motorbikes routes
app.get('/api/motorbikes', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM motorbikes');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/motorbikes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM motorbikes WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Motorbike not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Orders routes
app.post('/api/orders', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { items, total_amount } = req.body;

        // Create the order
        const orderResult = await client.query(
            'INSERT INTO orders (total_amount, status) VALUES ($1, $2) RETURNING id',
            [total_amount, 'pending']
        );

        const orderId = orderResult.rows[0].id;

        // Add order items and update stock
        for (const item of items) {
            // Insert order item
            await client.query(
                'INSERT INTO order_items (order_id, motorbike_id, quantity, price_at_time) VALUES ($1, $2, $3, $4)',
                [orderId, item.id, item.quantity, item.price]
            );

            // Update stock
            await client.query(
                'UPDATE motorbikes SET stock = stock - $1 WHERE id = $2',
                [item.quantity, item.id]
            );
        }

        await client.query('COMMIT');

        res.json({
            success: true,
            orderId,
            message: 'Order created successfully'
        });
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
});

// Get order status
app.get('/api/orders/:id', async (req, res) => {
    try {
        const orderResult = await pool.query(
            'SELECT * FROM orders WHERE id = $1',
            [req.params.id]
        );

        if (orderResult.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const order = orderResult.rows[0];

        // Get order items with motorbike details
        const itemsResult = await pool.query(
            `SELECT oi.*, m.brand, m.model, m.image_url 
             FROM order_items oi 
             JOIN motorbikes m ON oi.motorbike_id = m.id 
             WHERE oi.order_id = $1`,
            [req.params.id]
        );

        res.json({
            ...order,
            items: itemsResult.rows
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get order history
app.get('/api/orders', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT o.*, 
                    COUNT(oi.id) as total_items,
                    SUM(oi.quantity) as total_quantity
             FROM orders o
             LEFT JOIN order_items oi ON o.id = oi.order_id
             GROUP BY o.id
             ORDER BY o.created_at DESC`
        );

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 