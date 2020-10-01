const validateObjectId = require("../../middleware/validateObjectId");
const auth = require("../../middleware/auth");
const {
    User,
} = require("../../models/user");
const express = require("express");
const router = express.Router();


router.get("/:id", [auth, validateObjectId], async(req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    if (!user)
        return res.status(404).send("Sorry, You're not in our database.");
    res.send(user);
});

module.exports = router;