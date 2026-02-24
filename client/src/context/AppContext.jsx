import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from '../config/axios.config.js'



const AppContext = createContext();


const AppContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isSeller, setIsSeller] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [searchQuery, setSearchQuery] = useState({});

    const currency = import.meta.env.VITE_CURRENCY || '₹';

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('/api/v1/product/list');
            if(data.success) {
                setProducts(data.data)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const addToCart = (itemId) => {
        let cartData = structuredClone(cartItems);
        if(cartData[itemId]) {
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
        toast.success('Added to Cart');
    }

    const updateCartItem = (itemId, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId] = quantity;
        setCartItems(cartData);
        toast.success('Cart Updated');
    }

    const removeFromCart = (itemId) => {
        let cartData = structuredClone(cartItems);
        if(cartData[itemId]) {
            cartData[itemId] -= 1;
            if(cartData[itemId] === 0) {
                delete cartData[itemId];
            }
        }
        setCartItems(cartData);
        toast.success('Removed from Cart');
    }

    const getCartCount = () => {
        let totalCartCount = 0;
        for(const item in cartItems) {
            totalCartCount += cartItems[item];
        }
        return totalCartCount;
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for(const item in cartItems) {
            const itemInfo = products.find(
                product => product._id === item
            )
            totalAmount += itemInfo.offerPrice * cartItems[item];
        }
        return totalAmount;
    }

    const fetchSellerStatus = async () => {
        try {
            const { data } = await axios.get('/api/v1/seller/auth');
            if(data.success) {
                setIsSeller(true);
            } else {
                setIsSeller(false);
                toast.error(data.message)
            }
        } catch (error) {
            setIsSeller(false);
        }
    }

    const fetchUserStatus = async () => {
        try {
            const { data } = await axios.get('/api/v1/user/auth', { authRequired: true });
            if(data.success) {
                setUser(data.data);
                setCartItems(data.data.cartItems);
            } else {
                setUser(false);
            }
        } catch (error) {
            setUser(false);
        }
    }

    useEffect(
        () => {
            fetchProducts();
            fetchSellerStatus();
            fetchUserStatus();
        },
        []
    );

    useEffect(
        () => {
            let isRefreshing = false;
            let refreshPromise = null;

            const interceptor = axios.interceptors.response.use(
                (response) => response,
                async (error) => {
                    console.log('interceptor triggerred!!');
                    console.log(`Error: ${error}\nError message: ${error.message}`)
                    const originalRequest = error.config;

                    if(error.response?.status === 400 && !originalRequest._retry && originalRequest.authRequired) {
                        originalRequest._retry = true;
                        try {
                            if(!isRefreshing) {
                                isRefreshing = true;
                                refreshPromise = axios.get('/api/v1/user/refresh-token')
                                .finally(
                                    () => {
                                        isRefreshing = false;
                                    }
                                );
                            }    
                                await refreshPromise;
                                return axios(originalRequest);
                        } catch {
                            setUser(null);
                        }
                    }
                    return Promise.reject(error);
                }
            );
            return () => axios.interceptors.response.eject(interceptor);
        },
        []
    );

    useEffect(
        () => {
            const updateCart = async () => {
                try {
                    const { data } = await axios.post(
                        '/api/v1/cart/update',
                        { cartItems }, 
                        { authRequired: true }
                    );
                    if(!data.success) {  
                        toast.error(data.message);
                    } 
                } catch (error) {
                    toast.error(error.message);
                }
            }
            if(user) {
                updateCart();
            }
        },
        [cartItems]
    );

    const value = {
        user,
        setUser,
        isSeller,
        setIsSeller,
        navigate,
        showUserLogin,
        setShowUserLogin,
        products,
        currency,
        addToCart,
        removeFromCart,
        updateCartItem,
        cartItems,
        searchQuery,
        setSearchQuery,
        getCartCount,
        getCartAmount,
        axios,
        fetchProducts,
        setCartItems
    };

    return <AppContext.Provider value = {value}>
        {children}
        </AppContext.Provider>;
}

const useAppContext = () => {
    return useContext(AppContext);
}


export  {
    AppContext,
    AppContextProvider,
    useAppContext,
};