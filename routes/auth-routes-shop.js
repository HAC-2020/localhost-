const router=require('express').Router();
const passport=require('passport');
const Shop=require('../models/Shop');

router.get('/google',passport.authenticate('google',{
  scope : ['profile','email']
}));

router.get('/google/redirect',passport.authenticate('google'),(req,res)=>{
  console.log(req.user);
  Shop.findOne({email : req.user.email})
    .then((user)=>{
      if(user){
        res.redirect('/shop/dashboard');
        return;
      }
      res.redirect('/shop/profile');
    })
});

module.exports = router;