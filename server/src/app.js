import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { userRouter } from './routes/user.routes.js';
import { sellerRouter } from './routes/seller.routes.js';
import { productRouter } from './routes/products.routes.js';
import { cartRouter } from './routes/cart.routes.js';
import { addressRouter } from './routes/address.routes.js';
import { orderRouter } from './routes/order.route.js';
import recommendationRouter from './routes/recommendation.routes.js';

const app = express();

app.use(cors({
    origin: process.env.REACT_APP_URL,
    credentials: true
}));

app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(cookieParser());
app.use(express.static('public'));

app.use('/api/v1/user', userRouter);
app.use('/api/v1/seller', sellerRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/address', addressRouter);
app.use('/api/v1/order', orderRouter)
app.use('/api/v1/recommendations', recommendationRouter);

export { app };