const router = require("express").Router();
const mongoose = require("mongoose");

const User = require("../models/User.model");
const Game = require("../models/Game.model");
const Comment = require ("../models/Comment.model");

// GET SINGLE COMMENT /api/comments/:commentId
router.get("/comments/:commentId", async (req, res) => {
  const { commentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  try {
    const foundComment = await Comment.findById(commentId);
    res.status(200).json(foundComment);
  } catch (err) {
    console.log("Error while retrieving comment", err);
    res.status(500).json({ message: "Error while retrieving comment" });
  }
});

// POST COMMENT ON SINGLE GAME /api/comments
router.post("/comments", async (req, res) => {
    const { content, gameId } = req.body;
    const game = gameId;
    const author = req.payload._id;

    try {
      const newComment = await Comment.create({ game, author, content });

      await Game.findByIdAndUpdate(game, { $push: { comments: newComment._id } });
      await User.findByIdAndUpdate(author, { $push: { comments: newComment._id } });
      
      res.status(201).json(newComment);
    } catch (err) {
      console.log('Error adding comment', err);
      res.status(500).json({ message: "Error adding comment" });
    }
  });

// PUT UPDATE COMMENT /api/comments/:commentId
router.put("/comments/:commentId", async (req, res) => {
  const { commentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  try {
    const updatedComment = await Comment.findByIdAndUpdate(commentId, req.body, { new: true });
    res.status(200).json(updatedComment);
  } catch (err) {
    console.log("Error while updating comment", err);
    res.status(500).json({ message: "Error while updating comment" });
  }
});

//DELETE COMMENT /api/comments/:commentId
router.delete("/comments/:commentId", async (req, res) => {
  const { commentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  try {
    const foundComment = await Comment.findByIdAndDelete(commentId);
    
    if (foundComment) {
      await User.findByIdAndUpdate(foundComment.author._id, { $pull: { comments: commentId } });
    }

    console.log(`Comment with ID ${commentId} has been successfully removed from ${foundComment.author._id}'s comments list.`);
    res.status(200).json({ message: `Comment with ID ${commentId} has been successfully removed from the database.`});
  } catch (err) {
    console.log("Error deleting comment", err);
    res.status(500).json({ message: "Error deleting comment" });
  }
});

module.exports = router;