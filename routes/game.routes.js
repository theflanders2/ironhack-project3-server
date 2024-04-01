const router = require("express").Router();
const mongoose = require("mongoose");

const User = require("../models/User.model");
const Game = require("../models/Game.model");

const fileUploader = require("../config/cloudinary.config");

// GET ALL GAMES /api/games
router.get("/games", (req, res, next) => {
  Game.find().sort({name: 1})
    .then((allGames) => res.status(200).json(allGames))
    .catch((err) => {
      console.log("Error while getting all games", err);
      res.status(500).json({ message: "Error while getting all games" });
    });
});

// GET SINGLE GAME /api/games/:gameId
router.get("/games/:gameId", (req, res, next) => {
  const { gameId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(gameId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Game.findById(gameId)
    .populate({
      path: "comments",
      populate: {path: "author", select: "username"}
    })
    .then((foundGame) => res.status(200).json(foundGame))
    .catch((err) => {
      console.log("Error while retrieving game", err);
      res.status(500).json({ message: "Error while retrieving game" });
    });
});

// UPLOAD GAME COVER ART (CLOUDINARY) /api/games/upload
router.post("/games/upload", fileUploader.single("coverArtUrl"), (req, res, next) => {
  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }
  res.status(200).json({ coverArtUrl: req.file.path });
});

//POST ADD NEW GAME /api/games  -  Adds a new game
router.post("/games", (req, res, next) => {
    const { name, releaseYear, genre, platform, coverArtUrl } = req.body;
    const userId = req.payload._id;
    const username = req.payload.username;

    if (name === "" || releaseYear === "" || genre === "" || platform === "") {
      res.status(400).json({ message: "Please provide name, release year, genre and platform" });
      return;
    }

    Game.findOne({ name })
      .then((foundGame) => {
        if (foundGame) {
          res.status(400).json({ message: "Unable to add new game. Game already exists." });
          return;
        }
        return Game.create({
          name,
          releaseYear,
          genre,
          platform,
          coverArtUrl,
          contributedById: userId,
          contributedByUser: username,
        });
      })
      .then(async (createdGame) => {
        const updatedUser = await User.findByIdAndUpdate(userId, {
          $push: { gamesContributed: createdGame._id },
        });
        res.status(201).json(createdGame);
      })
      .catch((err) => {
        console.log("Error while adding new game", err);
        res.status(500).json({ message: "Error while adding new game" });
      });
  }
);

// UPDATE GAME /api/games/:gameId
router.put("/games/:gameId", (req, res, next) => {
  const { gameId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(gameId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Game.findByIdAndUpdate(gameId, req.body, { new: true })
    .then((updatedGame) => res.status(200).json(updatedGame))
    .catch((err) => {
      console.log("Error while updating the game", err);
      res.status(500).json({ message: "Error while updating the game" });
    });
});

// ADD GAME TO GAMES PLAYED LIST /api/games/:gameId/add-to-games-played
router.put("/games/:gameId/add-to-games-played", (req, res, next) => {
  const { gameId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(gameId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

    User.findById(req.payload._id).then((foundUser) => {
      if (foundUser.gamesPlayed.includes(gameId)) {
        res.status(400).json({ message:"Already on games played list" });
        return;
      }

      Game.findById(gameId)
        .then(async (foundGame) => {
          await User.findByIdAndUpdate(req.payload._id, { $push: { gamesPlayed: foundGame._id }});
          console.log(`Successfully added ${foundGame.name} to gamesPlayed list.`);
          res.status(200).json(foundGame);
        })
        .catch((err) => {
          console.log("Error adding game to list", err);
          res.status(500).json({ message: "Error adding game to list" });
        });
    });
});

// REMOVE FROM GAMES PLAYED /api/games/:gameId/remove-from-games-played
router.put("/games/:gameId/remove-from-games-played", (req, res, next) => {
    const { gameId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(gameId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    User.findByIdAndUpdate(req.payload._id, { $pull: { gamesPlayed: gameId } })
      .then(() => {
        console.log(`Game with ID ${gameId} has been successfully removed from ${req.payload.username}'s gamesPlayed list.`);
        res.status(200).json({ message: `Game with ID ${gameId} has been successfully removed from ${req.payload.username}'s gamesPlayed list.` });
      })
      .catch((err) => {
        console.log("Error removing game from gamesPlayed list", err);
        res.status(500).json({ message: "Error removig game from gamesPlayed list" });
      });
  }
);

// ADD TO CURRENTLY PLAYING /api/games/:gameId/add-to-games-currently-playing
router.put("/games/:gameId/add-to-games-currently-playing", (req, res, next) => {
    const { gameId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(gameId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

      User.findById(req.payload._id).then((foundUser) => {
        if (foundUser.gamesCurrentlyPlaying.includes(gameId)) {
          res.status(400).json({ message: "Already on games currently playing list" });
          return;
        }

        Game.findById(gameId)
          .then(async (foundGame) => {
            await User.findByIdAndUpdate(req.payload._id, { $push: { gamesCurrentlyPlaying: foundGame._id }});
            console.log(`Successfully added ${foundGame.name} to gamesCurrentlyPlaying list.`);
            res.status(200).json(foundGame);
          })
          .catch((err) => {
            console.log("Error adding game to list", err);
            res.status(500).json({ message: "Error adding game to list" });
          });
      });
    
});

// REMOVE FROM CURRENTLY PLAYING /api/games/:gameId/remove-from-games-currently-playing
router.put("/games/:gameId/remove-from-games-currently-playing", (req, res, next) => {
    const { gameId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(gameId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    User.findByIdAndUpdate(req.payload._id, { $pull: { gamesCurrentlyPlaying: gameId }})
      .then(() => {
        console.log(`Game with ID ${gameId} has been successfully removed from ${req.payload.username}'s gamesCurrentlyPlaying list.`);
        res.status(200).json({ message: `Game with ID ${gameId} has been successfully removed from ${req.payload.username}'s gamesCurrentlyPlaying list.` });
      })
      .catch((err) => {
        console.log("Error removing game from gamesCurrentlyPlaying list", err);
        res.status(500).json({ message: "Error removig game from gamesCurrentlyPlaying list" });
      });
  }
);

// ADD TO WISHLIST /api/games/:gameId/add-to-wishlist
router.put("/games/:gameId/add-to-wishlist", (req, res, next) => {
  const { gameId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(gameId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

    User.findById(req.payload._id).then((foundUser) => {
      if (foundUser.wishlist.includes(gameId)) {
        res.status(400).json({ message: "Already on wishlist" });
        return;
      }

      Game.findById(gameId)
        .then(async (foundGame) => {
          await User.findByIdAndUpdate(req.payload._id, { $push: { wishlist: foundGame._id }});
          console.log(`Successfully added ${foundGame.name} to wishlist.`);
          res.status(200).json(foundGame);
        })
        .catch((err) => {
          console.log("Error adding game to list", err);
          res.status(500).json({ message: "Error adding game to list" });
        });
    });
});

// REMOVE FROM WISHLIST /api/games/:gameId/remove-from-wishlist
router.put("/games/:gameId/remove-from-wishlist", (req, res, next) => {
    const { gameId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(gameId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    User.findByIdAndUpdate(req.payload._id, { $pull: { wishlist: gameId } })
      .then(() => {
        console.log(`Game with ID ${gameId} has been successfully removed from ${req.payload.username}'s wishlist.`);
        res.status(200).json({ message: `Game with ID ${gameId} has been successfully removed from ${req.payload.username}'s wishlist.`});
      })
      .catch((err) => {
        console.log("Error removing game from wishlist", err);
        res.status(500).json({ message: "Error removig game from wishlist" });
      });
  }
);

module.exports = router;
