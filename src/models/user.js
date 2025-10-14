//import Joi from 'joi';
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
},
  {
   versionKey: false,
    timestamps: true, // createdAt та updatedAt
  },
);

userSchema.methods.toJSON = function() {
  const obj  = this.toObject();
  delete obj.password; // Видаляємо поле password
  return obj;
}

export const User = mongoose.model('User', userSchema, "UsersCollection");
