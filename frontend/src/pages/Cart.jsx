import React, { useEffect, useState } from "react";
import API from "../api";

const Cart = () => {
  const [cart, setCart] = useState([]);

  const fetchCart = () => {
    API.get("/cart") // You can create a GET /cart route in backend
      .then((res) => setCart(res.data.products))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const placeOrder = () => {
    const totalAmount = cart.reduce((a, c) => a + c.product.price * c.quantity, 0);
    API.post("/order", { totalAmount })
      .then(() => {
        alert("Order Placed");
        setCart([]);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <h2>Your Cart</h2>
      {cart.map((item) => (
        <div key={item.productId}>
          {item.productId} | Qty: {item.quantity}
        </div>
      ))}
      {cart.length > 0 && <button onClick={placeOrder}>Place Order</button>}
    </div>
  );
};

export default Cart;
