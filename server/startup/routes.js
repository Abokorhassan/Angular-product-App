const express = require("express");
const path = require('path');
const changePassword = require("../routes/auth/changePassword");
const resgister = require("../routes/auth/register");
const auth = require("../routes/auth/auth");
const inviteUser = require("../routes/auth/inviteUser");
const product = require("../routes/product");
const location = require("../routes/location");
const profile = require("../routes/auth/profile");
const error = require("../middleware/error");

module.exports = function(app) {
    app.use(express.json());
    app.use("/api/changePass", changePassword);
    app.use("/api/register", resgister);
    app.use("/api/auth", auth);
    app.use("/api/inviteUser", inviteUser);
    app.use('/api/product', product)
    app.use('/api/location', location)
    app.use('/api/me', profile)
    app.use(error);
};