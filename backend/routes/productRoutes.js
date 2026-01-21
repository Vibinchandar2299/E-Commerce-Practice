const router = require("express").Router();
const { getProducts, addProduct } = require("../controllers/productController");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

router.get("/", getProducts);
router.post("/", auth, admin, addProduct);

module.exports = router;
