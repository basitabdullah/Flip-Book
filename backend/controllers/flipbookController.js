import mongoose from "mongoose";
import { Flipbook } from "../models/flipbookModel.js";
import { PublishedFlipbook } from "../models/publishedFlipbookModel.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { log } from "console";

const __dirname = dirname(fileURLToPath(import.meta.url));
const uploadDir = "backend/uploads/pageContent";

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "backend/uploads/pageContent/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|webm|mov/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb("Error: Only images and videos are allowed!");
    }
  },
}).single("file");

// Get a flipbook by ID

export const getAllFlipbooks = async (req, res) => {
  try {
    const flipbooks = await Flipbook.find().sort({ createdAt: -1 }); // Sort by creation date, newest first

    if (!flipbooks || flipbooks.length === 0) {
      return res.status(404).json({ message: "No flipbooks found" });
    }

    res.status(200).json(flipbooks);
  } catch (error) {
    console.error("Error in getAllFlipbooks:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getFlipbookById = async (req, res) => {
  try {
    const { id } = req.params;

    const flipbook = await Flipbook.findById(id);

    if (!flipbook) {
      return res.status(404).json({ message: "Flipbook not found" });
    }

    res.status(200).json(flipbook);
  } catch (error) {
    console.error("Error in getFlipbookById:", error);
    res.status(500).json({ message: error.message });
  }
};

export const createFlipbook = async (req, res) => {
  const { name, image } = req.body;

  try {
    // Create a new flipbook
    const newFlipbook = new Flipbook({
      name,
      image,
      pages: [], // Initially no pages
    });

    await newFlipbook.save();

    res
      .status(201)
      .json({ message: "Flipbook created successfully.", newFlipbook });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteFlipbook = async (req, res) => {
  const { flipbookId } = req.params;

  try {
    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(flipbookId)) {
      return res.status(400).json({ message: "Invalid flipbook ID format" });
    }

    // Find and delete the flipbook
    const deletedFlipbook = await Flipbook.findByIdAndDelete(flipbookId);

    if (!deletedFlipbook) {
      return res.status(404).json({ message: "Flipbook not found" });
    }

    // Also delete any associated published flipbook
    await PublishedFlipbook.findOneAndDelete({ flipbook: flipbookId });

    res.status(200).json({
      message: "Flipbook deleted successfully",
      deletedFlipbook,
    });
  } catch (error) {
    console.error("Error deleting flipbook:", error);
    res.status(500).json({ message: error.message });
  }
};
// Get all pages in the flipbook
export const getAllPages = async (req, res) => {
  try {
    const flipbook = await Flipbook.findOne();
    if (!flipbook) {
      return res.status(404).json({ message: "Flipbook not found." });
    }
    res.status(200).json(flipbook.pages);
  } catch (error) {
    console.error("Error fetching pages:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get a single page by its page number
export const getPageByNumber = async (req, res) => {
  try {
    const flipbook = await Flipbook.findOne();
    if (!flipbook) {
      return res.status(404).json({ message: "Flipbook not found." });
    }
    const page = flipbook.pages.find(
      (p) => p.pageNumber === parseInt(req.params.pageNumber, 10)
    );
    if (!page) {
      return res.status(404).json({ message: "Page not found." });
    }
    res.status(200).json(page);
  } catch (error) {
    console.error("Error fetching page:", error);
    res.status(500).json({ message: error.message });
  }
};

// Create a new page
export const createPage = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: err.message || "Error uploading file" });
    }

    const { flipbookId } = req.params;
    const { title, pageNumber, description, contentType } = req.body;

    try {
      const flipbook = await Flipbook.findById(flipbookId);
      if (!flipbook) {
        return res.status(404).json({ message: "Flipbook not found." });
      }

      const existingPage = flipbook.pages.find(
        (p) => p.pageNumber === parseInt(pageNumber, 10)
      );
      if (existingPage) {
        return res.status(400).json({ message: "Page number already exists." });
      }

      let content = req.body.content;

      // If file was uploaded, use its path
      if (req.file) {
        content = req.file.path;
      }

      flipbook.pages.push({
        pageType: "Page",
        title,
        pageNumber,
        description,
        content,
        contentType,
      });

      await flipbook.save();
      res.status(201).json({ message: "Page added successfully.", flipbook });
    } catch (error) {
      console.error("Error creating page:", error);
      res.status(500).json({ message: error.message });
    }
  });
};

