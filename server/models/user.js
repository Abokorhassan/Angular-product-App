const config = require("config");
const jwt = require("jsonwebtoken");
// const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true,
        minlength: 2,
        maxlength: 50,
    },
    email: {
        type: String,
        // required: true,
        minlength: 5,
        maxlength: 255,
        unique: true,
    },
    password: {
        type: String,
        minlength: 5,
        maxlength: 1024,
    },
    loginCount: {
        type: Number,
        default: 0,
    },
    points: {
        type: Number,
        default: 0,
    },
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({
            _id: this._id,
            name: this.name,
            email: this.email,
        },
        config.get("jwtPrivateKey")
    );
    return token;
};

const User = mongoose.model("User", userSchema);

exports.userSchema = userSchema;
exports.User = User;