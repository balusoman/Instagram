const express = require('express');
const userController = require('../controllers/user');


const router = express.Router();

router.post('/signup',userController.createUser);

// router.post('/login', (req, res, next) => {
//     let fetchedUser;
//     User.findOne({email:req.body.email}).then(user=>{
//         if(!user){
//             return res.status(401).json({
//                 message:'Email Authentication failed!'
//             });
//         }
//         fetchedUser=user;
//         return bcrypt.compare(req.body.password, user.password);
//     }).then(result=>{
//         if(!result){
//             return res.status(401).json({
//                 message:'Authentication failed!'
//             });
//         }

//         const token = jwt.sign({email:fetchedUser.email, userId:fetchedUser._id},
//             'secrete_this_should_be_shorter',
//             {expiresIn:'1h'});

//             res.status(200).json({
//             token:token,
//             expiresIn:3600,
//             userId:fetchedUser._id
//         })
//     })
//     .catch(err=>{
//         return res.status(401).json({
//             message:'Invalid authentication credentials!'
//         });
//     });
// })

router.post('/login',userController.userLogin)



module.exports = router;