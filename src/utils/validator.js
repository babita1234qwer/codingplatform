const validator=require('validator');
const validate=(data)=>{
    const mandatoryfields=['firstName','emailid','password'];
    const isallowed=mandatoryfields.every((k)=> Object.keys(data).includes(k));
    if(!isallowed){
        throw new Error('Mandatory fields are missing');
    }
    if(!validator.isEmail(data.emailid)){
        throw new Error('Email is not valid');
    }
    if(!validator.isStrongPassword(data.password)){
        throw new Error('Password is not strong');
    }
}

module.exports=validate;