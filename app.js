const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const passport=require('passport');
const mongoose=require('mongoose'); 
const flash=require('connect-flash');
const session=require('express-session');
const passportSet=require('./config/passport-setup');
require('./config/passport-setup-local')(passport);
require('dotenv').config();

mongoose.connect(process.env.MONGO,{
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use(express.static('public'))

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}))

app.use(passport.initialize());
app.use(passport.session());


app.use(flash());

app.use((req,res,next)=>{
  res.locals.success_msg=req.flash('success_msg');
  res.locals.error =req.flash('error');
  res.locals.chat=req.user;
  next();
})

app.use('/auth',require('./routes/auth-routes'));

app.use('/user',require('./routes/user-routes'));

app.get('/',(req,res)=>{
  res.render('shop-contomer');
})

const PORT=process.env.PORT || 4000;

const server=app.listen(PORT,function(){
  console.log(`running on port number ${PORT}`);
});