const jwt=require('jsonwebtoken');
module.exports=(req,res,next)=>{
    const token=req.headers.authorization.split(" ")[1];
    const decodedToken = req.headers.authorization.split(" ")[1];
    try{ 
        req.userData={email:decodedToken.email,userId:decodedToken.userId};
        next();
    }catch(error){
        res.status(401).json({
            message:'You are not authenticated!'
        });
    }
};