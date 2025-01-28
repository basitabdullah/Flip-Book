import mongoose from "mongoose";

const pageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true }, // URL for image, video, or map
  pageNumber: { type: Number, required: true },
  contentType: {
    type: String,
    required: true,
    enum: ["image", "video", "map"], // Add allowed content types
  },
});

const flipbookSchema = new mongoose.Schema({
  pages: [pageSchema], // Stores current pages of the flipbook
  currentVersion: { type: String, default: "1.0" }, // The current version of the flipbook
  archivedVersions: [
    {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Archive", // References the Archive model
    },
  ],
});

export const Flipbook = mongoose.model("Flipbook", flipbookSchema);
