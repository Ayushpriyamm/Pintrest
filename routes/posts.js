
const mongoose=require("mongoose");

const postSchema=mongoose.Schema({
	
    imageText:{
        type:String,
        required:true
    },
    image:{
        type:String
    },
    description:{
        type:String
    },
    
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
    },

    createdAt:{
        type:Date,
        default:Date.now
    },

    likes:{
        type:Array,
        default:[]
    },  

	});

module.exports=mongoose.model("Post",postSchema)
   
