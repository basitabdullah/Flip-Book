import { Flipbook } from "../models/flipbookModel.js";
import { ReviewsOrMapPage } from "../models/flipbookModel.js";

export const createReviewsOrMapPage = async (req, res) => {
  try {
    const { flipbookId } = req.params;
    const { title, pageNumber, content } = req.body;

    // Find the flipbook
    const flipbook = await Flipbook.findById(flipbookId);
    if (!flipbook) {
      return res.status(404).json({ message: "Flipbook not found" });
    }

    // Check for duplicate page numbers
    const pageExists = flipbook.pages.some(
      (page) => page.pageNumber === parseInt(pageNumber)
    );

    if (pageExists) {
      return res.status(400).json({
        message: "A page with this page number already exists",
      });
    }

    // Create new reviews/map page
    const newReviewsOrMapPage = {
      title,
      pageNumber: parseInt(pageNumber),
      content,
      pageType: "ReviewsOrMap",
      isCustom: true,
    };

    // Add the page to flipbook
    flipbook.pages.push(newReviewsOrMapPage);
    await flipbook.save();

    res.status(201).json({
      message: "Reviews/Map page added successfully",
      flipbook,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding reviews/map page",
      error: error.message,
    });
  }
};

export const updateReviewsOrMapPage = async (req, res) => {
  try {
    const { flipbookId, pageId } = req.params;
    const { title, pageNumber, content } = req.body;

    // Find the flipbook
    const flipbook = await Flipbook.findById(flipbookId);
    if (!flipbook) {
      return res.status(404).json({
        success: false,
        message: "Flipbook not found!",
      });
    }

    // Find the page in flipbook's pages array
    const pageIndex = flipbook.pages.findIndex((page) => {
      const isMatch =
        page.pageType === "ReviewsOrMap" &&
        page.pageNumber === parseInt(pageNumber); // Use pageNumber from body instead of pageId

      return isMatch;
    });

    if (pageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Reviews/Map page not found",
        debug: {
          searchedNumber: parseInt(pageNumber),
          availablePages: flipbook.pages.map((p) => ({
            type: p.pageType,
            number: p.pageNumber,
          })),
        },
      });
    }

    // Get existing page data
    const existingPage = flipbook.pages[pageIndex];

    // Update the page in flipbook's pages array
    flipbook.pages[pageIndex] = {
      ...existingPage, // Keep existing properties
      _id: existingPage._id, // Preserve the ID
      title: title || existingPage.title,
      content: content || existingPage.content,
      pageNumber: parseInt(pageNumber), // Use pageNumber from body
      pageType: "ReviewsOrMap", // Keep the correct page type
      isCustom: true,
    };

    // Save the updated flipbook
    const updatedFlipbook = await flipbook.save();

    // Return the updated page with success status
    return res.status(200).json({
      success: true,
      message: "Reviews/Map page updated successfully",
      page: updatedFlipbook.pages[pageIndex],
      flipbook: updatedFlipbook,
    });
  } catch (error) {
    console.error("Error updating reviews/map page:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update page",
      error: error.message,
    });
  }
};

export const deleteReviewsOrMapPage = async (req, res) => {
  try {
    const { flipbookId, pageId } = req.params;

    const flipbook = await Flipbook.findById(flipbookId);
    if (!flipbook) {
      return res.status(404).json({ message: "Flipbook not found" });
    }

    // Find the page index
    const pageIndex = flipbook.pages.findIndex(
      (page) =>
        page._id.toString() === pageId && page.pageType === "ReviewsOrMap"
    );

    if (pageIndex === -1) {
      return res.status(404).json({ message: "Reviews/Map page not found" });
    }

    // Remove the page
    flipbook.pages.splice(pageIndex, 1);
    await flipbook.save();

    res.status(200).json({
      message: "Reviews/Map page deleted successfully",
      flipbook,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting reviews/map page",
      error: error.message,
    });
  }
};
