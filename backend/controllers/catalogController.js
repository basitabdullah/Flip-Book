import { Flipbook, CatalogPage } from "../models/flipbookModel.js";

// Add catalog page
export const addCatalogPage = async (req, res) => {
  try {
    const { flipbookId } = req.params;
    const { title, pageNumber, subtitle, catalogItems } = req.body;

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

    // Validate catalogItems structure
    if (!Array.isArray(catalogItems)) {
      return res.status(400).json({ message: "CatalogItems should be an array" });
    }

    // Validate each catalog item entry
    const isValidItems = catalogItems.every(item => 
      item.name && 
      item.price && 
      item.image &&
      Array.isArray(item.amenities) &&
      item.amenities.length > 0
    );

    if (!isValidItems) {
      return res.status(400).json({ 
        message: "Each catalog item must have name, price, image, and at least one amenity" 
      });
    }

    // Create the new catalog page using the Mongoose model
    const newCatalogPage = new CatalogPage({
      title,
      pageNumber: parseInt(pageNumber, 10),
      subtitle,
      catalogItems,
      pageType: 'Catalog', // Explicitly set the pageType
      isCustom: true
    });

    // Add the new catalog page to the flipbook's pages array
    flipbook.pages.push(newCatalogPage);

    // Save the updated flipbook
    await flipbook.save();

    res.status(201).json({
      message: "Catalog page added successfully",
      flipbook,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding catalog page",
      error: error.message,
    });
  }
};

// Update catalog page
export const updateCatalogPage = async (req, res) => {
  try {
    const { flipbookId, pageId } = req.params;
    const { title, subtitle, catalogItems, pageNumber } = req.body;

    // Find the flipbook
    const flipbook = await Flipbook.findById(flipbookId);
    if (!flipbook) {
      return res.status(404).json({ message: "Flipbook not found" });
    }

    // Find the page index
    const pageIndex = flipbook.pages.findIndex(
      page => page._id.toString() === pageId && page.pageType === 'Catalog'
    );

    if (pageIndex === -1) {
      return res.status(404).json({ message: "Catalog page not found" });
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

    // Validate catalogItems if provided
    if (catalogItems) {
      if (!Array.isArray(catalogItems)) {
        return res.status(400).json({ message: "CatalogItems should be an array" });
      }

      const isValidItems = catalogItems.every(item => 
        item.name && 
        item.price && 
        item.image &&
        Array.isArray(item.amenities) &&
        item.amenities.length > 0
      );

      if (!isValidItems) {
        return res.status(400).json({ 
          message: "Each catalog item must have name, price, image, and at least one amenity" 
        });
      }
    }

    // Update the page
    flipbook.pages[pageIndex] = {
      ...flipbook.pages[pageIndex],
      title,
      subtitle,
      catalogItems,
      pageNumber: parseInt(pageNumber),
      pageType: 'Catalog',
      isCustom: true
    };

    // Save the updated flipbook
    await flipbook.save();

    res.status(200).json({
      message: "Catalog page updated successfully",
      flipbook
    });
  } catch (error) {
    console.error('Error updating catalog page:', error);
    res.status(500).json({
      message: "Error updating catalog page",
      error: error.message
    });
  }
};

// Delete catalog page
export const deleteCatalogPage = async (req, res) => {
  try {
    const { flipbookId, pageId } = req.params;

    // Find the flipbook
    const flipbook = await Flipbook.findById(flipbookId);
    if (!flipbook) {
      return res.status(404).json({ message: "Flipbook not found" });
    }

    // Find the page index
    const pageIndex = flipbook.pages.findIndex(
      page => page._id.toString() === pageId && page.pageType === 'Catalog'
    );

    if (pageIndex === -1) {
      return res.status(404).json({ message: "Catalog page not found" });
    }

    // Remove the page
    flipbook.pages.splice(pageIndex, 1);

    // Save the updated flipbook
    await flipbook.save();

    res.status(200).json({
      message: "Catalog page deleted successfully",
      flipbook
    });
  } catch (error) {
    console.error('Error deleting catalog page:', error);
    res.status(500).json({
      message: "Error deleting catalog page",
      error: error.message
    });
  }
}; 