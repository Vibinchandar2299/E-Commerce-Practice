const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const seedDevAdmin = async () => {
  const shouldSeed = process.env.SEED_ADMIN === "true";
  const isProduction = process.env.NODE_ENV === "production";
  if (!shouldSeed || isProduction) return;

  const shouldResetPassword = process.env.RESET_ADMIN_PASSWORD === "true";

  const adminName = process.env.ADMIN_NAME || "Admin";
  const adminEmail = process.env.ADMIN_EMAIL || "admin@local.dev";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";

  const existing = await User.findOne({ email: adminEmail });
  if (!existing) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await User.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      isAdmin: true,
    });
    console.log(`Dev admin created: ${adminEmail}`);
    return;
  }

  if (shouldResetPassword) {
    existing.password = await bcrypt.hash(adminPassword, 10);
    await existing.save();
    console.log(`Dev admin password reset: ${adminEmail}`);
  }

  if (!existing.isAdmin) {
    existing.isAdmin = true;
    await existing.save();
    console.log(`Dev admin promoted: ${adminEmail}`);
  }
};

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/order", require("./routes/orderRoutes"));

(async () => {
  try {
    await connectDB();
    await seedDevAdmin();
    app.listen(5000, () => console.log("Server Started"));
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
})();
