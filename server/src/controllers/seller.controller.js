import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateAccessAndRefreshToken } from "../utils/generateTokens.js";

const registerSeller = asyncHandler(async (req, res) => {
    const { name, email, password, shopName, shopLocation } = req.body;

    if(!(name && email && password && shopName && shopLocation)) {
        throw new ApiError(400, 'All fields are required')
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if(existingUser) {
        throw new ApiError(409, 'User with this email already exists!')
    }

    const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        role: 'SELLER',  
        shopName,
        shopLocation
    })

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)
    const options = { httpOnly: true, secure: true }

    return res
    .status(200)
    .cookie('refreshToken', refreshToken, options)
    .cookie('accessToken', accessToken, options)
    .json(new ApiResponse(200, {
        email: user.email,
        name: user.name,
        role: user.role,
        shopName: user.shopName,
        shopLocation: user.shopLocation
    }, 'Seller registered successfully'))
})

const sellerLogin = asyncHandler( async (req, res) => {
    const { email, password } = req.body;
    if(!(email && password)) {
        throw new ApiError(400, 'All fields are required')
    }

    const user = await User.findOne({
        email, 
        role: "SELLER"
    })
    if(!user) {
        throw new ApiError(401, 'User does not exist')
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid) {
        throw new ApiError(401, 'Email or password is incorrect')
    }

    const  {accessToken, refreshToken} = await generateAccessAndRefreshToken(user?._id);
    const loggedInUser = await User.findById(user?._id).select('-password -refreshToken');

    const options = {
        httpOnly: true, 
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            loggedInUser,
            'User logged in successfully'
        )
    )
} )

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

const sellerLogout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user?._id,
        { $unset: { refreshToken: 1 } },
        { new: true }
    )

    const options = { httpOnly: true, secure: true }

    return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new ApiResponse(200, {}, "Seller logged out successfully"))
})

export {
    registerSeller,
    sellerLogin,
    sellerAuth,
    sellerLogout
}