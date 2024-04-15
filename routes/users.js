const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const {User}=require('../authontication/user');
const passport=require('passport');
const nodemailer = require("nodemailer");
// const crypto=require('crypto');
router.get('/login', (req, res) => {
    res.render('loginpage', { title: 'Login' });
});

router.get('/register', (req, res) => {
    res.render('register', { title: 'register' });
});

router.get('/forgotpass', (req, res) => {
  res.render('forgotpass', { title: 'forgotpass' });
});

router.get('/resetpass', (req, res) => {
  res.render('resetpass', { title: 'resetpass' });
});

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
        console.error('Error logging out:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
      res.redirect('/users/login');
  });
});

router.post('/register', (req, res) => {
    // console.log(req.body);
    const {name ,email,password,password2}=req.body;
    let errors=[];
    if(!name || !email || !password ||!password2){
        errors.push({msg:'Please fill all the filds'});
    }
    if(password !== password2){
        errors.push({msg:'Password do not match'});
    }
    if(password.length<6){
        errors.push({msg:'Password should be at list 6 characters'});
    }
    if(errors.length>0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2,
            title:'register'
        });
        console.log('Hiiiii');
    }
    else{
        // res.send('pass');
        User.findOne({ email: email }).then(user => {
            if (user) {
              errors.push({ msg: 'Email already exists' });
              res.render('register', {
                errors,
                name,
                email,
                password,
                password2,
                title:"register"
              });
            } else {
              const newUser = new User({
                name,
                email,
                password
              });
              bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                  if (err) throw err;
                  newUser.password = hash;
                  newUser
                    .save()
                    .then(user => {
                   
                      res.redirect('/users/login');
                    })
                    .catch(err => console.log(err));
                });
              });
            }
        });
    }
});




router.post('/login',(req,res,next)=>{
  passport.authenticate('local',{
    successRedirect:'/home',
    failureRedirect:'/users/login',
    failureFlash:true
  })(req,res,next);
});

router.post('/forgotpass',async(req,res)=>{
  const otp=Math.floor(1000 + Math.random() * 9000);;
  req.session.email = req.body.email;
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", 
    port: 587,
    secure: false, 
    auth: {
      user: "pratikp3800@gmail.com", 
      pass: "lupt nqan vhfl jsdr",
    },
  });
  let info = await transporter.sendMail({
    from: '"You" <pratikp3800@gmail.com>',
    to: `${req.body.email}`,
    subject: "Testing, testing, 123",
    html: `
    <h1>OTP Verification</h1>
    <p>Your OTP is: <strong>${otp}</strong></p>
    <p>Please use this OTP to verify your identity.</p>
    <p>OTP will be valid for 3 min.</p>
    `,
  });
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      user.otp=otp;
      user.save();
    } else {
      console.log("email does not exist");
    }
});

  console.log(info.messageId);
  res.redirect(`/users/resetpass`); 
});


router.post('/resetpass',async(req,res)=>{
  const email=req.session.email;
  const {otp,password,password2}=req.body;
    let errors=[];
    if(!otp|| !password ||!password2){
        errors.push({msg:'Please fill all the filds'});
    }
    if(password !== password2){
        errors.push({msg:'Password do not match'});
    }
    if(password.length<6){
        errors.push({msg:'Password should be at list 6 characters'});
    }
    if(errors.length>0){
        res.render('resetpass',{
            errors,
            otp,
            password,
            password2,
            title:'resetpass'
        });
        console.log('Hiiiii');
    }
    else{
        // res.send('pass');
        User.findOne({ email: email }).then(user => {
            if (user) {
              console.log("yser found");
              if(user.otp!=otp){
                  errors.push({msg:'incorrrect otp'});
                  res.render('resetpass',{
                    errors,
                    otp,
                    password,
                    password2,
                    title:'resetpass'
                });
                return ;
                
              }
              bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash) => {
                  if (err) throw err;
                  user.password = hash;
                  user
                    .save()
                    .then(user => {
                      res.redirect('/users/login');
                    })
                    .catch(err => console.log(err));
                });
              });
            } else {
              console.log("yser found");
              errors.push({ msg: 'Email does not exists' });
              res.render('resetpass', {
                errors,
                otp,
                password,
                password2,
                title:"resetpass"
              });
            }
        });
    }
});

module.exports = router;
