const router = require("express").Router();

const Game = require("../models/Game.model");

router.get("/", async (req, res, next) => {
  try {
    //Retrieve the latest 10 games directly from the database
    //If fewer than 10 games exist, return them all
    const latestGames = await Game.find().sort({ createdAt: -1}).limit(10)
    res.status(200).json(latestGames);
  } catch (err) {
    console.log("Error while fetching all games", err);
    res.status(500).json({ message: "Error while fetching games" });
  }
});

module.exports = router;