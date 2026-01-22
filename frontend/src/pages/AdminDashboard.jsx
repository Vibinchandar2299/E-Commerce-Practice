import React, { useState, useEffect } from "react";
import API from "../api";

const AdminDashboard = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
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
    setDescription("");
    setError("");
  };

  const selectProductForEdit = (product) => {
    setSelectedProductId(product._id);
    setName(product.name || "");
    setPrice(String(product.price ?? ""));
    setImage(product.image || "");
    setDescription(product.description || "");
    setError("");
  };

  const addProduct = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const payload = { name, price: parseFloat(price), image, description };

    const req = selectedProductId
      ? API.put(`/products/${selectedProductId}`, payload)
      : API.post("/products", payload);

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
                onChange={(e) => setImage(e.target.value)}
                required
              />
            </div>
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
                <button
                  type="button"
                  onClick={() => selectProductForEdit(product)}
                  className="admin-edit-btn"
                  disabled={loading}
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
