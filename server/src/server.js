import { app } from './app.js';
import connectDb from './db/index.js';
import dotenv from 'dotenv';

dotenv.config(
    {
        path: './.env'
    }
);


connectDb()
.then(
    () => {
        const server = app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running on port: ${process.env.PORT}`);
        })
        server.on('error', (error) => {
            console.log("Server error in src/server.js: ", error)
        })
    }
)
.catch((error) => {
    console.log("MongoDB connection failed in src/server.js: ", error)
})