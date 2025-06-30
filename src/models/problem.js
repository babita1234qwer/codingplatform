const mongoose=require('mongoose');
const{Schema}=mongoose;
const problemSchema=new Schema({
    title:{
        type:String,
        required:true
        
    },
    description:{
        type:String,
        required:true
    },
    difficulty:{
        type:String,
        enum:["easy","medium","hard"],
        default:"easy"
    },
    tags:[{
        type:String,
        enum:["array","string","linkedlist","graph","dp"],
        required:true
    }],
    visibletestcases:[
        {
            input:{
                type:String,
                required:true
            },
            output:{
                type:String,
                required:true
            },
            explanation:{
                type:String,
                required:true
            }
        }
    ],

hiddentestcases:[
    {
        input:{
            type:String,
            required:true
        },
        output:{
            type:String,
            required:true
        },
        explanation:{
            type:String,
        
        }
    }
],
startCode:[
    {
        language:{
            type:String,
            required:true
        },
        initialcode:{
            type:String,
            required:true
        },
    }
],
referenceCode:[
    { language:{    
        type:String,
        required:true
    },
    completecode:{
        type:String,
        required:true
    },}],
problemCreator:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true
}},

{
    timestamps:true
}
)
const Problem=mongoose.model('Problem',problemSchema);
module.exports=Problem;