// Update an existing page
export const updatePage = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: err.message || "Error uploading file" });
    }

    const { title, description, pageNumber, contentType } = req.body;
    const { pageId, flipbookId } = req.params;

    // Validate MongoDB ObjectId format
    if (
      !mongoose.Types.ObjectId.isValid(flipbookId) ||
      !mongoose.Types.ObjectId.isValid(pageId)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid flipbook or page ID format" });
    }

    try {
      const flipbook = await Flipbook.findById(flipbookId);
      if (!flipbook) {
        return res.status(404).json({ message: "Flipbook not found." });
      }

      const pageIndex = flipbook.pages.findIndex(
        (p) => p._id.toString() === pageId
      );
      if (pageIndex === -1) {
        return res.status(404).json({ message: "Page not found." });
      }

      // Check for duplicate page number
      if (pageNumber && pageNumber !== flipbook.pages[pageIndex].pageNumber) {
        const pageExists = flipbook.pages.some(
          (p, idx) => idx !== pageIndex && p.pageNumber === pageNumber
        );
        if (pageExists) {
          return res
            .status(400)
            .json({ message: "Page number already exists." });
        }
      }

      // Handle content update
      let content = req.body.content;
      if (req.file) {
        content = req.file.path;
      }

      // Update the page while preserving pageType
      flipbook.pages[pageIndex] = {
        ...flipbook.pages[pageIndex],
        title: title || flipbook.pages[pageIndex].title,
        description: description || flipbook.pages[pageIndex].description,
        content: content || flipbook.pages[pageIndex].content,
        contentType: contentType || flipbook.pages[pageIndex].contentType,
        pageNumber: pageNumber || flipbook.pages[pageIndex].pageNumber,
        pageType: "Page",
      };

      await flipbook.save();
      res.status(200).json({ message: "Page updated successfully.", flipbook });
    } catch (error) {
      console.error("Error updating page:", error);
      res.status(500).json({ message: error.message });
    }
  });
};

// Delete a page
export const deletePage = async (req, res) => {
  const { pageId } = req.params;

  try {
    const flipbook = await Flipbook.findOne();
    if (!flipbook) {
      return res.status(404).json({ message: "Flipbook not found." });
    }

    // Find the page by ID instead of page number
    const pageIndex = flipbook.pages.findIndex(
      (p) => p._id.toString() === pageId
    );

    if (pageIndex === -1) {
      return res.status(404).json({ message: "Page not found." });
    }

    // Remove the page
    flipbook.pages.splice(pageIndex, 1);
    await flipbook.save();

    res.status(200).json({ message: "Page deleted successfully.", flipbook });
  } catch (error) {
    console.error("Error deleting page:", error);
    res.status(500).json({ message: error.message });
  }
};

//////////////////////publish/////////////////////////////////

