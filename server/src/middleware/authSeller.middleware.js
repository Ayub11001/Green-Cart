import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

const authSeller = asyncHandler( async (req, res, next) => {
    const sellerToken = req.cookies?.sellerToken || req.header("Authorization")?.replace("Bearer", "");
    if(!sellerToken) {
        throw new ApiError(400, 'Seller Not Authorized')
    }

    const decodedSellerToken = jwt.verify(sellerToken, process.env.SELLER_TOKEN_SECRET)
    if(decodedSellerToken?.email !== process.env.SELLER_EMAIL) {
        throw new ApiError(
            401,
            'Unauthorized access'
        )
    }
    next();
} )

export default authSeller;