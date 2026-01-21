import React, { useState } from "react";
import API from "../api";

const AdminDashboard = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  const addProduct = (e) => {
    e.preventDefault();
    API.post("/products", { name, price, image, description })
      .then(() => alert("Product Added"))
      .catch((err) => alert("Error adding product"));
  };

  return (
    <form onSubmit={addProduct}>
      <h2>Admin Dashboard - Add Product</h2>
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <br />
      <input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
      <br />
      <input placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} required />
      <br />
      <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
      <br />
      <button type="submit">Add Product</button>
    </form>
  );
};

export default AdminDashboard;