// Publish a specific Flipbbok
export const publishFlipbook = async (req, res) => {
  const { flipbookId } = req.params;
  const { name, issueName } = req.body;

  try {
    const flipbook = await Flipbook.findById(flipbookId).lean();
    if (!flipbook) {
      return res.status(404).json({ message: "Flipbook not found." });
    }

    // First, unpublish all existing published flipbooks
    await PublishedFlipbook.updateMany(
      {}, // match all documents
      { isPublished: false }
    );

    const validatedPages = flipbook.pages
      .map((page) => {
        const basePage = {
          title: page.title,
          pageNumber: page.pageNumber,
        };

        switch (page.pageType) {
          case "Page":
            return {
              ...basePage,
              pageType: "PublishedPage",
              description: page.description,
              content: page.content,
              contentType: page.contentType,
            };

          case "IndexPage":
            return {
              ...basePage,
              pageType: "PublishedIndexPage",
              images: page.images || [],
              pagesTitles: page.pagesTitles || [],
              isCustom: true,
            };

          case "Gallery":
            return {
              ...basePage,
              pageType: "PublishedGalleryPage",
              subtitle: page.subtitle,
              imagesData: page.imagesData
                ? page.imagesData.map((img) => ({
                    imagesDataTitle: img.imagesDataTitle,
                    imagesDataSubtitle: img.imagesDataSubtitle,
                    imagesDataImage: img.imagesDataImage,
                  }))
                : [],
              isCustom: true,
            };

          case "Catalog":
            return {
              ...basePage,
              pageType: "PublishedCatalogPage",
              subtitle: page.subtitle,
              position : page.position,
              catalogItems: page.catalogItems
                ? page.catalogItems.map((item) => ({
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    amenities: item.amenities,
                  }))
                : [],
              isCustom: true,
            };

          case "Social":
            return {
              ...basePage,
              pageType: "PublishedSocialPage",
              subtitle: page.subtitle,
              street: page.street,
              city: page.city,
              postalCode: page.postalCode,
              phone: page.phone,
              email: page.email,
              mapUrl: page.mapUrl,
              socialLinks: page.socialLinks,
              isCustom: true,
            };

          case "ReviewsOrMap":
            return {
              ...basePage,
              pageType: "PublishedReviewsOrMapPage",
              content: page.content,
              isCustom: true,
            };

            case "BackCover":
              return {
                ...basePage,
                pageType: "PublishedBackCover",
                subtitle: page.subtitle,
                image : page.image,
                isCustom: true,
              };

          default:
            return null;
        }
      })
      .filter((page) => page !== null);

    const publishedFlipbook = new PublishedFlipbook({
      name,
      flipbook: flipbook._id,
      pages: validatedPages,
      issue: issueName,
      isPublished: true, // Set the latest one to published
    });

    await publishedFlipbook.save();

    // Return the populated published flipbook with complete data
    const populatedPublishedFlipbook = await PublishedFlipbook.findById(
      publishedFlipbook._id
    ).populate({
      path: "flipbook",
      model: "Flipbook",
    });

    res.status(200).json({
      message: "Flipbook published successfully.",
      publishedFlipbook: populatedPublishedFlipbook,
    });
  } catch (error) {
    console.error("Error publishing flipbook:", error);
    res.status(500).json({ message: error.message });
  }
};

//////////////////////////////////////////get published flipbook////////////////////////////////////

