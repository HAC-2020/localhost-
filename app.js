const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
require('dotenv').config();


mongoose.connect(process.env.MONGO,{
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use(express.static('public'));

app.get('/both',(req,res)=>{
  res.render('shop-contomer');
})

const PORT=process.env.PORT || 4000;

const server=app.listen(PORT,function(){
  console.log(`running on port number ${PORT}`);
});