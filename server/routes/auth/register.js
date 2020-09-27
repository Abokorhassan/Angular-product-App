const auth = require("../../middleware/auth");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const {
    User,
    validate
} = require("../../models/user");
const express = require("express");
const router = express.Router();

router.get("/me", auth, async(req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    res.send(user);
});

router.post("/", async(req, res) => {
    const {
        error
    } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({
        email: req.body.email,
    });
    if (user) return res.status(400).send("User already registered.");

    user = new User(_.pick(req.body, ["name", "email"]));
    const password = crypto.randomBytes(3).toString("hex"); // Create hex random pasword
    user.password = password

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    MailConfig(password);

    await user.save();

    res.status(200).json("You successfully created... check your email and get your password from their!", );
});

function MailConfig(password) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "kaambulkaambul@gmail.com",
            pass: "kaambul123",
        },
    });

    const mailOptions = {
        from: "kaambulkaambul@gmail.com",
        to: "abokorhassan@gmail.com",
        subject: "Product App Email Verification",
        text: "You are receiving this because you (or someone else) has signed up Product App for your your email.\n\n" +
            `YOUR PASSWORD IS:  ${password}\n\n` +
            "If you didn't sign up Prduct App, please ignore this email.\n",
    };

    transporter.sendMail(mailOptions, (err, response) => {
        if (err) {
            console.log("----", err);
            // res.status(500).send(err)
        } else {
            console.log("here is the res: ", response);
            // res.status(200).json("recovery email sent");
            // res.send("recovery email sent");
        }
    });

}

module.exports = router;