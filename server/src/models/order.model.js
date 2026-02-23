import mongoose, { mongo } from "mongoose";

const orderSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User',
            required: true
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId, 
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ],
        amount: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            default: 'Order Placed'
        },
        address: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Address',
            required: true
        },
        paymentType: {
            type: String,
            required: true
        },
        isPaid: {
            type: Boolean,
            default: false,
            required: true
        }

    },
    {
        timestamps: true
    }
)

export const Order = mongoose.model('Order', orderSchema);