import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";

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
        setProducts(dummyProducts)
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

    useEffect(
        () => {
            fetchProducts();
        },
        []
    )

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