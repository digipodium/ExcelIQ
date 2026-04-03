const express = require("express");
const router = express.Router(); 
const Model = require("../models/usermodel");
const jwt = require("jsonwebtoken");
const userAuth = require("../middlewares/auth");
require("dotenv").config();

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
module.exports = router;