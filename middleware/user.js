const {User} = require('../db/db');
const {validator} = require ('../utils/helper')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');


// middleware for checking if user already exist
async function userSchemaMiddleware(req, res, next) {
    const {email, password} = req.body;

    // validate user credentials using the helper function
    const validation = validator(email, password);
    if (!validation){
        return res.status(500).json({ message: 'Credentials are not valid' }); 
    }

    try{
        // check if a user with the provided email already exists
        const user = await User.findOne({email:email});
        if(user){
            return res.status(500).json({ message: 'User already exist' });
        } else {
            next();    
        }
    } catch(err){
        console.log(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
    
}

// middleware for authenticating user login
async function userMiddleware(req, res, next) {
    const {email, password} = req.body;

     // validate user credentials using the helper function
    const validation = validator(email, password);
    if (!validation){
        return res.status(500).json({ message: 'Credentials are not valid' });
    }

    try{
        // check if a user with the provided email exists
        const user = await User.findOne({email:email});
        if(!user){
            return res.status(404).json({ message: 'user not found' });
        }

        // compare the provided password with the hashed password in the database
        const match = await bcrypt.compare(password, user.password)

        // if passwords match, generate a JWT token and attach it to the request
        if(match){
            console.log("user authenticated") 
            const token = jwt.sign({ userId: user._id, email: user.email }, process.env.KEY , { expiresIn: '1h' });   
            req.token = token;
            next();
        } else {
            return res.status(500).json({message: 'password is incorrect'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }   
}

module.exports = {
    userMiddleware,
    userSchemaMiddleware
}