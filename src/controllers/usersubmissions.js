const Problem = require('../models/problem');
const Submission = require('../models/submission');
const ContestSubmission = require('../models/contestsubmission');
const Contest = require('../models/contest');
const {getLanguageById,submitBatch, submittoken} = require('../utils/problemutility');
const submitcode = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;
    const { code, language, contestId } = req.body; 

    if (!code || !language || !problemId || !userId) {
      return res.status(400).send({ error: "Code, language, problem ID and user ID are required" });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).send({ error: "Problem not found" });
    }

    const submission = await Submission.create({
      userId,
      problemId,
      code,
      language,
      testcasespassed: 0,
      totalTestcases: problem.hiddentestcases.length,
      status: 'pending'
    });

    const languageId = getLanguageById(language);
    if (!languageId) {
      return res.status(400).send({ error: "Invalid language selected" });
    }

    const submissions = problem.hiddentestcases.map((testcase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output
    }));

    const batchResult = await submitBatch(submissions);
    const tokens = batchResult.map(r => r.token);
    const testResults = await submittoken(tokens);

    // Analyze result
    let passed = 0, runtime = 0, memory = 0;
    let status = 'accepted', errorMessage = null;

    for (const test of testResults) {
      if (test.status.id === 3) {
        passed++;
        runtime += parseFloat(test.time);
        memory = Math.max(memory, test.memory);
      } else {
        status = test.status.id === 4 ? 'error' : 'wrong';
        errorMessage = test.stderr;
      }
    }

    submission.status = status;
    submission.runTime = runtime;
    submission.memory = memory;
    submission.testcasespassed = passed;
    submission.errorMessage = errorMessage;
    await submission.save();

    // ✅ Normal solved-problem tracking
    if (!req.result.problemsolved.includes(problemId)) {
      req.result.problemsolved.push(problemId);
      await req.result.save();
    }

    // ✅ Handle Contest Score (only if contestId exists)
    if (contestId && status === 'accepted') {
      const contest = await Contest.findById(contestId);
      if (!contest) {
        console.warn("Contest ID is invalid or does not exist");
      } else {
        const isInContest = contest.problems.includes(problemId);
        if (isInContest) {
          const alreadySubmitted = await ContestSubmission.findOne({ userId, contestId, problemId });
          if (!alreadySubmitted) {
            await ContestSubmission.create({
              userId,
              contestId,
              problemId,
              score: 100,
              submissionTime: new Date()
            });
          }
        }
      }
    }

    return res.status(200).send({
      message: 'Code submitted successfully',
      submission
    });

  } catch (err) {
    console.error('Error in submitcode:', err);
    return res.status(500).send({ error: 'Internal server error' });
  }}
  const runcode=async(req,res)=>{
    try{
    const userId = req.result._id;
    const problemId = req.params.id;  
    const { code, language } = req.body;
    console.log({ code, language, problemId, userId });
    if(!code || !language || !problemId || !userId){
      return res.status(400).send({error:"Code, language, problem ID and  user ID are required"});
    }
    const problem= await Problem.findById(problemId);
    if (!problem) {
  return res.status(404).send({ error: "Problem not found" });
}
   
    const languageid= getLanguageById(language);
const submissions=problem.visibletestcases.map((testcase)=>({
        source_code: code,
        language_id: languageid,
        stdin: testcase.input,
        expected_output: testcase.output
    }));
    const submitresult=await submitBatch(submissions);
   const resulttoken=submitresult.map((result)=>result.token);
    const testresult=await submittoken(resulttoken);
    
    return res.status(200).send({
      message: 'Code submitted successfully',
      testResults: testresult
    });
  }
catch(err){
    console.error('Error in submitcode:', err);
    return res.status(500).send({error: 'Internal server error'});
  }}
module.exports={submitcode,runcode};