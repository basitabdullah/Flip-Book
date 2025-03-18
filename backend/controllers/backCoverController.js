import { BackCover } from "../models/flipbookModel.js";
import multer from "multer";
import fs from "fs";
import { Flipbook } from "../models/flipbookModel.js";

const uploadDir = "backend/uploads/backcoverImages";

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "backend/uploads/backcoverImages");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images."), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export const addBackCoverPage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, pageNumber, subtitle } = req.body;

    const flipbook = await Flipbook.findById(id);
    if (!flipbook) {
      return res.status(404).json({ message: "Flipbook not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    const backCover = await BackCover.create({
      title,
      pageNumber: parseInt(pageNumber),
      subtitle,
      image: req.file.path,
      flipbook: id,
      pageType: "BackCover",
      isCustom: true,
    });
    flipbook.pages.push(backCover);
    await flipbook.save();
    res.status(201).json(backCover);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateBackCoverPage = async (req, res) => {
  try {
    const { flipbookId, pageId } = req.params;

    // Find the flipbook first
    const flipbook = await Flipbook.findById(flipbookId);
    if (!flipbook) {
      return res.status(404).json({ message: "Flipbook not found" });
    }

    // Find the page in flipbook's pages array
    const pageIndex = flipbook.pages.findIndex(
      (page) => page._id && page._id.toString() === pageId.toString()
    );

    if (pageIndex === -1) {
      // If not found in flipbook, try to find directly in BackCover collection
      const backCover = await BackCover.findById(pageId);
      if (!backCover) {
        return res.status(404).json({ message: "Back cover not found" });
      }

      // Update the back cover fields
      backCover.title = req.body.title || backCover.title;
      backCover.subtitle = req.body.subtitle || backCover.subtitle;

      if (req.file) {
        // Delete old image if it exists
        if (backCover.image) {
          try {
            fs.unlinkSync(backCover.image);
          } catch (err) {
            console.error("Error deleting old image:", err);
          }
        }
        backCover.image = req.file.path;
      }

      const updatedBackCover = await backCover.save();
      return res.json(updatedBackCover);
    }

    // If page found in flipbook, update both flipbook page and BackCover document
    const backCoverPage = flipbook.pages[pageIndex];
    const backCover = await BackCover.findById(backCoverPage._id);
    
    if (!backCover) {
      return res.status(404).json({ message: "Back cover document not found" });
    }

    // Update the back cover fields
    backCover.title = req.body.title || backCover.title;
    backCover.subtitle = req.body.subtitle || backCover.subtitle;

    if (req.file) {
      // Delete old image if it exists
      if (backCover.image) {
        try {
          fs.unlinkSync(backCover.image);
        } catch (err) {
          console.error("Error deleting old image:", err);
        }
      }
      backCover.image = req.file.path;
    }

    // Update the page in flipbook's pages array while preserving required fields
    flipbook.pages[pageIndex] = {
      ...flipbook.pages[pageIndex],  // Keep all existing fields
      _id: backCoverPage._id,        // Preserve the ID
      pageNumber: backCoverPage.pageNumber,  // Preserve the page number
      pageType: backCoverPage.pageType,      // Preserve the page type
      flipbook: flipbookId,          // Preserve the flipbook reference
      isCustom: true,
      title: req.body.title || backCoverPage.title,
      subtitle: req.body.subtitle || backCoverPage.subtitle,
      image: req.file ? req.file.path : backCoverPage.image
    };

    // Save both documents
    const [updatedBackCover, updatedFlipbook] = await Promise.all([
      backCover.save(),
      flipbook.save()
    ]);

    res.json(updatedBackCover);
  } catch (error) {
    console.error("Error updating back cover:", error);
    res.status(400).json({ message: error.message });
  }
};

export const deleteBackCoverPage = async (req, res) => {
  try {
    const { flipbookId, pageId } = req.params;

    // Find the flipbook first
    const flipbook = await Flipbook.findById(flipbookId);
    if (!flipbook) {
      return res.status(404).json({ message: "Flipbook not found" });
    }

    const pageIndex = flipbook.pages.findIndex(
      (page) => page._id && page._id.toString() === pageId.toString()
    );

    if (pageIndex === -1) {
      console.log("Page not found by ID, trying to find by type and number");

      // Try to find the back cover directly
      const backCover = await BackCover.findById(pageId);

      if (!backCover) {
        return res.status(404).json({ message: "Back cover not found" });
      }


      // Delete the back cover
      await backCover.deleteOne();

      // Also remove from flipbook if we can find it by pageNumber
      const pageByNumberIndex = flipbook.pages.findIndex(
        (page) =>
          (page.pageType === "BackCover" || page.pageType === "BackPage") &&
          page.pageNumber === backCover.pageNumber
      );

      if (pageByNumberIndex !== -1) {
        flipbook.pages.splice(pageByNumberIndex, 1);
        await flipbook.save();
      }

      return res.json({ message: "Back cover removed successfully" });
    }

    // Get the back cover from the flipbook
    const backCoverPage = flipbook.pages[pageIndex];

    // Remove the page from the flipbook's pages array
    flipbook.pages.splice(pageIndex, 1);
    await flipbook.save();

    // Now delete the actual back cover document if needed
    if (backCoverPage._id) {
      const backCover = await BackCover.findById(backCoverPage._id);
      if (backCover) {
        await backCover.deleteOne();
      }
    }

    res.json({ message: "Back cover removed successfully" });
  } catch (error) {
    console.error("Error deleting back cover:", error);
    res.status(500).json({ message: error.message });
  }
};
