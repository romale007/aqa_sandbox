import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Container,
    Pagination,
    Stack,
} from '@mui/material';

// Backend API URL
const API_URL = 'http://localhost:5001';

function MotorbikeList() {
    const navigate = useNavigate();
    const [motorbikes, setMotorbikes] = useState([]);
    const [filteredBikes, setFilteredBikes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [brandFilter, setBrandFilter] = useState('all');
    const [priceRange, setPriceRange] = useState('all');
    const [page, setPage] = useState(1);
    const bikesPerPage = 9; // Show 9 bikes per page (3x3 grid)

    useEffect(() => {
        // Use the backend API URL
        const fetchMotorbikes = async () => {
            try {
                const response = await fetch(`${API_URL}/api/motorbikes`);
                const data = await response.json();

                // Update image URLs to use the backend server
                const bikesWithCorrectUrls = data.map(bike => ({
                    ...bike,
                    image_url: bike.image_url ? `${API_URL}${bike.image_url}` : null
                }));

                setMotorbikes(bikesWithCorrectUrls);
                setFilteredBikes(bikesWithCorrectUrls);
            } catch (error) {
                console.error('Error fetching motorbikes:', error);
            }
        };

        fetchMotorbikes();
    }, []);

    useEffect(() => {
        let filtered = [...motorbikes];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(
                (bike) =>
                    bike.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    bike.model.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply brand filter
        if (brandFilter !== 'all') {
            filtered = filtered.filter((bike) => bike.brand === brandFilter);
        }

        // Apply price range filter
        if (priceRange !== 'all') {
            const [min, max] = priceRange.split('-').map(Number);
            filtered = filtered.filter(
                (bike) => bike.price >= min && (max ? bike.price <= max : true)
            );
        }

        setFilteredBikes(filtered);
        setPage(1); // Reset to first page when filters change
    }, [motorbikes, searchTerm, brandFilter, priceRange]);

    const brands = [...new Set(motorbikes.map((bike) => bike.brand))];

    // Calculate pagination
    const indexOfLastBike = page * bikesPerPage;
    const indexOfFirstBike = indexOfLastBike - bikesPerPage;
    const currentBikes = filteredBikes.slice(indexOfFirstBike, indexOfLastBike);
    const pageCount = Math.ceil(filteredBikes.length / bikesPerPage);

    const handlePageChange = (event, value) => {
        setPage(value);
        window.scrollTo(0, 0); // Scroll to top when page changes
    };

    return (
        <Container>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Motorbikes
                </Typography>
                <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Search"
                            variant="outlined"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                            <InputLabel>Brand</InputLabel>
                            <Select
                                value={brandFilter}
                                label="Brand"
                                onChange={(e) => setBrandFilter(e.target.value)}
                            >
                                <MenuItem value="all">All Brands</MenuItem>
                                {brands.map((brand) => (
                                    <MenuItem key={brand} value={brand}>
                                        {brand}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                            <InputLabel>Price Range</InputLabel>
                            <Select
                                value={priceRange}
                                label="Price Range"
                                onChange={(e) => setPriceRange(e.target.value)}
                            >
                                <MenuItem value="all">All Prices</MenuItem>
                                <MenuItem value="0-5000">Under $5,000</MenuItem>
                                <MenuItem value="5000-10000">$5,000 - $10,000</MenuItem>
                                <MenuItem value="10000-15000">$10,000 - $15,000</MenuItem>
                                <MenuItem value="15000-20000">$15,000 - $20,000</MenuItem>
                                <MenuItem value="20000-30000">$20,000 - $30,000</MenuItem>
                                <MenuItem value="30000">Over $30,000</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>

            <Grid container spacing={4}>
                {currentBikes.map((bike) => (
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
                                image={bike.image_url || 'https://source.unsplash.com/random/800x600/?motorcycle'}
                                alt={`${bike.brand} ${bike.model}`}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {bike.brand} {bike.model}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Year: {bike.year}
                                </Typography>
                                <Typography variant="h6" color="primary">
                                    ${bike.price.toLocaleString()}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {pageCount > 1 && (
                <Stack spacing={2} sx={{ mt: 4, mb: 4, alignItems: 'center' }}>
                    <Pagination
                        count={pageCount}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                    />
                </Stack>
            )}
        </Container>
    );
}

export default MotorbikeList; 