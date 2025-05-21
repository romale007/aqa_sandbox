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
    Chip,
    OutlinedInput,
    Divider,
    IconButton,
} from '@mui/material';
import { Link } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

// Get API URL from environment variable or use default
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// Price range options
const PRICE_RANGES = [
    { value: 'all', label: 'All Prices' },
    { value: '0-5000', label: 'Under $5,000' },
    { value: '5000-10000', label: '$5,000 - $10,000' },
    { value: '10000-15000', label: '$10,000 - $15,000' },
    { value: '15000-20000', label: '$15,000 - $20,000' },
    { value: '20000-30000', label: '$20,000 - $30,000' },
    { value: '30000-', label: 'Over $30,000' },
];

function MotorbikeList() {
    const navigate = useNavigate();
    const [motorbikes, setMotorbikes] = useState([]);
    const [filteredBikes, setFilteredBikes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBrands, setSelectedBrands] = useState([]);
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
        if (selectedBrands.length > 0) {
            filtered = filtered.filter((bike) => selectedBrands.includes(bike.brand));
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
    }, [motorbikes, searchTerm, selectedBrands, priceRange]);

    // Calculate pagination
    const indexOfLastBike = page * bikesPerPage;
    const indexOfFirstBike = indexOfLastBike - bikesPerPage;
    const currentBikes = filteredBikes.slice(indexOfFirstBike, indexOfLastBike);
    const pageCount = Math.ceil(filteredBikes.length / bikesPerPage);

    const handlePageChange = (event, value) => {
        setPage(value);
        window.scrollTo(0, 0); // Scroll to top when page changes
    };

    const handleBrandChange = (event) => {
        const {
            target: { value },
        } = event;
        setSelectedBrands(
            typeof value === 'string' ? value.split(',') : value,
        );
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
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }} data-testid="motorbike-list-page">
            <Typography variant="h4" component="h1" gutterBottom>
                Motorbikes
            </Typography>

            <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }} data-testid="filters-section">
                <TextField
                    label="Search"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ minWidth: 200 }}
                    data-testid="search-input"
                />
                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel id="brand-filter-label">Brand</InputLabel>
                    <Select
                        labelId="brand-filter-label"
                        multiple
                        value={selectedBrands}
                        onChange={handleBrandChange}
                        input={<OutlinedInput label="Brand" />}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} data-testid={`selected-brand-${value}`} />
                                ))}
                                {selected.length > 0 && (
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setSelectedBrands([]);
                                        }}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        sx={{
                                            p: 0.5,
                                            ml: 0.5,
                                            '&:hover': { backgroundColor: 'transparent' }
                                        }}
                                        data-testid="clear-brands-button"
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                )}
                            </Box>
                        )}
                        data-testid="brand-select"
                    >
                        {brands.map((brand) => (
                            <MenuItem key={brand} value={brand} data-testid={`brand-option-${brand}`}>
                                {brand}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel id="price-range-label">Price Range</InputLabel>
                    <Select
                        labelId="price-range-label"
                        value={priceRange}
                        label="Price Range"
                        onChange={(e) => setPriceRange(e.target.value)}
                        data-testid="price-range-select"
                    >
                        {PRICE_RANGES.map((range) => (
                            <MenuItem key={range.value} value={range.value} data-testid={`price-option-${range.value}`}>
                                {range.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Typography variant="body1" sx={{ mb: 2 }} data-testid="results-count">
                Showing {currentBikes.length} of {filteredBikes.length} motorbikes
            </Typography>

            <Grid container spacing={4} data-testid="motorbike-grid">
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
                            data-testid={`motorbike-card-${bike.id}`}
                        >
                            <CardMedia
                                component="img"
                                height="200"
                                image={bike.image_url || 'https://via.placeholder.com/300x200?text=No+Image'}
                                alt={`${bike.brand} ${bike.model}`}
                                data-testid={`motorbike-image-${bike.id}`}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h5" component="h3" data-testid={`motorbike-title-${bike.id}`}>
                                    {bike.brand} {bike.model}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph data-testid={`motorbike-year-${bike.id}`}>
                                    Year: {bike.year}
                                </Typography>
                                <Typography variant="h6" color="primary" data-testid={`motorbike-price-${bike.id}`}>
                                    ${bike.price.toLocaleString()}
                                </Typography>
                                <Button
                                    component={Link}
                                    to={`/motorbikes/${bike.id}`}
                                    variant="outlined"
                                    color="primary"
                                    sx={{ mt: 2 }}
                                    data-testid={`view-details-button-${bike.id}`}
                                >
                                    View Details
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {pageCount > 1 && (
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }} data-testid="pagination">
                    <Pagination
                        count={pageCount}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        data-testid="pagination-controls"
                    />
                </Box>
            )}
        </Container>
    );
}

export default MotorbikeList; 