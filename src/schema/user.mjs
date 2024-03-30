import mongoose from "mongoose";

const { Schema, model } = mongoose;
const { String } = mongoose.Schema.Types;

const UsersScema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    notEmpty: true,
  },
});

const User = model("User", UsersScema);
export default User;
