const express=require('express');
const app=express();
const mongoose=require('mongoose'); 
const bodyParser=require('body-parser');
require('dotenv').config();z

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

const PORT=process.env.PORT || 5000;

const server=app.listen(PORT,function(){
  console.log(`running on port number ${PORT}`);
});