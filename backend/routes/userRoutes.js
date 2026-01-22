const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { getMe, updateMe, changePassword } = require("../controllers/userController");

router.get("/me", auth, getMe);
router.put("/me", auth, updateMe);
router.put("/me/password", auth, changePassword);

module.exports = router;
