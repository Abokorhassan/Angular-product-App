const Joi = require("joi");
const mongoose = require("mongoose");
const {
    userSchema
} = require("./user");

const locationtSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        maxlength: 50,
    },
    lat: {
        type: String,
        required: true,
    },
    lng: {
        type: String,
        required: true,
    },
    primaryLocation: {
        type: Boolean,
        default: false,
    },
    user: {
        type: userSchema,
        // required: true,
    },
});

const Location = mongoose.model("Location", locationtSchema);


exports.Location = Location;