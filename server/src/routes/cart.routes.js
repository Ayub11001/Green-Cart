import { Router } from 'express';
import { updateCart } from '../controllers/cart.controller.js';
import authUser from '../middleware/authUser.middleware.js'
const cartRouter = Router();

cartRouter.route('/update').post(authUser, updateCart);

export { cartRouter }