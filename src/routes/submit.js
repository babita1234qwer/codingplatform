const express = require('express');
const submitRouter = express.Router();
const userMiddleware= require('../middleware/usermiddleware');
const {submitcode,runcode} = require('../controllers/usersubmissions');
submitRouter.post("/submit/:id",userMiddleware,submitcode);
submitRouter.post("/runcode/:id",userMiddleware,runcode);
module.exports = submitRouter;