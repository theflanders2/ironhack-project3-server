const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  prestigeLevel: { type: String, default: "Recently discovered gaming." },
  avatarUrl: { type: String, default: "" },
  gamesContributed: [ { type: Schema.Types.ObjectId, ref: 'Game' } ],
  gamesPlayed: [ { type: Schema.Types.ObjectId, ref: 'Game' } ],
  gamesCurrentlyPlaying: [ { type: Schema.Types.ObjectId, ref: 'Game' } ],
  wishlist: [ { type: Schema.Types.ObjectId, ref: 'Game' } ]
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

module.exports = model("User", userSchema);
