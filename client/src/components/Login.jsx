import React from 'react';
import { useAppContext } from '../context/AppContext.jsx';
import toast from 'react-hot-toast';

const Login = () => {
    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [isSeller, setIsSeller] = React.useState(false);
    const [shopName, setShopName] = React.useState("");
    const [shopLocation, setShopLocation] = React.useState("");
    const {
        setShowUserLogin,
        setUser,
        setIsSeller: setSellerStatus,
        axios,
        navigate,
    } = useAppContext();

    const onSubmitHandler = async (event) => {
        try {
            event.preventDefault()
            const endpoint =
            state === "login"
                ? isSeller
                    ? "/api/v1/seller/login"
                    : "/api/v1/user/login"
                : isSeller
                    ? "/api/v1/seller/register"
                    : "/api/v1/user/register";

            const payload =
                state === "register"
                    ? isSeller
                        ? {
                            name,
                            email,
                            password,
                            shopName,
                            shopLocation,
                        }
                        : {
                            name,
                            email,
                            password,
                        }
                    : {
                        email,
                        password,
                    };
            const { data } = await axios.post(endpoint, payload);

            if (data.success) {
                setUser(data.data);
                setSellerStatus(data.data.role === "SELLER");

                navigate(data.data.role === "SELLER" ? "/seller" : "/");

                setShowUserLogin(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
        
    }

    return (
        <div 
        onClick={()=> setShowUserLogin(false)}
        className='fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50'>
            <form onSubmit={onSubmitHandler} onClick={(e) => e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white">
                <>
                    <p className="text-2xl font-medium m-auto">
                        <span className="text-primary">
                            {isSeller ? "Seller" : "User"}
                        </span>{" "}
                        {state === "login" ? "Login" : "Sign Up"}
                    </p>

                    <div className="flex w-full gap-2">
                        <button
                            type="button"
                            onClick={() => setIsSeller(false)}
                            className={`flex-1 py-2 rounded-md border transition-all ${
                                !isSeller
                                    ? "bg-primary text-white border-primary"
                                    : "border-gray-300"
                            }`}
                        >
                            Customer
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsSeller(true)}
                            className={`flex-1 py-2 rounded-md border transition-all ${
                                isSeller
                                    ? "bg-primary text-white border-primary"
                                    : "border-gray-300"
                            }`}
                        >
                            Seller
                        </button>
                    </div>
                </>
                {state === "register" && (
                    <div className="w-full">
                        <p>Name</p>
                        <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
                    </div>
                )}
                <div className="w-full ">
                    <p>Email</p>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="email" required />
                </div>
                <div className="w-full ">
                    <p>Password</p>
                    <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="password" required />
                </div>


                {state === "register" && isSeller && (
                    <>
                        <div className="w-full">
                            <p>Shop Name</p>
                            <input
                                value={shopName}
                                onChange={(e) => setShopName(e.target.value)}
                                placeholder="Enter shop name"
                                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                                type="text"
                                required
                            />
                        </div>

                        <div className="w-full">
                            <p>Shop Location</p>
                            <input
                                value={shopLocation}
                                onChange={(e) => setShopLocation(e.target.value)}
                                placeholder="Enter shop location"
                                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                                type="text"
                                required
                            />
                        </div>
                    </>
                )}


                {state === "register" ? (
                    <p>
                        Already have account? <span onClick={() => setState("login")} className="text-primary cursor-pointer">click here</span>
                    </p>
                ) : (
                    <p>
                        Create an account? <span onClick={() => setState("register")} className="text-primary cursor-pointer">click here</span>
                    </p>
                )}
                <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
                    {state === "register" ? "Create Account" : "Login"}
                </button>
            </form>
        </div>
    );
};

export default Login;