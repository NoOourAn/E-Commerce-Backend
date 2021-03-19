const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user')
const authenticationMiddleware = require('../middlewares/authentication');
const userRouter = new express.Router();

userRouter.get('/getUsers', async(req, res) => {
    try {
        const users = await User.find({}); // just to get all users for me to test
        const obj = {
            success: true,
            users: users
        }
        res.send(obj);
    } catch (err) {
        res.json({ statusCode: 422 ,success: false, message: err.message });

    }
})

userRouter.post('/reg', async(req, res) => { // the registration router
    try {
        const { username, email, password } = req.body;
        const hash = await bcrypt.hash(password, 7); // to hash the password
        const user = await User.create({ username, email, password: hash })
        res.statusCode = 201;
        res.send({ success: true, user: user });
    } catch (err) {
        res.json({ statusCode: 422 ,success: false, message: "Duplicated User" });
    }
})

userRouter.post('/login', async(req, res) => { // the login router
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username }).exec();
        if (!user) throw new Error("wrong username or password");
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("wrong username or password");
        const token = jwt.sign({ id: user.id }, 'my-signing-secret');
        res.json({ success: true, token });
    } catch (err) {
        res.json({ statusCode: 422 ,success: false, message: "username or password is invalid" });

    }
});
//-----------------------------------------------------------------------------------

userRouter.use(authenticationMiddleware) // this will make only the logged user to use the below functions

userRouter.get('/myProfile', async(req, res) => { // will show the info of my profile
    try {
        const user = await User.findOne({ _id: req.signedData.id }, { password: 0 }); // password=0 means dont show it to me
        const obj = {
            success: true,
            user: user
        }
        res.send(obj);
    } catch (err) {
        res.json({ statusCode: 404 ,success: false, message: err.message });

    }
})

userRouter.patch('/profileUpdate', async(req, res) => { // update router for user
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

userRouter.delete('/profileDelete', async(req, res) => {
    try { // this router will delete the user profile and its data
        const userById = await User.findById(req.signedData.id);
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