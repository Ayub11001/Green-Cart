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

export {
    registerUser
};