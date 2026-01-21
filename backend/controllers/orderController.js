const Order = require("../models/Order");
const Cart = require("../models/Cart");

exports.placeOrder = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id });

  const order = new Order({
    userId: req.user.id,
    products: cart.products,
    totalAmount: req.body.totalAmount
  });

  await order.save();
  await Cart.deleteOne({ userId: req.user.id });

  res.json("Order Placed Successfully");
};
