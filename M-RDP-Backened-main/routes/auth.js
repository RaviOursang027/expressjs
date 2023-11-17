const express = require("express");
const {
  signup,
  accountActivation,
  signin,
  forgotPassword,
  resetPassword,
  googleLogin,
  facebookLogin,
  sendOtp,
  verifyOtp,
} = require("../controllers/auth");
const router = express.Router();

const {
  userSignupValidator,
  userSigninValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../validators/auth");
const { runValidation } = require("../validators");

router.post("/signup", userSignupValidator, runValidation, signup);
router.post("/account-activation", accountActivation);
router.post("/signin", userSigninValidator, runValidation, signin);
router.post("/google-login", googleLogin);
router.post("/facebook-login", facebookLogin);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);



//forgot reset password
router.post(
  "/forgot-password",
  forgotPasswordValidator,
  runValidation,
  forgotPassword
);
router.put(
  "/reset-password",
  resetPasswordValidator,
  // runValidation,
  resetPassword
);

module.exports = router;
