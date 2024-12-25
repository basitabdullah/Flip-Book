import mongoose from "mongoose";

const pageSchema = new mongoose.Schema({
  pageNumber: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  mediaType: { type: String, enum: ["image", "video", "map"], required: true },
  mediaURL: { type: String, required: true },
});

export const Page = mongoose.model("Page", pageSchema);
