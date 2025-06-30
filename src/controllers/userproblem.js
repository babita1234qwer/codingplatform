const mongoose = require('mongoose');
const ContestSubmission = require('../models/contestsubmission');
const {getLanguageById,submitBatch,submittoken}=require('../utils/problemutility');
const Submission = require('../models/submission');
const Problem=require('../models/problem');
const User = require('../models/user');
const Contest = require('../models/contest');
const SolutionVideo =require("../models/solutionVideo");
const createContest = async (req, res) => {
  try {
    const { title, description, startTime, endTime, problems } = req.body;
    const createdBy = req.user._id; 

    const contest = new Contest({
      title,
      description,
      startTime,
      endTime,
      problems,
      createdBy
    });

    await contest.save();
    res.status(201).send({ message: "Contest created", contest });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};
const getAllContests = async (req, res) => {
  try {
    const contests = await Contest.find().populate("problems", "title difficulty");
    res.status(200).send(contests);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};
const getLiveContests = async (req, res) => {
  try {
    const now = new Date();
    const contests = await Contest.find({
      startTime: { $lte: now },
      endTime: { $gte: now },
    }).populate("problems", "title difficulty");

    res.status(200).send(contests);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};
const getContestById = async (req, res) => {
  try {
    const { id } = req.params;
    const contest = await Contest.findById(id).populate("problems");
    if (!contest) return res.status(404).send({ error: "Contest not found" });
    res.status(200).send(contest);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

const createProblem=async(req,res)=>{
    const {title,description,difficulty,tags,visibletestcases,hiddentestcases,startCode,referenceCode,problemCreator}=req.body;
     try{
       for(const {language,completecode} of referenceCode){
         const languageid=getLanguageById(language);
         // Debug log
  console.log('DEBUG:', { language, completecode, languageid, 
    completecodeType: typeof completecode, languageidType: typeof languageid 
  });
           if (Array.isArray(completecode) || Array.isArray(languageid)) {
    console.error('ERROR: completecode or languageid is an array!', { completecode, languageid });
    return res.status(400).send({ error: 'Internal mapping error: code or language id is array' });
  }
  if (!Array.isArray(visibletestcases) || visibletestcases.length === 0) {
  return res.status(400).send({ error: "No visible test cases provided" });
}

         const submissions=visibletestcases.map(testcase=>({
            source_code:completecode,
             language_id:languageid,
            stdin:testcase.input,
            expected_output:testcase.output


         }));
         if (submissions.length === 0) {
  return res.status(400).send({ error: "No submissions generated for Judge0" });
}
       console.log('Submitting batch with:', submissions.length, 'submissions');

if (!submissions || submissions.length === 0) {
  console.error('ERROR: Submissions array is empty!');
  console.error('completecode:', completecode);
  console.error('languageid:', languageid);
  console.error('visibletestcases:', visibletestcases);
  return res.status(400).send({ error: "Submissions array is empty" });
}
console.log('completecode:', completecode);
console.log('languageid:', languageid);
console.log('visibletestcases:', visibletestcases);
console.log('Generated submissions:', submissions);


        const submitresult=await submitBatch(submissions);
        //console.log('submitresult:', submitresult);
//console.log('submitresult.tokens:', submitresult ? submitresult.tokens : 'submitresult is null/undefined');
console.log('Judge0 batch submission response:', submitresult);

      //  if (!submitresult || !Array.isArray(submitresult.tokens)) {
  //  return res.status(500).send({ error: "Failed to submit batch or invalid response from Judge0" });
//}
const resulttoken = submitresult.map(item => item.token);
// this is already an array of tokens
console.log('Tokens extracted:', resulttoken);

       const testresult=await submittoken(resulttoken);
    console.log("Testresult:", testresult);
       if (!testresult || typeof testresult !== 'object') {
  return res.status(500).send("Invalid test result structure");
}

       for(const test of testresult){
        if(test.status_id!=3){
          return res.status(400).send("error occured")
        
        }}
      

       }
       
       //lconsole.log('Submitting batch with:', submissions.length, 'submissions');
//console.log('Judge0 batch submission response:', submitresult);
//console.log('Tokens extracted:', resulttoken);
//console.log('Judge0 test results:', testresult);


      const userproblem= await Problem.create({
        ...req.body,
        problemCreator:req.user._id,


       });
      
        res.status(200).send("problem created successfully");
     }
     catch(err){
        res.status(400).send({error:err.message});

     }}

     const updateprobem=async(req,res)=>{
      const {id}=req.params;
          const {title,description,difficulty,tags,visibletestcases,hiddentestcases,startCode,referenceCode,problemCreator}=req.body;
 try{
  if(!id){
    return res.status(400).send({error:"Problem ID is required"});}
      const dsaproblem=await Problem.findById(id);
    if(!dsaproblem){
      return res.status(404).send({error:"Problem not found"});
    }
    for(const {language,completecode} of referenceCode){
         const languageid=getLanguageById(language);
         // Debug log
  console.log('DEBUG:', { language, completecode, languageid, 
    completecodeType: typeof completecode, languageidType: typeof languageid 
  });
           if (Array.isArray(completecode) || Array.isArray(languageid)) {
    console.error('ERROR: completecode or languageid is an array!', { completecode, languageid });
    return res.status(400).send({ error: 'Internal mapping error: code or language id is array' });
  }
  if (!Array.isArray(visibletestcases) || visibletestcases.length === 0) {
  return res.status(400).send({ error: "No visible test cases provided" });
}

         const submissions=visibletestcases.map(testcase=>({
            source_code:completecode,
             language_id:languageid,
            stdin:testcase.input,
            expected_output:testcase.output


         }));
         if (submissions.length === 0) {
  return res.status(400).send({ error: "No submissions generated for Judge0" });
}
       console.log('Submitting batch with:', submissions.length, 'submissions');

if (!submissions || submissions.length === 0) {
  console.error('ERROR: Submissions array is empty!');
  console.error('completecode:', completecode);
  console.error('languageid:', languageid);
  console.error('visibletestcases:', visibletestcases);
  return res.status(400).send({ error: "Submissions array is empty" });
}
console.log('completecode:', completecode);
console.log('languageid:', languageid);
console.log('visibletestcases:', visibletestcases);
console.log('Generated submissions:', submissions);


        const submitresult=await submitBatch(submissions);
        //console.log('submitresult:', submitresult);
//console.log('submitresult.tokens:', submitresult ? submitresult.tokens : 'submitresult is null/undefined');
console.log('Judge0 batch submission response:', submitresult);

      //  if (!submitresult || !Array.isArray(submitresult.tokens)) {
  //  return res.status(500).send({ error: "Failed to submit batch or invalid response from Judge0" });
//}
const resulttoken = submitresult.map(item => item.token);
// this is already an array of tokens
console.log('Tokens extracted:', resulttoken);

       const testresult=await submittoken(resulttoken);
    console.log("Testresult:", testresult);
       if (!testresult || typeof testresult !== 'object') {
  return res.status(500).send("Invalid test result structure");
}

       for(const test of testresult){
        if(test.status_id!=3){
          return res.status(400).send("error occured")
        
        }}
      

       }
      const newproblem= await Problem.findByIdAndUpdate(id,{...req.body},{runValidators:true,new:true});
      res.status(200).send({message:"Problem updated successfully",problem:newproblem});
      }
      catch(err){
        res.status(400).send({error:err.message});
      }}

      const deleteproblem=async(req,res)=>{
        const {id}=req.params;
        try{
          if(!id){
            return res.status(400).send({error:"Problem ID is required"});
          }
          const dsaproblem=await Problem.findById(id);
          if(!dsaproblem){
            return res.status(404).send({error:"Problem not found"});
          }
           const deleteproblem=await Problem.findByIdAndDelete(id);
          if(!deleteproblem){
            return res.status(404).send({error:"Problem not found"}); 
          }
           res.status(200).send({message:"Problem deleted successfully"});
        }
        catch(err){
          res.status(400).send({error:err.message});
        }

      }
      const getproblembyid=async(req,res)=>{
        const {id}=req.params;
        try{
          if(!id){
            return res.status(400).send({error:"Problem ID is required"});
          }
          const getproblem=await Problem.findById(id).select(' _id title description difficulty tags visibletestcases  startCode referenceCode problemCreator createdAt updatedAt');
         
          if(!getproblem){
            return res.status(404).send({error:"Problem not found"});
          }
           const videos=await SolutionVideo.findOne({problemId:id})
          if(videos){
            const responseData={
              ...getproblem.toObject(),

            secureUrl:videos.secureUrl,
            cloudinaryPublicId:videos.cloudinaryPublicId,
            thumbnailUrl:videos.thumbnailUrl,
            duration:videos.duration,}
            //console.log(secureUrl);
            return res.status(200).send(responseData);
            
          }
           res.status(200).send(getproblem);
        }
        catch(err){
          res.status(400).send({error:err.message});
        }
      }
      const getallproblem=async(req,res)=>{
        try{
          const allproblem=await Problem.find({}).select(' _id title  difficulty tags');
          if(allproblem.length===0){
            return res.status(404).send({error:"No problem found"});
          }
           res.status(200).send(allproblem);
        }
        catch(err){
          res.status(400).send({error:err.message});
        }
      }
      const solvedallproblem=async(req,res)=>{
        try{
          const userId = req.result._id;
          const user=await User.findById(userId).populate({
            path:"problemsolved",
            select:"_id title difficulty tags"
          });
          res.status(200).send(user.problemsolved);
        }
        catch(err){
          res.status(500).send({error:err.message});
        }}
        const submittedproblems=async(req,res)=>{
          try{
            console.log("req.result:", req.result);

            const userId = new mongoose.Types.ObjectId(req.result._id);
    const problemid = new  mongoose.Types.ObjectId(req.params.pid);
            console.log('Fetching submissions for:', userId, problemid);

            const ans=await Submission.find({userId:userId,problemId:problemid});
           console.log('Found submissions:', ans);

            if(ans.length==0){
            return res.status(404).send({error:"No submissions found for this problem"});
           }
            
            
            res.status(200).send(ans);
          }
          catch(err){
            res.status(500).send({error:err.message});
          }}
const getUserContests = async (req, res) => {
  try {
    const userId = req.user?._id || req.result?._id;
    if (!userId) return res.status(400).json({ error: "User ID not found" });

    // Only convert if userId is a string
    const userObjectId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
    console.log("userId from auth:", userId);
    console.log("userObjectId:", userObjectId);

    const contestIds = await ContestSubmission.find({ userId: userObjectId }).distinct('contestId');
    console.log("contestIds found:", contestIds);

    const contests = await Contest.find({ _id: { $in: contestIds } });
    console.log("contests found:", contests);

    res.json(contests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

      module.exports={createProblem,updateprobem,deleteproblem,getproblembyid,getallproblem,solvedallproblem, submittedproblems,createContest,getAllContests,getLiveContests,getContestById,getUserContests};