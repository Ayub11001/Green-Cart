import { Router } from "express";

import {
    registerUser,
    loginUser,
    isAuth,
    logoutUser, 
    refreshAccessToken
} from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

// authorized routes
import authUser from "../middleware/authUser.middleware.js";

userRouter.get('/auth', authUser, isAuth);
userRouter.get('/logout', authUser, logoutUser);
userRouter.get('/refresh-token', authUser, refreshAccessToken)

export { userRouter };