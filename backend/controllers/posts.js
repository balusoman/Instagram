const Post = require('../models/post');


exports.createPost = (req,res,next)=>{
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
}


exports.updatePost = (req,res,next)=>{
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
        if(result.matchedCount>0){
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

exports.getPosts =  (req,res,next)=>{
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
    }

exports.getPost = (req,res,next)=>{
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
}

exports.deletePost = (req,res,next)=>{
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

}