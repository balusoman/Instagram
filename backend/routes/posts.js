const express = require('express');
const multer = require('multer');
const Post = require('../models/post');
const checkAuth = require('../middleware/check-auth');


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

router.post('',checkAuth,
multer({storage:storage}).single("image"),(req,res,next)=>{
    const url=req.protocol+'://'+req.get('host');
     const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url+'/images/'+req.file.filename,
        creator:req.body.creator
    })
    post.save()
    .then(createdPost=>{
        res.status(201).json({
            message:'Post added successfully',
            post: {
                id: createdPost._id,
                title: createdPost.title,
                content: createdPost.content,
                imagePath: createdPost.imagePath,
                creator: createdPost.creator
            }
        });
    }).catch(error => {
        res.status(500).json({
          message: "Creating a post failed!"
        });
      });
});


router.get('', (req,res,next)=>{
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if(pageSize && currentPage){
        postQuery.skip(pageSize*(currentPage-1)).limit(pageSize);
    }
    postQuery.then(documents=>{
        fetchedPosts = documents;
       return Post.countDocuments();
    }).then(count=>{
        res.status(200).json({
            message:'Posts fetched successfully',
            posts:fetchedPosts,
            maxPosts:count
        })
    }).catch(error=>{
        res.status(500).json({
            message:"Fetching posts failed!"
        });
    })
    })

router.get('/:id',(req,res,next)=>{
    Post.findById(req.params.id).then(post=>{
        if(post){
            res.status(200).json(post);
        }else{
            res.status(404).json({message:'Post not found!'});
        }
    }).catch(error=>{
        res.status(500).json({
            message:"Fetching post failed!"
        });
    })
})

router.put('/:id',checkAuth,
multer({storage:storage}).single("image"),(req,res,next)=>{
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
        imagePath:imagePath,
        creator:req.body.creator
    })
    Post.updateOne({_id:req.params.id , creator: req.body.creator},post).then(result=>{
        console.log(result);
        if(result.modifiedCount>0){
            res.status(200).json({message:'Update successful!',post:post});
    }
    else{
        res.status(401).json({message:'Not authorized!'});
    }
}).catch(error=>{
    res.status(500).json({
        message:"Couldn't update post!"
    });
})
}
)

router.delete('/:id',checkAuth,(req,res,next)=>{
    Post.deleteOne({_id:req.params.id,creator:req.body.creator}).then(result=>{
        console.log(result,"7843683");
        if(result.deletedCount>0){
            res.status(200).json({message:'Deletion successful!'});
            }
            else{
            res.status(401).json({message:'Not authorized!'});
            }
    }).catch(error=>{
        res.status(500).json({
            message:"Deleting post failed!"
        });
    })

})

module.exports = router;
