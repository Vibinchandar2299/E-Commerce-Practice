import React, { useState, useEffect } from "react";
import API from "../api";

const AdminDashboard = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [description, setDescription] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    API.get("/products")
      .then((res) => setProducts(res.data))
      .catch(() => setError("❌ Error loading products"));
  };

  const resetForm = () => {
    setSelectedProductId(null);
    setName("");
    setPrice("");
    setImage("");
    setImageFile(null);
    setImagePreview("");
    setDescription("");
    setError("");
  };

  const selectProductForEdit = (product) => {
    const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
    let imageUrl = product.image || "";
    
    // Build full URL for uploaded files
    if (imageUrl && imageUrl.startsWith("/uploads/")) {
      imageUrl = API_BASE + imageUrl;
    }
    
    setSelectedProductId(product._id);
    setName(product.name || "");
    setPrice(String(product.price ?? ""));
    setImage(product.image || "");
    setImageFile(null);
    setImagePreview(imageUrl);
    setDescription(product.description || "");
    setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setImage(""); // Clear URL if file is selected
    }
  };

  const handleImageURL = (e) => {
    const url = e.target.value;
    setImage(url);
    setImageFile(null);
    setImagePreview(url || "");
  };

  const addProduct = (e) => {
    e.preventDefault();
    setError("");
    
    // Check if either image or imageFile is provided
    if (!image && !imageFile) {
      setError("❌ Please provide either an image URL or upload an image file");
      return;
    }

    setLoading(true);
    
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", parseFloat(price));
    formData.append("description", description);
    
    if (imageFile) {
      formData.append("image", imageFile);
    } else {
      formData.append("image", image);
    }

    const req = selectedProductId
      ? API.put(`/products/${selectedProductId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
      : API.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });

    req
      .then(() => {
        alert(selectedProductId ? "✅ Product Updated Successfully" : "✅ Product Added Successfully");
        setLoading(false);
        resetForm();
        fetchProducts();
      })
      .catch(() => {
        setError(selectedProductId ? "❌ Error updating product" : "❌ Error adding product");
        setLoading(false);
      });
  };

  const deleteProduct = (productId) => {
    if (window.confirm("⚠️ Are you sure you want to delete this product?")) {
      setLoading(true);
      API.delete(`/products/${productId}`)
        .then(() => {
          alert("✅ Product Deleted Successfully");
          fetchProducts();
        })
        .catch(() => {
          setError("❌ Error deleting product");
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <div className="container">
      <h1>⚙️ Admin Dashboard</h1>
      <div className="admin-container">
        <div className="admin-form">
          <h2>{selectedProductId ? "Edit Product" : "Add New Product"}</h2>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={addProduct}>
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                placeholder="Enter product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Price (₹)</label>
              <input
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                step="0.01"
                required
              />
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input
                type="url"
                placeholder="Enter image URL"
                value={image}
                onChange={handleImageURL}
              />
              <small style={{ color: "#999", marginTop: "0.25rem", display: "block" }}>
                OR upload an image file below
              </small>
            </div>
            <div className="form-group">
              <label>Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <small style={{ color: "#999", marginTop: "0.25rem", display: "block" }}>
                Supported formats: JPG, PNG, GIF, WebP
              </small>
            </div>
            {imagePreview && (
              <div className="form-group" style={{ textAlign: "center" }}>
                <label>Image Preview</label>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    borderRadius: "8px",
                    marginTop: "0.5rem",
                    objectFit: "cover"
                  }}
                />
              </div>
            )}
            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Enter product description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <button type="submit" disabled={loading} className="admin-edit-btn">
                {loading ? (selectedProductId ? "Updating..." : "Adding...") : selectedProductId ? "Update Product" : "Add Product"}
              </button>
              {selectedProductId && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={loading}
                  className="admin-edit-btn admin-edit-btn-secondary"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
        <div className="admin-products">
          <h2>Products ({products.length})</h2>
          <div style={{ maxHeight: "600px", overflowY: "auto" }}>
            {products.map((product) => (
              <div
                key={product._id}
                style={{
                  padding: "1rem",
                  borderBottom: "1px solid #e0e0e0",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "1rem",
                  alignItems: "center",
                }}
              >
              <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>{product.name}</div>
                  <div style={{ fontSize: "0.9rem", color: "#666" }}>
                    Price: <strong>₹ {product.price}</strong>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={() => selectProductForEdit(product)}
                    className="admin-edit-btn"
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteProduct(product._id)}
                    className="admin-edit-btn"
                    style={{ backgroundColor: "#dc3545" }}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
