import mongoose from "mongoose";

const basePageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    pageNumber: { 
      type: Number, 
      required: true,
      min: [1, 'Page number must be positive'] 
    }
  },
  { discriminatorKey: "pageType" }
);

const BasePage = mongoose.model("BasePage", basePageSchema);

// Normal page schema (this maintains compatibility with existing controllers)
const Page = BasePage.discriminator(
  "Page",
  new mongoose.Schema({
    description: { type: String, required: true },
    content: { type: String, required: true }, // URL for image, video, or map
    contentType: {
      type: String,
      required: true,
      enum: ["image", "video", "map"],
    }
  })
);

// Index page schema
const IndexPage = BasePage.discriminator(
  "IndexPage",
  new mongoose.Schema({
    description: { type: String, required: true },
    content: { type: String, required: true },
    contentType: {
      type: String,
      required: true,
      enum: ["image", "video", "map"],
    },
    images: { type: [String], required: true },
    pagesTitles: [{
      title: { type: String, required: true },
      pageNumber: { type: Number, required: true },
    }]
  })
);

// Keep the original flipbook schema unchanged for compatibility
const flipbookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  pages: [basePageSchema], // Can store both normal and index pages
  isPublished: { type: Boolean, default: false },
});

// Add compound index to ensure unique page numbers within a flipbook
flipbookSchema.index({ "pages.pageNumber": 1, _id: 1 }, { unique: true });

const Flipbook = mongoose.model("Flipbook", flipbookSchema);

// Export in the same way as before to maintain compatibility
export { Flipbook, BasePage, Page, IndexPage };    