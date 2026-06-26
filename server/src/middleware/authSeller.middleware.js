import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const authSeller = asyncHandler(async (req, res, next) => {
    if(!req.user) {
        throw new ApiError(401, 'Not authenticated')
    }

    if(req.user.role !== 'SELLER') {
        throw new ApiError(403, 'Access denied. Sellers only.')
    }

    next();
})

export default authSeller;