import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Grid,
    Typography,
    Button,
    Box,
    Paper,
    Divider,
    Chip,
    Snackbar,
    Alert,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../context/CartContext';

// Backend API URL
const API_URL = 'http://localhost:5001';

function MotorbikeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [motorbike, setMotorbike] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchMotorbike = async () => {
            try {
                const response = await fetch(`${API_URL}/api/motorbikes/${id}`);
                if (!response.ok) {
                    throw new Error('Motorbike not found');
                }
                const data = await response.json();

                // Update image URL to use the backend server
                const updatedMotorbike = {
                    ...data,
                    image_url: data.image_url ? `${API_URL}${data.image_url}` : null
                };

                setMotorbike(updatedMotorbike);
            } catch (error) {
                console.error('Error fetching motorbike:', error);
                navigate('/motorbikes');
            } finally {
                setLoading(false);
            }
        };

        fetchMotorbike();
    }, [id, navigate]);

    const handleAddToCart = () => {
        addToCart(motorbike);
        setShowAlert(true);
    };

    const handleCloseAlert = () => {
        setShowAlert(false);
    };

    if (loading) {
        return (
            <Container>
                <Typography>Loading...</Typography>
            </Container>
        );
    }

    if (!motorbike) {
        return null;
    }

    return (
        <Container>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                        }}
                    >
                        <img
                            src={motorbike.image_url || 'https://source.unsplash.com/random/800x600/?motorcycle'}
                            alt={`${motorbike.brand} ${motorbike.model}`}
                            style={{
                                width: '100%',
                                height: 'auto',
                                objectFit: 'cover',
                                borderRadius: '8px',
                            }}
                        />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            {motorbike.brand} {motorbike.model}
                        </Typography>
                        <Typography variant="h5" color="primary" gutterBottom>
                            ${motorbike.price.toLocaleString()}
                        </Typography>
                        <Box sx={{ my: 2 }}>
                            <Chip
                                label={`Year: ${motorbike.year}`}
                                sx={{ mr: 1 }}
                            />
                            <Chip
                                label={`Stock: ${motorbike.stock} available`}
                                color={motorbike.stock > 0 ? 'success' : 'error'}
                            />
                        </Box>
                        <Typography variant="body1" paragraph>
                            {motorbike.description}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<ShoppingCartIcon />}
                            onClick={handleAddToCart}
                            disabled={motorbike.stock === 0}
                            sx={{ mt: 2 }}
                        >
                            {motorbike.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
            <Snackbar
                open={showAlert}
                autoHideDuration={3000}
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
                    {motorbike.brand} {motorbike.model} added to cart!
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default MotorbikeDetail; 