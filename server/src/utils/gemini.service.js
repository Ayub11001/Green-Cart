import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getProductRecommendations = async (cartItems, orderHistory, availableProducts) => {
    try {
        const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL });

        // Prepare cart items data
        const cartItemsText = cartItems.map(item =>
            `- ${item.name} (Category: ${item.category}, Price: ${item.price})`
        ).join('\n');

        // Prepare order history data
        const orderHistoryText = orderHistory.length > 0
            ? orderHistory.map(item =>
                `- ${item.name} (Category: ${item.category})`
              ).join('\n')
            : 'No previous order history';

        // Prepare available products catalog
        const productsText = availableProducts.map(product =>
            `ID: ${product._id}, Name: ${product.name}, Category: ${product.category}, Price: ${product.offerPrice}, Description: ${product.description.join(', ')}`
        ).join('\n');

        // Build the prompt
        const prompt = `You are an intelligent product recommendation system for an e-commerce platform.

**Current Cart Items:**
${cartItemsText}

**User's Order History:**
${orderHistoryText}

**Available Products:**
${productsText}

Based on the user's current cart items and order history, recommend 5-6 products that would complement their purchase. Consider:
1. Products in similar or complementary categories
2. Products that are frequently bought together
3. User's purchasing patterns from history
4. Price range compatibility

IMPORTANT: Return ONLY a JSON array of product IDs. Do not include any explanations or additional text.
Format: ["product_id_1", "product_id_2", "product_id_3", "product_id_4", "product_id_5"]

Rules:
- Do NOT recommend products already in the cart
- Recommend only from the available products list
- Return exactly 5-6 product IDs
- Return valid MongoDB ObjectIDs from the available products`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse the JSON response
        const cleanedText = text.trim().replace(/```json\n?|\n?```/g, '');
        const recommendedIds = JSON.parse(cleanedText);

        // Validate and filter recommendations
        const validRecommendations = availableProducts.filter(product =>
            recommendedIds.includes(product._id.toString()) &&
            !cartItems.some(cartItem => cartItem._id.toString() === product._id.toString())
        );

        return validRecommendations.slice(0, 6);
    } catch (error) {
        console.error('Gemini AI Error:', error);
        throw new Error('Failed to generate recommendations');
    }
};
