import mongoose from "mongoose";
import { Flipbook } from "../models/flipbookModel.js";
import { Archive } from "../models/archiveModel.js";
import { PublishedFlipbook } from "../models/publishedFlipbookModel.js";
// Get a flipbook by ID

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
  const { currentVersion } = req.body;

  try {
    // Create a new flipbook
    const newFlipbook = new Flipbook({
      pages: [], // Initially no pages
      currentVersion: currentVersion || "1.0", // Default version if not provided
    });

    await newFlipbook.save();

    res
      .status(201)
      .json({ message: "Flipbook created successfully.", newFlipbook });
  } catch (error) {
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
  const { flipbookId } = req.params; // Flipbook ID passed as a parameter
  const { pageNumber, title, description, content, contentType } = req.body;

  try {
    // Find the specific flipbook by ID
    const flipbook = await Flipbook.findById(flipbookId);

    // If the flipbook does not exist
    if (!flipbook) {
      return res.status(404).json({ message: "Flipbook not found." });
    }

    // Check if a page with the same page number already exists
    const existingPage = flipbook.pages.find(
      (p) => p.pageNumber === parseInt(pageNumber, 10)
    );
    if (existingPage) {
      return res.status(400).json({ message: "Page number already exists." });
    }

    // Add the new page to the flipbook
    flipbook.pages.push({
      pageNumber,
      title,
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
};

// Update an existing page
export const updatePage = async (req, res) => {
  const { title, description, content, pageNumber, version, contentType } =
    req.body;
  const { pageId } = req.params;
  const { flipbookId } = req.params;

  console.log("Received request with:", {
    flipbookId,
    pageId,
    body: req.body,
  });

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
    // Find the specific flipbook by ID
    const flipbook = await Flipbook.findById(flipbookId);
    console.log("Flipbook query result:", flipbook);

    if (!flipbook) {
      return res.status(404).json({ message: "Flipbook not found." });
    }

    // Find the page by ID within the flipbook's pages array
    const pageIndex = flipbook.pages.findIndex(
      (p) => p._id.toString() === pageId
    );
    console.log("Page search result:", {
      pageIndex,
      availablePages: flipbook.pages.map((p) => p._id.toString()),
    });

    if (pageIndex === -1) {
      return res.status(404).json({ message: "Page not found." });
    }

    // Check if the new page number already exists (if pageNumber is being changed)
    if (pageNumber && pageNumber !== flipbook.pages[pageIndex].pageNumber) {
      const pageExists = flipbook.pages.some(
        (p, idx) => idx !== pageIndex && p.pageNumber === pageNumber
      );
      if (pageExists) {
        return res.status(400).json({ message: "Page number already exists." });
      }
    }

    // Update the page
    flipbook.pages[pageIndex] = {
      ...flipbook.pages[pageIndex],
      title: title || flipbook.pages[pageIndex].title,
      description: description || flipbook.pages[pageIndex].description,
      content: content || flipbook.pages[pageIndex].content,
      contentType: contentType || flipbook.pages[pageIndex].contentType,
      pageNumber: pageNumber || flipbook.pages[pageIndex].pageNumber,
    };

    await flipbook.save();

    res.status(200).json({ message: "Page updated successfully.", flipbook });
  } catch (error) {
    console.error("Error updating page:", error);
    res.status(500).json({ message: error.message });
  }
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

//get archived version by ID
export const getArchivedVersionById = async (req, res) => {
  try {
    const { archiveId } = req.params;
    const archive = await Archive.findById(archiveId);
    if (!archive) {
      return res.status(404).json({ message: "Archived version not found." });
    }
    res.status(200).json(archive);
  } catch (error) {
    console.error("Error fetching archived version:", error);
    res.status(500).json({ message: error.message });
  }
};
// Archive the current flipbook version
export const archiveVersion = async (req, res) => {
  const { version } = req.body;
  const { name } = req.body;
  const { flipbookId } = req.params; // Extract flipbookId from URL params

  try {
    // Validate flipbookId
    if (!flipbookId) {
      return res.status(400).json({ message: "Flipbook ID is required." });
    }

    // Find the flipbook by ID
    const flipbook = await Flipbook.findById(flipbookId);
    if (!flipbook) {
      return res.status(404).json({ message: "Flipbook not found." });
    }

    // Check if the version already exists in the Archive
    const existingArchive = await Archive.findOne({
      flipbookId: flipbook._id,
      version,
    });

    if (existingArchive) {
      return res.status(400).json({ message: "Version already exists." });
    }

    // Create a new Archive entry
    const archive = new Archive({
      name,
      flipbook: flipbook._id,
      version: version || `v${Date.now()}`, // Default version if not provided
      pages: flipbook.pages, // Copy all pages from the flipbook
    });

    await archive.save();

    res
      .status(201)
      .json({ message: "Version archived successfully.", archive });
  } catch (error) {
    console.error("Error archiving version:", error);
    res.status(500).json({ message: error.message });
  }
};

// Retrieve all archived versions
export const getArchivedVersions = async (req, res) => {
  try {
    const archives = await Archive.find();

    res.status(200).json(archives);
  } catch (error) {
    console.error("Error fetching archives:", error);
    res.status(500).json({ message: error.message });
  }
};

//////////////////////publish/////////////////////////////////

// Publish a specific archived version
export const publishArchivedVersion = async (req, res) => {
  const { flipbookId, version } = req.params;
  try {
    const archive = await Archive.findOne({
      flipbookId,
      version,
    });
    if (!archive) {
      return res.status(404).json({ message: "Archived version not found." });
    }

    const flipbook = await Flipbook.findOneAndUpdate(
      { _id: req.params.flipbookId },
      { pages: archive.pages },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Archived version published successfully.", flipbook });
  } catch (error) {
    console.error("Error publishing archived version:", error);
    res.status(500).json({ message: error.message });
  }
};

// Publish a specific Flipbbok
export const publishFlipbook = async (req, res) => {
  const { flipbookId } = req.params;
  const { name } = req.body;
  const { issueName } = req.body;

  try {
    // Find the Flipbook by ID
    const flipbook = await Flipbook.findById(flipbookId);
    if (!flipbook) {
      return res.status(404).json({ message: "Flipbook not found." });
    }

    // Create a new PublishedFlipbook
    const publishedFlipbook = new PublishedFlipbook({
      name,
      flipbook: flipbook._id,
      pages: flipbook.pages,
      issue: issueName,
    });

    // Save the PublishedFlipbook
    await publishedFlipbook.save();

    // Mark the Flipbook as published
    flipbook.isPublished = true;
    await flipbook.save();

    // Respond with success
    res.status(200).json({
      message: "Flipbook published successfully.",
      publishedFlipbook,
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
    const flipbook = await PublishedFlipbook.findById(flipbookId);
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
    const flipbooks = await PublishedFlipbook.find();

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
    const flipbook = await PublishedFlipbook.findById(flipbookId);

    if (!flipbook) {
      return res.status(404).json({ message: "Flipbook not found." });
    }

    flipbook.isPublished = !flipbook.isPublished;
    await flipbook.save();
    
    res.status(200).json(`Publication Status: ${flipbook.isPublished}`);
  } catch (error) {
    console.error("Error getting flipbooks:", error);
    res.status(500).json({ message: error.message });
  }
};
