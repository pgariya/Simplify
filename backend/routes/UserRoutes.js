var express = require("express");
const User = require("../model/UserModel");

const UserRouter = express.Router();

UserRouter.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving users" });
  }
});

UserRouter.post("/send-otp", async (req, res) => {
  try {
    const { name, email, mobile, salutation, isd } = req.body;

    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      return res.status(404).json({ message: "User already exists" });
    }

    if (user && user.isVerified == false) {
      const otp = mobile.toString().slice(-6);
      const otpExpiry = Date.now() + 5 * 60 * 1000;

      user.name = name;
      user.email = email;
      user.mobile = mobile;
      user.salutation = salutation.label;
      user.isd = isd;
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      user.otpRetryCount = 0;

      await user.save();

      return res.status(200).json({ message: "OTP sent successfully" });
    }

    // const otp = generateOtp();
    // Generate OTP ( last 6 digits of mobile)
    const otp = mobile.toString().slice(-6);
    const otpExpiry = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes

    user = new User({
      name,
      email,
      mobile,
      salutation: salutation.label,
      isd,

      otp,
      otpExpiry: otpExpiry,
      otpRetryCount: 0,
      isVerified: false,
    });

    await user.save();
    // sendOtpEmail(user.email, otp);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending OTP" });
  }
});

UserRouter.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otpRetryCount >= 5) {
      return res.status(429).json({
        message: "Maximum OTP retries reached. Please try again later.",
      });
    }

    if (user.otp !== otp) {
      user.otpRetryCount += 1; // Increment retry count
      await user.save();
      return res.status(400).json({ message: "Invalid OTP" });
    } else if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Expired OTP" });
    }

    // OTP is correct
    user.otp = null;
    user.otpExpiry = null;
    user.otpRetryCount = 0;
    user.isVerified = true;

    await user.save();

    res.status(200).json({ message: "Successfully Registered" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error in verifying OTP" });
  }
});

UserRouter.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otpRetryCount >= 5) {
      return res.status(429).json({
        message: "Maximum OTP retries reached. Please try again later.",
      });
    }

    console.log(user,"user")
    // const otp = generateOtp();
    const otp = user?.mobile?.toString().slice(-6);
    const otpExpiry = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // sendOtpEmail(user.email, otp);

    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error resending OTP" });
  }
});

module.exports = UserRouter;
