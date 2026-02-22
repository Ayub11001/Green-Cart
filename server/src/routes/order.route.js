import {Router} from 'express';
import authUser from '../middleware/authUser.middleware.js';
import authSeller from '../middleware/authSeller.middleware.js';
import { 
    getOrders, 
    placeOrderCOD, 
    getAllOrders 
} from '../controllers/order.controller.js';

const orderRouter = Router();

orderRouter.route('/cod').post(authUser, placeOrderCOD);
orderRouter.route('/user').get(authUser, getOrders);
orderRouter.route('/seller').get(authSeller, getAllOrders);

export {orderRouter}