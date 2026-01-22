const router = require("express").Router();
const { getProducts, addProduct, updateProduct, deleteProduct } = require("../controllers/productController");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

router.get("/", getProducts);
router.post("/", auth, admin, addProduct);
router.put("/:id", auth, admin, updateProduct);
router.delete("/:id", auth, admin, deleteProduct);

module.exports = router;
