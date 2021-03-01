const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user')
const authenticationMiddleware = require('../middlewares/authentication');
const userRouter = new express.Router();

userRouter.get('/getUsers',async(req,res)=>{
    try{
        const users = await User.find({});  // just to get all users for me to test
        res.send(users)
    }
    catch(err){
        console.error(err);
        res.statusCode = 422;
        res.json({ success: false, message: err.message });n
    }
})

userRouter.post('/reg'  , async (req,res)=>{                    // the registration router
    try{
        const {username, email , password } = req.body;
        const hash = await bcrypt.hash(password,7); // to hash the password
        const user = await User.create({username, email ,password:hash })
        res.statusCode = 201;
        res.send(user);
    }
    catch(err){
        console.error(err);
        res.statusCode = 422;
        res.json({ success: false, message: err.message });
    }
})

userRouter.post('/login'  , async (req,res)=>{      // the login router
    try {
    const {username, password} = req.body;
    const user = await User.findOne({ username }).exec(); 
    if(!user) throw new Error("wrong username or password");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("wrong username or password");
    const token = jwt.sign({ id: user.id }, 'my-signing-secret');
    res.json({ token });
} catch (err) {
    console.error(err);
    res.statusCode = 422;
    res.json({success: false, message: err.message});
}
});
//-----------------------------------------------------------------------------------

userRouter.use(authenticationMiddleware)   // this will make only the logged user to use the below functions

userRouter.get('/myProfile' , async (req, res) => { // will show the info of my profile
    try{
        const user = await User.findOne({ _id: req.signedData.id }, { password: 0 }); // password=0 means dont show it to me
        res.send(user);
    }
    catch(err){
        console.error(err);
        res.statusCode = 404;
        res.json({success: false, message: err.message});
    }
})

userRouter.patch('/profileUpdate' , async (req, res) => {   // update router for user
try{
    const {username,email} = req.body;
    const user = await User.updateOne({ _id: req.signedData.id },{$set: {username:username,email:email}} );
    res.send(user);
}
catch(err){
    console.error(err);
    res.json({success: false, message: err.message});
}
})

userRouter.delete('/profileDelete' , async (req, res) => {
    try{                                                                // this router will delete the user profile and its data
        const userById = await User.findById(req.signedData.id);
        const user = await User.deleteOne({ _id: req.signedData.id } );   //delete the user it self
        res.send(user);
    }
    catch(err){
        console.error(err);
        res.json({success: false, message: err.message});
    }
    })

module.exports = userRouter;