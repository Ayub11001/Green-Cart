import { Router } from "express";
import {
    addProduct,
    getProductList,
    getProductById,
    changeStock,
} from '../controllers/product.controller.js';
import {upload} from '../middleware/multer.middleware.js';
import authSeller from "../middleware/authSeller.middleware.js";

const productRouter = Router();

productRouter.post('/add', upload.array('images'), authSeller, addProduct);
productRouter.get('/list', getProductList);
productRouter.get('/:id', getProductById)
productRouter.post('/stock', authSeller, changeStock)

export  {productRouter}