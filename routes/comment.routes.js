const router = require("express").Router();
const mongoose = require("mongoose");

const User = require("../models/User.model");
const Game = require("../models/Game.model");
const Comment = require ("../models/Comment.model");

// GET SINGLE COMMENT /api/comments/:commentId
router.get("/comments/:commentId", (req, res, next) => {
  const { commentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Comment.findById(commentId)
    .then((foundComment) => res.status(200).json(foundComment))
    .catch((err) => {
      console.log("Error while retrieving comment", err);
      res.status(500).json({ message: "Error while retrieving comment" });
    });
});

// POST COMMENT ON SINGLE GAME /api/comments
router.post("/comments", (req, res, next) => {
    const { content, gameId } = req.body;
    const game = gameId;
    const author = req.payload._id;
  
    Comment.create({ game, author, content })
      .then(async (newComment) => {
        await Game.findByIdAndUpdate(game, { $push: { comments: newComment._id } })
        await User.findByIdAndUpdate(author, { $push: { comments: newComment._id } })
        res.status(201).json(newComment)
      })
      .catch((err) => {
        console.log('Error adding comment', err);
        res.status(500).json({ message: "Error adding comment" });
      });
  });

// PUT UPDATE COMMENT /api/comments/:commentId
router.put("/comments/:commentId", (req, res, next) => {
  const { commentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Comment.findByIdAndUpdate(commentId, req.body, { new: true })
    .then((updatedComment) => res.status(200).json(updatedComment))
    .catch((err) => {
      console.log("Error while updating comment", err);
      res.status(500).json({ message: "Error while updating comment" });
    });
});

//DELETE COMMENT /api/comments/:commentId
router.delete("/comments/:commentId", (req, res, next) => {
  const { commentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Comment.findByIdAndDelete(commentId)
    .then(async (foundComment) => {
      const updatedUser = await User.findByIdAndUpdate(foundComment.author._id, {
        $pull: { comments: commentId },
      });
      console.log(`Comment with ID ${commentId} has been successfully removed from ${foundComment.author._id}'s comments list.`);
      res.status(200).json({ message: `Comment with ID ${commentId} has been successfully removed from the database.`});
    })
    .catch((err) => {
      console.log("Error deleting comment", err);
      res.status(500).json({ message: "Error deleting comment" });
    });
});

module.exports = router;