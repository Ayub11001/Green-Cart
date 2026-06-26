import { Router } from "express";
import {
    addProduct,
    getProductList,
    getProductById,
    changeStock,
    getSellerProducts
} from '../controllers/product.controller.js';
import {upload} from '../middleware/multer.middleware.js';
import authSeller from "../middleware/authSeller.middleware.js";
import authUser from "../middleware/authUser.middleware.js";

const productRouter = Router();

productRouter.post('/add',  authUser, authSeller, upload.array('images'), addProduct);
productRouter.get('/list', getProductList);
productRouter.post('/stock', authUser, authSeller, changeStock);
productRouter.get('/seller', authUser, authSeller, getSellerProducts);
productRouter.get('/:id', getProductById);

export  {productRouter}