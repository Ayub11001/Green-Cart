import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: process.env.REACT_APP_URL,
    credentials: true
}));

export { app };