const router = require("express").Router();
const mongoose = require("mongoose");

// ********* require User, Game and Comment models in order to use them *********
const User = require("../models/User.model");
const Game = require("../models/Game.model");
const Comment = require ("../models/Comment.model");

/*-----POST COMMENT ON SINGLE GAME-----*/ 
// full path: /api/comments -  Posts a comment on a specific game by id
router.post("/comments", (req, res, next) => {
    const { content, gameId } = req.body;
    const game = gameId;
    const author = req.payload._id;
  
    Comment.create({ game, author, content })
      .then(async (newComment) => {
        // console.log('newComment:', newComment)
        await Game.findByIdAndUpdate(game, { $push: { comments: newComment._id } })
        await User.findByIdAndUpdate(author, { $push: { comments: newComment._id } })
        res.status(201).json(newComment)
      })
      .catch((err) => {
        console.log('Error adding comment', err);
        res.status(500).json({ message: "Error adding comment" });
      });
  });

module.exports = router;