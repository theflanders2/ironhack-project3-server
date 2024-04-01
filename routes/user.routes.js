const router = require("express").Router();
const mongoose = require("mongoose");

const User = require("../models/User.model");
const Game = require("../models/Game.model");
const Comment = require("../models/Comment.model");

const fileUploader = require("../config/cloudinary.config");

// GET ALL USERS /api/users 
router.get("/users", (req, res, next) => {
  User.find()
    .then((allUsers) => res.status(200).json(allUsers))
    .catch((err) => {
      console.log("Error getting all users", err);
      res.status(500).json({ message: "Error getting all users" });
    });
});

// GET USER PAGE /api/users/:userId
router.get("/users/:userId", (req, res, next) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "Specified user id number is not valid" });
    return;
  }

  User.findById(userId)
    .populate({
      path: "comments",
      populate: { path: "game", select: "name" },
    })
    .populate("gamesContributed gamesPlayed gamesCurrentlyPlaying wishlist")
    .then((foundUser) => {
      const {
        _id,
        username,
        email,
        prestigeLevel,
        avatarUrl,
        comments,
        gamesContributed,
        gamesPlayed,
        gamesCurrentlyPlaying,
        wishlist,
      } = foundUser;

      const reconstructedFoundUser = {
        _id,
        username,
        email,
        prestigeLevel,
        avatarUrl,
        comments,
        gamesContributed,
        gamesPlayed,
        gamesCurrentlyPlaying,
        wishlist,
      };
      res.status(200).json({ user: reconstructedFoundUser });
    })
    .catch((err) => {
      console.log("Error while retrieving the user", err);
      res.status(500).json({ message: "Error while retrieving the user" });
    });
});

// UPDATE USER PAGE /api/users/:userId
router.put("/users/:userId", (req, res, next) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "Specified user id number is not valid" });
    return;
  }

  User.findByIdAndUpdate(userId, req.body, { new: true })
    .then((updatedUser) => res.json(updatedUser))
    .catch((err) => {
      console.log("Error while updating the user", err);
      res.status(500).json({ message: "Error while updating the user" });
    });
});

module.exports = router;
