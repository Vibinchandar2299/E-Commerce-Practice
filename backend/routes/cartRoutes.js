const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
} = require("../controllers/cartController");

router.get("/", auth, getCart);
router.post("/", auth, addToCart);
router.put("/:productId", auth, updateCartItem);
router.delete("/:productId", auth, removeCartItem);
module.exports = router;
