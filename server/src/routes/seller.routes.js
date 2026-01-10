import { Router } from "express";
import {
    sellerLogin,
    sellerAuth,
    sellerLogout
} from "../controllers/seller.controller.js";


const sellerRouter = Router()

sellerRouter.post('/seller-login', sellerLogin)

import authSeller from "../middleware/authSeller.middleware.js"

sellerRouter.get('/seller-auth', authSeller, sellerAuth)
sellerRouter.get('/seller-logout', authSeller, sellerLogout)

export {sellerRouter}