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
    CircularProgress
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../context/CartContext';

// Get API URL from environment variable or use default
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

function MotorbikeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [motorbike, setMotorbike] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchMotorbike = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/api/motorbikes/${id}`);

                if (!response.ok) {
                    throw new Error('Motorbike not found');
                }

                const data = await response.json();

                // Update image URL to use the backend server
                if (data.image_url) {
                    data.image_url = `${API_URL}${data.image_url}`;
                }

                setMotorbike(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching motorbike:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchMotorbike();
    }, [id]);

    const handleAddToCart = () => {
        addToCart(motorbike);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="h5" color="error">{error}</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/motorbikes')}
                    sx={{ mt: 2 }}
                >
                    Back to Motorbikes
                </Button>
            </Container>
        );
    }

    if (!motorbike) {
        return null;
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                        <Box
                            component="img"
                            src={motorbike.image_url || 'https://via.placeholder.com/600x400?text=No+Image'}
                            alt={`${motorbike.brand} ${motorbike.model}`}
                            sx={{
                                width: '100%',
                                height: 'auto',
                                borderRadius: 1
                            }}
                        />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h3" component="h1" gutterBottom>
                        {motorbike.brand} {motorbike.model}
                    </Typography>
                    <Typography variant="h5" color="text.secondary" gutterBottom>
                        Year: {motorbike.year}
                    </Typography>
                    <Typography variant="h4" color="primary" sx={{ my: 2 }}>
                        ${motorbike.price.toLocaleString()}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body1" paragraph>
                        <strong>Brand:</strong> {motorbike.brand}
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>Model:</strong> {motorbike.model}
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>Year:</strong> {motorbike.year}
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>Price:</strong> ${motorbike.price.toLocaleString()}
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>Stock:</strong> {motorbike.stock} available
                    </Typography>
                    <Box sx={{ mt: 4 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={handleAddToCart}
                            disabled={motorbike.stock <= 0}
                            sx={{ mr: 2 }}
                        >
                            Add to Cart
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            size="large"
                            onClick={() => navigate('/motorbikes')}
                        >
                            Back to Motorbikes
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}

export default MotorbikeDetail; 