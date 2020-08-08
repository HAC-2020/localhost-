const router=require('express').Router();
const passport=require('passport');
const User=require('../models/user');

router.get('/google',passport.authenticate('google',{
  scope : ['profile','email']
}));

router.get('/google/redirect',passport.authenticate('google'),(req,res)=>{
  User.findOne({email : req.user.email})
    .then((user)=>{
      if(user){
        res.redirect('/user/dashboard');
        return;
      }
      res.redirect('/user/prof');
    })
});

module.exports = router;