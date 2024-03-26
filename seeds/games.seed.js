const mongoose = require("mongoose");
const Game = require("../models/Game.model");
require("dotenv").config();

const games = [
    {
        name: "Soul Calibur VI",
        releaseYear: 2018,
        genre: "Fighting",
        coverArtUrl: "https://res.cloudinary.com/dcsk4b8kl/image/upload/v1711439684/ironhack-project3/jvsgreljjabvefee8byk.jpg",
        platform: "PS4",
        // contributedById: {
        //   $oid: "65f378afc019f50c2fac1d5c"
        // },
        contributedByUser: "TestBoss",
        comments: []
      }
]

const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ironhack-project3-server";

mongoose
  .connect(MONGO_URI)
  .then((x) => {
    const dbName = x.connections[0].name;
    console.log(`Connected to Mongo! Database name: "${dbName}"`);
  })
  .then(() => Game.create(games))
  .then((createdGames) => console.log(`${createdGames.length} games added to db`))
  .then(() => mongoose.connection.close())
  .catch((err) => console.log(err));