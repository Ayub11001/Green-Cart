import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js";

const sellerLogin = asyncHandler( async (req, res) => {
    const {email, password} = req.body;
    if(email !== process.env.SELLER_EMAIL || password !== process.env.SELLER_PASSWORD) {
        throw new ApiError(
            400,
            "Incorrect Credentials"
        )
    }

    const sellerToken = jwt.sign(
        {
            email
        },
        process.env.SELLER_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
        }
    )

    const options = {
        httpOnly: true, 
        secure: true
    }

    return res
    .status(200)
    .cookie("sellerToken", sellerToken, options)
    .json(
        new ApiResponse(
            200,
            {sellerToken},
            'Seller Logged in successfullly'
        )
    )

})

const sellerAuth = asyncHandler( async (req, res) => {
    try {
        return res
        .status(200)
        .json(
            new ApiResponse(
                200, 
                {},
                "Seller is Authorized"
            )
        )
    } catch (error) {
        throw new ApiError(
            400,
            error.message || "Seller error"
        )
    }
} )

const sellerLogout = asyncHandler( async (req, res) => {
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .clearCookie('sellerToken', options)
    .json(
        new ApiResponse(
            200,
            {},
            "Seller logged out successfully"
        )
    )
})

export {
    sellerLogin,
    sellerAuth,
    sellerLogout
}