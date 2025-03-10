import mongoose from "mongoose";

const basePageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    pageNumber: {
      type: Number,
      required: true,
      min: [1, "Page number must be positive"],
    },
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
    },
  })
);

// Index page schema
const IndexPage = BasePage.discriminator(
  "IndexPage",
  new mongoose.Schema({
    images: {
      type: [String],
      required: true,
    },
    isCustom: { type: Boolean, default: true },
  })
);

// Galery page schema
const GalleryPage = BasePage.discriminator(
  "Gallery",
  new mongoose.Schema({
    subtitle: { type: String, required: true },
    imagesData: [
      {
        imagesDataTitle: { type: String, required: true },
        imagesDataSubtitle: { type: String, required: true },
        imagesDataImage: { type: String, required: true },
      },
    ],
    isCustom: { type: Boolean, default: true },
  })
);

// backCover page schema
const BackCover = BasePage.discriminator(
  "BackCover",
  new mongoose.Schema({
    subtitle: { type: String, required: true },
    image: { type: String, required: true },
    isCustom: { type: Boolean, default: true },
  })
);
// Catalog page schema
const CatalogPage = BasePage.discriminator(
  "Catalog",
  new mongoose.Schema({
    subtitle: { type: String, required: true },
    catalogItems: [
      {
        name: { type: String, required: true },
        price: { type: String, required: true },
        image: { type: String, required: true },
        amenities: [{ type: String, required: true }],
      },
    ],
    isCustom: { type: Boolean, default: true },
  })
);

// Catalog page schema
const ReviewsOrMapPage = BasePage.discriminator(
  "ReviewsOrMap",
  new mongoose.Schema({
    content: { type: String, required: true },
    isCustom: { type: Boolean, default: true },
  })
);

// Social page schema
const SocialPage = BasePage.discriminator(
  "Social",
  new mongoose.Schema({
    subtitle: { type: String, required: true },

    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: Number, required: true },

    phone: { type: Number, required: true },
    email: { type: String, required: true },

    mapUrl: { type: String, required: true },
    socialLinks: [
      {
        platform: {
          type: String,
          required: true,
          enum: ["facebook", "instagram", "twitter", "youtube"],
        },
        url: {
          type: String,
          required: true,
          default: function () {
            return `https://${this.platform}.com`;
          },
        },
      },
    ],
    isCustom: { type: Boolean, default: true },
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

// Export all models
export {
  Flipbook,
  BasePage,
  Page,
  IndexPage,
  GalleryPage,
  CatalogPage,
  SocialPage,
  ReviewsOrMapPage,
  BackCover,
};
