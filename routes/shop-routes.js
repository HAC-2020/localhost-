const router=require('express').Router();
const bcrypt=require('bcrypt');
const Shop=require('../models/Shop');
const passport=require('passport');
const auth=require('../config/auth');


router.get('/login',auth.Shop.revauthCheck,(req,res)=>{
  res.render('shop-login');
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/shop/dashboard',
    failureRedirect: '/shop/login',
    failureFlash :true
  })(req, res, next);
});


router.get('/logout',(req,res)=>{
  req.logOut();
  req.flash('success_msg','You are now successfully logout');
  res.redirect('/shop/login');
});

router.get('/signup',auth.Shop.revauthCheck,(req,res)=>{
  res.render('shop-register');
});

router.post('/signup',(req,res)=>{
  const {name,email,pass,re_pass} = req.body;
  const err=[];
  if(!pass || !name || !email || !re_pass){
    err.push('Please fill all the fields');
  }
  if(pass!==re_pass){
    err.push('Password Doesn\'t Match');
  }
  if(pass.length < 6){
    err.push('Password Should be 6 character long');
  }
 
  if(err.length>0){
    res.render('shop-register',{
      name,
      email,
      pass,
      re_pass,
      err
    });
  }else{
    Shop.findOne({email : email}).then((user)=>{
      if(user){
        err.push('Email already registered');
        res.render('shop-register',{
          name,
          email,
          pass,
          re_pass,
          err
        });
      }else{
        const shop=new Shop({
          name : name,
          email : email,
          pass :pass,
        });
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(pass, salt, function(err, hash) { 
              shop.pass=hash;
              shop.save().then((newUser)=>{
                req.flash('success_msg','You are succesfully registered');
                res.redirect('/shop/login');
              }).catch(err=>{
                console.log(err);
              }); 
          });
      });
           
      }
    });
  } 
});

module.exports = router;