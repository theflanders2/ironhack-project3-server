const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const gameSchema = new Schema({
  name: { type: String, required: true },
  releaseYear: { type: Number, required: true },
  genre: { type: String, required: true },
  coverArtUrl: { type: String, required: false },
  platform: { type: String, enum: ["PSOne", "PS2", "PS3", "PS4", "PS5"], required: true },
  contributedById: { type: Schema.Types.ObjectId, ref: 'User' },
  contributedByUser: { type: String, required: true},
  comments: [ { type: Schema.Types.ObjectId, ref: 'Comment' } ]
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

module.exports = model("Game", gameSchema);