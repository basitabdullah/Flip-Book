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
  name: { type: String, required: true },
  image: { type: String, required: true },
  pages: [pageSchema], // Stores current pages of the flipbook
});

export const Flipbook = mongoose.model("Flipbook", flipbookSchema);
