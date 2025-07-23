const express = require('express');
const { createOrder, verifyPayment, checkPremiumAccess } = require("../controllers/paymentcontrollers.js");

const userMiddleware = require('../middleware/usermiddleware.js');
const Paymentrouter = express.Router();

Paymentrouter.post("/create-order", createOrder);
Paymentrouter.post("/verify", userMiddleware,verifyPayment);
Paymentrouter.get('/has-access', userMiddleware, checkPremiumAccess);

module.exports = Paymentrouter;