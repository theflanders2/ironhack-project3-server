const router = require("express").Router();
const mongoose = require("mongoose");

// ********* require User, Game and Comment models in order to use them *********
const User = require("../models/User.model");
const Game = require("../models/Game.model");
const Comment = require("../models/Comment.model");

// ********* require fileUploader in order to use it *********
const fileUploader = require("../config/cloudinary.config");

/*-----GET ALL USERS-----*/
// full path: /api/users -  Retrieves all users
router.get("/users", (req, res, next) => {
  User.find()
    .then((allUsers) => res.status(200).json(allUsers))
    .catch((err) => {
      console.log("Error getting all users", err);
      res.status(500).json({ message: "Error getting all users" });
    });
});

/*-----GET FIND USER PAGE-----*/
// full path: /api/users/:userId -  Retrieves a specific user by id
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
    .populate("gamesContributed")
    .populate("gamesPlayed")
    .populate("gamesCurrentlyPlaying")
    .populate("wishlist")
    .then((foundUser) => {
      // Deconstruct found user object to omit the password
      // We should never expose passwords publicly
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

      // Create a new object that doesn't expose the password
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

      // Send a json response containing the user object
      res.status(200).json({ user: reconstructedFoundUser });
    })
    .catch((err) => {
      console.log("Error while retrieving the user", err);
      res.status(500).json({ message: "Error while retrieving the user" });
    });
});

/*-----PUT UPDATE USER PAGE-----*/
// full path: /api/users/:userId  -  Updates a specific user by id
router.put("/users/:userId", (req, res, next) => {
  const { userId } = req.params;
  const { avatarUrl } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "Specified user id number is not valid" });
    return;
  }

  User.findByIdAndUpdate(userId, avatarUrl, { new: true })
    .then((updatedUser) => res.json(updatedUser))
    .catch((err) => {
      console.log("Error while updating the user", err);
      res.status(500).json({ message: "Error while updating the user" });
    });
});

/*-----GET FIND USER WISHLIST PAGE-----*/
// full path: /api/users/:userId/wishlist  -  Retrieves a user's wishlist
// ADD CODE HERE

/*-----PUT UPDATE USER WISHLIST PAGE-----*/
// full path: /api/users/:userId/wishlist  -  Updates a user's wishlist
// ADD CODE HERE

module.exports = router;
