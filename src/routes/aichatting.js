const express=require('express');
const aiRouter=express.Router();
const userMiddleware=require('../middleware/usermiddleware');
const solveDoubt=require('../controllers/solveDoubt')
aiRouter.post('/chat',userMiddleware,solveDoubt);

module.exports=aiRouter;