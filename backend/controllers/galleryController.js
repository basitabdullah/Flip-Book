import { Flipbook, GalleryPage } from "../models/flipbookModel.js";
import multer from "multer";
import fs from "fs";

// Ensure upload directory exists
const uploadDir = "backend/uploads/galleryImages";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
}).array("images", 8); // Allow up to 8 images

export const addGalleryPage = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ 
        message: "Error uploading files", 
        error: err 
      });
    }

    try {
      const { flipbookId } = req.params;
      const { title, pageNumber, subtitle } = req.body;
      
      // Parse imagesData from the request body
      let imagesData;
      try {
        imagesData = JSON.parse(req.body.imagesData);
      } catch (error) {
        return res.status(400).json({ message: "ImagesData should be a valid JSON array" });
      }

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

      // Handle file uploads if any
      if (req.files?.length > 0) {
        const newImagePaths = req.files.map(file => `/uploads/galleryImages/${file.filename}`);
        // Update imagesData with new image paths
        imagesData = imagesData.map((item, index) => ({
          ...item,
          imagesDataImage: newImagePaths[index] || item.imagesDataImage
        }));
      }

      // Create the new gallery page
      const newGalleryPage = {
        title,
        pageNumber: parseInt(pageNumber, 10),
        subtitle,
        imagesData,
        pageType: 'Gallery',
        isCustom: true
      };

      // Add the page to the flipbook
      flipbook.pages.push(newGalleryPage);
      await flipbook.save();

      res.status(201).json({
        message: "Gallery page added successfully",
        flipbook
      });
    } catch (error) {
      console.error('Error in addGalleryPage:', error);
      res.status(500).json({ message: error.message });
    }
  });
};

export const updateGalleryPage = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ 
        message: "Error uploading files", 
        error: err 
      });
    }

    try {
      const { flipbookId, pageId } = req.params;
      const { title, subtitle, pageNumber } = req.body;
      let imagesData = JSON.parse(req.body.imagesData || '[]');

      const flipbook = await Flipbook.findById(flipbookId);
      if (!flipbook) {
        return res.status(404).json({ message: "Flipbook not found" });
      }

      const pageIndex = flipbook.pages.findIndex(
        page => page._id.toString() === pageId && page.pageType === 'Gallery'
      );

      if (pageIndex === -1) {
        return res.status(404).json({ message: "Gallery page not found" });
      }

      // If updating page number, check if new number already exists
      if (pageNumber !== flipbook.pages[pageIndex].pageNumber) {
        const pageExists = flipbook.pages.some(
          page => page.pageNumber === parseInt(pageNumber) && page._id.toString() !== pageId
        );

        if (pageExists) {
          return res.status(400).json({ 
            message: "A page with this page number already exists" 
          });
        }
      }

      // Handle file uploads if any
      if (req.files?.length > 0) {
        const newImagePaths = req.files.map(file => `/uploads/galleryImages/${file.filename}`);
        // Update imagesData with new image paths
        imagesData = imagesData.map((item, index) => ({
          ...item,
          imagesDataImage: newImagePaths[index] || item.imagesDataImage
        }));
      }

      // Update the page
      flipbook.pages[pageIndex] = {
        ...flipbook.pages[pageIndex],
        title,
        subtitle,
        imagesData,
        pageNumber: parseInt(pageNumber),
        pageType: 'Gallery',
        isCustom: true
      };

      await flipbook.save();

      res.status(200).json({
        message: "Gallery page updated successfully",
        flipbook
      });
    } catch (error) {
      console.error('Error updating gallery page:', error);
      res.status(500).json({
        message: "Error updating gallery page",
        error: error.message
      });
    }
  });
};

export const deleteGalleryPage = async (req, res) => {
  try {
    const { flipbookId, pageId } = req.params;

    // Find the flipbook
    const flipbook = await Flipbook.findById(flipbookId);
    if (!flipbook) {
      return res.status(404).json({ message: "Flipbook not found" });
    }

    // Find the page index
    const pageIndex = flipbook.pages.findIndex(
      page => page._id.toString() === pageId && page.pageType === 'Gallery'
    );

    if (pageIndex === -1) {
      return res.status(404).json({ message: "Gallery page not found" });
    }

    // Remove the page
    flipbook.pages.splice(pageIndex, 1);

    // Save the updated flipbook
    await flipbook.save();

    res.status(200).json({
      message: "Gallery page deleted successfully",
      flipbook
    });
  } catch (error) {
    console.error('Error deleting gallery page:', error);
    res.status(500).json({
      message: "Error deleting gallery page",
      error: error.message
    });
  }
};

