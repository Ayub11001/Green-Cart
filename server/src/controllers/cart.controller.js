import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js";
import {ApiError} from '../utils/ApiError.js';
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.models.js";

const updateCart = asyncHandler( async (req, res) => {
    const { cartItems } = req.body;
    const user = req.user;
    if(!(cartItems)) {
        throw new ApiError(
            400,
            'cart items are required'
        )
    }
    
    const cartItemIds = Object.keys(cartItems);
    const availableItems = await Product.find(
        {
            _id: {
                $in: cartItemIds
            },
            inStock: true
        }
    ).select("_id");

    const availableItemsSet = new Set(
        availableItems.map(
            (product) => product._id.toString()
        )
    )

    const finalCart = Object.fromEntries(
        Object.entries(cartItems).filter(
            ([itemId, _]) => availableItemsSet.has(itemId)
        )
    )

    const newUser = await User.findByIdAndUpdate(
        user?._id,
        {
            cartItems: finalCart
        },
        {
            new: true
        }
    ).select("-password -refreshToken");

    if(!newUser) {
        throw new ApiError(
            500,
            "User cart items were not updated"
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            newUser,
            "User cart updated successfully"
        )
    )
    
} ) 



export {
    updateCart
}