import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    API.get("/products")
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load products");
        setLoading(false);
      });
  }, []);

  const addToCart = (productId) => {
    API.post("/cart", { productId, quantity: 1 })
      .then(() => alert("✅ Added to Cart"))
      .catch((err) => alert("❌ Error adding to cart"));
  };

  const buyNow = (productId) => {
    API.post("/cart", { productId, quantity: 1 })
      .then(() => navigate("/cart"))
      .catch(() => alert("❌ Please login to buy"));
  };

  const filteredProducts = products.filter((p) =>
    (p?.name || "").toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="container">
      <h1 style={{ marginBottom: "1rem" }}>🏪 Our Products</h1>
      <div className="home-search">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {loading && <p style={{ textAlign: "center", fontSize: "1.1rem" }}>Loading products...</p>}
      {error && <p style={{ textAlign: "center", color: "red" }}>{error}</p>}
      {filteredProducts.length === 0 && !loading && <p style={{ textAlign: "center" }}>No products available</p>}
      <div className="products-grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product._id} product={product} addToCart={addToCart} buyNow={buyNow} />
        ))}
      </div>
    </div>
  );
};

export default Home;
