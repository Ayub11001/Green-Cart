import { Order } from '../models/order.model.js';
import { Product } from '../models/product.models.js';
import { getProductRecommendations } from '../utils/gemini.service.js';

export const getRecommendations = async (req, res) => {
    try {
        const { userId } = req.params;
        const { cartItems } = req.body; // Array of product IDs in cart

        if (!userId || !cartItems || cartItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'User ID and cart items are required'
            });
        }

        // Fetch cart items details
        const cartProducts = await Product.find({ _id: { $in: cartItems } });

        // Fetch user's order history
        const orders = await Order.find({ userId })
            .populate('items.product')
            .sort({ createdAt: -1 })
            .limit(10);

        // Extract unique products from order history
        const orderHistoryProducts = [];
        const seenProductIds = new Set();

        orders.forEach(order => {
            order.items.forEach(item => {
                if (item.product && !seenProductIds.has(item.product._id.toString())) {
                    orderHistoryProducts.push(item.product);
                    seenProductIds.add(item.product._id.toString());
                }
            });
        });

        // Fetch all available products (in stock, excluding cart items)
        const availableProducts = await Product.find({
            inStock: true,
            _id: { $nin: cartItems }
        }).limit(50);

        if (availableProducts.length === 0) {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'No products available for recommendations'
            });
        }

        // Get AI-powered recommendations
        const recommendations = await getProductRecommendations(
            cartProducts,
            orderHistoryProducts,
            availableProducts
        );

        return res.status(200).json({
            success: true,
            data: recommendations,
            message: 'Recommendations generated successfully'
        });

    } catch (error) {
        console.error('Recommendation Controller Error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to generate recommendations'
        });
    }
};
