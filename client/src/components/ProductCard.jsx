import {useState} from "react";
import { assets } from "../assets/assets.js";
import { useAppContext } from "../context/AppContext.jsx";

const ProductCard = ({product}) => {
    const [count, setCount] = useState(0);
    const {
        currency,
        addToCart,
        removeFromCart,
        cartItems,
        navigate 
    } = useAppContext();

    return product && (
        <div className="border border-gray-500/20 rounded-lg md:px-4 px-3 py-2 bg-white min-w-56 max-w-56 w-full">
            <div className="group cursor-pointer flex items-center justify-center px-2">
                <img className="group-hover:scale-105 transition max-w-26 md:max-w-36" src={product.image[0]} alt={product.name} />
            </div>
            <div className="text-gray-500/60 text-sm">
                <p>{product.category}</p>
                <p className="text-gray-700 font-medium text-lg truncate w-full">{product.name}</p>
                <div className="flex items-center gap-0.5">
                    {Array(5).fill('').map((_, i) => (
                            <img src={
                                i<4 ? assets.star_icon : assets.star_dull_icon
                            }
                            className="md:w-3.5 w-3"
                            key={i}
                            />
                    ))}
                    <p>4</p>
                </div>
                <div className="flex items-end justify-between mt-3">
                    <p className="md:text-xl text-base font-medium text-primary">
                        {currency}{product.offerPrice} <span className="text-gray-500/60 md:text-sm text-xs line-through">{currency}{product.price}</span>
                    </p>
                    <div className="text-primary" onClick={(e) => {
                        e.stopPropagation();
                    }}>
                        {!cartItems[product._id] ? (
                            <button className="flex items-center justify-center gap-1 bg-primary/15 border border-primary/60 hover:bg-primary/20 md:w-20 w-16 h-[34px] rounded text-primary font-medium cursor-pointer" onClick={() => addToCart(product._id) } >
                                <img src={assets.cart_icon} alt="" />
                                Add
                            </button>
                        ) : (
                            <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-primary/25 rounded select-none">
                                <button onClick={() =>  removeFromCart(product._id) } className="cursor-pointer text-md px-2 h-full" >
                                    -
                                </button>
                                <span className="w-5 text-center">{cartItems[product._id]}</span>
                                <button onClick={() => addToCart(product._id) } className="cursor-pointer text-md px-2 h-full" >
                                    +
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;