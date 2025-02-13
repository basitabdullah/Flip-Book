import { Flipbook, GalleryPage } from "../models/flipbookModel.js";

export const addGalleryPage = async (req, res) => {
  try {
    const { flipbookId } = req.params;
    const { title, pageNumber, subtitle, images } = req.body;

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

    // Parse images if needed
    const parsedImages =
      typeof images === "string" ? JSON.parse(images) : images;

    if (!Array.isArray(parsedImages)) {
      return res.status(400).json({ message: "Images should be an array" });
    }

    // Create the new gallery page using the Mongoose model
    const newGalleryPage = new GalleryPage({
      title,
      pageNumber: parseInt(pageNumber, 10),
      subtitle,
      imagesData: parsedImages,
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
    const { flipbookId,pageNumber } = req.params;
    const { title, subtitle, images } = req.body;

    // Find the flipbook by its ID
    const flipbook = await Flipbook.findById(flipbookId);
    if (!flipbook) {
      return res.status(404).json({ message: "Flipbook not found" });
    }

    // Parse images if needed
    const parsedImages =
      typeof images === "string" ? JSON.parse(images) : images;

    if (!Array.isArray(parsedImages)) {
      return res.status(400).json({ message: "Images should be an array" });
    }

    // Create the new gallery page using the Mongoose model
    const newGalleryPage = new GalleryPage({
      title,
      pageNumber: parseInt(pageNumber, 10),
      subtitle,
      imagesData: parsedImages,
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

export const deleteGalleryPage = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({
      message: "Error adding deleting gallery page",
      error: error.message,
    });
  }
};
