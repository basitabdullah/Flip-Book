import mongoose from "mongoose";

const publishedFlipbookSchema = new mongoose.Schema({
  issue: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  flipbook: { type: mongoose.Schema.Types.ObjectId, unique: false, ref: "Flipbook" },
  isPublished: { type: Boolean, default: false },
  pages: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true }, // URL for image, video, or map
    pageNumber: { type: Number, required: true },
    contentType: {
      type: String,
      required: true,
      enum: ["image", "video", "map"],
    },
  }],
  publishedAt: { type: Date, default: Date.now },
});

export const PublishedFlipbook = mongoose.model("PublishedFlipbook", publishedFlipbookSchema);