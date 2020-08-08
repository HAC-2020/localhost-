const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const userSchema= new Schema({
  name :String,
  email : String,
  pass : String,
  date :{
    type : Date, 
    default : Date.now
  },
  googleid : String,
  image : {
    type:String,
    default: "https://dl.dropboxusercontent.com/s/gh4dfzfxcqbz6pl/43.jpeg?dl=0"
  },
  username:String,
  City :String,
  State : String,
  Area : String,
  Updated : {
    type:Boolean,
    default: false
  }
});

const User=mongoose.model('user',userSchema);

module.exports = User;