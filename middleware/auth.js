const {User} = require('../db/db');
const jwt = require('jsonwebtoken')

// middleware for handling authtentication requests
async function authMiddleware(req, res, next) {
    const token = req.header("Authorization");

    // check if the token is missing
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized - Missing token' });
    }

    try {
        // verify the token
        const decoded = jwt.verify(token, process.env.KEY);

        // check the validity of the decoded payload
        const user = await User.findOne({ email: decoded.email});
        if (user._id == decoded.userId) {
            console.log("user authenticated");

            // attach the user information to the request for future middleware or route handlers
            req.user = user;
            next();
        } else{
            console.error('Invalid user information in the token');
            return res.status(401).json({ message: 'Unauthorized - Invalid token' });
        }

        if (!user) {
            console.error('Invalid user information in the token');
            return res.status(401).json({ message: 'Unauthorized - Invalid token' });
        }
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }
}

module.exports = authMiddleware;