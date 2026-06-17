import  { React, useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext.jsx';
import { assets, dummyAddress } from '../assets/assets';
import toast from 'react-hot-toast';
import ProductCard from '../components/ProductCard.jsx';

const CartPage = () => {
    const [showAddress, setShowAddress] = useState(false)
    const [cartArray, setCartArray] = useState([])
    const [selectedAddress, setSelectedAddress] = useState(null)
    const [paymentOptioins, setPaymentOptions] = useState('COD')
    const [addresses , setAddresses] = useState([])
    const [recommendedProducts, setRecommendedProducts] = useState([])
    const [loadingRecommendations, setLoadingRecommendations] = useState(false)
  
    const {
        products,
        currency,
        cartItems,
        setCartItems,
        removeFromCart,
        getCartCount,
        updateCartItem,
        navigate,
        getCartAmount,
        axios,
        user,
        addToCart
    } = useAppContext();

    const placeOrder = async () => {
        try {
            if(!selectedAddress) {
                return toast.error("Add an address");
            }

            if(paymentOptioins === 'COD') {
                const {data} = await axios.post(
                    '/api/v1/order/cod',
                    {
                        userId: user._id,
                        items: cartArray.map(item => ({ product: item._id, quantity: item.quantity })),
                        address: selectedAddress._id
                    }, 
                    { authRequired: true }
                );
                if(data.success) {
                    toast.success(data.message);
                    setCartItems({});
                    navigate('/my-orders')
                } else {
                    toast.error(data.message);
                }
            } else {
                const {data} = await axios.post(
                    '/api/v1/order/stripe',
                    {
                        userId: user._id,
                        items: cartArray.map(item => ({ product: item._id, quantity: item.quantity })),
                        address: selectedAddress._id
                    }, 
                    { authRequired: true },
                    {
                        headers: {
                            origin: window.location.origin
                        }
                    }
                );

                if(data.success) {
                    window.location.replace(data.data.url)
                } else {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const getUserAddress = async () => {
        try {
            const {data} = await axios.get('/api/v1/address/get', { authRequired: true });
            if(data.success) {
                setAddresses(data.data);
                if(data.data.length > 0) {
                    setSelectedAddress(data.data[0]);
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const fetchRecommendations = async () => {
        try {
            if (!user || !cartArray || cartArray.length === 0) return;

            setLoadingRecommendations(true);
            const cartItemIds = cartArray.map(item => item._id);

            const { data } = await axios.post(
                `/api/v1/recommendations/get/${user._id}`,
                { cartItems: cartItemIds },
                { authRequired: true }
            );

            if (data.success) {
                setRecommendedProducts(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch recommendations:', error);
        } finally {
            setLoadingRecommendations(false);
        }
    }

    const getCart = () => {
        let tempArray = []

        for(const key in cartItems) {
            const product = products.find(
                item => item._id === key
            )
            product.quantity = cartItems[key]
            tempArray.push(product)
        }
        setCartArray(tempArray)
    }

    useEffect(
        () => {
            if(products.length > 0 && cartItems) {
                getCart();
            }
        },
        [products, cartItems]
    );

    useEffect(
        () => {
            if(user) {
                getUserAddress();
            }
        },
        [user]
    );

    useEffect(
        () => {
            if(user && cartArray.length > 0) {
                fetchRecommendations();
            }
        },
        [user, cartArray]
    );

    return products.length > 0 && cartItems ? (
        <>
        <div className="flex flex-col md:flex-row py-16">
            <div className='flex-1 max-w-4xl'>
                <h1 className="text-3xl font-medium mb-6">
                    Shopping Cart <span className="text-sm text-primary">{getCartCount()} Items</span>
                </h1>

                <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
                    <p className="text-left">Product Details</p>
                    <p className="text-center">Subtotal</p>
                    <p className="text-center">Action</p>
                </div>

                {cartArray.map((product, index) => (
                    <div key={index} className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3">
                        <div className="flex items-center md:gap-6 gap-3">
                            <div
                            onClick={() => {
                                navigate(`/products/${product.category.toLowerCase()}/${product._id}`)
                                scrollTo(0, 0)
                            }}
                            className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded overflow-hidden">
                                <img className="max-w-full h-full object-cover" src={product.image[0]} alt={product.name} />
                            </div>
                            <div>
                                <p className="hidden md:block font-semibold">{product.name}</p>
                                <div className="font-normal text-gray-500/70">
                                    <p>Weight: <span>{product.weight || "N/A"}</span></p>
                                    <div className='flex items-center'>
                                        <p>Qty:</p>
                                        <select
                                        onChange={
                                            (e) => {updateCartItem(product._id, Number(e.target.value))}
                                        }
                                        value={cartItems[product._id]}
                                        className='outline-none'>
                                            {Array(
                                                cartItems[product._id] > 9 ?
                                                cartItems[product._id] :
                                                9
                                            ).fill('')
                                            .map(
                                                (_, index) =>(
                                                    <option
                                                    key={index}
                                                    value={index + 1}
                                                    >
                                                        {index + 1}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-center">{currency}{product.offerPrice * product.quantity}</p>
                        <button
                        onClick={() => removeFromCart(product._id)}
                        className="cursor-pointer mx-auto">
                            <img
                            className='inline-block w-6 h-6'
                            src={assets.remove_icon} alt="" />
                        </button>
                    </div>)
                )}

                <button
                onClick={() => {
                        navigate('/products');
                        scrollTo(0, 0)
                }}
                className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium">
                    <img
                    className='group-hover:translate-x-1 transition'
                    src={assets.arrow_right_icon_colored} alt="" />
                    Continue Shopping
                </button>

            </div>

            {/* Order Summary Section */}

            <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
                <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
                <hr className="border-gray-300 my-5" />

                <div className="mb-6">
                    <p className="text-sm font-medium uppercase">Delivery Address</p>
                    <div className="relative flex justify-between items-start mt-2">
                        <p className="text-gray-500">
                            {
                                selectedAddress ? `
                                    ${selectedAddress.street},
                                    ${selectedAddress.city},
                                    ${selectedAddress.state},
                                    ${selectedAddress.zipCode},
                                    ${selectedAddress.country}
                                ` :
                                'No address selected'
                            }
                        </p>
                        <button onClick={() => setShowAddress(!showAddress)} className="text-primary hover:underline cursor-pointer">
                            Change
                        </button>
                        {showAddress && (
                            <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full">
                                {
                                    addresses.map(
                                        (address, index) => (
                                            <p onClick={() => {
                                                setSelectedAddress(address)
                                                setShowAddress(false)
                                            }} 
                                            key={index}
                                            className="text-gray-500 p-2 hover:bg-gray-100">
                                                { address.street}, {address.city}, {address.state}, {address.country}
                                            </p>
                                        )
                                    )
                                }
                                <p onClick={() => navigate('/add-address')} className="text-primary text-center cursor-pointer p-2 hover:bg-indigo-500/10">
                                    Add address
                                </p>
                            </div>
                        )}
                    </div>

                    <p className="text-sm font-medium uppercase mt-6">Payment Method</p>

                    <select 
                    onChange={
                        (e) => setPaymentOptions(e.target.value)
                    }
                    className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none">
                        <option value="COD">Cash On Delivery</option>
                        <option value="Online">Online Payment</option>
                    </select>
                </div>

                <hr className="border-gray-300" />

                <div className="text-gray-500 mt-4 space-y-2">
                    <p className="flex justify-between">
                        <span>Price</span><span>{currency}{getCartAmount()}</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Shipping Fee</span><span className="text-green-600">Free</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Tax (2%)</span><span>{currency}{getCartAmount() * (0.02) || 0}</span>
                    </p>
                    <p className="flex justify-between text-lg font-medium mt-3">
                        <span>Total Amount:</span><span>{currency}{(getCartAmount() * (0.02) + getCartAmount()) || 0}</span>
                    </p>
                </div>

                <button className="w-full py-3 mt-6 cursor-pointer bg-primary text-white font-medium hover:bg-primary-dull transition"
                onClick={
                    () => {
                        placeOrder();
                    }
                }>
                    {
                        paymentOptioins === 'COD' ? 'Place Order' : 'Proceed to Checkout'
                    }
                </button>
            </div>
        </div>

        {/* AI Recommendations Section - Full Width Below */}
        {recommendedProducts.length > 0 && (
            <div className="mt-12 px-4">
                <h2 className="text-2xl font-medium mb-4 flex items-center gap-2">
                    <span>Recommended for You</span>
                    <span className="text-sm text-gray-500 font-normal">Powered by AI</span>
                </h2>
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {recommendedProducts.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            </div>
        )}

        {loadingRecommendations && (
            <div className="mt-12 text-center">
                <p className="text-gray-500">Loading recommendations...</p>
            </div>
        )}
        </>
    ) : null
}
      


export default CartPage