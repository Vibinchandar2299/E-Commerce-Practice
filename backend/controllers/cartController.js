const Cart = require("../models/Cart");
const Product = require("../models/Product");

exports.addToCart = async (req, res) => {
  let cart = await Cart.findOne({ userId: req.user.id });

  if (!cart) {
    cart = new Cart({ userId: req.user.id, products: [] });
  }

  const { productId, quantity } = req.body;

  if (!productId) return res.status(400).json("productId is required");

  const qty = Number(quantity || 1);
  if (!Number.isFinite(qty) || qty <= 0) return res.status(400).json("Invalid quantity");

  const existing = cart.products.find((p) => String(p.productId) === String(productId));
  if (existing) {
    existing.quantity = (existing.quantity || 0) + qty;
  } else {
    cart.products.push({ productId, quantity: qty });
  }
  await cart.save();

  res.json("Added to Cart");
};

exports.getCart = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id });
  if (!cart) return res.json({ userId: req.user.id, products: [] });

  const productIds = cart.products.map((p) => p.productId);
  const products = await Product.find({ _id: { $in: productIds } });
  const productMap = new Map(products.map((p) => [String(p._id), p]));

  const enriched = cart.products.map((p) => ({
    productId: p.productId,
    quantity: p.quantity,
    product: productMap.get(String(p.productId)) || null,
  }));

  res.json({ userId: cart.userId, products: enriched });
};

exports.updateCartItem = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  const qty = Number(quantity);
  if (!Number.isFinite(qty)) return res.status(400).json("Invalid quantity");

  const cart = await Cart.findOne({ userId: req.user.id });
  if (!cart) return res.status(404).json("Cart not found");

  const idx = cart.products.findIndex((p) => String(p.productId) === String(productId));
  if (idx === -1) return res.status(404).json("Item not found");

  if (qty <= 0) {
    cart.products.splice(idx, 1);
  } else {
    cart.products[idx].quantity = qty;
  }

  await cart.save();
  res.json("Cart updated");
};

exports.removeCartItem = async (req, res) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ userId: req.user.id });
  if (!cart) return res.status(404).json("Cart not found");

  cart.products = cart.products.filter((p) => String(p.productId) !== String(productId));
  await cart.save();

  res.json("Removed from cart");
};
