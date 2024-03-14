const router = require("express").Router();
const mongoose = require("mongoose");

// ********* require User, Game and Comment models in order to use them *********
const User = require("../models/User.model");
const Game = require("../models/Game.model");
const Comment = require ("../models/Comment.model");

// ********* require isAuthenticated in order to use it and protect routes *********
const { isAuthenticated } = require("../middleware/jwt.middleware")

// ********* require fileUploader in order to use it *********
const fileUploader = require("../config/cloudinary.config");

/*-----GET ALL GAMES-----*/
// full path: /api/games -  Retrieves all games
router.get("/games", (req, res, next) => {
    Game.find()
      .then((allGames) => res.json(allGames))
      .catch((err) => {
        console.log("Error while getting all games", err);
        res.status(500).json({ message: "Error while getting all games" });
      });
  });

/*-----GET SINGLE GAME-----*/
// full path: /api/games/:gameId -  Retrieves a specific game by id
router.get("/games/:gameId", (req, res, next) => {
    const { gameId } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(gameId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }
  
    // Each Game has a `comments` array holding `_id`s of Comment documents
    // Use .populate() method to get swap the `_id`s for the actual Comment
    Game.findById(gameId)
      .populate("comments")
      .then((foundGame) => res.status(200).json(foundGame))
      .catch((err) => {
        console.log("Error while retrieving game", err);
        res.status(500).json({ message: "Error while retrieving game" });
      });
  });

/*-----POST ADD NEW GAME-----*/
// full path: /api/games  -  Adds a new game
router.post("/games", isAuthenticated, /*fileUploader.single("imageUrl"),*/ (req, res, next) => {
  const { name, releaseYear, genre, platform } = req.body;
  // Use req.payload to retrieve information of logged in user
  const userId = req.payload._id;
  const username = req.payload.username;
  // console.log("req.payload", req.payload);

  // Check if the name, releaseYear genre or platform is provided as an empty string 
  if (name === '' || releaseYear === '' || genre === '' || platform === '') {
    res.status(400).json({ message: "Please provide name, release year, genre and platform" });
    return;
  }

  Game.findOne({ name })
    .then((foundGame) => {
      // If a game with the same name already exists, send an error message
      if (foundGame) {
        res.status(400).json({ message: "Unable to add new game. Game already exists." });
        return;
      }
    return Game.create({ name, releaseYear, genre, platform, contributedById:userId, contributedByUser:username });
  })

  // If the game is unique, proceed to add the game
  // Game.create({ name, releaseYear, genre, platform, contributedById:userId, contributedByUser:username })
    .then( async (createdGame) => {
      // Update User's 'gamesContributed' property
      const updatedUser = await User.findByIdAndUpdate(userId, { $push: { gamesContributed: createdGame._id } } )
      // const addedGame = await Game.findById(createdGame._id).populate("contributedBy")
      // const { _id, username } = addedGame.contributedBy
      // addedGame.contributedBy = { _id, username }
      // res.json(addedGame)
      res.status(201).json(createdGame)
    })
    .catch((err) => {
      console.log("Error while adding new game", err);
      res.status(500).json({ message: "Error while adding new game" });
    });
});

/*-----POST COMMENT ON SINGLE GAME-----*/ 
// full path: /api/games/:gameId -  Retrieves a specific game by id
router.post("/games/:gameId", isAuthenticated, (req, res, next) => {
  const { content } = req.body;
  const { gameId } = req.params;
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
      console.log('Error while retrieving game', err);
      res.status(500).json({ message: "Error while retrieving game" });
    });
});

