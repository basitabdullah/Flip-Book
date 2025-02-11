import { Flipbook } from "../models/flipbookModel.js";

// Add index page
export const addIndexPage = async (req, res) => {
  try {
    const { flipbookId } = req.params;
    const { 
      title, 
      pageNumber, 
      images, 
      pagesTitles 
    } = req.body;

    const flipbook = await Flipbook.findById(flipbookId);
    if (!flipbook) {
      return res.status(404).json({ message: "Flipbook not found" });
    }

    // Only check uniqueness for the main page number
    const pageExists = flipbook.pages.some(
      page => page.pageNumber === parseInt(pageNumber)
    );

    if (pageExists) {
      return res.status(400).json({ 
        message: "A page with this page number already exists" 
      });
    }

    // Validate that pagesTitles page numbers are positive
    const validPagesTitles = pagesTitles.map(entry => ({
      ...entry,
      pageNumber: parseInt(entry.pageNumber)
    }));

    if (validPagesTitles.some(entry => entry.pageNumber < 1)) {
      return res.status(400).json({
        message: "Page numbers in pagesTitles must be positive"
      });
    }

    const newIndexPage = {
      pageType: 'IndexPage',
      title,
      pageNumber: parseInt(pageNumber),
      images,
      pagesTitles: validPagesTitles
    };

    flipbook.pages.push(newIndexPage);
    await flipbook.save();

    res.status(201).json({ 
      message: "Index page added successfully", 
      flipbook 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error adding index page", 
      error: error.message 
    });
  }
};

// Update index page
export const updateIndexPage = async (req, res) => {
  try {
    const { flipbookId, pageNumber } = req.params;
    const { 
      title, 
      images, 
      pagesTitles, 
      newPageNumber 
    } = req.body;

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

    // If updating page number, check if new number already exists
    if (newPageNumber && newPageNumber !== parseInt(pageNumber)) {
      const pageExists = flipbook.pages.some(
        page => page.pageNumber === parseInt(newPageNumber)
      );

      if (pageExists) {
        return res.status(400).json({ 
          message: "A page with this page number already exists" 
        });
      }
    }

    flipbook.pages[pageIndex] = {
      ...flipbook.pages[pageIndex],
      title: title || flipbook.pages[pageIndex].title,
      pageNumber: newPageNumber || flipbook.pages[pageIndex].pageNumber,
      images: images || flipbook.pages[pageIndex].images,
      pagesTitles: pagesTitles || flipbook.pages[pageIndex].pagesTitles
    };

    await flipbook.save();

    res.status(200).json({ 
      message: "Index page updated successfully", 
      page: flipbook.pages[pageIndex] 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error updating index page", 
      error: error.message 
    });
  }
};

// Delete index page
export const deleteIndexPage = async (req, res) => {
  try {
    const { flipbookId, pageNumber } = req.params;

    const flipbook = await Flipbook.findById(flipbookId);
    if (!flipbook) {
      return res.status(404).json({ message: "Flipbook not found" });
    }

    const pageIndex = flipbook.pages.findIndex(
      page => page.pageNumber === parseInt(pageNumber) && page.pageType === 'index'
    );

    if (pageIndex === -1) {
      return res.status(404).json({ message: "Index page not found" });
    }

    flipbook.pages.splice(pageIndex, 1);
    await flipbook.save();

    res.status(200).json({ message: "Index page deleted successfully" });
  } catch (error) {
    res.status(500).json({ 
      message: "Error deleting index page", 
      error: error.message 
    });
  }
}; 