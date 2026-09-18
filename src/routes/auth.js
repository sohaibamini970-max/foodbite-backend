const router = require("express").Router();
const upload = require("../utils/upload");
const { register, login, me } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

router.post("/register", upload.single("image"), register);
router.post("/login", login);
router.get("/me", protect, me);

module.exports = router;