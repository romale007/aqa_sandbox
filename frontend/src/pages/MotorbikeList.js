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
    Button,
    CircularProgress,
} from '@mui/material';
import { Link } from 'react-router-dom';

// Get API URL from environment variable or use default
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

function MotorbikeList() {
    const navigate = useNavigate();
    const [motorbikes, setMotorbikes] = useState([]);
    const [filteredBikes, setFilteredBikes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [brandFilter, setBrandFilter] = useState('all');
    const [priceRange, setPriceRange] = useState('all');
    const [page, setPage] = useState(1);
    const bikesPerPage = 9; // Show 9 bikes per page (3x3 grid)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        const fetchMotorbikes = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/api/motorbikes`);
                const data = await response.json();

                // Extract unique brands
                const uniqueBrands = [...new Set(data.map(bike => bike.brand))].sort();
                setBrands(uniqueBrands);

                // Update image URLs to use the backend server
                const bikesWithCorrectUrls = data.map(bike => ({
                    ...bike,
                    image_url: bike.image_url ? `${API_URL}${bike.image_url}` : null
                }));

                setMotorbikes(bikesWithCorrectUrls);
                setFilteredBikes(bikesWithCorrectUrls);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching motorbikes:', err);
                setError('Failed to load motorbikes. Please try again later.');
                setLoading(false);
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

    // Calculate pagination
    const indexOfLastBike = page * bikesPerPage;
    const indexOfFirstBike = indexOfLastBike - bikesPerPage;
    const currentBikes = filteredBikes.slice(indexOfFirstBike, indexOfLastBike);
    const pageCount = Math.ceil(filteredBikes.length / bikesPerPage);

    const handlePageChange = (event, value) => {
        setPage(value);
        window.scrollTo(0, 0); // Scroll to top when page changes
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
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Motorbikes
            </Typography>

            <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                    label="Search"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ minWidth: 200 }}
                />
                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel id="brand-filter-label">Brand</InputLabel>
                    <Select
                        labelId="brand-filter-label"
                        value={brandFilter}
                        label="Brand"
                        onChange={(e) => setBrandFilter(e.target.value)}
                    >
                        <MenuItem value="all">All Brands</MenuItem>
                        {brands.map((brand) => (
                            <MenuItem key={brand} value={brand}>{brand}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Typography variant="body1" sx={{ mb: 2 }}>
                Showing {currentBikes.length} of {filteredBikes.length} motorbikes
            </Typography>

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
                                image={bike.image_url || 'https://via.placeholder.com/300x200?text=No+Image'}
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

            {pageCount > 1 && (
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                    <Pagination
                        count={pageCount}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            )}
        </Container>
    );
}

export default MotorbikeList; 