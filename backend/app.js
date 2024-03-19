const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

const app=express();

mongoose.connect('mongodb+srv://balu_soman:wEF2gc0ROsAb3k4w@atlascluster.lfher8k.mongodb.net/instagram?retryWrites=true&w=majority&appName=AtlasCluster', {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log('Connected to database!');
}).catch(()=>{
    console.log('Connection failed!');
} );

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PATCH, DELETE, OPTIONS');
    next();
});

// wEF2gc0ROsAb3k4w

app.post('/api/posts', (req,res,next)=>{
    console.log(req.body);
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    console.log(post);
    post.save();
    res.status(201).json({
        message:'Post added successfully'
    });
});


app.get('/api/posts', (req,res,next)=>{
    Post.find().then(documents=>{
        res.status(200).json({
            message:'Posts fetched successfully!',
            posts: documents
        }); 
    });
})

app.delete('/api/posts/:id',(req,res,next)=>{
    console.log(req.params.id);
    Post.deleteOne({_id:req.params.id}).then(result=>{
        console.log(result);
    });
    res.status(200).json({message:'Post deleted!'});
})

module.exports=app;