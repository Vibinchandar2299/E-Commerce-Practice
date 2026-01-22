import React, { useState } from "react";

const ProductCard = ({ product, addToCart, buyNow }) => {
  const fallbackImage = "https://via.placeholder.com/600x400?text=No+Image";
  const [imgSrc, setImgSrc] = useState(product?.image || fallbackImage);

  return (
    <div className="product-card">
      <img
        src={imgSrc}
        alt={product?.name}
        onError={() => {
          if (imgSrc !== fallbackImage) setImgSrc(fallbackImage);
        }}
      />
      <div className="product-card-content">
        <h3>{product.name}</h3>
        <p>{product.description && product.description.substring(0, 80)}...</p>
        <p className="product-price">₹ {product.price}</p>
        <button onClick={() => addToCart(product._id)}>Add to Cart</button>
        <button onClick={() => buyNow(product._id)} style={{ marginTop: "0.75rem", background: "#111827" }}>
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

