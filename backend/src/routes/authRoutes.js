import express from 'express';
import {
  signup,
  login,
  logout,
  forgotPassword,
  verifyOtp,
  resetPassword,
  verifySignup,
  searchUsers
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyOtpSchema,
  resetPasswordSchema,
  verifySignupSchema
} from '../validation/authValidation.js';

const router = express.Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/verify-signup', validate(verifySignupSchema), verifySignup);
router.post('/login', validate(loginSchema), login);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/verify-otp', validate(verifyOtpSchema), verifyOtp);
router.patch('/reset-password', validate(resetPasswordSchema), resetPassword);

// Protected routes
router.post('/logout', protect, logout);
router.get('/users/search', protect, searchUsers);

// A simple protected route to test single session
router.get('/me', protect, (req, res) => {
  res.status(200).json({
    status: 'success',
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.userCredentials.email
    }
  });
});

export default router;
