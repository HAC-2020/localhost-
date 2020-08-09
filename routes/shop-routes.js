const router=require('express').Router();
const bcrypt=require('bcrypt');
const Shop=require('../models/Shop');
const passport=require('passport');
const auth=require('../config/auth');
const Order=require('../models/Order');

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

router.get('/profile-update',auth.Shop.authCheck,(req,res)=>{
  res.render('profileUpdate-shop',{user:req.user});
});

router.post('/profile-update',(req,res)=>{
  const err=[];
  const {password,shopname,area,city,state,image} = req.body;
  if(!password || !shopname || !area || !state || !city){
    err.push('All fields are required');
  }
  if(password.length <6){
    err.push('Password Should be 6 character long');
  }  
  Shop.findOne({shopname})
    .then((user)=>{
      if(user){
        err.push('Shopname is not Available');
      }

      if(err.length>0){
        res.render('profileUpdate-shop',{
          password,
          shopname,
          city,
          state,
          image,
          area,
          err
        });
      }else{
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(password, salt, function(err, hash) { 
              Shop.findOneAndUpdate({email : req.user.email},{$set:{pass : hash,shopname,Area : area,City : city,State:state,image,Updated:true}},{upsert:true,new:true}).then((data)=>{
                 res.redirect('/shop/dashboard');
              }) 
          });
      }); 
      }
    })
})

router.get('/dashboard',auth.Shop.authCheck,(req,res)=>{
  console.log(req.user);
   if(req.user.Updated){
     Order.find({to:req.user.id})
       .then((data)=>{
         res.render('dashboard-shop',{
           user:req.user,
           orders:data
          });
       })
     return;
   }
  res.redirect('/shop/profile-update')
})



router.get('/profile',auth.Shop.authCheck,(req,res)=>{
  res.render('profileUpdate-shop',{user:req.user});
})


router.get('/history',auth.Shop.authCheck,(req,res)=>{
  Order.find({to:req.user.id})
    .then((data)=>{
      res.render('history-shop',{
        data,
        user:req.user
      });
    })
  })

  router.get('/dashboard/:id',auth.Shop.authCheck,(req,res)=>{
    Order.findById(req.params.id)
      .then((data)=>{
        res.render("shop-viewOrder",{
          order:data,
          user : req.user
        });
      })
  })


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