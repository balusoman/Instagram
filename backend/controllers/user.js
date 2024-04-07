const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


exports.createUser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(hash=>{
        console.log(hash)
        const user= new User({
            email:req.body.email,
            password: hash
         });
         console.log(user);
         user.save().then(result=>{
                res.status(201).json({
                    message:'User created!',
                    result:result
                });
         }).catch(err=>{
             res.status(500).json({ 
                        message:'Invalid authentication credentials!',
                        error:err
                 
             });
         });

    })
}

exports.userLogin =  async (req, res, next) => {
    try {
        // Find the user in the database
        const user = await User.findOne({ email: req.body.email });

        // If user doesn't exist, return authentication failure message
        if (!user) {
            return res.status(401).json({
                message: 'Email Authentication failed!'
            });
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);

        // If passwords don't match, return authentication failure message
        if (!passwordMatch) {
            return res.status(401).json({
                message: 'Authentication failed!'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { email: user.email, userId: user._id },
            process.env.JWT_KEY,
            { expiresIn: '1h' }
        );

        // Send the token and user ID in response
        res.status(200).json({
            token: token,
            expiresIn: 3600,
            userId: user._id
        });
    } catch (error) {
        // Handle any errors and return appropriate message
        console.error(error); // Log the error for debugging
        return res.status(401).json({
            message: 'Invalid authentication credentials!'
        });
    }
}