const express = require('express');
const multer = require('multer');
const Post = require('../models/post');


const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg'
}
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'backend/images');
    },
    filename:(req,file,cb)=>{
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null,name+'-'+Date.now()+'.'+ext);
    }
})

router.post('',multer({storage:storage}).single("image"),(req,res,next)=>{
    const url=req.protocol+'://'+req.get('host');
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url+'/images/'+req.file.filename
    });
    post.save().then(createdPost=>{
        res.status(201).json({
            message:'Post added successfully',
            post: {
                id: createdPost._id,
                title: createdPost.title,
                content: createdPost.content,
                imagePath: createdPost.imagePath
            }
        });
    });
});


router.get('', (req,res,next)=>{
    Post.find().then(documents=>{
        res.status(200).json({
            message:'Posts fetched successfully!',
            posts: documents
        }); 
    });
})

router.get('/:id',(req,res,next)=>{
    Post.findById(req.params.id).then(post=>{
        if(post){
            res.status(200).json(post);
        }else{
            res.status(404).json({message:'Post not found!'});
        }
    })
})

router.put('/:id',multer({storage:storage}).single("image"),(req,res,next)=>{
    let imagePath
    if(req.file){
        const url=req.protocol+'://'+req.get('host');
        imagePath = url+'/images/'+req.file.filename;
    }else{
        imagePath = req.body.imagePath;
    }
    const post = new Post({
        _id:req.body.id,
        title:req.body.title,
        content:req.body.content,
        imagePath:imagePath
    })
    Post.updateOne({_id:req.params.id},post).then(result=>{
        console.log(result);
        res.status(200).json({message:'Update successful!',post:post});
    });
})

router.delete('/:id',(req,res,next)=>{
    console.log(req.params.id);
    Post.deleteOne({_id:req.params.id}).then(result=>{
        console.log(result);
    });
    res.status(200).json({message:'Post deleted!'});
})

module.exports = router;
