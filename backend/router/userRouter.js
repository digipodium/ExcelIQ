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
router.get('/getall',  (req, res) => {
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
router.post('/authenticate',(req,res)=>{
 const {email, password } = req.body;
  Model.findOne({ email, password })
  .then((result) => {

    if (result){
      const { _id, email} = result;

      jwt.sign({_id, email },
        process.env.JWT_SECRET,
        {expiresIn: '6d'},
        (err, token) => { 
          if(err){
            console.log(err);
            res.status(500).json({message: 'error creating token'})
          } else{
            res.status(201).json({ token })
          }
        }

      )
    }else{
      res.status(403).json({message:'credentials Invalid'});
    }

  }).catch((err) => {
    console.log(err);
    req.status(500).json(err);
  });

});

const nodemailer = require("nodemailer");

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Model.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 3600000;

    await user.save();

    const resetLink = `http://localhost:3000/reset-password/${token}`;

    // email sender
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "exceliqsecurity@gmail.com",
        pass: "saoj sswq vgzk hmbz",
      },
    });

    await transporter.sendMail({
      from: "ExcelIQ security ",
      to: email,
      subject: "Reset your password",
      html: `
        <h3>Reset Password</h3>
        <p>Click below link to reset password</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    });

    res.json({ message: "Reset link sent to email" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// reset password
router.post("/user/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await Model.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;