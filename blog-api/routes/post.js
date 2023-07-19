const express = require("express");
const router = express.Router();
const { Posts, Comments } = require("../models");
const {autheticateUser} = require("../middleware/authUser");

  // get all post
router.get('/', autheticateUser, async (req,res)=>{
    try{
        const allPosts = await Posts.findAll();
        res.status(200).json(allPosts);
    } catch(err) {
        console.error(err);
        res.status(500).send({message: err.message});
    }
})
// get all user posts
router.get('/user', autheticateUser, async (req, res) => {
    try {
        const userId = parseInt(req.session.userId, 10);

        const userPosts = await Posts.findAll({ where: { UserId: userId } });

        if (userPosts && userPosts.length > 0) {
            return res.status(200).json(userPosts);
        } else {
            return res.status(404).json({ message: "No posts found for the user" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// get post based on id
router.get('/:postId', autheticateUser, async (req,res)=>{
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
router.post('/', autheticateUser, async (req,res)=>{
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
router.patch('/:postId', autheticateUser, async (req,res)=>{
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
router.delete('/:postId', autheticateUser, async (req,res)=>{
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

//create a new comment for a post
router.get("/:postId/comment", autheticateUser, async (req,res)=>{
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
            message: "Error has occurred while fetching the comment"
        });
    }
    
});

// fetch for all comments on a post
router.post("/:postId/comment", autheticateUser, async (req,res)=>{
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

  
module.exports = router;