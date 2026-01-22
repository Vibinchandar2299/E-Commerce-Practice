const router = require("express").Router();
const { getProducts, addProduct, updateProduct } = require("../controllers/productController");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

router.get("/", getProducts);
router.post("/", auth, admin, addProduct);
router.put("/:id", auth, admin, updateProduct);

module.exports = router;
