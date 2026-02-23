import { Router } from "express";
import {
    sellerLogin,
    sellerAuth,
    sellerLogout
} from "../controllers/seller.controller.js";


const sellerRouter = Router()

sellerRouter.post('/login', sellerLogin)

import authSeller from "../middleware/authSeller.middleware.js"

sellerRouter.get('/auth', authSeller, sellerAuth)
sellerRouter.get('/logout', authSeller, sellerLogout)

export {sellerRouter}