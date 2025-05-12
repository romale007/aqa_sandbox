import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Button,
    Box,
    CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';

// Get API URL from environment variable or use default
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const Home = () => {
    const [featuredBikes, setFeaturedBikes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBikes = async () => {
            try {
                const response = await fetch(`${API_URL}/api/motorbikes`);
                const data = await response.json();

                // Get one bike from each brand
                const brands = ['Honda', 'Yamaha', 'Kawasaki', 'Ducati', 'BMW', 'Harley Davidson'];
                const featured = brands.map(brand => {
                    const brandBikes = data.filter(bike => bike.brand === brand);
                    return brandBikes.length > 0 ? brandBikes[0] : null;
                }).filter(bike => bike !== null);

                setFeaturedBikes(featured);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching bikes:', error);
                setLoading(false);
            }
        };

        fetchBikes();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography variant="h2" component="h1" gutterBottom>
                    Welcome to Motorbike Store
                </Typography>
                <Typography variant="h5" color="text.secondary" paragraph>
                    Discover our collection of premium motorbikes from top brands
                </Typography>
                <Button
                    component={Link}
                    to="/motorbikes"
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ mt: 2 }}
                >
                    Browse All Motorbikes
                </Button>
            </Box>

            <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
                Featured Motorbikes
            </Typography>

            <Grid container spacing={4}>
                {featuredBikes.map((bike) => (
                    <Grid item key={bike.id} xs={12} sm={6} md={4}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardMedia
                                component="img"
                                height="200"
                                image={bike.image_url ? `${API_URL}${bike.image_url}` : 'https://via.placeholder.com/300x200?text=No+Image'}
                                alt={`${bike.brand} ${bike.model}`}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h5" component="h3">
                                    {bike.brand} {bike.model}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    Year: {bike.year}
                                </Typography>
                                <Typography variant="h6" color="primary">
                                    ${bike.price.toLocaleString()}
                                </Typography>
                                <Button
                                    component={Link}
                                    to={`/motorbikes/${bike.id}`}
                                    variant="outlined"
                                    color="primary"
                                    sx={{ mt: 2 }}
                                >
                                    View Details
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Home; 