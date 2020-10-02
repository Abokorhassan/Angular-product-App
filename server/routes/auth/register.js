const auth = require("../../middleware/auth");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const {
    User,
} = require("../../models/user");
const {
    Location
} = require("../../models/locaiton");
const Joi = require("joi");
const express = require("express");
const router = express.Router();


router.post("/", async (req, res) => {
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

    MailConfig(req, password);
    await user.save();

    // Saving the location
    if (req.body.lat && req.body.lng) {
        const location = new Location({
            name: req.body.name,
            lat: req.body.lat,
            lng: req.body.lng,
            primaryLocation: true,
            user: {
                _id: user._id,
                name: user.name
            }
        })
        await location.save()
    }



    const inviterUser = await User.findById(req.body.InvitedUser)
    if (inviterUser) {
        inviterUser.points = inviterUser.points + 10
        await inviterUser.save()
    }

    res.status(200).json("You successfully created... check your email and get your password from their!", );
});

function MailConfig(req, password) {
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
        from: "Product App",
        to: req.body.email,

        subject: "Product App Email Verification",
        text: "You are receiving this because you (or someone else) has signed up Product App for your your email.\n\n" +
            `YOUR PASSWORD IS:  ${password}\n\n` +
            "If you didn't sign up Prduct App, please ignore this email.\n",
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
        }
    });

}


function validate(user) {
    const schema = {
        name: Joi.string().min(4).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        InvitedUser: Joi.objectId(),
        lat: Joi.number(),
        lng: Joi.number(),
        address: Joi.string().min(4).max(50)
    };
    return Joi.validate(user, schema);
}


module.exports = router;