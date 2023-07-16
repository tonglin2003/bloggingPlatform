const express = require("express");
const app = express();
const port = 4000
const bcrypt = require("bcryptjs");
const { Op } = require('sequelize');
const session = require("express-session");
require("dotenv").config();

const { Posts, Users, Comments } = require('./models');

app.use((req, res, next)=>{
    res.on("finish", ()=>{
        console.log(`${req.method} ${req.originalUrl} ${req.statusCode}`);
    });
    next();
});

app.use(express.json());

// session building
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 3600000
        },
    })
);

// autheticator to state the user must be signed in to do an action
const autheticateUser = (req, res, next) => {
    if (!req.session.userId){
        return res
            .status(401)
            .json({ message: "You must be logged in to view this page"});
    }
    next();
};

app.get('/', (req, res)=>{
    res.send("hello");
});

// get all post
app.get('/posts', autheticateUser, async (req,res)=>{
    try{
        const allPosts = await Posts.findAll();
        res.status(200).json(allPosts);
    } catch(err) {
        console.error(err);
        res.status(500).send({message: err.message});
    }
})

// get post based on id
app.get('/posts/:postId', autheticateUser, async (req,res)=>{
    const postId = parseInt(req.params.postId,10);
    try{
        const post = await Posts.findOne({where: {id: postId}});

        if (post) {
            res.status(200).json(post);
          } else {
            res.status(404).send({ message: "post not found" });
          }
    } catch(err) {
        console.error(err);
        res.status(500).send({message: err.message});
    }
})

// post a new post
app.post('/posts', autheticateUser, async (req,res)=>{
    try{
        const post = await Posts.create({
            postTitle: req.body.postTitle,
            postContent:req.body.postContent,
            postImgUrl: req.body.postImgUrl,
            UserId: req.session.userId
        });
        res.status(200).json({
            message: "Post Created",
            postTile: post.postTitle
        })
    } catch(err) {
        console.error(err);
        res.status(500).send({message: err.message});
    }
})

// updated an postId
app.patch('/posts/:postId', autheticateUser, async (req,res)=>{
    const postId = parseInt(req.params.postId,10);
    try{
        const record = await Posts.findOne({where: {id: postId}});

        if (record && record.UserId !== parseInt(req.session.userId,10))
        {
            return res
            .status(403)
            .json({message: "You are not authorized to edit this post"});
        }

        const [numberOfAffectedRows, affectedRows] = await Posts.update(req.body,{
            where: {id: postId}, returning: true
        })

        if (numberOfAffectedRows > 0){
            res.status(200).json(affectedRows[0]);
        } else {
            res.status(404).json({message: "Post not found"});
        }
    } catch(err) {
        console.error(err);
        res.status(500).send({message: err.message});
    }
});

// delete a post
app.delete('/posts/:postId', autheticateUser, async (req,res)=>{
    const postId = parseInt(req.params.postId,10);
    try{
        const record = await Posts.findOne({where: {id: postId}});

        if (record && record.UserId !== parseInt(req.session.userId,10))
        {
            return res
            .status(403)
            .json({message: "You are not authorized to delete this post"});
        }

        const deletedPost = await Posts.destroy({where: {id: postId}});
        if (deletedPost > 0) {
            res.status(200).send({ message: "Post deleted successfully" });
          } else {
            res.status(404).send({ message: "Post not found" });
          }
    } catch(err) {
        console.error(err);
        res.status(500).send({message: err.message});
    }
});


// signup a new user
app.post('/signup', async (req, res)=>{
    const hashedPassword = await bcrypt.hash(req.body.password,10);
    try{
        const user = await Users.create({
            username: req.body.username,
            password: hashedPassword
        });
        
        // seting session with user's id
        req.session.userId = user.id;

        return res.status(201).json({
            message: "User Created!",
            user: {
                username: user.username,
            }
        });
    } catch(err) {
        if (err.name === "SequelizeValidationError") {
            return res.status(422).json({errors: err.errors.map((e)=> e.message)});
        }
        else if (err.name === "SequelizeUniqueConstraintError")
        {
            return res.status(422).json({errors: "this username is being used by another user"});
        }
        res.status(500).json({
            message: "Error occured while creating user",
            error: err
        });
    }
});

