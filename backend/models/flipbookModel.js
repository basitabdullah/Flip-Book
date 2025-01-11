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
  pages: [pageSchema],
  currentVersion: { type: String, default: "1.0" }, // e.g., versioning
});

export const Flipbook = mongoose.model("Flipbook", flipbookSchema);
