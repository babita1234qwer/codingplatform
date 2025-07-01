const express=require('express');
const problemrouter=express.Router();
const adminMiddleware=require('../middleware/adminmiddleware');
const userMiddleware=require('../middleware/usermiddleware');
const {createProblem,updateprobem,deleteproblem,getproblembyid,getallproblem,solvedallproblem,submittedproblems,getAllContests,getLiveContests,getContestById,createContest,getUserContests}=require("../controllers/userproblem");
problemrouter.get("/test", (req, res) => {
    res.send("Problem route works!");
});
console.log(" problemcreator.js file loaded"); 


problemrouter.post("/create",adminMiddleware,createProblem);
problemrouter.post("/createcontest",adminMiddleware,createContest); 
problemrouter.get("/getallcontests",userMiddleware,getAllContests);
problemrouter.get("/getlivecontests",userMiddleware,getLiveContests);
problemrouter.get("/contestbyid/:id",userMiddleware,getContestById); 
problemrouter.patch("/update/:id",adminMiddleware,updateprobem);
problemrouter.delete("/delete/:id",deleteproblem);
problemrouter.get("/usercontests", userMiddleware, getUserContests);

problemrouter.get("/problembyid/:id",userMiddleware,getproblembyid);
problemrouter.get("/getallproblem",userMiddleware,getallproblem);
problemrouter.get("/problemsolvedbyuser",userMiddleware,solvedallproblem); 
problemrouter.get("/submittedproblems/:pid",userMiddleware,submittedproblems);
module.exports=problemrouter;