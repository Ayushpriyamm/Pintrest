var express = require('express');
const passport = require('passport');
const userModel=require('./users');
const postModel=require('./posts')
const localStrategy=require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));
const path = require('path');


const upload=require('./multer');

var router = express.Router();

router.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'public','images','uploads', 'favicon.ico'));
});

/* GET home page. */
router.get('/register', function(req, res, next) {
  res.render('index');  
});
router.get('/', function(req, res, next) {
  if(req.isAuthenticated()){
    res.render('home',{loggedIn:true});
  }else{
    res.render('home',{loggedIn:false})
  }
   
});


router.get('/login', function(req, res, next) {
 
  res.render('login', { error: req.flash("error") }); 
});


//profile
  router.get('/profile',isLoggedIn,async function(req,res) {
    const user= await userModel.findOne({
      username:req.session.passport.user
    }).populate("posts")
    res.render("profile",{user})
    
  })

  //upload
  router.post('/createPost',isLoggedIn,upload.single('file'),async function(req,res) {
    if (!req.file || !req.body.fileCaption || req.body.fileCaption.trim() === '') {
      const user = await userModel.findOne({ username: req.session.passport.user });
      const dpURL = user ? user.dp : '';
      return res.render('postUpload', { dpURL, error: "Please provide an image and a file caption." });
    }
    const user= await userModel.findOne({username:req.session.passport.user})
    const post=await postModel.create({
      image:req.file.filename,
      imageText:req.body.fileCaption,
      description:req.body.description,
      failureFlash:true,
      user:user._id,
    })
   user.posts.push(post._id)
   await user.save()
   res.redirect('/profile')

  // Fetch user data again and render the profile with user data
   const updatedUser = await userModel.findOne({ 
    username: req.session.passport.user 
   }).populate("posts")

    res.render("profile", { user: updatedUser })
  });

  //profile pic
  router.post('/dp',isLoggedIn,upload.single("image"),async function (req,res) {
    const user= await userModel.findOne({username:req.session.passport.user})
    user.dp=req.file.filename;
    await user.save();
    res.redirect('/profile')
  })

  //createPost
  router.get('/createPost',isLoggedIn,async function(req,res) {
    const user= await userModel.findOne({username:req.session.passport.user})
    const dpURL = user ? user.dp : '';
    res.render("postUpload",{dpURL})
  })

  //feed
  router.get('/feed',isLoggedIn, async function(req, res) {
    try {
      const user = await userModel.findOne({ username: req.session.passport.user });
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      const allpost = await postModel.find().populate('user');
      const dpURL = user.dp || ''; // Handle cases where user.dp might be undefined/null
  
      
  
      res.render("feed", { allpost, dpURL });
    } catch (error) {
      // Handle errors by logging and sending an error response
      console.error('Error in /feed route:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  

  //post Details
  router.get('/postDetails/:postId',isLoggedIn, async function (req,res) {
    const postId = req.params.postId;
    const post=await postModel.findById(postId).populate('user')
    const user= await userModel.findOne({username:req.session.passport.user})
    const dpURL = user ? user.dp : '';
    
    res.render('postDetails',{post,user,dpURL})
  })
  
  router.get('/download/:imageName',isLoggedIn, function(req, res) {
    try {
      const imageName = req.params.imageName;
      const imagePath = path.join(__dirname,'..', 'public', 'images', 'uploads', imageName);
      res.download(imagePath, (err) => {
        if (err) {
          console.error('Error downloading file:', err);
          res.status(500).send('Server Error');
        }
      });
    } catch (error) {
      console.error('Error handling download request:', error);
      res.status(500).send('Server Error');
    }
  });
  //post deletion
  router.get('/delete/:postId', async function (req, res) {
    const postId = req.params.postId;
    await postModel.findByIdAndDelete(postId);
    res.redirect('/profile');
  })

	//register route
	router.post('/register',function (req,res) {
	  var userData=new userModel({
      username:req.body.username,
    
      email:req.body.email, 
    
      fullname:req.body.fullname,	
    
    });

 	 userModel.register(userData,req.body.password) 
 	 .then(function(){
  	  passport.authenticate("local")(req,res,function(){
 	     res.redirect('/profile');
 	   })
 	 })
	})

  //login 
  router.post('/login',passport.authenticate("local",{
    successRedirect:'/profile',
    failureRedirect:'/login',
    failureFlash:true
  }),function(req,res){})

  //logout
  router.get('/logout',function(req,res,next){
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect('/')
    })
  })
  //isLoggedIn Middleware
  function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
      return next()
    }
    res.redirect('/login')
  }

module.exports = router;
