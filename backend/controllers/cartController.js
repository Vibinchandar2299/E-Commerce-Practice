const Cart = require("../models/Cart");

exports.addToCart = async (req, res) => {
  let cart = await Cart.findOne({ userId: req.user.id });

  if (!cart) {
    cart = new Cart({ userId: req.user.id, products: [] });
  }

  cart.products.push(req.body);
  await cart.save();

  res.json("Added to Cart");
};
