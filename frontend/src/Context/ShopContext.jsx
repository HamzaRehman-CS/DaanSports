import React, { createContext, useEffect, useState, useCallback } from "react";
import { API_URL } from '../config';

export const ShopContext = createContext(null);

const getDefaultCart = () => {
    let cart = {};
    for (let index = 0; index < 300+1; index++) {
        cart[index] = 0;
    }
    return cart;
};

const ShopContextProvider = (props) => {
    const [cartItems, setCartItems] = useState(getDefaultCart());
    const [all_product, setAll_Product] = useState([]);

    const fetchProducts = useCallback(() => {
        fetch(`${API_URL}/all-products`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setAll_Product(data);
                }
            })
            .catch(err => {
                console.warn("Product sync notice:", err.message);
            });
    }, []);

    useEffect(() => {
        // Initial fetch
        fetchProducts();

        // 1. Live auto-refresh polling every 3 seconds for 100% instant sync with Admin Portal
        const pollInterval = setInterval(() => {
            fetchProducts();
        }, 3000);

        // 2. Instant refetch whenever user switches back to this browser tab
        const handleFocus = () => {
            fetchProducts();
        };
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                fetchProducts();
            }
        };

        window.addEventListener('focus', handleFocus);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        if (localStorage.getItem('auth-token')) {
            fetch(`${API_URL}/getcart`, {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data', 
                    'auth-token': `${localStorage.getItem('auth-token')}`, 
                    'Content-Type': 'application/json'
                },
                body: ""
            })
            .then(res => res.json())
            .then(data => {
                if (data && typeof data === 'object') {
                    setCartItems(data);
                }
            })
            .catch(() => {});
        }

        return () => {
            clearInterval(pollInterval);
            window.removeEventListener('focus', handleFocus);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [fetchProducts]);

    const addToCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
        if (localStorage.getItem('auth-token')) {
            fetch(`${API_URL}/addtocart`, {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data', 
                    'auth-token': `${localStorage.getItem('auth-token')}`, 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "itemId": itemId })
            })
            .then(res => res.json())
            .catch(() => {});
        }
    };

    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: Math.max(0, (prev[itemId] || 0) - 1) }));
        if (localStorage.getItem('auth-token')) {
            fetch(`${API_URL}/removefromcart`, {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data', 
                    'auth-token': `${localStorage.getItem('auth-token')}`, 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "itemId": itemId })
            })
            .then(res => res.json())
            .catch(() => {});
        }
    };

    const getTotalCartValue = () => {
        let total_amount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                const itemInfo = (all_product || []).find((product) => product && product.id === Number(item));
                if (itemInfo && itemInfo.new_price !== undefined) {
                    total_amount += (Number(itemInfo.new_price) * cartItems[item]);
                }
            }
        }
        return total_amount;
    };

    const getTotalCartItems = () => {
        let total_items = 0;
        for (const item in cartItems) {
            const current_item_quantity = cartItems[item];
            if (current_item_quantity > 0) {
                total_items += current_item_quantity;
            }
        }
        return total_items;
    };

    const contextValue = {
        all_product: Array.isArray(all_product) ? all_product : [],
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartValue,
        getTotalCartItems,
        refreshProducts: fetchProducts
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;