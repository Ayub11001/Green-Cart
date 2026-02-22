import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import {Product} from '../models/product.models.js'
import { Order } from '../models/order.model.js';

const placeOrderCOD = asyncHandler( async(req, res) => {
    const userId = req.user?._id;
    const { items, address } = req.body;
    if(!address || items.length === 0) {
        throw new ApiError(
            400,
            'Invalid data'
        )
    }

    let amount = await items.reduce(
        async(accumilator, item) => {
            const product = await Product.findById(item.product);
            return ( await accumilator ) + product.offerPrice * item.quantity;
        },
        0
    );

    amount += Math.floor(amount*0.02);

    await Order.create(
        {
            userId,
            items,
            amount,
            address, 
            paymentType: 'COD'
        }
    );

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Order Placed Successfully"
        )
    )
} );

const getOrders = asyncHandler( async(req, res) => {
    const userId = req.user?._id;
    const orders = await Order.find(
        {
            userId,
            $or: [
                { paymentType: "COD" },
                { isPaid: true }
            ]
        }
    ).populate('items.product address')
    .sort({createdAt: -1});

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            orders,
            "Orders Fetched Successfully"
        )
    )

} );

const getAllOrders = asyncHandler( async(req, res) => {
    const orders = await Order.find(
        {
            $or: [
                { paymentType: "COD" },
                { isPaid: true }
            ]
        }
    ).populate('items.product address')
    .sort({createdAt: -1});

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            orders,
            "Orders Fetched Successfully"
        )
    )

} );

export {
    placeOrderCOD,
    getOrders,
    getAllOrders,
}