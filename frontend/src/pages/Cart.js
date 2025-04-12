import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Button,
    IconButton,
    Divider,
    TextField,
    Snackbar,
    Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useCart } from '../context/CartContext';

// Backend API URL
const API_URL = 'http://localhost:5001';

function Cart() {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, updateQuantity, calculateTotal, clearCart } = useCart();
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleQuantityChange = (id, change) => {
        updateQuantity(id, change);
    };

    const handleRemoveItem = (id) => {
        removeFromCart(id);
    };

    const handleCheckout = async () => {
        try {
            const response = await fetch(`${API_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: cartItems,
                    total_amount: calculateTotal(),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create order');
            }

            const result = await response.json();

            if (result.success) {
                setShowSuccess(true);
                clearCart();
                // Redirect to home page after 2 seconds
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleCloseSuccess = () => {
        setShowSuccess(false);
    };

    const handleCloseError = () => {
        setError(null);
    };

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Shopping Cart
            </Typography>

            {cartItems.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                        Your cart is empty
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
                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        {cartItems.map((item) => (
                            <Card key={item.id} sx={{ mb: 2 }}>
                                <Grid container>
                                    <Grid item xs={12} sm={4}>
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={item.image_url || 'https://source.unsplash.com/random/800x600/?motorcycle'}
                                            alt={`${item.brand} ${item.model}`}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={8}>
                                        <CardContent>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'flex-start',
                                                }}
                                            >
                                                <Box>
                                                    <Typography variant="h6" gutterBottom>
                                                        {item.brand} {item.model}
                                                    </Typography>
                                                    <Typography
                                                        variant="h6"
                                                        color="primary"
                                                        gutterBottom
                                                    >
                                                        ${item.price.toLocaleString()}
                                                    </Typography>
                                                </Box>
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleRemoveItem(item.id)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    mt: 2,
                                                }}
                                            >
                                                <IconButton
                                                    onClick={() => handleQuantityChange(item.id, -1)}
                                                >
                                                    <RemoveIcon />
                                                </IconButton>
                                                <TextField
                                                    value={item.quantity}
                                                    type="number"
                                                    size="small"
                                                    sx={{ width: '60px', mx: 1 }}
                                                    inputProps={{ min: 1 }}
                                                    onChange={(e) =>
                                                        handleQuantityChange(
                                                            item.id,
                                                            parseInt(e.target.value) - item.quantity
                                                        )
                                                    }
                                                />
                                                <IconButton
                                                    onClick={() => handleQuantityChange(item.id, 1)}
                                                >
                                                    <AddIcon />
                                                </IconButton>
                                            </Box>
                                        </CardContent>
                                    </Grid>
                                </Grid>
                            </Card>
                        ))}
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Order Summary
                                </Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mb: 1,
                                    }}
                                >
                                    <Typography>Subtotal</Typography>
                                    <Typography>
                                        ${calculateTotal().toLocaleString()}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mb: 1,
                                    }}
                                >
                                    <Typography>Shipping</Typography>
                                    <Typography>Free</Typography>
                                </Box>
                                <Divider sx={{ my: 2 }} />
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mb: 2,
                                    }}
                                >
                                    <Typography variant="h6">Total</Typography>
                                    <Typography variant="h6">
                                        ${calculateTotal().toLocaleString()}
                                    </Typography>
                                </Box>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    size="large"
                                    onClick={handleCheckout}
                                >
                                    Proceed to Checkout
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            <Snackbar
                open={showSuccess}
                autoHideDuration={2000}
                onClose={handleCloseSuccess}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
                    Order placed successfully! Redirecting to home page...
                </Alert>
            </Snackbar>

            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={handleCloseError}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default Cart; 