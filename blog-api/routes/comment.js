const express = require("express");
const router = express.Router();
const { Comments } = require("../models");
const {autheticateUser} = require("../middleware/authUser");

// fetch all comments from current user
router.get("/user", autheticateUser, async (req,res)=>{
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
            message: `Error has occurred while fetching for comments ${req.session.userId}`
        });
    }
    
});

router.get("/:commentId", autheticateUser, async (req,res)=>{
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


// update comment based on id
router.patch('/:commentId', autheticateUser, async (req,res)=>{
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
router.delete('/:commentId', autheticateUser, async (req,res)=>{
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


module.exports = router;