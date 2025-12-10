import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  email: {type : String , required : true, unique: true}, 
  name: {type : String , required : true}, 
  role: {type : String , default : 'user', enum: ['user', 'admin']}, 
  image: { type: String },
  
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
