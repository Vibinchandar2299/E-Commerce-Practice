import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = () => {
    setLoading(true);
    API.get("/cart")
      .then((res) => {
        setCart(res.data.products || []);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeFromCart = (productId) => {
    API.delete(`/cart/${productId}`)
      .then(() => fetchCart())
      .catch((err) => console.log(err));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      API.put(`/cart/${productId}`, { quantity })
        .then(() => fetchCart())
        .catch((err) => console.log(err));
    }
  };

  const placeOrder = () => {
    const totalAmount = cart.reduce(
      (a, c) => a + (Number(c.product?.price || 0) * Number(c.quantity || 0)),
      0
    );
    API.post("/order", { totalAmount })
      .then(() => {
        alert("✅ Order placed successfully!");
        setCart([]);
      })
      .catch((err) => alert("❌ Error placing order"));
  };

  const totalPrice = cart.reduce(
    (a, c) => a + (Number(c.product?.price || 0) * Number(c.quantity || 0)),
    0
  );

  if (loading) return <div className="container"><p>Loading cart...</p></div>;

  return (
    <div className="container">
      <h1>🛒 Shopping Cart</h1>
      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <Link to="/">Continue Shopping</Link>
        </div>
      ) : (
        <div className="cart-container">
          {cart.map((item) => (
            <div key={item.productId} className="cart-item">
              <div className="cart-item-info">
                <div className="cart-item-name">{item.product?.name || "Product"}</div>
                <div className="cart-item-price">₹ {item.product?.price || 0}</div>
              </div>
              <div style={{ flex: "0.5" }}>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                  style={{ width: "60px", padding: "0.5rem" }}
                />
              </div>
              <div className="cart-item-actions">
                <button onClick={() => removeFromCart(item.productId)}>❌ Remove</button>
              </div>
            </div>
          ))}
          <div className="cart-summary">
            <span>Total:</span>
            <span className="cart-total">₹ {totalPrice.toFixed(2)}</span>
          </div>
          <button
            onClick={placeOrder}
            style={{
              width: "100%",
              padding: "1rem",
              marginTop: "1rem",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
