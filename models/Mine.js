const mongoose = require("mongoose");
const MineSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  time: { type: Number, required: true },
  count: { type: Number, required: true }
});
module.exports = mongoose.model("Mine", MineSchema);