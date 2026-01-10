import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import jwt from "jsonwebtoken";

const authSeller = asyncHandler( async (req, res, next) => {
    const sellerToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "");
    if(!sellerToken) {
        throw new ApiError(400, 'Seller Not Authorized')
    }

    const decodedSellerToken = jwt.verify(sellerToken, process.env.ACCESS_TOKEN_SECRET)
    if(decodedSellerToken?.email !== process.env.SELLER_EMAIL) {
        throw new ApiError(
            401,
            'Unauthorized access'
        )
    }
    next();
} )

export default authSeller;