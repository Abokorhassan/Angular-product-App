const express = require("express");
const path = require('path');
const changePassword = require("../routes/auth/changePassword");
const resgister = require("../routes/auth/register");
const auth = require("../routes/auth/auth");
const product = require("../routes/product");
const error = require("../middleware/error");

module.exports = function(app) {
    app.use(express.json());
    app.use("/api/changePass", changePassword);
    app.use("/api/register", resgister);
    app.use("/api/auth", auth);
    app.use('/api/product', product)
    app.use(error);
};