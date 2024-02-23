import { Schema, model } from "mongoose";

const treeSchema = new Schema({
  number: Number,
  left: Number,
  right: Number
}, {
  versionKey: false
});

export default model("Tree", treeSchema);