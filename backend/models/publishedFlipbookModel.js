import mongoose from "mongoose";

const basePublishedPageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    pageNumber: { type: Number, required: true },
  },
  { discriminatorKey: "pageType" }
);

const BasePublishedPage = mongoose.model(
  "BasePublishedPage",
  basePublishedPageSchema
);

// Regular published page
const PublishedPage = BasePublishedPage.discriminator(
  "PublishedPage",
  new mongoose.Schema({
    description: { type: String, required: true },
    content: { type: String, required: true },
    contentType: {
      type: String,
      required: true,
      enum: ["image", "video", "map"],
    },
  })
);
const PublishedBackCover = BasePublishedPage.discriminator(
  "PublishedBackCover",
  new mongoose.Schema({
    subtitle: { type: String, required: true },
    image: { type: String, required: true },
    isCustom: { type: Boolean, default: true },
  })
);
// Published index page
const PublishedIndexPage = BasePublishedPage.discriminator(
  "PublishedIndexPage",
  new mongoose.Schema({
    images: { type: [String], required: true },
    pagesTitles: [
      {
        title: { type: String, required: true },
        pageNumber: { type: Number, required: true, min: 1 },
      },
    ],
    isCustom: { type: Boolean, default: true },
  })
);

// Published gallery page - matching the original flipbook model structure
const PublishedGalleryPage = BasePublishedPage.discriminator(
  "PublishedGalleryPage",
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

// Published catalog page
const PublishedCatalogPage = BasePublishedPage.discriminator(
  "PublishedCatalogPage",
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

// Published social page
const PublishedSocialPage = BasePublishedPage.discriminator(
  "PublishedSocialPage",
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

// Published reviews or map page
const PublishedReviewsOrMapPage = BasePublishedPage.discriminator(
  "PublishedReviewsOrMapPage",
  new mongoose.Schema({
    content: { type: String, required: true },
    isCustom: { type: Boolean, default: true },
  })
);
const publishedFlipbookSchema = new mongoose.Schema({
  issue: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  flipbook: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flipbook",
    unique: false,
  },
  isPublished: { type: Boolean, default: false },
  pages: [basePublishedPageSchema],
  publishedAt: { type: Date, default: Date.now },
});

const PublishedFlipbook = mongoose.model(
  "PublishedFlipbook",
  publishedFlipbookSchema
);

export {
  PublishedFlipbook,
  BasePublishedPage,
  PublishedPage,
  PublishedIndexPage,
  PublishedGalleryPage,
  PublishedCatalogPage,
  PublishedSocialPage,
  PublishedReviewsOrMapPage,
  PublishedBackCover
};
