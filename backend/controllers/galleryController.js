import { Flipbook, GalleryPage } from "../models/flipbookModel.js";

export const addGalleryPage = async (req, res) => {
  try {
    const { flipbookId } = req.params;
    const { title, pageNumber, subtitle, imagesData } = req.body;

    // Find the flipbook by its ID
    const flipbook = await Flipbook.findById(flipbookId);
    if (!flipbook) {
      return res.status(404).json({ message: "Flipbook not found" });
    }

    // Check for duplicate page numbers in the flipbook
    const pageExists = flipbook.pages.some(
      (page) => page.pageNumber === parseInt(pageNumber, 10)
    );

    if (pageExists) {
      return res.status(400).json({
        message: "A page with this page number already exists",
      });
    }

    // Validate imagesData structure
    if (!Array.isArray(imagesData)) {
      return res.status(400).json({ message: "ImagesData should be an array" });
    }

    // Validate each image entry
    const isValidImages = imagesData.every(img => 
      img.imagesDataTitle && 
      img.imagesDataSubtitle && 
      img.imagesDataImage
    );

    if (!isValidImages) {
      return res.status(400).json({ message: "Each image must have title, subtitle, and image URL" });
    }

    // Create the new gallery page using the Mongoose model
    const newGalleryPage = new GalleryPage({
      title,
      pageNumber: parseInt(pageNumber, 10),
      subtitle,
      imagesData,
      pageType: 'Gallery', // Explicitly set the pageType
      isCustom: true
    });

    // Add the new gallery page to the flipbook's pages array
    flipbook.pages.push(newGalleryPage);

    // Save the updated flipbook
    await flipbook.save();

    res.status(201).json({
      message: "Gallery page added successfully",
      flipbook,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding gallery page",
      error: error.message,
    });
  }
};

export const updateGalleryPage = async (req, res) => {
  try {
    const { flipbookId, pageId } = req.params;
    const { title, subtitle, imagesData } = req.body;

    // Validate imagesData structure
    if (!Array.isArray(imagesData)) {
      return res.status(400).json({ message: "ImagesData should be an array" });
    }

    // Validate each image entry
    const isValidImages = imagesData.every(img => 
      img.imagesDataTitle && 
      img.imagesDataSubtitle && 
      img.imagesDataImage
    );

    if (!isValidImages) {
      return res.status(400).json({ message: "Each image must have title, subtitle, and image URL" });
    }

    // Update the page using findOneAndUpdate
    const result = await Flipbook.findOneAndUpdate(
      { 
        _id: flipbookId, 
        "pages._id": pageId,
        "pages.pageType": "Gallery" // Ensure we're updating a gallery page
      },
      {
        $set: {
          "pages.$.title": title,
          "pages.$.subtitle": subtitle,
          "pages.$.imagesData": imagesData,
        }
      },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "Flipbook or gallery page not found" });
    }

    res.status(200).json({
      message: "Gallery page updated successfully",
      flipbook: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating gallery page",
      error: error.message,
    });
  }
};

export const deleteGalleryPage = async (req, res) => {
  try {
    const { flipbookId, pageId } = req.params;

    // Use findOneAndUpdate with $pull to remove the specific gallery page
    const result = await Flipbook.findOneAndUpdate(
      { _id: flipbookId },
      {
        $pull: {
          pages: { 
            _id: pageId,
            pageType: "Gallery" // Ensure we're deleting a gallery page
          }
        }
      },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "Flipbook or gallery page not found" });
    }

    res.status(200).json({
      message: "Gallery page deleted successfully",
      flipbook: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting gallery page",
      error: error.message,
    });
  }
};

