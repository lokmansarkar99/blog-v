const mongoose = require('mongoose');


const { Schema, model } = mongoose;

// Define the schema
const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String },
    posts: { type: Number, default: 0 },
  },
  { timestamps: true }
); // Adding timestamps for createdAt and updatedAt

// Create and export the model
const User = model('User', userSchema);
module.exports = User;
