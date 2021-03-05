const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email:{
        type: String,
        required: [true, "an email is required"],
        validate: [isEmail, 'invalid email'],
        lowercase: true,
        unique: true
    },
    password:{
        type: String,
        required: [true, "password is required"],
        minlength: [6, "passwords should have atleast 6 characters"],
        
    }
});

// login

UserSchema.statics.login = async function(email, password){
    const user = await this.findOne({email});
    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }else{
            throw Error('incorrect password')
        }

    }else{
        throw Error("incorrect email")
    }
}
// hash password before saving user
UserSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('user', UserSchema);
module.exports = User;