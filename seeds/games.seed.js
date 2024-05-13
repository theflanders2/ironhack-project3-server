const mongoose = require("mongoose");
const Game = require("../models/Game.model");
const User = require("../models/User.model")
require("dotenv").config();

const userId = "65fefc2caebf46f2d56651f2";
const username = "No-_-Nation";

const games = [
    {
      name: "Days Gone",
      releaseYear: 2019,
      genre: ["Shooter", "Action", "Adventure", "Survival", "Horror"],
      coverArtUrl: "https://res.cloudinary.com/dcsk4b8kl/image/upload/v1715543618/ironhack-project3/playstation_4.daysgone_AU.16271086271835674943_rlzblk.jpg",
      platform: ["PS4"],
      contributedById: userId,
      contributedByUser: username,
      comments: []
    },
    {
      name: "Anthem",
      releaseYear: 2019,
      genre: ["Shooter", "Action", "RPG"],
      coverArtUrl: "https://res.cloudinary.com/dcsk4b8kl/image/upload/v1715543619/ironhack-project3/playstation_4.anthem_US.1707802748715804703_ite0qt.jpg",
      platform: ["PS4"],
      contributedById: userId,
      contributedByUser: username,
      comments: []
    },
    {
      name: "Assassin's Creed Odyssey",
      releaseYear: 2018,
      genre: ["Action", "RPG", "Adventure", "Shooter"],
      coverArtUrl: "https://res.cloudinary.com/dcsk4b8kl/image/upload/v1715543619/ironhack-project3/playstation_4.assassinscreedodyssey_US.16272004271441832250_wraczg.jpg",
      platform: ["PS4"],
      contributedById: userId,
      contributedByUser: username,
      comments: []
    },
    {
      name: "Destiny the Collection",
      releaseYear: 2016,
      genre: ["FPS"],
      coverArtUrl: "https://res.cloudinary.com/dcsk4b8kl/image/upload/v1715543619/ironhack-project3/playstation_4.destinythecollection_GB.16378808881869831527_fk823d.jpg",
      platform: ["PS3", "PS4"],
      contributedById: userId,
      contributedByUser: username,
      comments: []
    },
    {
      name: "Deus Ex: Mankind Divided",
      releaseYear: 2016,
      genre: ["Stealth", "Action", "RPG", "Adventure", "FPS"],
      coverArtUrl: "https://res.cloudinary.com/dcsk4b8kl/image/upload/v1715543620/ironhack-project3/playstation_4.deusexmankinddivided_AU.1627108745198585667_jvxdmd.jpg",
      platform: ["PS4"],
      contributedById: userId,
      contributedByUser: username,
      comments: []
    },
    {
      name: "Cyberpunk 2077",
      releaseYear: 2022,
      genre: ["Action", "RPG"],
      coverArtUrl: "https://res.cloudinary.com/dcsk4b8kl/image/upload/v1715543621/ironhack-project3/playstation_4.cyberpunk2077_AU.1627108495256348837_ef5xyn.jpg",
      platform: ["PS4", "PS5"],
      contributedById: userId,
      contributedByUser: username,
      comments: []
    },
    {
      name: "God of War",
      releaseYear: 2018,
      genre: ["Action", "Adventure", "RPG", "Fighting"],
      coverArtUrl: "https://res.cloudinary.com/dcsk4b8kl/image/upload/v1715543622/ironhack-project3/playstation_4.godofwar_.16271991131724927770_qsujaa.jpg",
      platform: ["PS4"],
      contributedById: userId,
      contributedByUser: username,
      comments: []
    },
    {
      name: "Assassin's Creed Syndicate",
      releaseYear: 2015,
      genre: ["Stealth" ,"Action", "Adventure", "Fighting"],
      coverArtUrl: "https://res.cloudinary.com/dcsk4b8kl/image/upload/v1715543622/ironhack-project3/playstation_4.assassinscreedsyndicate_AU.1627107685599279656_hpaztr.jpg",
      platform: ["PS4"],
      contributedById: userId,
      contributedByUser: username,
      comments: []
    },
    {
      name: "Assassin's Creed Origins",
      releaseYear: 2017,
      genre: ["Stealth" ,"Action", "Adventure", "Fighting", "RPG"],
      coverArtUrl: "https://res.cloudinary.com/dcsk4b8kl/image/upload/v1715543623/ironhack-project3/playstation_4.assassinscreedorigins_AU.16271076461465225676_pansbu.jpg",
      platform: ["PS4"],
      contributedById: userId,
      contributedByUser: username,
      comments: []
    },
    {
      name: "Detroit: Become Human",
      releaseYear: 2018,
      genre: ["Action", "Adventure"],
      coverArtUrl: "https://res.cloudinary.com/dcsk4b8kl/image/upload/v1715543623/ironhack-project3/playstation_4.detroitbecomehuman_US.1690311872399179425_mshrsk.jpg",
      platform: ["PS4"],
      contributedById: userId,
      contributedByUser: username,
      comments: []
    },
    {
      name: "Ghost of Tsushima",
      releaseYear: 2020,
      genre: ["Action", "Adventure"],
      coverArtUrl: "https://res.cloudinary.com/dcsk4b8kl/image/upload/v1715543624/ironhack-project3/playstation_4.ghostoftsushima_BR.16835258051907843925_wrvonj.jpg",
      platform: ["PS4", "PS5"],
      contributedById: userId,
      contributedByUser: username,
      comments: []
    },
    {
      name: "GreedFall",
      releaseYear: 2019,
      genre: ["Action", "RPG", "Adventure", "Fighting"],
      coverArtUrl: "https://res.cloudinary.com/dcsk4b8kl/image/upload/v1715543624/ironhack-project3/playstation_4.greedfall_AU.1627199145242536628_keenhk.jpg",
      platform: ["PS4", "PS5"],
      contributedById: userId,
      contributedByUser: username,
      comments: []
    },
    {
      name: "Horizon Zero Dawn",
      releaseYear: 2017,
      genre: ["Action", "RPG", "Adventure", "Shooter"],
      coverArtUrl: "https://res.cloudinary.com/dcsk4b8kl/image/upload/v1715543629/ironhack-project3/playstation_4.horizonzerodawn_AU.162719920657294644_umcsv0.jpg",
      platform: ["PS4"],
      contributedById: userId,
      contributedByUser: username,
      comments: []
    },
    {
      name: "Assassin's Creed Valhalla",
      releaseYear: 2020,
      genre: ["Action", "RPG", "Adventure", "Fighting", "Shooter", "Platformer"],
      coverArtUrl: "https://res.cloudinary.com/dcsk4b8kl/image/upload/v1715543627/ironhack-project3/playstation_5.assassinscreedvalhalla_AU.16269959041125050441_kszdpr.jpg",
      platform: ["PS4", "PS5"],
      contributedById: userId,
      contributedByUser: username,
      comments: []
    },
    {
      name: "Evil West",
      releaseYear: 2022,
      genre: ["RPG", "Third-person Shooter", "Fighting", "Action", "Adventure"],
      coverArtUrl: "https://res.cloudinary.com/dcsk4b8kl/image/upload/v1715543627/ironhack-project3/playstation_5.evilwest_CA.17084840711174326299_iuhtom.jpg",
      platform: ["PS4", "PS5"],
      contributedById: userId,
      contributedByUser: username,
      comments: []
    },
    {
      name: "The Witcher 3: Wild Hunt Complete Edition",
      releaseYear: 2015,
      genre: ["RPG", "Third-person Shooter", "Fighting", "Action", "Adventure"],
      coverArtUrl: "https://res.cloudinary.com/dcsk4b8kl/image/upload/v1715543628/ironhack-project3/playstation_5.thewitcher3wildhunt_DE.167757722634852234_bmxzug.jpg",
      platform: ["PS4"],
      contributedById: userId,
      contributedByUser: username,
      comments: []
    },
    {
      name: "Vampyr",
      releaseYear: 2018,
      genre: ["Action", "RPG", "Adventure", "Fighting"],
      coverArtUrl: "https://res.cloudinary.com/dcsk4b8kl/image/upload/v1715543628/ironhack-project3/playstation_4.vampyr_GB.1627342196866683177_jngmwz.jpg",
      platform: ["PS4"],
      contributedById: userId,
      contributedByUser: username,
      comments: []
    },
    {
      name: "Assassin's Creed Unity",
      releaseYear: 2014,
      genre: ["Stealth", "Action", "Adventure", "Fighting"],
      coverArtUrl: "https://res.cloudinary.com/dcsk4b8kl/image/upload/v1715543629/ironhack-project3/ps4_assassinscreedunity_bur39p.jpg",
      platform: ["PS4"],
      contributedById: userId,
      contributedByUser: username,
      comments: []
    },
    {
      name: "Battlefield 1",
      releaseYear: 2016,
      genre: ["FPS", "MMO"],
      coverArtUrl: "https://res.cloudinary.com/dcsk4b8kl/image/upload/v1715543629/ironhack-project3/ps4_battlefield1_vk9dxh.jpg",
      platform: ["PS4"],
      contributedById: userId,
      contributedByUser: username,
      comments: []
    },
    {
      name: "Tom Clancy's Ghost Recon Wildlands",
      releaseYear: 2017,
      genre: ["Tactical Shooter", "Third-person Shooter", "Adventure"],
      coverArtUrl: "https://res.cloudinary.com/dcsk4b8kl/image/upload/v1715543629/ironhack-project3/playstation_4.tomclancysghostreconwildlands_GB.16273420311569156691_slc6xo.jpg",
      platform: ["PS4"],
      contributedById: userId,
      contributedByUser: username,
      comments: []
    },
    {
      name: "Metal Gear Solid V: The Phantom Pain",
      releaseYear: 2015,
      genre: ["Stealth", "Action", "Adventure"],
      coverArtUrl: "https://res.cloudinary.com/dcsk4b8kl/image/upload/v1715543630/ironhack-project3/ps4_metalgearsolidvthephantompain_zfbeol.jpg",
      platform: ["PS4"],
      contributedById: userId,
      contributedByUser: username,
      comments: []
    },
    {
      name: "Metal Gear Solid V: Ground Zeroes",
      releaseYear: 2014,
      genre: ["Stealth", "Adventure"],
      coverArtUrl: "https://res.cloudinary.com/dcsk4b8kl/image/upload/v1715543630/ironhack-project3/ps4_metalgearsolidvgroundzeroes_q342wd.jpg",
      platform: ["PS4"],
      contributedById: userId,
      contributedByUser: username,
      comments: []
    },
    {
      name: "Uncharted: The Lost Legacy",
      releaseYear: 2017,
      genre: ["Stealth", "Third-person Shooter", "Action", "Adventure", "Puzzle"],
      coverArtUrl: "https://res.cloudinary.com/dcsk4b8kl/image/upload/v1715543630/ironhack-project3/playstation_4.unchartedthelostlegacy_AU.16273421512045329749_ab3vkf.jpg",
      platform: ["PS4"],
      contributedById: userId,
      contributedByUser: username,
      comments: []
    },
    {
      name: "Uncharted 4: A Thief's End",
      releaseYear: 2016,
      genre: ["Stealth", "Third-person Shooter", "Action", "Adventure", "Puzzle"],
      coverArtUrl: "https://res.cloudinary.com/dcsk4b8kl/image/upload/v1715543631/ironhack-project3/ps4_uncharted4ahiefsend_infzcy.jpg",
      platform: ["PS4"],
      contributedById: userId,
      contributedByUser: username,
      comments: []
    },
    {
      name: "Grand Theft Auto V",
      releaseYear: 2013,
      genre: ["Action", "Adventure", "Third-person Shooter"],
      coverArtUrl: "https://res.cloudinary.com/dcsk4b8kl/image/upload/v1715543630/ironhack-project3/ps4_grandtheftauto5_cqn39b.jpg",
      platform: ["PS3", "PS4", "PS5"],
      contributedById: userId,
      contributedByUser: username,
      comments: []
    },
    {
      name: "Mortal Kombat X",
      releaseYear: 2015,
      genre: ["Fighting", "Adventure", "RPG"],
      coverArtUrl: "https://res.cloudinary.com/dcsk4b8kl/image/upload/v1715543630/ironhack-project3/ps4_mortalkombatx_imrim7.jpg",
      platform: ["PS4"],
      contributedById: userId,
      contributedByUser: username,
      comments: []
    },
    {
      name: "Until Dawn",
      releaseYear: 2015,
      genre: ["Survival", "Horror", "Action", "Adventure", "Interactive Film"],
      coverArtUrl: "https://res.cloudinary.com/dcsk4b8kl/image/upload/v1715543631/ironhack-project3/ps4_untildawn_a4uw23.jpg",
      platform: ["PS4", "PS5"],
      contributedById: userId,
      contributedByUser: username,
      comments: []
    },
    {
      name: "Tom Clancy's The Division",
      releaseYear: 2015,
      genre: ["Third-person Shooter"],
      coverArtUrl: "https://res.cloudinary.com/dcsk4b8kl/image/upload/v1715543635/ironhack-project3/ps4_thedivision_xl1xwu.jpg",
      platform: ["PS4"],
      contributedById: userId,
      contributedByUser: username,
      comments: []
    }
]

const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ironhack-project3-server";

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