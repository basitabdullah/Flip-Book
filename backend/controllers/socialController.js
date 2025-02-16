import { Flipbook } from "../models/flipbookModel.js";

export const addSocialPage = async (req, res) => {
  try {
    const { flipbookId } = req.params;
    const { 
      title, 
      pageNumber, 
      subtitle,
      street,
      city,
      postalCode,
      phone,
      email,
      mapUrl,
      socialLinks 
    } = req.body;

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

    // Create new social page
    const newSocialPage = {
      title,
      pageNumber: parseInt(pageNumber),
      subtitle,
      street,
      city,
      postalCode,
      phone,
      email,
      mapUrl,
      socialLinks: socialLinks || [
        { platform: 'facebook', url: 'https://facebook.com' },
        { platform: 'instagram', url: 'https://instagram.com' },
        { platform: 'twitter', url: 'https://twitter.com' },
        { platform: 'youtube', url: 'https://youtube.com' }
      ],
      pageType: 'Social',
      isCustom: true
    };

    // Add the page to flipbook
    flipbook.pages.push(newSocialPage);
    await flipbook.save();

    res.status(201).json({
      message: "Social page added successfully",
      flipbook
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding social page",
      error: error.message
    });
  }
};

export const updateSocialPage = async (req, res) => {
  try {
    const { flipbookId, pageId } = req.params;
    const { 
      title, 
      pageNumber, 
      subtitle,
      street,
      city,
      postalCode,
      phone,
      email,
      mapUrl,
      socialLinks 
    } = req.body;

    const flipbook = await Flipbook.findById(flipbookId);
    if (!flipbook) {
      return res.status(404).json({ message: "Flipbook not found" });
    }

    // Find the page index
    const pageIndex = flipbook.pages.findIndex(
      page => page._id.toString() === pageId && page.pageType === 'Social'
    );

    if (pageIndex === -1) {
      return res.status(404).json({ message: "Social page not found" });
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
    const updatedPage = {
      ...flipbook.pages[pageIndex].toObject(),
      title,
      pageNumber: parseInt(pageNumber),
      subtitle,
      street,
      city,
      postalCode,
      phone,
      email,
      mapUrl,
      socialLinks: socialLinks || flipbook.pages[pageIndex].socialLinks,
      pageType: 'Social',
      isCustom: true
    };

    // Replace the old page with the updated one
    flipbook.pages[pageIndex] = updatedPage;
    await flipbook.save();

    res.status(200).json({
      message: "Social page updated successfully",
      flipbook
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating social page",
      error: error.message
    });
  }
};

export const deleteSocialPage = async (req, res) => {
  try {
    const { flipbookId, pageId } = req.params;

    const flipbook = await Flipbook.findById(flipbookId);
    if (!flipbook) {
      return res.status(404).json({ message: "Flipbook not found" });
    }

    // Find the page index
    const pageIndex = flipbook.pages.findIndex(
      page => page._id.toString() === pageId && page.pageType === 'Social'
    );

    if (pageIndex === -1) {
      return res.status(404).json({ message: "Social page not found" });
    }

    // Remove the page
    flipbook.pages.splice(pageIndex, 1);
    await flipbook.save();

    res.status(200).json({
      message: "Social page deleted successfully",
      flipbook
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting social page",
      error: error.message
    });
  }
}; 