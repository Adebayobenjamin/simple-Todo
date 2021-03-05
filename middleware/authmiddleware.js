const jwt = require('jsonwebtoken');
const User = require('../models/user');

const requireAuth = (req, res, next)=>{
    const token = req.cookies.todo;
        jwt.verify(token, 'drell secret', (err, decodedToken)=>{
            if(err){
                res.redirect('/login');
            }else{
                next();
            }
        })
    }


const CheckUser = (req, res, next)=>{
    const token = req.cookies.todo;
   if(token){
    jwt.verify(token, 'drell secret', async(err, decodedToken)=>{
        if(err){
            res.locals.user = null;
            next();
        }else{
          const user = await User.findById(decodedToken.id);
          res.locals.user = user;
          next();
        }
      })
   }else{
       res.locals.user =null;
       next();
   }
}
module.exports ={
    requireAuth,
    CheckUser
}