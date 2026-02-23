import { Product } from "../models/product.models.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js"

const addProduct = asyncHandler( async (req, res) => {
    let productData = JSON.parse(req.body.productData);
    const images = req.files
    if(!images) {
        throw new ApiError(
            400,
            "Images not uploaded"
        )
    }

    let imagesUrl = await Promise.all(
        images.map(async (item) => {
            let result = await uploadOnCloudinary(item.path);
            return result;
        })
    )

    await Product.create({ ...productData, image: imagesUrl})

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, {}, "Product added successfully"
        )
    )
})

const getProductList = asyncHandler( async (req, res) => {
    const products = await Product.find({})
    if(!products) {
        throw new ApiError(
            500,
            'Products not found!',
        )
    }

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        products,
        'Product list successfullly sent'
    ))
})

const getProductById = asyncHandler( async (req, res) => {
    const productId = req.params.id;
    if(!productId) {
        throw new ApiError(
            400,
            'Product ID was not received'
        )
    }

    const product = await Product.findById(productId);
    if(!product) {
        throw new ApiError(
            500,
            "Product not found"
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            product,
            'Product details sent successfully'
        )
    )
})

const changeStock = asyncHandler( async (req, res) => {
    const {id, inStock} = req.body;
    if(!id && inStock === undefined) {
        throw new ApiError(
            400,
            'ID, stock are required fields'
        )
    }

    await Product.findByIdAndUpdate(
        id,
        {
            $set: {inStock}
        }
    );

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Stock changed successfully"
        )
    )
})


export {
    addProduct,
    getProductList,
    getProductById,
    changeStock,
}