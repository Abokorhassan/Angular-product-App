const auth = require("../../middleware/auth");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const {
    User,
} = require("../../models/user");
const express = require("express");
const Joi = require("joi");
const router = express.Router();


router.post("/", async(req, res) => {
    const {
        error
    } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const inviter = await User.findById(req.body.userID)
    if (!inviter) return res.status(400).send("You're not in our database!")

    let invitedUser = await User.findOne({
        email: req.body.email,
    });
    if (invitedUser) return res.status(400).send("User already registered.");

    MailConfig(inviter, req);

    res.status(200).json("You successfully Invited this user, we sent him an email telling him to sign up Product App", );
});


function MailConfig(inviter, req) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "kaambulkaambul@gmail.com",
            pass: "kaambul123",
        },
    });

    const mailOptions = {
        from: "kaambulkaambul@gmail.com",
        // to: "abokorhassan@gmail.com",
        to: req.body.email,

        subject: "Product App Invitation",
        text: `You are receiving this because ${inviter.name} has Invted to sign up to our Product App.\n\n` +
            `If you interested in our product app please click this link below:\n\n` +
            `http://${req.headers.origin}/inviteUser-signup/${inviter._id}\n\n` +
            "If you're not interested, please just ignore this email.\n",
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

function validate(req) {
    const schema = {
        email: Joi.string()
            .min(5)
            .max(255)
            .required()
            .email(),
        userID: Joi.objectId().required(),

    };
    return Joi.validate(req, schema);
}

module.exports = router;