const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
         username: {    type: String,
                        min: 3,
                        max: 30,
                        lowercase: true,
                        unique: true,
                        required: [true, "can't be blank"],
                        match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
                        index: true
                    },
        password:{
            type: String,
            required: true
        },
        email: {    type: String,
                    lowercase: true,
                    unique: true,
                    required: [true, "can't be blank"], 
                    match: [/\S+@\S+\.\S+/, 'is invalid'], 
                    index: true
                },
}
, {timestamps: true}
)

const User = mongoose.model('User', UserSchema);
module.exports = User;
