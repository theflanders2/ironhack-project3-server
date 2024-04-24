const mongoose = require("mongoose");
const Game = require("../models/Game.model");
const User = require("../models/User.model")
require("dotenv").config();

const userId = "6603e31069aef89f17b4bbcc";
const username = "GamingGuru";

const games = [
    {
      name: "Soul Calibur VI",
      releaseYear: 2018,
      genre: "Fighting",
      coverArtUrl: "https://res.cloudinary.com/dcsk4b8kl/image/upload/v1711439684/ironhack-project3/jvsgreljjabvefee8byk.jpg",
      platform: ["PS4", "PS5"],
      contributedById: userId,
      contributedByUser: username,
      comments: []
    },
    {
      name: "Soul Clown",
      releaseYear: 2018,
      genre: "Fighting",
      coverArtUrl: "https://res.cloudinary.com/dcsk4b8kl/image/upload/v1711439684/ironhack-project3/jvsgreljjabvefee8byk.jpg",
      platform: "PS4",
      contributedById: userId,
      contributedByUser: username,
      comments: []
    }
]

const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ironhack-project3-server";

// mongoose
//   .connect(MONGO_URI)
//   .then((x) => {
//     const dbName = x.connections[0].name;
//     console.log(`Connected to Mongo! Database name: "${dbName}"`);
//   })
//   .then(() => Game.create(games))
//   .then(async (createdGames) => {
//     const updatedUser = await User.findByIdAndUpdate(userId, {
//       $push: { gamesContributed: { $each: createdGames.map(game => game._id) } }
//     });
//     console.log(`${createdGames.length} games added to db`)
//   })
//   .then(() => mongoose.connection.close())
//   .catch((err) => console.log(err));

async function connectAndSeed() {
  try {
    const x = await mongoose.connect(MONGO_URI);
    const dbName = x.connections[0].name;
    console.log(`Connected to Mongo! Database name: "${dbName}"`);

    const createdGames = await Game.create(games);
    console.log(`${createdGames.length} games added to db`);

    const updatedUser = await User.findByIdAndUpdate(userId, {
      $push: { gamesContributed: { $each: createdGames.map(game => game._id) } }
    });

    await mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
}

connectAndSeed();
