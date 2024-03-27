const path=require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');


const app=express();

mongoose.connect('mongodb+srv://balu_soman:wEF2gc0ROsAb3k4w@atlascluster.lfher8k.mongodb.net/instagram?retryWrites=true&w=majority&appName=AtlasCluster', {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log('Connected to database!');
}).catch(()=>{
    console.log('Connection failed!');
} );

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/images',express.static(path.join('backend/images')));

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods','GET, POST,PUT,PATCH, DELETE, OPTIONS');
    next();
});

app.use('/api/posts',postsRoutes);
// wEF2gc0ROsAb3k4w


module.exports=app;