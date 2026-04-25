const express = require("express");
const router = express.Router();
const Model = require("../models/usermodel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userAuth = require("../middlewares/auth");
require("dotenv").config();
const crypto = require("crypto");

//new route to add data to the database
router.post("/add", async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    if (!password) return res.status(400).json({ message: "Password is required" });

    // Hash password with 10 salt rounds
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await new Model({ ...rest, password: hashedPassword }).save();
    res.status(200).json(result);
  } catch (err) {
    console.error('error saving data:', err);
    if (err.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }
    res.status(500).json(err);
  }
});

//getall
router.get('/getall', (req, res) => {
  Model.find().then((result) => {
    res.status(200).json(result);
  }).catch((err) => {
    console.log(err);
    res.status(500).json(err);
  });
});

//delete
router.delete('/delete/:id', (req, res) => {
  Model.findByIdAndDelete(req.params.id).then((result) => {
    res.status(200).json(result);
  }).catch((err) => {
    console.log(err);
    res.status(500).json(err);
  });
});

//update
router.put('/update/:id', async (req, res) => {
  try {
    const updateData = { ...req.body };

    // If password is being updated, hash it first
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const result = await Model.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//Authenticate

router.post('/authenticate', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email only (not password — we'll compare hash)
    const user = await Model.findOne({ email });
    if (!user) {
      return res.status(403).json({ message: 'credentials Invalid' });
    }

    // Compare plain password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(403).json({ message: 'credentials Invalid' });
    }

    // Generate JWT with role
    const { _id, role } = user;
    const token = jwt.sign(
      { _id, email: user.email, role },
      process.env.JWT_SECRET,
      { expiresIn: '6d' }
    );

    res.status(201).json({ token, role });
  } catch (err) {
    console.error('Auth error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

const nodemailer = require("nodemailer");


// ================= FORGOT PASSWORD (SEND OTP) =================
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Model.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = otp;
    user.otpExpire = Date.now() + 5 * 60 * 1000; // 5 min

    await user.save();

    // email sender
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "exceliqsecurity@gmail.com",
        pass: "saoj sswq vgzk hmbz",
      },
    });

    await transporter.sendMail({
      from: "ExcelIQ Security",
      to: email,
      subject: "Password Reset OTP",
      html: `
        <h2>Password Reset OTP</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP will expire in 5 minutes</p>
      `,
    });

    res.json({ message: "OTP sent to your email" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});



// ================= RESET PASSWORD USING OTP =================
router.post("/reset-password-otp", async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const user = await Model.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpire < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Hash new password before saving
    user.password = await bcrypt.hash(password, 10);
    user.resetOtp = undefined;
    user.otpExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
// ================= VERIFY OTP ONLY =================
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await Model.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpire < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    res.status(200).json({
      success: true,
      message: "OTP verified successfully"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;