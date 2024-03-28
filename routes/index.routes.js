const router = require("express").Router();

// ********* require Game model in order to use it *********
const Game = require("../models/Game.model");

router.get("/", (req, res, next) => {
    Game.find()
      .then((allGames) => {
        const slicePoint = allGames.length - 10;
        const latestTenGamesAdded = allGames.slice(slicePoint).reverse();
        res.status(200).json(latestTenGamesAdded)
        console.log("latestTenGamesAdded", latestTenGamesAdded)
      })
      .catch((err) => {
        console.log("Error while getting all games", err);
        res.status(500).json({ message: "Error while getting all games" });
      });
  // res.status(200).json("All good in here");
});

module.exports = router;
