import { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

const AppContext = createContext();


const AppContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isSeller, setIsSeller] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const value = {
        user,
        setUser,
        isSeller,
        setIsSeller,
        navigate,
        showUserLogin,
        setShowUserLogin,
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