export const getPublishedFlipbook = async (req, res) => {
  const { flipbookId } = req.params;
  try {
    const flipbook = await PublishedFlipbook.findById(flipbookId).populate({
      path: "flipbook",
      model: "Flipbook",
    });

    if (!flipbook) {
      return res.status(404).json({ message: "Flipbook not found." });
    }

    res.status(200).json(flipbook);
  } catch (error) {
    console.error("Error getting flipbook:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllPublishedFlipbooks = async (req, res) => {
  try {
    const flipbooks = await PublishedFlipbook.find().populate({
      path: "flipbook",
      model: "Flipbook",
    });

    if (!flipbooks || flipbooks.length === 0) {
      console.log("No flipbooks found.");
      return res.status(404).json({ message: "No Published Flipbooks found." });
    }

    res.status(200).json(flipbooks);
  } catch (error) {
    console.error("Error getting flipbooks:", error);
    res.status(500).json({ message: error.message });
  }
};

export const togglePublishedFlipbook = async (req, res) => {
  const { flipbookId } = req.params;

  try {
    // Find the flipbook by its ID
    const flipbook = await PublishedFlipbook.findById(flipbookId);

    if (!flipbook) {
      return res.status(404).json({ message: "Flipbook not found." });
    }

    // Toggle the publication status of the selected flipbook
    flipbook.isPublished = !flipbook.isPublished;

    // If we are setting this flipbook to be published, make sure other flipbooks are unpublished
    if (flipbook.isPublished) {
      // Unpublish all other flipbooks
      await PublishedFlipbook.updateMany(
        { _id: { $ne: flipbookId } },
        { isPublished: false }
      );
    }

    // Save the updated flipbook status
    await flipbook.save();

    // Send a response with the updated status
    res.status(200).json({
      message: `Flipbook ${flipbookId} publication status toggled successfully.`,
      updatedFlipbookStatus: flipbook.isPublished,
    });
  } catch (error) {
    console.error("Error toggling flipbook publication status:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updatePublishedFlipbook = async (req, res) => {
  const { title, description, content, pageNumber, contentType } = req.body;
  const { pageId, flipbookId } = req.params;

  // Validate MongoDB ObjectId format
  if (
    !mongoose.Types.ObjectId.isValid(flipbookId) ||
    !mongoose.Types.ObjectId.isValid(pageId)
  ) {
    return res
      .status(400)
      .json({ message: "Invalid flipbook or page ID format" });
  }

  try {
    // Find the specific published flipbook by ID
    const publishedFlipbook = await PublishedFlipbook.findById(flipbookId);

    if (!publishedFlipbook) {
      return res.status(404).json({ message: "Published Flipbook not found." });
    }

    // Find the page by ID within the published flipbook's pages array
    const pageIndex = publishedFlipbook.pages.findIndex(
      (p) => p._id.toString() === pageId
    );

    if (pageIndex === -1) {
      return res.status(404).json({ message: "Page not found." });
    }

    // Check if the new page number already exists (if pageNumber is being changed)
    if (
      pageNumber &&
      pageNumber !== publishedFlipbook.pages[pageIndex].pageNumber
    ) {
      const pageExists = publishedFlipbook.pages.some(
        (p, idx) => idx !== pageIndex && p.pageNumber === pageNumber
      );
      if (pageExists) {
        return res.status(400).json({ message: "Page number already exists." });
      }
    }

    // Update the page
    publishedFlipbook.pages[pageIndex] = {
      ...publishedFlipbook.pages[pageIndex],
      title: title || publishedFlipbook.pages[pageIndex].title,
      description:
        description || publishedFlipbook.pages[pageIndex].description,
      content: content || publishedFlipbook.pages[pageIndex].content,
      contentType:
        contentType || publishedFlipbook.pages[pageIndex].contentType,
      pageNumber: pageNumber || publishedFlipbook.pages[pageIndex].pageNumber,
    };

    await publishedFlipbook.save();

    res.status(200).json({
      message: "Published flipbook page updated successfully.",
      publishedFlipbook,
    });
  } catch (error) {
    console.error("Error updating published flipbook page:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deletePublishedFlipbook = async (req, res) => {
  const { flipbookId } = req.params;
  let latestFlipbooks = [];

  try {
    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(flipbookId)) {
      return res.status(400).json({ message: "Invalid flipbook ID format" });
    }

    // Find the flipbook to be deleted
    const flipbookToDelete = await PublishedFlipbook.findById(flipbookId);

    if (!flipbookToDelete) {
      return res.status(404).json({ message: "Published flipbook not found" });
    }

    // If the flipbook being deleted was published, find the latest flipbook to publish
    if (flipbookToDelete.isPublished) {
      // Get all published flipbooks sorted by publishedAt in descending order
      latestFlipbooks = await PublishedFlipbook.find({
        _id: { $ne: flipbookId }, // Exclude the one being deleted
      }).sort({ publishedAt: -1 });

      // If there are other flipbooks, publish the latest one
      if (latestFlipbooks.length > 0) {
        const latestFlipbook = latestFlipbooks[0];
        latestFlipbook.isPublished = true;
        await latestFlipbook.save();
      }
    }

    // Delete the flipbook
    const deletedFlipbook = await PublishedFlipbook.findByIdAndDelete(
      flipbookId
    );

    // Update the original flipbook's isPublished status
    if (deletedFlipbook.flipbook) {
      await Flipbook.findByIdAndUpdate(deletedFlipbook.flipbook, {
        isPublished: false,
      });
    }

    res.status(200).json({
      message: "Published flipbook deleted successfully",
      deletedFlipbook,
      newPublishedFlipbook: latestFlipbooks[0] || null,
    });
  } catch (error) {
    console.error("Error deleting published flipbook:", error);
    res.status(500).json({ message: error.message });
  }
};