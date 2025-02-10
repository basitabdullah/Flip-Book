// import mongoose from "mongoose";

// const basePageSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     description: { type: String, required: true },
//     content: { type: String, required: true }, // URL for image, video, or map
//     pageNumber: { type: Number, required: true },
//     contentType: {
//       type: String,
//       required: true,
//       enum: ["image", "video", "map"], // Add allowed content types
//     },
//   },
//   { discriminatorKey: "pageType" }
// );

// const Page = mongoose.model("Page", basePageSchema);

// const IndexPage = Page.discriminator(
//   "IndexPage",
//   new mongoose.Schema({
//     sections: [{
//       title: { type: String, required: true },
//       pageNumber: { type: Number, required: true }
//     }]
//   })
// );

// const flipbookSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   image: { type: String, required: true },
//   pages: [basePageSchema], // Stores current pages of the flipbook
// });

//  const Flipbook = mongoose.model("Flipbook", flipbookSchema);
// export { Flipbook, Page, IndexPage };    






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
  pageType: {
    type: String,
    enum: ['regular', 'index', 'chapter', 'grid'],
    default: 'regular'
  },
  isCustom: {
    type: Boolean,
    default: false
  },
  tableOfContents: [
    {
      title: String,
      pageNumber: Number,
    },
  ],
});

const indexPageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  pageNumber: { type: Number, required: true, unique: true },
  tableOfContents: [
    {
      title: String,
      pageNumber: Number,
    },
  ],
  pageType: { type: String, default: "index" },
});

const catalogPageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  pageNumber: { type: Number, required: true },
  items: [
    {
      name: String,
      description: String,
      price: Number,
      image: String,
    },
  ],
  pageType: { type: String, default: "catalog" },
});

const galleryPageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  pageNumber: { type: Number, required: true },
  images: [
    {
      url: String,
      caption: String,
    },
  ],
  pageType: { type: String, default: "gallery" },
});

const reviewsPageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  pageNumber: { type: Number, required: true },
  reviews: [
    {
      author: String,
      rating: Number,
      comment: String,
      date: Date,
    },
  ],
  pageType: { type: String, default: "reviews" },
});

const coverPageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  pageNumber: { type: Number, required: true },
  coverImage: { type: String, required: true },
  subtitle: String,
  author: String,
  pageType: { type: String, default: "cover" },
});

const socialPageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  pageNumber: { type: Number, required: true },
  socialLinks: [
    {
      platform: String,
      url: String,
      icon: String,
    },
  ],
  pageType: { type: String, default: "social" },
});

const thanksPageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  pageNumber: { type: Number, required: true },
  message: { type: String, required: true },
  pageType: { type: String, default: "thanks" },
});

const flipbookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  pages: [
    {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      discriminatorKey: "pageType",
    },
  ],
});

const Flipbook = mongoose.model("Flipbook", flipbookSchema);

// Create discriminators for each page type
const pageTypes = {
  index: indexPageSchema,
  catalog: catalogPageSchema,
  gallery: galleryPageSchema,
  reviews: reviewsPageSchema,
  cover: coverPageSchema,
  social: socialPageSchema,
  thanks: thanksPageSchema,
  content: pageSchema, // Your original page schema for image/video/map content
};

Object.entries(pageTypes).forEach(([type, schema]) => {
  Flipbook.discriminator(type, schema);
});

export { Flipbook };
