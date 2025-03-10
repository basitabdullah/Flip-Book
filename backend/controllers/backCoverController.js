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
    const { flipbookId, pageNumber } = req.params;
    const backCover = await BackCover.findOne({
      flipbook: flipbookId,
      pageNumber: parseInt(pageNumber),
    });

    if (!backCover) {
      return res.status(404).json({ message: "Back cover not found" });
    }

    backCover.title = req.body.title || backCover.title;
    backCover.subtitle = req.body.subtitle || backCover.subtitle;

    if (req.file) {
      backCover.image = req.file.path;
    }

    const updatedBackCover = await backCover.save();
    res.json(updatedBackCover);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteBackCoverPage = async (req, res) => {
  try {
    const { flipbookId, pageNumber } = req.params;
    const backCover = await BackCover.findOne({
      flipbook: flipbookId,
      pageNumber: parseInt(pageNumber),
    });

    if (!backCover) {
      return res.status(404).json({ message: "Back cover not found" });
    }

    await backCover.deleteOne();
    res.json({ message: "Back cover removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
