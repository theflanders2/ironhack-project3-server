const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const commentSchema = new Schema({
	game: { type: Schema.Types.ObjectId, ref: "Game" },
	author: { type: Schema.Types.ObjectId, ref: "User" },
    content: { type: String, required: true }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

module.exports = model("Comment", userSchema);