const express=require('express');
const app=express();
const passport=require('passport');
const mongoose=require('mongoose'); 
const flash=require('connect-flash');
const session=require('express-session');
const auth=require('./config/auth');
const passportSetup = require('./config/passport-setup-shop');
const Shop=require('./models/Shop');
const nodemailer=require('nodemailer');
const Order=require('./models/Order');
require('./config/passport-setup-shop-local')(passport);
const bodyParser=require('body-parser');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: process.env.EMAIL, 
      pass: process.env.PASSWORD
  }
});


app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json());


mongoose.connect(process.env.MONGO,{
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.set('view engine','ejs');

app.use(express.urlencoded({extended:false}));

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


app.use('/auth',require('./routes/auth-routes-shop'));

app.use('/shop',require('./routes/shop-routes'));


app.delete('/api/order/:id',(req,res)=>{
  console.log(req.params.id);
  Order.findById(req.params.id).then((data)=>{ 
    const mailOptions = {
      from: 'customer.pansari@gmail.com', 
      to: data.fromEmail,
      subject: "Order Declined",
      text: `Dear ${data.fromName} ,
        Your order has been declined , sorry for the inconvinence , Try again after some time`
    };
    transporter.sendMail(mailOptions,(err,data)=>{
      if(err){
        console.log(err);
      }else{
        console.log('email sent!!!',data);
      }
    })
    data.remove();
    res.json("Order Deleted");
  }).catch((err)=>{
    throw err;
  })
})

app.put('/api/order/:id',(req,res)=>{
  console.log(req.body);
  Order.findOneAndUpdate({_id : req.params.id},{$set:{orderCompleted : true}},{upsert:true,new:true}).then((data)=>{
    res.json('data Updates Successfully');
    const mailOptions = {
      from: 'customer.pansari@gmail.com', 
      to: data.fromEmail,
      subject: "Order Delevered",
      text: `Thanks ${data.fromName} ,
        For Using Our Platform
        regards
        Pansari Team`
    };
    transporter.sendMail(mailOptions,(err,data)=>{
      if(err){
        console.log(err);
      }else{
        console.log('email sent!!!',data);
      }
    })
  })
})

app.post('/api/order/:id',(req,res)=>{
  console.log(req.body);
  const { time,email } =req.body;
  console.log(time,email);
  res.json('Time allotted');
  const mailOptions = {
    from: 'customer.pansari@gmail.com', 
    to: email,
    subject: "Order Accepted",
    text: ` Your Order Has Been Accepted 
    and we alloted you a time slot of ${time}
    and be carefully and wear mask always and 
    please be on time else  your order get cancelled`
  };
  transporter.sendMail(mailOptions,(err,data)=>{
    if(err){
      console.log(err);
    }else{
      console.log('email sent!!!',data);
    }
  })
})








const PORT=process.env.PORT || 5000;

const server=app.listen(PORT,function(){
  console.log(`running on port number ${PORT}`);
});