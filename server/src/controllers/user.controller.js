import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async function(userId) {
   try {
     const user = await User.findById(userId)

     const accessToken = user.generateAccessToken();
     const refreshToken = user.generateRefreshToken();

     user.refreshToken = refreshToken;

     await user.save({validateBeforeSave: false});
     
     return {
        accessToken,
        refreshToken
     }
   } catch (error) {
    throw new ApiError(500, 'Could not generate tokens')
   }
}

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password} = req.body;
    if(!(name && email && password)) {
        throw new ApiError(400, 'All fields are required')
    }

    const existingUser = await User.findOne({
        email: email.toLowerCase()
    })
    if(existingUser) {
        throw new ApiError(
            409,
            'User with this email already exists!'
        )
    }

    const user = await User.create(
        {
            name,
            email: email.toLowerCase(),
            password
        }
    )
    if(!user) {
        throw new ApiError(500, 'Could not create user')
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .cookie('refreshToken', refreshToken, options)
    .cookie('accessToken', accessToken, options)
    .json(
        new ApiResponse(
            200,
            {
                email: user.email,
                name: user.name,
            },
            'User registered and logged in successfully'
        )
    )
})

const loginUser = asyncHandler( async (req, res) => {
    const { email, password } = req.body;
    if(!(email && password)) {
        throw new ApiError(400, 'All fields are required')
    }

    const user = await User.findOne({email})
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

const isAuth = asyncHandler( async (req, res) => {
    const user = req.user;
    if(!user) {
        throw new ApiError(400, "User is logged out")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            user,
            "User returned successfully"
        )
    )
} )

const logoutUser = asyncHandler( async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
        $unset: {refreshToken: 1},    
        },
        {
            new: true
        }
    );
    if(!user) {
        throw new ApiError(400, 'User not found')
    }

    const options = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(
        new ApiResponse(
            200,
            {},
            "User logged out successfully"
        )
    )
} )

export {
    registerUser,
    loginUser,
    isAuth,
    logoutUser,
};