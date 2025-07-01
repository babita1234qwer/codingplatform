const axios=require('axios');
const mongoose = require('mongoose');
const getLanguageById=(lang)=>{
    const language={
        "cpp":54,
        "c++":54,
        
        "java":62,
        "python":71,
        "javascript":63
    }
    return language[lang.toLowerCase()];
}

const submitBatch=async (submissions)=>{
     //console.log('SUBMITTING TO JUDGE0:', JSON.stringify({ submissions }, null, 2));




const options = {
  method: 'POST',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    
    base64_encoded: 'false',
        wait: 'false',

    fields: '*'
  },
  headers: {
    'x-rapidapi-key': '2db011edcbmsha91808f33745381p18f804jsnbfb97525e677',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  data: {
    submissions
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data;
	} catch (error) {
		console.error(error);
    return null;
	}
}

 return await fetchData();



}
const waiting = async (timer) => {
  return new Promise(resolve => setTimeout(resolve, timer));
}

const submittoken=async(resulttoken)=>{
    const options = {
  method: 'GET',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    tokens:resulttoken.join(","),
    base64_encoded: 'false',
    fields: '*'
  },
  headers: {
    'x-rapidapi-key': '2db011edcbmsha91808f33745381p18f804jsnbfb97525e677',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
  }
};
async function fetchData() {
  try {
    const response = await axios.request(options);
          console.log('Polling response:', response.data);  
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
while(true){


const result= await fetchData();

console.log("📥 Judge0 result:", result);
//  console.log("📥 Judge0 result:", JSON.stringify(result, null, 2));


const isresultobtained=result.submissions.every((r)=>r.status_id>2);
if(isresultobtained){
  return result.submissions; // exit loop when all done
  }
  await waiting(1000); // wait 1 second before next poll
}


}
module.exports={getLanguageById,submitBatch,submittoken};