import { Address } from "../models/address.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addAddress = asyncHandler( async (req, res) => {
    const user = req.user;
    const { address } = req.body;
    if(address.length === 0) {
        throw new ApiError(
            400,
            'address is required'
        )
    }

    const savedAddress = Address.create(
        {
            ...address,
            user: user?._id
        }
    )
    if(!savedAddress) {
        throw new ApiError(
            500,
            "Address was not saved"
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            savedAddress,
            "Address successfullly saved"
        )
    )

})


const getAddress = asyncHandler( async (req, res) => {
    const user = req.user;
    const userAddress = await Address.aggregate(
        [
            {
                $match: {
                    user: user?._id
                }
            }
        ]
    );
    if(!userAddress) {
        throw new ApiError(
            500,
            'Unable to find user address'
        )
    }

    return res
    .status(200).
    json(
        new ApiResponse(
            200,
            userAddress,
            'User address fetched successfully'
        )
    )

} )
export {
    addAddress,
    getAddress
}