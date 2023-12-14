const mongoose=require("mongoose");
const plm=require("passport-local-mongoose")

mongoose.connect("mongodb+srv://ayushpriyam24:PjtLxTINw2dCreSA@cluster0.tb5so4r.mongodb.net/?retryWrites=true&w=majority")

const userSchema=mongoose.Schema({
	
	username:{
    type:String,
    required:true,
    unique:true,
  },

  password:{
    type:String,
    
  },
  
  posts:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Post'
  }],

  dp:{
    type:String,
  },

  email:{
    type:String,
    require:true,
    unique:true
  }, 

  fullname:{
    type:String,
    required:true,
  },

})
userSchema.plugin(plm);

module.exports=mongoose.model("user",userSchema)
