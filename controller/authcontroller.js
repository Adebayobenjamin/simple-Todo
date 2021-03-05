const User = require('../models/user');
const jwt = require('jsonwebtoken');

const maxAge = 3* 60*60*24

const CreateToken=(id)=>{
   return jwt.sign({id}, 'drell secret', {expiresIn: maxAge});
}

const handleErrors = (err) =>{
const errors = {email: '', password: ''}
    if(err.message === 'incorrect email'){
        errors.email= "your email is incorrect"
        return errors
    }
    if(err.message === 'incorrect password'){
        errors.password= "your password is incorrect"
        return errors
    }
    // user validation error
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path] = properties.message;
            return errors
        });

    }

    // duplicate key error
    if(err.code === 11000){
        errors.email = 'that email is already reistered';
        return errors;
    }
   return errors
}

module.exports.signup_get = (req, res)=>{
    res.render('signup')
}

module.exports.signup_post = (req, res)=>{
   const user = new User(req.body);
   user.save().then(result=>{
       const token = CreateToken(user._id);
       res.cookie('todo', token, {httpOnly: true, maxAge: maxAge*1000})
       res.status(201).json({user})
   }).catch(err=>{
       const errors = handleErrors(err);
       console.log(errors);
       res.status(400).json({errors})
   })
}
module.exports.login_get = (req, res)=>{
    res.render('login')
}
module.exports.login_post = async (req, res)=>{
    const {email, password} = req.body;
    try {
        const user = await User.login(email, password);
        const token = CreateToken(user._id);
        res.cookie('todo', token, {httpOnly: true, maxAge: maxAge * 1000});
        res.status(201).json({user})
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
        console.log(err.message)
    }
}
module.exports.logout_get = (req, res)=>{
    res.cookie('todo', null, {httpOnly: true, maxAge: 1});
    res.redirect('/login');
}