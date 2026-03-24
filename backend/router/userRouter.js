const express = require("express");
const router = express.Router(); 
const Model = require("../models/usermodel");
 

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
module.exports = router;