const passport=require('passport');
const googleStrategy=require('passport-google-oauth20').Strategy;
const keys=require('./keys');
const Shop=require('../models/Shop');

passport.serializeUser((user,done)=>{
   done(null,user.id);
});

passport.deserializeUser((id,done)=>{
  Shop.findById(id).then((user)=>{
    done(null,user);
  })
});

passport.use(new googleStrategy({
  //all google stuff \
  clientID : keys.google.clientID,
  clientSecret : keys.google.clientSecret,
  callbackURL :'/auth/google/redirect',
},(accessToken,refreshToken,profile,done)=>{
  Shop.findOne({googleid : profile.id}).then((data)=>{
    if(data){
      // console.log('User Already Existed : ' + data);
      done(null,data);
    }else{
      new Shop({
        googleid : profile.id,
        name : profile.displayName,
        image : profile._json.picture,
        email : profile.emails[0].value
      }).save().then((nwUser)=>{
        // console.log('New user registerd : ' + nwUser);
        done(null,nwUser);
      });
    }
  });

 })
);