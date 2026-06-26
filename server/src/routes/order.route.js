import {Router} from 'express';
import authUser from '../middleware/authUser.middleware.js';
import authSeller from '../middleware/authSeller.middleware.js';
import { 
    getOrders, 
    placeOrderCOD, 
    placeOrderStripe, 
    getAllOrders 
} from '../controllers/order.controller.js';

const orderRouter = Router();

orderRouter.route('/cod').post(authUser, placeOrderCOD);
orderRouter.route('/stripe').post(authUser, placeOrderStripe);
orderRouter.route('/user').get(authUser, getOrders);
orderRouter.route('/seller').get(authUser, authSeller, getAllOrders);

export {orderRouter}