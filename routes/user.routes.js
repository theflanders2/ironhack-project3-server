const router = require("express").Router();
const mongoose = require("mongoose");

// ********* require User, Game and Comment models in order to use them *********
const User = require("../models/User.model");
const Game = require("../models/Game.model");
const Comment = require ("../models/Comment.model");

// ********* require fileUploader in order to use it *********
const fileUploader = require("../config/cloudinary.config");

/*-----GET FIND USER PAGE-----*/
// full path: /api/users/:userId -  Retrieves a specific user by id
router.get("/users/:userId", (req, res, next) => {
    const { userId } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ message: "Specified user id number is not valid" });
        return;
    }

    User.findById(userId)
        // .populate("comments")
        .then((foundUser) => res.status(200).json(foundUser))
        .catch((err) => {
            console.log("Error while retrieving the user", err);
            res.status(500).json({ message: "Error while retrieving the user" });
        });
  });

/*-----GET FIND USER WISHLIST PAGE-----*/
// ADD CODE HERE

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

module.exports = router;