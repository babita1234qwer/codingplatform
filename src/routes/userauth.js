const express = require('express');

const authRouter =  express.Router();
const {register, login,logout, adminregister,deleteProfile} = require('../controllers/userauthent')
const userMiddleware = require("../middleware/usermiddleware");
const adminMiddleware = require('../middleware/adminmiddleware');


authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', userMiddleware, logout);
authRouter.post('/admin/register', adminMiddleware ,adminregister);
//authRouter.delete('/deleteProfile',userMiddleware,deleteProfile);
// authRouter.get('/getProfile',getProfile);
authRouter.get('/me', userMiddleware, (req, res) => {
  res.status(200).json(req.result); // req.result contains user details from token
})

module.exports = authRouter;



