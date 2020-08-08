const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const shopSchema= new Schema({
  name :String,
  email : String,
  pass : String,
  date :{
    type : Date, 
    default : Date.now
  },
  googleid : String,
  shopname : String,
  image : {
    type : String,
    default:" https://dl.dropboxusercontent.com/s/xe13w1ost241oyi/42.jpeg?dl=0",
  },
  Updated:String,
  City :String,
  State : String,
  Area : String,
});

const Shop=mongoose.model('shop',shopSchema);

module.exports = Shop;