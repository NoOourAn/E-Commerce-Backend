const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user')
const authenticationMiddleware = require('../middlewares/authentication');
const userRouter = new express.Router();
var multer = require('multer');
const multerS3 = require('multer-s3');
const fs = require('fs');
const AWS = require('aws-sdk');


//// AWS config
// Enter copied or downloaded access ID and secret key here
const ID = process.env.AWS_accessKeyId;
const SECRET = process.env.AWS_secretAccessKey;

// The name of the bucket that you have created
const BUCKET_NAME = process.env.BUCKET_NAME;

// initialize the S3 interface
const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

///// to upload to AWS S3 
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: BUCKET_NAME,
        acl: 'public-read',
        cacheControl: 'max-age=31536000',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            //const key = `user-profile-images/${process.env.NODE_ENV}_${Date.now().toString()}${path.extname(file.originalname)}`
            var filetype = '';
            if (file.mimetype === 'image/gif') {
                filetype = 'gif';
            }
            if (file.mimetype === 'image/png') {
                filetype = 'png';
            }
            if (file.mimetype === 'image/jpeg') {
                filetype = 'jpg';
            }
            const key = 'image-' + Date.now() + '.' + filetype;
            cb(null, key);
        }
    }),
});



///admin can get all users
userRouter.get('/getUsers', async (req, res) => {
    try {
        const users = await User.find({});
        const obj = {
            success: true,
            users: users
        }
        res.send(obj);
    } catch (err) {
        res.json({ statusCode: 422, success: false, message: err.message });

    }
})

userRouter.post('/reg', upload.single('file'), async (req, res) => { // the registration router
    try {
        const { username, email, password } = req.body;
        if (username && email && password) {
            if (req.file) {
                //for mongo database      
                req.body.imgUrl = req.file.location;
                req.body.imgName = req.file.key;
            }
            const hash = await bcrypt.hash(password, 7); // to hash the password
            req.body.password = hash
            const user = await User.create(req.body)
            console.log(user)
            const obj = {
                success: true,
                message: "you registered succesfully",
                user: user
            }
            res.send(obj)
        } else throw new Error("username , email , password are required")
    } catch (err) {
        res.json({ statusCode: 422, success: false, message: "Duplicated User" });
    }
})

userRouter.post('/login', async (req, res) => { // the login router
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username }).exec();
        if (!user) throw new Error("wrong username or password");
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("wrong username or password");
        const token = jwt.sign({ id: user.id }, process.env.SecretKey);
        res.json({ success: true, token, user });
    } catch (err) {
        console.log(err.message)
        res.json({ statusCode: 422, success: false, message: "username or password is invalid" });

    }
});
//-----------------------------------------------------------------------------------

userRouter.use(authenticationMiddleware) // this will make only the logged user to use the below functions

userRouter.get('/myProfile', async (req, res) => { // will show the info of my profile
    try {
        const user = await User.findOne({ _id: req.signedData.id }, { password: 0 }); // password=0 means dont show it to me
        const obj = {
            success: true,
            user: user
        }
        res.send(obj);
    } catch (err) {
        res.json({ statusCode: 404, success: false, message: err.message });

    }
})

/////update profile data
userRouter.patch('/profileUpdate', async (req, res) => { // update router for user
    try {
        const { username, email } = req.body;
        const user = await User.updateOne({ _id: req.signedData.id }, { $set: { username: username, email: email } });

        const obj = {
            success: true,
            message: "profile was edited succesfully",
            user: user
        }
        res.send(obj);
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: err.message });
    }
})
/////////update profile img
userRouter.patch('/imgUpdate', upload.single('file'), async (req, res) => { // update image router for user
    try {
        if (req.file) {
            //for mongo database      
            req.body.imgUrl = req.file.location;
            req.body.imgName = req.file.key;
            // const user = await User.findByIdAndUpdate(req.signedData.id , { imgUrl:req.body.imgUrl,imgName:req.body.imgName  }, { returnOriginal: true })
            const user = await User.updateOne({ _id: req.signedData.id }, { $set: { imgUrl: req.body.imgUrl, imgName: req.body.imgName } });
        }
        const obj = {
            success: true,
            message: "image was changed succesfully",
            user: user
        }
        res.send(obj);
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: err.message });
    }
})

userRouter.delete('/profileDelete', async (req, res) => {
    try { // this router will delete the user profile and its data
        const user = await User.deleteOne({ _id: req.signedData.id }); //delete the user it self
        const obj = {
            success: true,
            message: (user) ? "user deleted successfully" : "user not found"
        }
        res.send(obj);
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: err.message });
    }
})

module.exports = userRouter;