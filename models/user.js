import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  email: {type : String , required : true}, 
  name: {type : String }, 
  username: {type : String , required : true}, 
  role: {type : String , default : 'user', enum: ['user', 'admin']}, 
  
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
