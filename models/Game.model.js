const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const gameSchema = new Schema({
  name: { type: String, required: true },
  realeaseyYear: { type: String, required: true },
  genre: { type: String, required: true },
  platform: { type: String, enum: ["PSOne", "PS2", "PS3", "PS4", "PS5"] },
  contributedBy: [ { type: Schema.Types.ObjectId, ref: 'User' } ],
  comments: [ { type: Schema.Types.ObjectId, ref: 'Comment' } ]
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

module.exports = model("Game", gameSchema);