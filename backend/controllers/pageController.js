import { Page } from "../models/pageModel.js";

// Get all pages
export const getAllPages = async (req, res) => {
  try {
    const pages = await Page.find();
    res.status(200).json(pages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single page by page number
export const getPageByNumber = async (req, res) => {
  try {
    const page = await Page.findOne({ pageNumber: req.params.pageNumber });
    if (!page) return res.status(404).json({ message: "Page not found" });
    res.status(200).json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new page
export const createPage = async (req, res) => {
  const { pageNumber, title, description, mediaType, mediaURL } = req.body;

  try {
    const newPage = new Page({
      pageNumber,
      title,
      description,
      mediaType,
      mediaURL,
    });
    await newPage.save();
    res.status(201).json(newPage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an existing page
export const updatePage = async (req, res) => {
  const { title, description, mediaType, mediaURL } = req.body;

  try {
    const updatedPage = await Page.findOneAndUpdate(
      { pageNumber: req.params.pageNumber },
      { title, description, mediaType, mediaURL },
      { new: true }
    );
    if (!updatedPage)
      return res.status(404).json({ message: "Page not found" });
    res.status(200).json(updatedPage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a page
export const deletePage = async (req, res) => {
  try {
    const deletedPage = await Page.findOneAndDelete({
      pageNumber: req.params.pageNumber,
    });
    if (!deletedPage)
      return res.status(404).json({ message: "Page not found" });
    res.status(200).json({ message: "Page deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
