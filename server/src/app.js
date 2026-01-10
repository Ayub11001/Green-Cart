import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { userRouter } from './routes/user.routes.js';
import { sellerRouter } from './routes/seller.routes.js';

const app = express();

app.use(cors({
    origin: process.env.REACT_APP_URL,
    credentials: true
}));

app.use(express.json({limit: '16kb'}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(cookieParser())
app.use(express.static('public'))

app.use('/api/v1/users', userRouter)
app.use('/api/v1/seller', sellerRouter)

export { app };