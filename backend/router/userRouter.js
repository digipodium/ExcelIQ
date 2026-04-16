const express = require("express");
const router = express.Router();
const Model = require("../models/usermodel");
const jwt = require("jsonwebtoken");
const userAuth = require("../middlewares/auth");
require("dotenv").config();
const crypto = require("crypto");

//new route to add data to the database
router.post("/add", (req, res) => {
  console.log(req.body);

  new Model(req.body).save().then((result) => {
    res.status(200).json(result);
  }).catch((err) => {
    console.error('error saving data:', err);
    res.status(500).json(err);
  });
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
router.put('/update/:id', (req, res) => {
  Model.findByIdAndUpdate(req.params.id, req.body).then((result) => {
    res.status(200).json(result);
  }).catch((err) => {
    console.log(err);
    res.status(500).json(err);
  });
});

//Authenticate

router.post('/authenticate', (req, res) => {
  const { email, password } = req.body;
  Model.findOne({ email, password })
    .then((result) => {
      if (result) {
        // 1. Include "role" in the destructuring
        const { _id, email, role } = result;

        // 2. Add "role" to the JWT payload
        jwt.sign({ _id, email, role },
          process.env.JWT_SECRET,
          { expiresIn: '6d' },
          (err, token) => {
            if (err) {
              console.log(err);
              res.status(500).json({ message: 'error creating token' });
            } else {
              // 3. Return both token AND role to the frontend for immediate use
              res.status(201).json({ token, role });
            }
          }
        );
      } else {
        res.status(403).json({ message: 'credentials Invalid' });
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
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

    // update password
    user.password = password;
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