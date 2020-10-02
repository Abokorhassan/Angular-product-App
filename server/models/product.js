const Joi = require("joi");
const mongoose = require("mongoose");
const {
    userSchema
} = require('./user')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50
    },
    description: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 255,
    },
    quantity: {
        type: String,
        default: 0
    },
    price: {
        type: String,
        default: "0$"
    },
    user: {
        type: userSchema,
    }
});

const Product = mongoose.model("Product", productSchema);

function validateProduct(product) {
    const schema = {
        name: Joi.string()
            .min(4)
            .max(50)
            .required(),
        description: Joi.string()
            .min(10)
            .max(255)
            .required(),
        quantity: Joi.string(),
        price: Joi.string(),
        userID: Joi.objectId().required(),
    };

    return Joi.validate(product, schema);
}

exports.Product = Product;
exports.validate = validateProduct;