const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select("name email isAdmin");
  if (!user) return res.status(404).json("User not found");
  res.json(user);
};

exports.updateMe = async (req, res) => {
  const updates = {
    name: req.body.name,
    email: req.body.email,
  };

  Object.keys(updates).forEach((k) => updates[k] === undefined && delete updates[k]);

  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select(
    "name email isAdmin"
  );
  if (!user) return res.status(404).json("User not found");
  res.json(user);
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json("currentPassword and newPassword are required");
  }

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json("User not found");

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) return res.status(400).json("Wrong current password");

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ message: "Password updated" });
};