/*-----ADD EXISTING GAME TO GAMES PLAYED LIST-----*/ 
// full path: /api/games/:gameId/games-played -  Adds a specific game by id
router.put("/games/:gameId/games-played", isAuthenticated, (req, res, next) => {
  const { played } = req.body;
  const { gameId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(gameId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
  
  if (played === "yes") {
    User.findById(req.payload._id)
      .then((foundUser) => {
        // console.log('foundUser.gamesPlayed:', foundUser.gamesPlayed);
        if (foundUser.gamesPlayed.includes(gameId)){ // Check is game is already on user's gamesPlayed list
          res.status(400).json({ message: "Unable to add game to gamesPlayed list. Game is already on list." });
          return;
        }
      });

    Game.findById(gameId)
      .then(async (foundGame) => {
        // console.log ('foundGame:', foundGame)
        await User.findByIdAndUpdate(req.payload._id, { $push: { gamesPlayed: foundGame._id } })
        console.log(`Successfully added ${foundGame.name} to gamesPlayed list.`)
        res.status(200).json(foundGame)
      })
      .catch((err) => {
        console.log('Error adding game to list', err);
        res.status(500).json({ message: "Error adding game to list" });
      });
  }
});

/*-----REMOVE GAME FROM GAMES PLAYED LIST-----*/
// full path: /api/games/:gameId/games-played/remove  -  Removes a specific game by id
router.put("/games/:gameId/games-played/remove", isAuthenticated, (req, res, next) => {
  const { gameId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(gameId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  User.findByIdAndUpdate(req.payload._id, { $pull: { gamesPlayed: gameId } })
  // $pull removes value/item from array, removes gameID from array gamesPlayed array
    .then(() => {
      console.log(`Game with ID ${gameId} has been successfully removed from ${req.payload.username}'s gamesPlayed list.`)
      res.status(200).json({ message: `Game with ID ${gameId} has been successfully removed from ${req.payload.username}'s gamesPlayed list.` })
    })
    .catch((err) => {
      console.log('Error removing game from gamesPlayed list', err);
      res.status(500).json({ message: "Error removig game from gamesPlayed list" });
    });
});

/*-----ADD EXISTING GAME TO GAMES CURRENTLY PLAYING LIST-----*/ 
// full path: /api/games/:gameId/games-currently-playing -  Adds a specific game by id
router.put("/games/:gameId/games-currently-playing", isAuthenticated, (req, res, next) => {
  const { currentlyPlaying } = req.body;
  const { gameId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(gameId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  if (currentlyPlaying === "yes") {
    User.findById(req.payload._id)
      .then((foundUser) => {
        // console.log('foundUser.gamesCurrentlyPlaying:', foundUser.gamesCurrentlyPlaying);
        if (foundUser.gamesCurrentlyPlaying.includes(gameId)){ // Check is game is already on user's gamesPlayed list
          res.status(400).json({ message: "Unable to add game to gamesCurrentlyPlaying list. Game is already on list." });
          return;
        }
      });

    Game.findById(gameId)
      .then(async (foundGame) => {
        // console.log ('foundGame:', foundGame)
        await User.findByIdAndUpdate(req.payload._id, { $push: { gamesCurrentlyPlaying: foundGame._id } })
        console.log(`Successfully added ${foundGame.name} to gamesCurrentlyPlaying list.`)
        res.status(200).json(foundGame)
      })
      .catch((err) => {
        console.log('Error adding game to list', err);
        res.status(500).json({ message: "Error adding game to list" });
      });
  }
  
});

/*-----REMOVE GAME FROM GAMES CURRENTLY PLAYING LIST-----*/
// full path: /api/games/:gameId/games-currently-playing/remove  -  Removes a specific game by id
router.put("/games/:gameId/games-currently-playing/remove", isAuthenticated, (req, res, next) => {
  const { gameId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(gameId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  User.findByIdAndUpdate(req.payload._id, { $pull: { gamesCurrentlyPlaying: gameId } })
  // $pull removes value/item from array, removes gameID from array gamesCurrentlyPlaying array
    .then(() => {
      console.log(`Game with ID ${gameId} has been successfully removed from ${req.payload.username}'s gamesCurrentlyPlaying list.`)
      res.status(200).json({ message: `Game with ID ${gameId} has been successfully removed from ${req.payload.username}'s gamesCurrentlyPlaying list.` })
    })
    .catch((err) => {
      console.log('Error removing game from gamesCurrentlyPlaying list', err);
      res.status(500).json({ message: "Error removig game from gamesCurrentlyPlaying list" });
    });
});

/*-----ADD EXISTING GAME TO WISHLIST-----*/ 
// full path: /api/games/:gameId/wishlist -  Adds a specific game by id
router.put("/games/:gameId/wishlist", isAuthenticated, (req, res, next) => {
  const { wishlist } = req.body;
  const { gameId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(gameId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
  
  if (wishlist === "yes") {
    User.findById(req.payload._id)
      .then((foundUser) => {
        // console.log('foundUser.wishlist:', foundUser.wishlist);
        if (foundUser.wishlist.includes(gameId)){ // Check is game is already on user's gamesPlayed list
          res.status(400).json({ message: "Unable to add game to wishlist. Game is already on list." });
          return;
        }
      });

    Game.findById(gameId)
      .then(async (foundGame) => {
        // console.log ('foundGame:', foundGame)
        await User.findByIdAndUpdate(req.payload._id, { $push: { wishlist: foundGame._id } })
        console.log(`Successfully added ${foundGame.name} to wishlist.`)
        res.status(200).json(foundGame)
      })
      .catch((err) => {
        console.log('Error adding game to list', err);
        res.status(500).json({ message: "Error adding game to list" });
      });
  }
  
});

/*-----REMOVE GAME FROM WISHLIST-----*/
// full path: /api/games/:gameId/wishlist/remove -  Removes a specific game by id
router.put("/games/:gameId/wishlist/remove", isAuthenticated, (req, res, next) => {
  const { gameId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(gameId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  User.findByIdAndUpdate(req.payload._id, { $pull: { wishlist: gameId } })
  // $pull removes value/item from array, removes gameID from array wishlist array
    .then(() => {
      console.log(`Game with ID ${gameId} has been successfully removed from ${req.payload.username}'s wishlist.`)
      res.status(200).json( { message: `Game with ID ${gameId} has been successfully removed from ${req.payload.username}'s wishlist.` })
    })
    .catch((err) => {
      console.log('Error removing game from wishlist', err);
      res.status(500).json({ message: "Error removig game from wishlist" });
    });
});

/*-----DELETE GAME FROM DATABASE AND REMOVE FROM USER'S GAMES CONTRIBUTED LIST-----*/
// full path: /api/games/:gameId  -  Deletes a specific game by id
router.delete("/games/:gameId", isAuthenticated, (req, res, next) => {
  const { gameId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(gameId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Game.findByIdAndDelete(gameId)
    .then(async () => {
      const updatedUser = await User.findByIdAndUpdate(req.payload._id, { $pull: { gamesContributed: gameId } })
      // async/await + const updatedUser removes the game from the user's gameContributed property
      // $pull removes value/item from array, removes gameID from array gamesContributed array
      console.log(`Game with ID ${gameId} has been successfully removed from the game database and user ${req.payload._id}'s "gamesContributed" list.`)
      res.status(200).json({ message: `Game with ID ${gameId} has been successfully removed from the game database.` })
    })
    .catch((err) => {
      console.log("Error deleting game", err);
      res.status(500).json({ message: "Error deleting game" });
    });
});

module.exports = router;