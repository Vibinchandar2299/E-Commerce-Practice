import React from "react";

const ProductCard = ({ product, addToCart }) => {
  return (
    <div style={{ border: "1px solid #ccc", padding: 10, margin: 10 }}>
      <img src={product.image} alt={product.name} width="150" />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p>₹ {product.price}</p>
      <button onClick={() => addToCart(product._id)}>Add to Cart</button>
    </div>
  );
};

export default ProductCard;
