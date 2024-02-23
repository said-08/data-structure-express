import { Schema, model } from "mongoose";

const userSchema = new Schema({
  first_name: String,
  last_name: String,
  edad: Number,
  email: String,
  empresa: String,
}, {
  versionKey: false
});

export default model("User", userSchema);