// login user
app.post('/login', async (req, res) =>{
    try{
        const user = await Users.findOne({where: {username: req.body.username}});

        if (user === null){
            return res.status(401).json({
                message: "Incorrect username"
            });
        }

        bcrypt.compare(req.body.password, user.password, (error, result) =>{
            if (result){
                // seting session with user's id
                req.session.userId = user.id;
                return res.status(200).json({
                    message: "Logged in successfully",
                    user:{
                        username: user.username
                    }
                });
            } else {
                res.status(401).json({ message: "incorrect password"});
            }
        })
    } catch(err) {
        console.error(err)
        res.status(500).json({message: "An error occured during the login process"});
    }
});


//create a new comment for a post
app.get("/posts/:postId/comment", autheticateUser, async (req,res)=>{
    const postId = parseInt(req.params.postId, 10);

    try{
        // check if the post exist
        const post = await Posts.findOne({where: {id: postId}});

        if (!post) {
            return res.status(404).json({message: "The post doesn't exist"});
        } 

        // fetch all comments on this post
        const allComments = await Comments.findAll({where: {PostId: postId}});

        if (allComments.length > 0){
            return res.status(201).json(allComments);
        }
        else{
            return res.status(404).json({
                message: "No comments found"
            })
        }
    } catch(err) {
        return res.status(500).json({
            message: "Error has occurred while creating comment"
        });
    }
    
});

app.get("/comment/:commentId", autheticateUser, async (req,res)=>{
    const commentId = parseInt(req.params.commentId, 10);

    try{
        // check if the post exist
        const comment = await Comments.findOne({where: {id: commentId}});

        if (comment){
            return res.status(201).json(comment);
        }
        else{
            return res.status(404).json({
                message: "No comments found"
            })
        }
    } catch(err) {
        return res.status(500).json({
            message: "Error has occurred while fetching for comment"
        });
    }
    
});

// fetch for all comments on a post
app.post("/posts/:postId/comment", autheticateUser, async (req,res)=>{
    const postId = parseInt(req.params.postId, 10);

    try{
        // check if the post exist
        const post = await Posts.findOne({where: {id: postId}});

        if (!post) {
            return res.status(404).json({message: "The post doesn't exist"});
        } 
        const newComment = await Comments.create({
            commentContent: req.body.commentContent,
            UserId: req.session.userId,
            PostId: postId
        })
        res.status(201).json({
            message: "Comment created successfully",
            comment: newComment.commentContent
        })
    } catch(err) {
        console.error(err)
        res.status(500).json({
            message: "Error has occurred while creating comment"
        });
    }
    
});

// update comment based on id
app.patch('/comment/:commentId', autheticateUser, async (req,res)=>{
    const commentId = parseInt(req.params.commentId,10);
    try{
        const record = await Comments.findOne({where: {id: commentId}});

        if (record && record.UserId !== parseInt(req.session.userId,10))
        {
            return res
            .status(403)
            .json({message: "You are not authorized to edit this comment"});
        }

        const [numberOfAffectedRows, affectedRows] = await Comments.update(req.body,{
            where: {id: commentId}, returning: true
        })

        if (numberOfAffectedRows > 0){
            res.status(200).json(affectedRows[0]);
        } else {
            res.status(404).json({message: "Comment not found"});
        }
    } catch(err) {
        console.error(err);
        res.status(500).send({message: err.message});
    }
});

// delete comment based on id
app.delete('/comment/:commentId', autheticateUser, async (req,res)=>{
    const commentId = parseInt(req.params.commentId,10);
    try{
        const record = await Comments.findOne({where: {id: commentId}});

        if (record && record.UserId !== parseInt(req.session.userId,10))
        {
            return res
            .status(403)
            .json({message: "You are not authorized to delete this comments"});
        }

        const deletedComment = await Comments.destroy({where: {id: commentId}});
        if (deletedComment > 0) {
            res.status(200).send({ message: "Comment deleted successfully" });
          } else {
            res.status(404).send({ message: "Comment not found" });
          }
    } catch(err) {
        console.error(err);
        res.status(500).send({message: err.message});
    }
});

// fetch all comments from current user
app.get("/user/comment", autheticateUser, async (req,res)=>{
    try{
        // check if the post exist
        const allComments = await Comments.findAll({where: {UserId: parseInt(req.session.userId,10)}});

        if (allComments.length > 0){
            return res.status(201).json(allComments);
        }
        else{
            return res.status(404).json({
                message: "No comments found"
            })
        }
    } catch(err) {
        return res.status(500).json({
            message: "Error has occurred while fetching for comment"
        });
    }
    
});

app.listen(port, ()=>{
    console.log(`server is running on http://localhost:${port}`);
})