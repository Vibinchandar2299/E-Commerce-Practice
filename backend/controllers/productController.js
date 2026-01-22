const Product = require("../models/Product");

const seedProducts = [
  {
    name: "Wireless Headphones",
    price: 1999,
    image: "https://images.unsplash.com/photo-1518449058121-64f9470c7d8e?auto=format&fit=crop&w=1200&q=60",
    description: "Comfortable over-ear wireless headphones with deep bass and long battery life.",
  },
  {
    name: "Smart Watch",
    price: 2499,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=60",
    description: "Track fitness, heart rate, and notifications with a sleek smart watch.",
  },
  {
    name: "Gaming Mouse",
    price: 999,
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=1200&q=60",
    description: "High precision gaming mouse with RGB lighting and programmable buttons.",
  },
  {
    name: "Mechanical Keyboard",
    price: 2299,
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1200&q=60",
    description: "Tactile mechanical keyboard built for speed, comfort, and durability.",
  },
  {
    name: "Stylish Backpack",
    price: 1499,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=60",
    description: "Spacious backpack for daily commute with laptop sleeve and water resistance.",
  },
  {
    name: "Running Shoes",
    price: 2999,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=60",
    description: "Lightweight running shoes with breathable mesh and cushioned support.",
  },
  {
    name: "Coffee Maker",
    price: 1899,
    image: "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&w=1200&q=60",
    description: "Brew barista-style coffee at home with easy one-touch controls.",
  },
  {
    name: "Bluetooth Speaker",
    price: 1299,
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=60",
    description: "Portable speaker with rich sound, punchy bass, and splash resistance.",
  },
  {
    name: "Sunglasses",
    price: 799,
    image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1200&q=60",
    description: "UV-protected sunglasses with a classic frame and comfortable fit.",
  },
  {
    name: "Desk Lamp",
    price: 699,
    image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=60",
    description: "Modern LED desk lamp with adjustable brightness and warm light mode.",
  },
];

exports.getProducts = async (req, res) => {
  const count = await Product.countDocuments();
  if (count < seedProducts.length) {
    const existing = await Product.find({}, { name: 1 });
    const existingNames = new Set(existing.map((p) => p.name));
    const missing = seedProducts.filter((p) => !existingNames.has(p.name));
    if (missing.length) {
      await Product.insertMany(missing);
    }
  }
  res.json(await Product.find());
};

exports.addProduct = async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.json("Product Added");
};

exports.updateProduct = async (req, res) => {
  const updated = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      price: req.body.price,
      image: req.body.image,
      description: req.body.description,
    },
    { new: true }
  );

  if (!updated) return res.status(404).json("Product not found");
  res.json(updated);
};
