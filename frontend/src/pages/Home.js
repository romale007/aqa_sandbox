import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Container,
} from '@mui/material';

// Backend API URL
const API_URL = 'http://localhost:5001';

function Home() {
    const navigate = useNavigate();
    const [featuredBikes, setFeaturedBikes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedBikes = async () => {
            try {
                const response = await fetch(`${API_URL}/api/motorbikes`);
                const data = await response.json();
                // Get one bike from each brand for featured section
                const brands = ['Honda', 'Yamaha', 'Kawasaki', 'Ducati', 'BMW', 'Harley Davidson'];
                const featured = brands.map(brand => {
                    return data.find(bike => bike.brand === brand) || null;
                }).filter(bike => bike !== null);

                // Update image URLs to use the backend server
                const featuredWithCorrectUrls = featured.map(bike => ({
                    ...bike,
                    image_url: bike.image_url ? `${API_URL}${bike.image_url}` : null
                }));

                setFeaturedBikes(featuredWithCorrectUrls);
            } catch (error) {
                console.error('Error fetching featured bikes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedBikes();
    }, []);

    return (
        <Box>
            {/* Hero Section */}
            <Box
                sx={{
                    bgcolor: 'background.paper',
                    pt: 8,
                    pb: 6,
                    textAlign: 'center',
                }}
            >
                <Container maxWidth="sm">
                    <Typography
                        component="h1"
                        variant="h2"
                        color="text.primary"
                        gutterBottom
                    >
                        Welcome to Motorbike Store
                    </Typography>
                    <Typography variant="h5" color="text.secondary" paragraph>
                        Discover our collection of premium motorbikes. From sport bikes to
                        cruisers, find the perfect ride for your adventures.
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/motorbikes')}
                    >
                        Browse Motorbikes
                    </Button>
                </Container>
            </Box>

            {/* Featured Bikes Section */}
            <Container sx={{ py: 8 }} maxWidth="md">
                <Typography variant="h4" component="h2" gutterBottom>
                    Featured Motorbikes
                </Typography>
                <Grid container spacing={4}>
                    {loading ? (
                        <Grid item xs={12}>
                            <Typography>Loading featured bikes...</Typography>
                        </Grid>
                    ) : (
                        featuredBikes.map((bike) => (
                            <Grid item key={bike.id} xs={12} sm={6} md={4}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => navigate(`/motorbikes/${bike.id}`)}
                                >
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={bike.image_url}
                                        alt={`${bike.brand} ${bike.model}`}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {bike.brand} {bike.model}
                                        </Typography>
                                        <Typography>
                                            ${bike.price.toLocaleString()}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    )}
                </Grid>
            </Container>
        </Box>
    );
}

export default Home; 