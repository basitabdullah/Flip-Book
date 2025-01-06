import mongoose from "mongoose";

const archiveSchema = new mongoose.Schema({
  version: { type: String, required: true, unique: true },
  flipbook: { type: mongoose.Schema.Types.ObjectId, ref: "Flipbook" },
  archivedAt: { type: Date, default: Date.now },
});

export const Archive = mongoose.model("Archive", archiveSchema);



