import { Router } from "express";
import {
    registerSeller,
    sellerLogin,
    sellerAuth,
    sellerLogout
} from "../controllers/seller.controller.js";


const sellerRouter = Router()

sellerRouter.post('/register', registerSeller) 
sellerRouter.post('/login', sellerLogin)

import authSeller from "../middleware/authSeller.middleware.js"
import authUser from "../middleware/authUser.middleware.js";

sellerRouter.get('/auth',authUser ,authSeller, sellerAuth)
sellerRouter.get('/logout',authUser, authSeller, sellerLogout)

export {sellerRouter}