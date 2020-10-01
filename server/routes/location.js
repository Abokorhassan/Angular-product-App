const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const {
    User,
} = require("../models/user");
const {
    Location,
} = require("../models/locaiton");
const Joi = require("joi");
const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

router.get("/:id", [auth, validateObjectId], async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user)
        return res.status(404).send("Sorry, You're not in our database.");

    const location = await Location.find({
        'user._id': mongoose.Types.ObjectId(req.params.id)
    });

    res.send(location);
});



router.post("/", async (req, res) => {
    const {
        error
    } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findById(req.body.userID);
    if (!user)
        return res.status(404).send("Sorry, You're not in our database.");

    const location = new Location({
        lat: req.body.lat,
        lng: req.body.lng,
        name: req.body.name,
        user: {
            _id: user._id,
            name: user.name
        }
    })

    await location.save()

    res.status(200).json("You added this address!");
});


function validate(user) {
    const schema = {
        name: Joi.string().min(4).max(50),
        lat: Joi.number(),
        lng: Joi.number(),
        userID: Joi.objectId(),
    };
    return Joi.validate(user, schema);
}


module.exports = router;