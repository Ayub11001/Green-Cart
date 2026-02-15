import mongoose from 'mongoose';

const connectDb = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)

        console.log(`MogoDB connection successfull\nDB host: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log(`MongoDB connection error! at src/db/index.js\nError: ${error}`);
        process.exit(1)
    }
}

export default connectDb;