require("dotenv").config();
const mongoose = require('mongoose');
const dns = require("node:dns/promises"); 
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const url = process.env.DATABASE_URL;
mongoose.connect(url).then((result) => {
    console.log('connected to database');
}).catch((err) => {
    console.error('error connecting to database:', err);
});

module.exports = mongoose;