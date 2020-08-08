const passport=require('passport');
const googleStrategy=require('passport-google-oauth20').Strategy;
const keys=require('./keys');
const User=require('../models/user');

passport.serializeUser((user,done)=>{
   done(null,user.id);
});

passport.deserializeUser((id,done)=>{
  User.findById(id).then((user)=>{
    done(null,user);
  })
});

passport.use(new googleStrategy({
  //all google stuff \
  clientID : keys.google.clientID,
  clientSecret : keys.google.clientSecret,
  callbackURL :'/auth/google/redirect',
},(accessToken,refreshToken,profile,done)=>{
  User.findOne({email : profile.emails[0].value}).then((data)=>{
    if(data){
      // console.log('User Already Existed : ' + data);
      done(null,data);
    }else{
      new User({
        googleid : profile.id,
        name : profile.displayName,
        image : profile._json.picture,
        email : profile.emails[0].value,
        Updated : false
      }).save().then((nwUser)=>{
        // console.log('New user registerd : ' + nwUser);
        done(null,nwUser);
      });
    }
  });

 })
);