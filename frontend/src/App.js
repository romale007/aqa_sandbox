import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box } from '@mui/material';

// Components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MotorbikeList from './pages/MotorbikeList';
import MotorbikeDetail from './pages/MotorbikeDetail';
import Cart from './pages/Cart';
import OrderHistory from './pages/OrderHistory';
import { CartProvider } from './context/CartContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/motorbikes" element={<MotorbikeList />} />
                <Route path="/motorbikes/:id" element={<MotorbikeDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/orders" element={<OrderHistory />} />
              </Routes>
            </Container>
          </Box>
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
