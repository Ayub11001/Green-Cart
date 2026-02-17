import { Router } from "express";
import { addAddress, getAddress } from "../controllers/address.controller.js";
import authUser from '../middleware/authUser.middleware.js'
const addressRouter = Router();

addressRouter.route('/add').post(authUser, addAddress);
addressRouter.route('/get').get(authUser, getAddress);

export {addressRouter}