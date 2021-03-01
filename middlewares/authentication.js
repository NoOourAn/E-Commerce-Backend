const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    try {
        const signedData = jwt.verify(req.headers.access_token, 'my-signing-secret');
        console.log(signedData);
        req.signedData =  signedData;
        next();
    } catch (err) {
        console.log(req.headers);
        console.error(err);
        res.statusCode = 401;
        res.json({ success: false, message: "Authentication failed" });
    }
}