const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      //   unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    salutation: { type: String },
    isd: { type: Object },

    otp: {type : String} ,
    otpExpiry: { type: Date },
    otpRetryCount: { type: Number, default: 0 }, // Tracks OTP resend attempts

    isVerified: {type : Boolean , default: false}
  },

  {
    timestamps: true,
  }
);

let User = mongoose.model("User", userSchema);
module.exports = User;
