import { Flipbook } from "../models/flipbookModel.js";

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
      page => page.pageNumber === parseInt(pageNumber)
    );

    if (pageExists) {
      return res.status(400).json({ 
        message: "A page with this page number already exists" 
      });
    }

    // Create new reviews/map page
    const newReviewsOrMapPage = {
      title,
      pageNumber: parseInt(pageNumber),
      content,
      pageType: 'ReviewsOrMap',
      isCustom: true
    };

    // Add the page to flipbook
    flipbook.pages.push(newReviewsOrMapPage);
    await flipbook.save();

    res.status(201).json({
      message: "Reviews/Map page added successfully",
      flipbook
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding reviews/map page",
      error: error.message
    });
  }
};

export const updateReviewsOrMapPage = async (req, res) => {
  try {
    const { flipbookId, pageId } = req.params;
    const { title, pageNumber, content } = req.body;

    const flipbook = await Flipbook.findById(flipbookId);
    if (!flipbook) {
      return res.status(404).json({ message: "Flipbook not found" });
    }

    // Find the page index
    const pageIndex = flipbook.pages.findIndex(
      page => page._id.toString() === pageId && page.pageType === 'ReviewsOrMap'
    );

    if (pageIndex === -1) {
      return res.status(404).json({ message: "Reviews/Map page not found" });
    }

    // Check for duplicate page number if changing
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

    // Update the page
    flipbook.pages[pageIndex] = {
      ...flipbook.pages[pageIndex],
      title,
      pageNumber: parseInt(pageNumber),
      content,
      pageType: 'ReviewsOrMap',
      isCustom: true
    };

    await flipbook.save();

    res.status(200).json({
      message: "Reviews/Map page updated successfully",
      flipbook
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating reviews/map page",
      error: error.message
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
      page => page._id.toString() === pageId && page.pageType === 'ReviewsOrMap'
    );

    if (pageIndex === -1) {
      return res.status(404).json({ message: "Reviews/Map page not found" });
    }

    // Remove the page
    flipbook.pages.splice(pageIndex, 1);
    await flipbook.save();

    res.status(200).json({
      message: "Reviews/Map page deleted successfully",
      flipbook
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting reviews/map page",
      error: error.message
    });
  }
};






