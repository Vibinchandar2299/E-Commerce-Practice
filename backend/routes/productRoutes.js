const router = require("express").Router();
const { getProducts, addProduct, updateProduct, deleteProduct } = require("../controllers/productController");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const upload = require("../middleware/multer");

router.get("/", getProducts);
router.post("/", auth, admin, upload.single("image"), addProduct);
router.put("/:id", auth, admin, upload.single("image"), updateProduct);
router.delete("/:id", auth, admin, deleteProduct);

module.exports = router;
