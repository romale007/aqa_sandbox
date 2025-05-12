import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    Grid,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
} from '@mui/material';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';

// Backend API URL
const API_URL = 'http://localhost:5001';

function OrderHistory() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${API_URL}/api/orders`);
                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }
                const data = await response.json();
                setOrders(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleViewOrder = async (orderId) => {
        try {
            const response = await fetch(`${API_URL}/api/orders/${orderId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch order details');
            }
            const data = await response.json();
            // Parse the items if they're stored as a string
            if (typeof data.items === 'string') {
                data.items = JSON.parse(data.items);
            }
            setSelectedOrder(data);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleCloseOrder = () => {
        setSelectedOrder(null);
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'warning';
            case 'completed':
                return 'success';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    if (loading) {
        return (
            <Container>
                <Typography>Loading orders...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Typography color="error">{error}</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/')}
                    sx={{ mt: 2 }}
                >
                    Return to Home
                </Button>
            </Container>
        );
    }

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Order History
            </Typography>

            {orders.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                        No orders found
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={() => navigate('/motorbikes')}
                    >
                        Browse Motorbikes
                    </Button>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {orders.map((order) => (
                        <Grid item xs={12} key={order.id}>
                            <Card>
                                <CardContent>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} sm={3}>
                                            <Typography variant="h6">
                                                Order #{order.id}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={3}>
                                            <Typography variant="body1">
                                                Total: ${order.total_amount.toLocaleString()}
                                            </Typography>
                                            <Typography variant="body2">
                                                Items: {order.total_items}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={3}>
                                            <Chip
                                                label={order.status}
                                                color={getStatusColor(order.status)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={3}>
                                            <Button
                                                variant="outlined"
                                                onClick={() => handleViewOrder(order.id)}
                                            >
                                                View Details
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Dialog
                open={!!selectedOrder}
                onClose={handleCloseOrder}
                maxWidth="md"
                fullWidth
            >
                {selectedOrder && (
                    <>
                        <DialogTitle>
                            Order #{selectedOrder.id} Details
                        </DialogTitle>
                        <DialogContent>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle1">
                                    Status: <Chip label={selectedOrder.status} color={getStatusColor(selectedOrder.status)} />
                                </Typography>
                                <Typography variant="subtitle1">
                                    Date: {new Date(selectedOrder.created_at).toLocaleString()}
                                </Typography>
                                <Typography variant="subtitle1">
                                    Total: ${selectedOrder.total_amount.toLocaleString()}
                                </Typography>
                            </Box>
                            <Typography variant="h6" gutterBottom>
                                Items
                            </Typography>
                            <List>
                                {selectedOrder.items.map((item, index) => (
                                    <ListItem key={index}>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <TwoWheelerIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={`${item.brand} ${item.model}`}
                                            secondary={`Quantity: ${item.quantity} | Price: $${item.price_at_time.toLocaleString()}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseOrder}>Close</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Container>
    );
}

export default OrderHistory; 