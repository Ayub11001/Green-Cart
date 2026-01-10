import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    cartItems: {
        type: Object, 
        default: {}
    }
}, {
    timestamps: true, 
    minimize: false  
});

export const User = mongoose.model('User', userSchema)