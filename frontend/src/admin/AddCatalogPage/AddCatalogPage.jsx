import React, { useState } from "react";
import useCatalogPageStore from "../../stores/useCatalogPageStore";
import useFlipbookStore from "../../stores/useFlipbookStore";
import { toast } from "react-hot-toast";
import "./AddCatalogPage.scss";

const AddCatalogPage = ({ flipbookId }) => {
  const { addCatalogPage } = useCatalogPageStore();
  const { getFlipbookById } = useFlipbookStore();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [pageNumber, setPageNumber] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [position, setPosition] = useState("vertical");
  const [booknowLink, setBooknowLink] = useState("");
  const [catalogItems, setCatalogItems] = useState([
    {
      name: "",
      price: "",
      image: "",
      amenities: [],
    },
  ]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadMethods, setUploadMethods] = useState(["url"]);

  const handleAddItem = () => {
    setCatalogItems([
      ...catalogItems,
      {
        name: "",
        price: "",
        image: "",
        amenities: [],
      },
    ]);
    setUploadMethods([...uploadMethods, "url"]);
    setSelectedFiles([...selectedFiles, null]);
  };

  const handleUpdateItem = (index, field, value) => {
    const updatedItems = [...catalogItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    setCatalogItems(updatedItems);
  };

  const handleUpdateAmenities = (index, value) => {
    const updatedItems = [...catalogItems];
    updatedItems[index] = {
      ...updatedItems[index],
      amenities: value.split(",").map((item) => item.trim()),
    };
    setCatalogItems(updatedItems);
  };

  const handleRemoveItem = (index) => {
    setCatalogItems(catalogItems.filter((_, i) => i !== index));
    setUploadMethods(uploadMethods.filter((_, i) => i !== index));
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newFiles = [...selectedFiles];
      newFiles[index] = file;
      setSelectedFiles(newFiles);

      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        handleUpdateItem(index, "image", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadMethodChange = (index, method) => {
    const newMethods = [...uploadMethods];
    newMethods[index] = method;
    setUploadMethods(newMethods);

    // Reset the image and file when changing methods
    const updatedItems = [...catalogItems];
    updatedItems[index] = {
      ...updatedItems[index],
      image: "",
    };
    setCatalogItems(updatedItems);

    const newFiles = [...selectedFiles];
    newFiles[index] = null;
    setSelectedFiles(newFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("pageNumber", pageNumber);
      formData.append("subtitle", subtitle);
      formData.append("position", position);
      formData.append("booknowLink", booknowLink);

      // Prepare catalog items data
      const itemsForSubmission = catalogItems.map((item, index) => ({
        ...item,
        image: uploadMethods[index] === "url" ? item.image : "", // Clear image URL if using file upload
      }));
      formData.append("catalogItems", JSON.stringify(itemsForSubmission));

      // Append files for items using file upload
      selectedFiles.forEach((file, index) => {
        if (uploadMethods[index] === "file" && file) {
          formData.append("images", file);
        }
      });

      await addCatalogPage(flipbookId, formData);

      // Refresh flipbook data
      await getFlipbookById(flipbookId);

      // Reset form
      setTitle("");
      setPageNumber("");
      setSubtitle("");
      setBooknowLink("");
      setCatalogItems([
        {
          name: "",
          price: "",
          image: "",
          amenities: [],
        },
      ]);
      setSelectedFiles([null]);
      setUploadMethods(["url"]);

      toast.success("Catalog page added successfully");
    } catch (error) {
      toast.error(error.message || "Failed to add catalog page");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-catalog-page">
      <h3>Add Catalog Page</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Position</label>
          <select
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          >
            <option value="horizontal">horizontal</option>
            <option value="vertical">vertical</option>
          </select>
        </div>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter page title"
            required
          />
        </div>

        <div className="form-group">
          <label>Page Number</label>
          <input
            type="number"
            value={pageNumber}
            onChange={(e) => setPageNumber(e.target.value)}
            placeholder="Enter page number"
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label>Subtitle</label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Enter subtitle"
            required
          />
        </div>

        <div className="form-group">
          <label>Book Now Link</label>
          <input
            type="text"
            value={booknowLink}
            onChange={(e) => setBooknowLink(e.target.value)}
            placeholder="Enter book now link (optional)"
          />
        </div>

        <div className="catalog-items-section">
          <div className="section-header">
            <h4>Catalog Items</h4>
            <button type="button" onClick={handleAddItem} className="add-btn">
              + Add Item
            </button>
          </div>

          {catalogItems.map((item, index) => (
            <div key={index} className="catalog-item">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) =>
                    handleUpdateItem(index, "name", e.target.value)
                  }
                  placeholder="Item name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Price</label>
                <input
                  type="text"
                  value={item.price}
                  onChange={(e) =>
                    handleUpdateItem(index, "price", e.target.value)
                  }
                  placeholder="Item price"
                  required
                />
              </div>

              <div className="form-group">
                <label>Image</label>
                <div className="image-input-group">
                  <select
                    value={uploadMethods[index]}
                    onChange={(e) => handleUploadMethodChange(index, e.target.value)}
                    className="upload-method-select"
                  >
                    <option value="url">URL</option>
                    <option value="file">File Upload</option>
                  </select>

                  {uploadMethods[index] === "url" ? (
                    <input
                      type="text"
                      value={item.image}
                      onChange={(e) =>
                        handleUpdateItem(index, "image", e.target.value)
                      }
                      placeholder="Image URL"
                      required
                    />
                  ) : (
                    <div className="file-upload-container">
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, index)}
                        accept="image/*"
                        required={!item.image}
                      />
                      {item.image && (
                        <div className="image-preview">
                          <img src={item.image} alt="Preview" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Amenities (comma-separated)</label>
                <input
                  type="text"
                  value={item.amenities.join(", ")}
                  onChange={(e) => handleUpdateAmenities(index, e.target.value)}
                  placeholder="Enter amenities"
                  required
                />
              </div>

              {index > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="remove-btn"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Adding..." : "Add Catalog Page"}
        </button>
      </form>
    </div>
  );
};

export default AddCatalogPage;
