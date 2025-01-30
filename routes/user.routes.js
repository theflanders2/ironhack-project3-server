const router = require("express").Router();
const mongoose = require("mongoose");

const User = require("../models/User.model");

// GET ALL USERS /api/users 
router.get("/users", async (req, res) => {
  try {
    const allUsers = await User.find();
    res.status(200).json(allUsers);
  } catch (err) {
    console.log("Error getting all users", err);
    res.status(500).json({ message: "Error getting all users" });
  }
});

// GET USER PAGE /api/users/:userId
router.get("/users/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "Specified user id number is not valid" });
    return;
  }

  try {
    const foundUser = await User.findById(userId)
      .populate({
        path: "comments",
        populate: { path: "game", select: "name" }
      })
      .populate("gamesContributed gamesPlayed gamesCurrentlyPlaying wishlist")
    
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

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
  } catch (err) {
    console.log("Error while retrieving the user", err);
    res.status(500).json({ message: "Error while retrieving the user" });
  }
});

// UPDATE USER PAGE /api/users/:userId
router.put("/users/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "Specified user id number is not valid" });
    return;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
    res.json(updatedUser);
  } catch (err) {
    console.log("Error while updating the user", err);
    res.status(500).json({ message: "Error while updating the user" });
  }
});

module.exports = router;
