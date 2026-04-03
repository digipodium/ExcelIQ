const jwt = require('jsonwebtoken');
require('dotenv').config();

const userAuth = (req, res, next) => {

    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        console.log('token missing');
        return res.status(401).json({ message: 'token missing' });
    } 
    else {
        jwt.verify(token, process.env.JWT_SECRET,
            (err, payload) => {
                if (err) {
                    console.log(err);
                    return res.status(403).json(err);
                } else {
                    req.user = payload;
                    next();
                }
            });
    }
}
module.exports = userAuth;