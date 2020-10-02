const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const {
    User
} = require("../../models/user");
const express = require("express");
const router = express.Router();


router.put("/:id", async (req, res) => {
    const {
        error
    } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);


    let user = await User.findById(req.params.id)
    if (!user) return res.status(400).send("You're not in our Database.");

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    if (user.loginCount === 0) {
        user.loginCount++;
    }

    await user.save();

    res.status(200).json("successfully, changed your password");
});

function validate(req) {
    const schema = {
        password: Joi.string()
            .min(5)
            .max(255)
            .required()
    };
    return Joi.validate(req, schema);
}

module.exports = router;