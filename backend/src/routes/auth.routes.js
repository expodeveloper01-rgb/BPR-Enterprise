const router = require("express").Router();
const { register, login, googleAuth, getMe, verifyEmail, resendCode } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");
const { body } = require("express-validator");

const registerRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

const loginRules = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

router.post("/register", registerRules, register);
router.post("/login", loginRules, login);
router.post("/google", googleAuth);
router.post("/verify-email", verifyEmail);
router.post("/resend-code", resendCode);
router.get("/me", protect, getMe);

module.exports = router;
