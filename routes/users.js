const mongoose=require("mongoose");
const plm=require("passport-local-mongoose")
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

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
