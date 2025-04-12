import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Badge,
    Box,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HistoryIcon from '@mui/icons-material/History';
import { useCart } from '../context/CartContext';

function Navbar() {
    const { cartCount } = useCart();

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography
                    variant="h6"
                    component={RouterLink}
                    to="/"
                    sx={{
                        flexGrow: 1,
                        textDecoration: 'none',
                        color: 'inherit',
                    }}
                >
                    Motorbike Store
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                        color="inherit"
                        component={RouterLink}
                        to="/motorbikes"
                    >
                        Motorbikes
                    </Button>
                    <Button
                        color="inherit"
                        component={RouterLink}
                        to="/orders"
                        startIcon={<HistoryIcon />}
                    >
                        Orders
                    </Button>
                    <IconButton
                        color="inherit"
                        component={RouterLink}
                        to="/cart"
                    >
                        <Badge badgeContent={cartCount} color="secondary">
                            <ShoppingCartIcon />
                        </Badge>
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar; 