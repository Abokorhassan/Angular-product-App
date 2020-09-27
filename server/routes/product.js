const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");

const {
    Product,
    validate
} = require("../models/product");
const fs = require("fs");
const _ = require("lodash");
const mongoose = require("mongoose");
const express = require("express");
const {
    User
} = require("../models/user");
const router = express.Router();

router.get("/", [auth], async(req, res) => {
    const products = await Product.find().select("name description quantity price user");
    res.send(products);
});

router.post("/", [auth], async(req, res) => {
    const {
        error
    } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.body.userID)
    if (!user) return res.status(400).send("not a valid user")

    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
        user: {
            _id: user._id,
            name: user.name,
            loginCount: user.loginCount,
            points: user.points,
        }
    })

    await product.save();

    res.send(product);
});

router.put("/:id", [auth], async(req, res) => {
    const {
        error
    } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.body.userID)
    if (!user) return res.status(400).send("not a valid user")

    const product = await Product.findByIdAndUpdate(
        req.params.id, {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            quantity: req.body.quantity,
            user: {
                _id: user._id,
                name: user.name,
                loginCount: user.loginCount,
                points: user.points,
            }
        }, {
            new: true
        }
    );

    if (!product)
        return res.status(404).send("The product with the given ID was not found.");

    res.send(product);
});

router.get("/:id", validateObjectId, async(req, res) => {
    const product = await Product.findById(req.params.id).select("-__v -user -_id");
    if (!product)
        return res.status(404).send("The product with the given ID was not found.");

    res.send(product);
});


router.delete("/:id", [auth], async(req, res) => {

    const product = await Product.findByIdAndRemove(req.params.id);

    if (!product)
        return res.status(404).send("The product with the given ID was not found.");

    res.send(product);
    res.send("ss")
});


module.exports = router;