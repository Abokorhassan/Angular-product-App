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


router.post("/", async (req, res) => {
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
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            type: "OAuth2",
            clientId: "485256091990-6i7o961pv72bpq997hcgls30ae9n3a8g.apps.googleusercontent.com",
            clientSecret: "Q3qvh4VgppN2EOW53cnulb6O",
        },
    });

    const mailOptions = {
        from: "kaambulkaambul@gmail.com",
        to: req.body.email,

        subject: "Product App Invitation",
        text: `You are receiving this because ${inviter.name} has Invted to sign up to our Product App.\n\n` +
            `If you interested in our product app please click this link below:\n\n` +
            `http://${req.headers.origin}/inviteUser-signup/${inviter._id}\n\n` +
            "If you're not interested, please just ignore this email.\n",
        auth: {
            user: "abokorhassan@gmail.com",
            refreshToken: "1//04MjTDt--LM2uCgYIARAAGAQSNwF-L9IrryTr7hifmJ9V4k6L-QywjtVVyidosZSI_91aSq5JFf3nfJeGqXGTQYrck33GVxaOSHs",
            accessToken: "ya29.a0AfH6SMBcPQbpNagdbHKR_hzGaFxS3g-03-w74UfRiCbhRnMn2DiIL3khYa_Ko8yUefNaqxacpxcU0VThKAOTYvaIbyRI58zADG1RaFq6Xgo-UTkPb9YMeJiWRdG61ekQQszu7cNhiHO7imAY4mLOh9tO77l44Gjh5w0",
        },
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