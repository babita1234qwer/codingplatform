const mongoose=require('mongoose');
const {Schema}=mongoose;
const userSchema=new Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:20
    },
    lastName:{
        type:String,
        
        minLength:3,
        maxLength:20
    },
    emailid:{
        type:String,
        required:true,
        unique:true
    },
    age:{
        type:Number,
        min:6,
        max:80
    },
    role:{
        type:String,
        enum:["admin","user"],
        default:"user"
    },
    problemsolved:{
        type:[{
            type:Schema.Types.ObjectId,
            ref:'Problem'
        }],
        unique:true
    },
    password:{
        type:String,
        required:true,
        
        
    },premiumUser: {
  type: Boolean,
  default: false,
}},
    {
        timestamps:true
    }
);
userSchema.post('findOneAndDelete',async function (userInfo){
    if(userInfo){
        await mongoose.model('submission').deleteMany({userId:userInfo._id});
    }
})
const User=mongoose.model('User',userSchema);
module.exports=User;