import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import {Product} from '../models/product.models.js'
import { Order } from '../models/order.model.js';
import stripe from "stripe"

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

const placeOrderStripe = asyncHandler( async (req, res) => {
    const userId = req.user?._id;
    const { items, address } = req.body;
    const {origin} = req.headers;

    if(!address || items.length === 0) {
        throw new ApiError(
            400,
            'Invalid data'
        )
    }

    let productData = [];

    let amount = await items.reduce(
        async(accumilator, item) => {
            const product = await Product.findById(item.product);
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity,
            });
            return ( await accumilator ) + product.offerPrice * item.quantity;
        },
        0
    );

    amount += Math.floor(amount*0.02);

    const order = await Order.create(
        {
            userId,
            items,
            amount,
            address, 
            paymentType: 'Online'
        }
    );

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    const line_items = productData.map(
        (item) => {
            return {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: Math.floor(item.price + item.price*0.02) * 100
                },
                quantity: item.quantity,
            }
        }
    );

    const session = await stripeInstance.checkout.sessions.create({
        line_items,
        mode: "payment",
        success_url: `${origin}/loader?next=my-orders`,
        cancel_url: `${origin}/cart`,
        metadata: {
            orderId: order._id.toString(),
            userId: userId.toString(),
        }
    });

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {url: session.url},
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
    ).populate({
        path: 'items.product',
        populate: {
            path: 'sellerId',
            select: 'shopName shopLocation'
        }
    })
    .populate('address')
    .sort({ createdAt: -1 });

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
    const sellerId = req.user._id;

    const productIds = await Product.find({sellerId}).distinct("_id");

    const orders = await Order.find(
        {
            $or: [
                { paymentType: "COD" },
                { isPaid: true }
            ],
            "items.product": {
                $in: productIds,
            }
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
    placeOrderStripe,
    getOrders,
    getAllOrders,
}