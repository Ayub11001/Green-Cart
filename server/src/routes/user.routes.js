import { Router } from "express";
import authUser from "../middleware/authUser.middleware.js"
import {
    registerUser,
    loginUser,
    isAuth,
    logoutUser
} from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/auth', authUser, isAuth);
userRouter.get('/logout', authUser, logoutUser);
export { userRouter };