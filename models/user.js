const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username required"],
  },
  password: {
    type: String,
    required: [true, "Password required"],
  },
});

module.exports = mongoose.model("User", userSchema);
