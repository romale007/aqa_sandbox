import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [cartCount, setCartCount] = useState(0);

    // Load cart from localStorage on initial render
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            setCartItems(parsedCart);
            setCartCount(parsedCart.reduce((total, item) => total + item.quantity, 0));
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
        setCartCount(cartItems.reduce((total, item) => total + item.quantity, 0));
    }, [cartItems]);

    const addToCart = (motorbike) => {
        setCartItems(prevItems => {
            // Check if the motorbike is already in the cart
            const existingItemIndex = prevItems.findIndex(item => item.id === motorbike.id);

            if (existingItemIndex >= 0) {
                // If it exists, update the quantity
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex].quantity += 1;
                return updatedItems;
            } else {
                // If it doesn't exist, add it to the cart
                return [...prevItems, {
                    id: motorbike.id,
                    brand: motorbike.brand,
                    model: motorbike.model,
                    price: motorbike.price,
                    image_url: motorbike.image_url,
                    quantity: 1
                }];
            }
        });
    };

    const removeFromCart = (id) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const updateQuantity = (id, change) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + change) }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const calculateTotal = () => {
        return cartItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            cartCount,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            calculateTotal
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
} 