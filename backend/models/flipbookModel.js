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
});


const flipbookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  pages: [pageSchema], // Stores current pages of the flipbook
});

export const Flipbook = mongoose.model("Flipbook", flipbookSchema);