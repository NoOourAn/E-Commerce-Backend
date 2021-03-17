const jwt = require('jsonwebtoken');
const User = require('../models/user')


module.exports = async(req, res, next) => {
    try {
        const signedData = jwt.verify(req.headers.access_token, 'my-signing-secret');
        const user = await User.findById(signedData.id)
        console.log(user.username);
        if (user.username == "admin") {
            req.type = "admin"
        } else {
            req.type = "user"
        }
        console.log(signedData);
        req.signedData = signedData;
        next();
    } catch (err) {
        console.log(req.headers);
        console.error(err);
        res.statusCode = 401;
        res.json({ success: false, message: "Authentication failed" });
    }
}