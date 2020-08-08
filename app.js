const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const passport=require('passport');
const mongoose=require('mongoose'); 
const flash=require('connect-flash');
const session=require('express-session');
const passportSet=require('./config/passport-setup');
require('./config/passport-setup-local')(passport);
const nodemailer=require('nodemailer');
const Order=require('./models/Order');
require('dotenv').config();


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: process.env.EMAIL, 
      pass: process.env.PASSWORD
  }
});

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

app.post('/api/order',(req,res)=>{
  const {orders,to,from} = req.body;
  const mailOptions = {
    from: 'customer.pansari@gmail.com', 
    to: from.email,
    subject: "Order Recieved",
    text: `Dear ${from.name},
           We Have Recieved your order and we are processing it
           Please wait for the order to be confirmed from 
           shop side`
  };
  transporter.sendMail(mailOptions,(err,data)=>{
    if(err){
      console.log(err);
    }else{
      console.log('email sent!!!',data);
    }
  })

  const order=new Order({
    order:orders,
    to:to.id,
    from:from.id,
    fromName: from.name,
    fromLocation: from.location,
    fromEmail:from.email
  })
  order.save().then((data)=>{
    res.send(data);
  })
}) 

const PORT=process.env.PORT || 4000;

const server=app.listen(PORT,function(){
  console.log(`running on port number ${PORT}`);
});