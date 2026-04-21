import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  // basic info 
  email: {type : String , required : true, unique: true}, 
  name: {type : String , required : true}, 
  role: {type : String , default : 'user', enum: ['user', 'admin']}, 
  image: { type: String },

  // User institute info
  university: { type: String, default: null },
  program: { type: String, default: null },
  specialization: { type: String, default: null },
  semester: { type: Number, default: null },
  createdAt: { type: Date, default: Date.now },
  
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
