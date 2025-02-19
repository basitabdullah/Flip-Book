import { Flipbook, IndexPage } from "../models/flipbookModel.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const uploadDir = 'backend/uploads/indexImages';

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'backend/uploads/indexImages/') 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Images only!');
    }
  }
}).array('images', 8); // Allow up to 8 images

// Add index page
export const addIndexPage = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ 
        message: "Error uploading files", 
        error: err.message || err 
      });
    }

    try {
      console.log('Request body:', req.body);
      console.log('Uploaded files:', req.files);
      
      const { flipbookId } = req.params;
      const { title, pageNumber } = req.body;

      const flipbook = await Flipbook.findById(flipbookId);
      if (!flipbook) {
        return res.status(404).json({ message: "Flipbook not found" });
      }

      // Check if page number already exists
      const pageExists = flipbook.pages.some(
        page => page.pageNumber === parseInt(pageNumber)
      );

      if (pageExists) {
        return res.status(400).json({ 
          message: "A page with this page number already exists" 
        });
      }

      // Generate image paths - ensure each file is only processed once
      const imagePaths = [...new Set(req.files.map(file => `/backend/uploads/indexImages/${file.filename}`))];

      const newIndexPage = new IndexPage({
        title,
        pageNumber: parseInt(pageNumber),
        images: imagePaths,
        pageType: 'IndexPage',
        isCustom: true
      });

      flipbook.pages.push(newIndexPage);
      await flipbook.save();

      res.status(201).json({ 
        message: "Index page added successfully", 
        flipbook 
      });
    } catch (error) {
      console.error('Error in addIndexPage:', error);
      res.status(500).json({ 
        message: "Error adding index page", 
        error: error.message 
      });
    }
  });
};

// Update index page
export const updateIndexPage = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ 
        message: "Error uploading files", 
        error: err 
      });
    }

    try {
      const { flipbookId, pageNumber } = req.params;
      const { title, newPageNumber } = req.body;

      const flipbook = await Flipbook.findById(flipbookId);
      if (!flipbook) {
        return res.status(404).json({ message: "Flipbook not found" });
      }

      const pageIndex = flipbook.pages.findIndex(
        page => page.pageNumber === parseInt(pageNumber) && page.pageType === 'IndexPage'
      );

      if (pageIndex === -1) {
        return res.status(404).json({ message: "Index page not found" });
      }

      // Generate new image paths if files were uploaded - ensure each file is only processed once
      const imagePaths = req.files?.length > 0 
        ? [...new Set(req.files.map(file => `/backend/uploads/indexImages/${file.filename}`))]
        : flipbook.pages[pageIndex].images;

      // Update the page
      flipbook.pages[pageIndex] = {
        ...flipbook.pages[pageIndex],
        title: title || flipbook.pages[pageIndex].title,
        pageNumber: parseInt(newPageNumber || pageNumber),
        images: imagePaths,
        pageType: 'IndexPage',
        isCustom: true
      };

      await flipbook.save();

      res.status(200).json({ 
        message: "Index page updated successfully", 
        flipbook 
      });
    } catch (error) {
      res.status(500).json({ 
        message: "Error updating index page", 
        error: error.message 
      });
    }
  });
};

// Delete index page
export const deleteIndexPage = async (req, res) => {
  try {
    const { flipbookId, pageNumber } = req.params;

    const flipbook = await Flipbook.findById(flipbookId);
    if (!flipbook) {
      return res.status(404).json({ message: "Flipbook not found" });
    }

    // Find the index of the page to delete
    const pageIndex = flipbook.pages.findIndex(
      page => page.pageNumber === parseInt(pageNumber) && page.pageType === 'IndexPage'
    );

    if (pageIndex === -1) {
      return res.status(404).json({ message: "Index page not found" });
    }

    // Remove the page
    flipbook.pages.splice(pageIndex, 1);
    await flipbook.save();

    res.status(200).json({ 
      message: "Index page deleted successfully",
      flipbook 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error deleting index page", 
      error: error.message 
    });
  }
}; 